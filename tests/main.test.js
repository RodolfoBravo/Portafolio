const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const SOURCE = fs.readFileSync(path.join(__dirname, '../assets/js/main.js'), 'utf8');

// main.js es un módulo UMD que decide su propio `win` (`self` o `this`) en el
// momento en que se ejecuta; no expone la factory por separado, así que no
// hay forma de inyectarle una `window` de prueba con un simple `require()`.
// En vez de traer jsdom como dependencia, se ejecuta el código fuente con
// `vm` en un sandbox donde `self` es el stub que arma cada test — el mismo
// truco que hace que `typeof self !== 'undefined' ? self : this` resuelva a
// nuestro objeto de prueba en lugar del `global` real de Node. Cada llamada
// crea una instancia de módulo nueva y aislada (variables de estado internas
// como `cardsById`, `modalEl` o `langInitialized` no se comparten entre
// tests).
function loadApp(win) {
  const sandbox = { module: { exports: {} }, self: win, console };
  vm.createContext(sandbox);
  vm.runInContext(SOURCE, sandbox, { filename: 'main.js' });
  return sandbox.module.exports;
}

// ---------- Stubs mínimos de DOM, hechos a mano ----------

function makeAttrEl(attrs) {
  const store = Object.assign({}, attrs || {});
  let html = '';
  return {
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(store, name) ? store[name] : null; },
    setAttribute(name, value) { store[name] = String(value); },
    removeAttribute(name) { delete store[name]; },
    hasAttribute(name) { return Object.prototype.hasOwnProperty.call(store, name); },
    addEventListener() {},
    focus() {},
    style: {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    get innerHTML() { return html; },
    set innerHTML(value) { html = value; }
  };
}

// Fábrica de `document` compartida por los cuatro tests: por defecto todo
// `getElementById`/`querySelectorAll` devuelve "no existe", así que cada
// `init*` del arranque toma su rama de salida temprana y no revienta. Cada
// test sólo agrega lo que su comportamiento necesita.
function makeBaseDoc(overrides) {
  const base = {
    readyState: 'complete',
    documentElement: makeAttrEl({}),
    body: makeAttrEl({}),
    getElementById() { return null; },
    querySelectorAll() { return []; },
    addEventListener() {}
  };
  return Object.assign(base, overrides || {});
}

const FakeI18n = {
  apply() {},
  detect() { return 'en'; },
  t(lang, key) { return key; }
};

// Fábrica de "#workGrid": el único método real de fake-DOM que necesitamos.
// `renderCards` construye un string de HTML y lo asigna a `innerHTML`; en un
// navegador eso crea nodos reales. Aquí, el setter de `innerHTML` interpreta
// ese mismo string (los `<article class="card" ... data-category="..."
// data-id="...">` que emite `main.js`) y arma objetos de carta con la misma
// forma que usan `renderCards`/`initFilters`/`closeCase`.
function makeWorkGrid() {
  let cards = [];
  let html = '';
  return {
    get innerHTML() { return html; },
    set innerHTML(value) {
      html = value;
      const re = /<article class="card"[^>]*?data-category="([^"]*)"[^>]*?data-id="([^"]*)"/g;
      const found = [];
      let m;
      while ((m = re.exec(value))) found.push({ category: m[1], id: m[2] });
      cards = found.map(({ category, id }) => {
        const store = { 'data-category': category, 'data-id': id };
        return {
          getAttribute: (n) => (Object.prototype.hasOwnProperty.call(store, n) ? store[n] : null),
          setAttribute: (n, v) => { store[n] = String(v); },
          removeAttribute: (n) => { delete store[n]; },
          hasAttribute: (n) => Object.prototype.hasOwnProperty.call(store, n),
          querySelector: () => null,
          addEventListener() {},
          focus() { this._focused = true; }
        };
      });
    },
    querySelectorAll(sel) { return sel === '.card' ? cards : []; }
  };
}

const FAKE_CASES = [
  {
    id: 'a', category: 'rag', link: null,
    stack: ['X'], architecture: ['S1', 'S2'],
    es: { title: 'A', tagline: 'ta', problem: 'p', solution: 's', impact: ['i1', 'i2'], learned: 'l' },
    en: { title: 'A', tagline: 'ta', problem: 'p', solution: 's', impact: ['i1', 'i2'], learned: 'l' }
  },
  {
    id: 'b', category: 'agents', link: null,
    stack: ['Y'], architecture: ['S1'],
    es: { title: 'B', tagline: 'tb', problem: 'p', solution: 's', impact: ['i1'], learned: 'l' },
    en: { title: 'B', tagline: 'tb', problem: 'p', solution: 's', impact: ['i1'], learned: 'l' }
  }
];

// ---------- 1. Los suscriptores de onLangChange disparan en orden de registro ----------

test('los suscriptores de onLangChange se ejecutan en el orden en que se registraron', () => {
  const win = { document: makeBaseDoc(), I18n: FakeI18n };
  const App = loadApp(win);

  const order = [];
  App.onLangChange(() => order.push('first'));
  App.onLangChange(() => order.push('second'));
  App.onLangChange(() => order.push('third'));

  App.setLang('es');

  assert.deepStrictEqual(order, ['first', 'second', 'third']);
});

// ---------- 2. El primer setLang no revela los titulares (bandera langInitialized) ----------

test('el primer setLang del arranque no marca los titulares como revelados', () => {
  const child = makeAttrEl({ 'data-i18n': 'hero.h1a' });
  child.textContent = 'Hola Mundo';
  const heading = makeAttrEl({ 'data-reveal-words': '' });
  heading.querySelectorAll = (sel) => (sel === '[data-i18n]' ? [child] : []);

  const doc = makeBaseDoc({
    querySelectorAll(sel) {
      if (sel === '[data-reveal-words]') return [heading];
      if (sel === '[data-reveal]') return [heading];
      return [];
    }
  });

  // Sin IntersectionObserver real, `observeReveal` marcaría todo como
  // revelado de inmediato (rama "sin soporte"), lo que taparía la señal que
  // este test quiere aislar. Con un IntersectionObserver falso que nunca
  // dispara su callback, los nodos quedan "observados, pero no revelados" —
  // el mismo estado que tienen en un navegador real antes de entrar en
  // viewport.
  function FakeIntersectionObserver() {
    this.observe = () => {};
    this.unobserve = () => {};
  }

  const win = { document: doc, I18n: FakeI18n, IntersectionObserver: FakeIntersectionObserver };
  loadApp(win);

  // El arranque ya corrió (síncrono, `readyState: 'complete'`) e invocó
  // `setLang` una vez desde `initLang()`. Esa primera invocación NO debe
  // haber revelado el titular todavía: le toca a `initReveal()` observarlo
  // por primera vez, no al suscriptor de cambio de idioma.
  assert.strictEqual(heading.hasAttribute('data-revealed'), false,
    'el primer setLang (arranque) no debe revelar los titulares');
});

// El test anterior sólo verifica el estado post-arranque. Se separa en dos
// tests para que cada aserción tenga un nombre propio y una falla sea legible.
test('un setLang posterior (cambio de idioma real) sí revela los titulares', () => {
  const child = makeAttrEl({ 'data-i18n': 'hero.h1a' });
  child.textContent = 'Hola Mundo';
  const heading = makeAttrEl({ 'data-reveal-words': '' });
  heading.querySelectorAll = (sel) => (sel === '[data-i18n]' ? [child] : []);

  const doc = makeBaseDoc({
    querySelectorAll(sel) {
      if (sel === '[data-reveal-words]') return [heading];
      if (sel === '[data-reveal]') return [heading];
      return [];
    }
  });

  function FakeIntersectionObserver() {
    this.observe = () => {};
    this.unobserve = () => {};
  }

  const win = { document: doc, I18n: FakeI18n, IntersectionObserver: FakeIntersectionObserver };
  const App = loadApp(win);

  assert.strictEqual(heading.hasAttribute('data-revealed'), false, 'precondición: aún no revelado tras el arranque');

  App.setLang('es');

  assert.strictEqual(heading.getAttribute('data-revealed'), 'true',
    'un cambio de idioma posterior al arranque debe revelar el titular');
});

// ---------- 3. Un re-render (cambio de idioma) conserva state.filter ----------

test('renderCards vuelve a aplicar el filtro activo en cada repintado', () => {
  const grid = makeWorkGrid();
  const doc = makeBaseDoc({
    getElementById(id) { return id === 'workGrid' ? grid : null; },
    querySelectorAll(sel) { return sel === '#workGrid .card' ? grid.querySelectorAll('.card') : []; }
  });

  const win = { document: doc, I18n: FakeI18n, CaseStudies: FAKE_CASES };
  const App = loadApp(win);

  // Primer render (arranque): filtro por defecto 'all', las dos cartas visibles.
  let cards = grid.querySelectorAll('.card');
  assert.strictEqual(cards.length, 2);
  assert.ok(cards.every((c) => !c.hasAttribute('hidden')), 'con filtro "all" ninguna carta debe estar oculta');

  // El usuario filtra por "rag" (lo que haría el click handler de initFilters)
  // y luego cambia de idioma, lo que dispara un repintado completo de
  // #workGrid con cartas nuevas.
  App.state.filter = 'rag';
  App.renderCards('es', true);

  cards = grid.querySelectorAll('.card');
  const cardA = cards.find((c) => c.getAttribute('data-id') === 'a'); // category rag
  const cardB = cards.find((c) => c.getAttribute('data-id') === 'b'); // category agents

  assert.strictEqual(cardA.hasAttribute('hidden'), false, 'la carta que coincide con el filtro debe seguir visible');
  assert.strictEqual(cardB.hasAttribute('hidden'), true, 'la carta que no coincide con el filtro debe seguir oculta');
});

// ---------- 4. closeCase resuelve la carta por id, no por el nodo capturado al abrir ----------

test('closeCase resuelve la carta por id contra cardsById, no contra un nodo capturado en openCase', () => {
  const grid = makeWorkGrid();
  const modalEl = makeAttrEl({ hidden: '' });
  const modalBody = makeAttrEl({});
  const modalClose = makeAttrEl({});
  const modalBackdrop = makeAttrEl({});

  const doc = makeBaseDoc({
    getElementById(id) {
      if (id === 'workGrid') return grid;
      if (id === 'modal') return modalEl;
      if (id === 'modalBody') return modalBody;
      if (id === 'modalClose') return modalClose;
      if (id === 'modalBackdrop') return modalBackdrop;
      return null;
    },
    querySelectorAll(sel) { return sel === '#workGrid .card' ? grid.querySelectorAll('.card') : []; },
    body: makeAttrEl({})
  });
  doc.body.children = [];

  const win = { document: doc, I18n: FakeI18n, CaseStudies: FAKE_CASES };
  const App = loadApp(win);

  // Tras el arranque, cardsById ya tiene las cartas de la primera carga.
  const cardABeforeRerender = App.getCardById('a');
  assert.ok(cardABeforeRerender, 'precondición: la carta "a" debe existir tras el arranque');

  App.openCase('a');

  // Cambio de idioma con el modal abierto: #workGrid se reconstruye por
  // completo y "a" pasa a apuntar a un nodo de carta distinto.
  App.renderCards('en', true);
  const cardAAfterRerender = App.getCardById('a');

  assert.notStrictEqual(cardAAfterRerender, cardABeforeRerender,
    'precondición: el repintado debe producir un nodo de carta distinto para "a"');

  App.closeCase();

  assert.strictEqual(cardAAfterRerender._focused, true,
    'closeCase debe devolver el foco a la carta ACTUAL resuelta por id');
  assert.notStrictEqual(cardABeforeRerender._focused, true,
    'closeCase no debe operar sobre el nodo capturado en openCase, que quedó desconectado');
});
