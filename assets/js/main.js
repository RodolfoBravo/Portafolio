(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.App = api;
})(typeof self !== 'undefined' ? self : this, function (win) {
  'use strict';

  /* ---------- Estado ---------- */

  var doc = win.document;
  var LS_KEY = 'rb.lang';
  var langSubscribers = [];
  var state = { lang: 'es' };

  var reduceMotion = win.matchMedia
    ? win.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ---------- Helpers privados ---------- */

  function readStoredLang() {
    try { return win.localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }
  function writeStoredLang(lang) {
    try { win.localStorage.setItem(LS_KEY, lang); } catch (e) { /* modo privado */ }
  }

  function onLangChange(fn) { langSubscribers.push(fn); }

  function setLang(lang) {
    state.lang = lang;
    win.I18n.apply(doc.documentElement, lang);
    writeStoredLang(lang);

    var toggle = doc.getElementById('langToggle');
    if (toggle) toggle.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');

    for (var i = 0; i < langSubscribers.length; i++) langSubscribers[i](lang);
  }

  function initLang() {
    setLang(win.I18n.detect(readStoredLang(), win.navigator && win.navigator.language));
    var toggle = doc.getElementById('langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      setLang(state.lang === 'es' ? 'en' : 'es');
    });
  }

  function initNav() {
    var burger = doc.getElementById('navBurger');
    var links = doc.getElementById('navLinks');
    if (burger && links) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        links.setAttribute('data-open', String(!open));
      });
      links.addEventListener('click', function (e) {
        if (e.target.tagName !== 'A') return;
        burger.setAttribute('aria-expanded', 'false');
        links.setAttribute('data-open', 'false');
      });
    }

    // Barra de progreso de scroll
    var bar = doc.getElementById('navProgress');
    if (bar) {
      var ticking = false;
      var update = function () {
        var max = doc.documentElement.scrollHeight - win.innerHeight;
        var pct = max > 0 ? (win.scrollY / max) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
        ticking = false;
      };
      win.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        win.requestAnimationFrame(update);
      }, { passive: true });
      update();
    }

    // Sección activa
    var navLinks = doc.querySelectorAll('#navLinks a');
    if (!navLinks.length || !win.IntersectionObserver) return;
    var byId = {};
    for (var i = 0; i < navLinks.length; i++) {
      byId[navLinks[i].getAttribute('href').slice(1)] = navLinks[i];
    }
    var obs = new win.IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j++) {
        var link = byId[entries[j].target.id];
        if (!link) continue;
        if (entries[j].isIntersecting) {
          for (var k = 0; k < navLinks.length; k++) navLinks[k].removeAttribute('aria-current');
          link.setAttribute('aria-current', 'true');
        }
      }
    }, { rootMargin: '-45% 0px -50% 0px' });

    for (var id in byId) {
      var el = doc.getElementById(id);
      if (el) obs.observe(el);
    }
  }

  function ready(fn) {
    if (doc.readyState !== 'loading') fn();
    else doc.addEventListener('DOMContentLoaded', fn);
  }

  // ---------- Case studies ----------
  var cardsById = {};

  function chip(text) { return '<span class="card__chip">' + text + '</span>'; }

  function renderCards(lang) {
    var grid = doc.getElementById('workGrid');
    if (!grid || !win.CaseStudies) return;
    var data = win.CaseStudies;
    var html = '';

    for (var i = 0; i < data.length; i++) {
      var c = data[i];
      var loc = c[lang] || c.en;
      var catLabel = win.I18n.t(lang, 'work.filter' +
        c.category.charAt(0).toUpperCase() + c.category.slice(1));

      html += '<article class="card" data-reveal data-category="' + c.category + '" data-id="' + c.id + '">'
        + '<div class="card__top">'
        + '<span class="mono card__cat">' + catLabel + '</span>'
        + (c.link ? '' : '<span class="mono card__lock">' + win.I18n.t(lang, 'work.private') + '</span>')
        + '</div>'
        + '<h3 class="card__title">' + loc.title + '</h3>'
        + '<p class="card__tagline">' + loc.tagline + '</p>'
        + '<div class="card__stack">' + c.stack.slice(0, 4).map(chip).join('') + '</div>'
        + '<button class="card__more" type="button" data-open="' + c.id + '">'
        + '<span>' + win.I18n.t(lang, 'work.readMore') + '</span><span aria-hidden="true">→</span>'
        + '</button>'
        + '</article>';
    }

    grid.innerHTML = html;

    cardsById = {};
    var cards = grid.querySelectorAll('.card');
    for (var j = 0; j < cards.length; j++) {
      cardsById[cards[j].getAttribute('data-id')] = cards[j];
      if (reduceMotion) cards[j].setAttribute('data-revealed', 'true');
    }
    if (!reduceMotion) observeReveal('#workGrid .card');
    attachTilt();
  }

  function getCardById(id) { return cardsById[id] || null; }

  function initFilters() {
    var bar = doc.getElementById('workFilters');
    var grid = doc.getElementById('workGrid');
    if (!bar || !grid) return;

    bar.addEventListener('click', function (e) {
      var btn = e.target.closest('.work__filter');
      if (!btn) return;
      var filter = btn.getAttribute('data-filter');

      var all = bar.querySelectorAll('.work__filter');
      for (var i = 0; i < all.length; i++) {
        all[i].setAttribute('aria-pressed', String(all[i] === btn));
      }

      var cards = grid.querySelectorAll('.card');
      for (var j = 0; j < cards.length; j++) {
        var show = filter === 'all' || cards[j].getAttribute('data-category') === filter;
        if (show) cards[j].removeAttribute('hidden');
        else cards[j].setAttribute('hidden', '');
      }
    });
  }

  function attachTilt() {
    if (reduceMotion) return;
    var cards = doc.querySelectorAll('#workGrid .card');
    for (var i = 0; i < cards.length; i++) bindTilt(cards[i]);
  }

  function bindTilt(card) {
    var MAX = 6;
    var pending = false, px = 0, py = 0, rx = 0, ry = 0;

    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      ry = ((px / r.width) - .5) * 2 * MAX;
      rx = -((py / r.height) - .5) * 2 * MAX;
      if (pending) return;
      pending = true;
      win.requestAnimationFrame(function () {
        card.style.setProperty('--px', px + 'px');
        card.style.setProperty('--py', py + 'px');
        card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
        pending = false;
      });
    }, { passive: true });

    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  }

  onLangChange(function (lang) { renderCards(lang); });

  // ---------- Motor de reveal ----------
  var revealObserver = null;

  function getRevealObserver() {
    if (revealObserver || !win.IntersectionObserver) return revealObserver;
    revealObserver = new win.IntersectionObserver(function (entries, obs) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.setAttribute('data-revealed', 'true');
        obs.unobserve(entries[i].target);
      }
    }, { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    return revealObserver;
  }

  function observeReveal(selector) {
    var nodes = doc.querySelectorAll(selector);
    var obs = getRevealObserver();
    for (var i = 0; i < nodes.length; i++) {
      if (!obs) { nodes[i].setAttribute('data-revealed', 'true'); continue; }
      obs.observe(nodes[i]);
    }
  }

  function splitWords(el) {
    if (el.getAttribute('data-split') === 'true') return;
    var STAGGER = 45;
    var index = 0;
    var children = el.querySelectorAll('[data-i18n]');

    for (var c = 0; c < children.length; c++) {
      var words = String(children[c].textContent).trim().split(/\s+/);
      var html = '';
      for (var w = 0; w < words.length; w++) {
        html += '<span class="word"><span style="--d:' + (index * STAGGER) + 'ms">' + words[w] + '</span></span> ';
        index++;
      }
      children[c].innerHTML = html;
    }
    el.setAttribute('data-split', 'true');
  }

  function initReveal() {
    // El h1 se parte en palabras antes de observarlo.
    var titles = doc.querySelectorAll('[data-reveal-words]');
    for (var i = 0; i < titles.length; i++) {
      if (!reduceMotion) splitWords(titles[i]);
      titles[i].setAttribute('data-reveal', '');
    }
    observeReveal('[data-reveal]');
  }

  // Al cambiar idioma, i18n reescribe el textContent y destruye los <span>.
  // Se vuelve a partir y se marca como revelado para que no quede oculto.
  //
  // IMPORTANTE: `initLang()` dispara `setLang` en el arranque, lo que ejecutaría este
  // suscriptor ANTES de `initReveal()` y dejaría los titulares ya revelados, matando la
  // animación de entrada del h1. La bandera salta esa primera invocación.
  var langInitialized = false;

  onLangChange(function () {
    if (!langInitialized) { langInitialized = true; return; }
    var titles = doc.querySelectorAll('[data-reveal-words]');
    for (var i = 0; i < titles.length; i++) {
      titles[i].removeAttribute('data-split');
      if (!reduceMotion) splitWords(titles[i]);
      titles[i].setAttribute('data-revealed', 'true');
    }
  });

  // ---------- Aurora reactiva al cursor ----------
  function initAurora() {
    var hero = doc.getElementById('hero');
    if (!hero || reduceMotion) return;
    var pending = false, lastX = 0, lastY = 0;

    hero.addEventListener('pointermove', function (e) {
      lastX = e.clientX - win.innerWidth / 2;
      lastY = e.clientY - win.innerHeight / 2;
      if (pending) return;
      pending = true;
      win.requestAnimationFrame(function () {
        hero.style.setProperty('--mx', lastX.toFixed(1) + 'px');
        hero.style.setProperty('--my', lastY.toFixed(1) + 'px');
        pending = false;
      });
    }, { passive: true });
  }

  // ---------- Scramble del rol ----------
  function initScramble() {
    var el = doc.getElementById('roleScramble');
    if (!el) return;
    var ROLES = ['AI Engineer', 'LLM Systems Engineer', 'AI Solutions Architect'];
    var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&/<>[]{}';
    var idx = 0;

    if (reduceMotion) { el.textContent = ROLES[0]; return; }

    function scrambleTo(target) {
      var frame = 0;
      var from = el.textContent;
      var len = Math.max(from.length, target.length);
      var id = win.setInterval(function () {
        var out = '';
        for (var i = 0; i < len; i++) {
          if (i < frame - 4) out += target[i] || '';
          else if (i < frame) out += CHARS[Math.floor(Math.random() * CHARS.length)];
          else out += target[i] ? (from[i] || '') : '';
        }
        el.textContent = out;
        frame++;
        if (frame > len + 4) { win.clearInterval(id); el.textContent = target; }
      }, 32);
    }

    win.setInterval(function () {
      idx = (idx + 1) % ROLES.length;
      scrambleTo(ROLES[idx]);
    }, 4200);
  }

  // ---------- Contadores ----------
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count-to'));
    var suffix = el.getAttribute('data-count-suffix') || '';
    var pad = parseInt(el.getAttribute('data-count-pad') || '0', 10);
    var DURATION = 1400;

    function paint(value) {
      var text = String(Math.round(value));
      while (text.length < pad) text = '0' + text;
      el.textContent = text + suffix;
    }

    if (reduceMotion) { paint(target); return; }

    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / DURATION);
      paint(target * easeOutExpo(p));
      if (p < 1) win.requestAnimationFrame(step);
    }
    paint(0);
    win.requestAnimationFrame(step);
  }

  function initCounters() {
    var nodes = doc.querySelectorAll('[data-count-to]');
    if (!nodes.length) return;
    if (!win.IntersectionObserver) {
      for (var i = 0; i < nodes.length; i++) runCounter(nodes[i]);
      return;
    }
    var obs = new win.IntersectionObserver(function (entries, o) {
      for (var j = 0; j < entries.length; j++) {
        if (!entries[j].isIntersecting) continue;
        runCounter(entries[j].target);
        o.unobserve(entries[j].target);
      }
    }, { threshold: .5 });
    for (var k = 0; k < nodes.length; k++) obs.observe(nodes[k]);
  }

  // ---------- Modal ----------
  var modalEl, modalBody, inertTargets = [];
  var FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

  // El fondo (header/main/footer) se marca `inert` mientras el modal está abierto.
  // Es defensa en profundidad junto al focus trap: el soporte de `aria-modal` para
  // restringir el cursor virtual de lectores de pantalla es inconsistente entre
  // combinaciones de navegador y AT, así que sin esto un usuario de lector de
  // pantalla podría navegar al contenido de detrás sin pasar por el trap de teclado.
  function setInert(on) {
    for (var i = 0; i < inertTargets.length; i++) inertTargets[i].inert = on;
  }

  function findCase(id) {
    var data = win.CaseStudies || [];
    for (var i = 0; i < data.length; i++) if (data[i].id === id) return data[i];
    return null;
  }

  function buildModalHtml(c, lang) {
    var loc = c[lang] || c.en;
    var t = function (k) { return win.I18n.t(lang, k); };
    var catLabel = t('work.filter' + c.category.charAt(0).toUpperCase() + c.category.slice(1));

    var arch = '';
    for (var i = 0; i < c.architecture.length; i++) {
      if (i) arch += '<span class="modal__archArrow" aria-hidden="true">→</span>';
      arch += '<span class="modal__archStep">' + c.architecture[i] + '</span>';
    }

    var chips = '';
    for (var j = 0; j < c.stack.length; j++) chips += '<span class="card__chip">' + c.stack[j] + '</span>';

    var impact = '';
    for (var k = 0; k < loc.impact.length; k++) impact += '<li>' + loc.impact[k] + '</li>';

    return '<span class="mono modal__cat">' + catLabel + '</span>'
      + '<h3 class="modal__title" id="modalTitle">' + loc.title + '</h3>'
      + '<p class="modal__tagline">' + loc.tagline + '</p>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelProblem') + '</span>'
      + '<p>' + loc.problem + '</p></div>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelSolution') + '</span>'
      + '<p>' + loc.solution + '</p></div>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelArchitecture') + '</span>'
      + '<div class="modal__arch">' + arch + '</div></div>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelStack') + '</span>'
      + '<div class="modal__chips">' + chips + '</div></div>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelImpact') + '</span>'
      + '<ul class="modal__impact">' + impact + '</ul></div>'
      + '<div class="modal__block"><span class="mono modal__label">' + t('work.labelLearned') + '</span>'
      + '<p>' + loc.learned + '</p></div>';
  }

  function openCase(id) {
    var c = findCase(id);
    if (!c || !modalEl) return;

    modalBody.innerHTML = buildModalHtml(c, state.lang);
    modalEl.removeAttribute('hidden');
    modalEl.setAttribute('data-case', id);
    doc.body.setAttribute('data-modal-open', 'true');
    setInert(true);
    doc.getElementById('modalClose').focus();
  }

  function closeCase() {
    if (!modalEl || modalEl.hasAttribute('hidden')) return;

    // El id se lee ANTES de limpiar `data-case`: no guardamos una referencia al
    // nodo de la carta capturada en `openCase`, porque un cambio de idioma mientras
    // el modal está abierto reconstruye `#workGrid` (Task 6) y deja esa referencia
    // desconectada del documento. Volver a resolver la carta por id en este momento,
    // con `cardsById` ya actualizado, evita que el foco caiga al <body>.
    var openId = modalEl.getAttribute('data-case');

    modalEl.setAttribute('hidden', '');
    modalEl.removeAttribute('data-case');
    doc.body.removeAttribute('data-modal-open');
    setInert(false);

    var card = openId ? getCardById(openId) : null;
    var btn = card && card.querySelector('[data-open]');
    if (btn) btn.focus();
    else if (card) card.focus();
  }

  function trapFocus(e) {
    if (modalEl.hasAttribute('hidden') || e.key !== 'Tab') return;
    var nodes = modalEl.querySelectorAll(FOCUSABLE);
    if (!nodes.length) return;
    var first = nodes[0], last = nodes[nodes.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function initModal() {
    modalEl = doc.getElementById('modal');
    modalBody = doc.getElementById('modalBody');
    if (!modalEl) return;

    // El modal es hermano de <header>, <main> y <footer> en el HTML, nunca su
    // descendiente, así que marcarlos `inert` no puede alcanzar ni desactivar el diálogo.
    inertTargets = [doc.querySelector('header'), doc.querySelector('main'), doc.querySelector('footer')]
      .filter(function (el) { return !!el; });

    doc.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-open]');
      if (opener) { openCase(opener.getAttribute('data-open')); return; }
      var card = e.target.closest('#workGrid .card');
      if (card) { openCase(card.getAttribute('data-id')); }
    });

    doc.getElementById('modalClose').addEventListener('click', closeCase);
    doc.getElementById('modalBackdrop').addEventListener('click', closeCase);

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCase();
      trapFocus(e);
    });

    // Al cambiar idioma con el modal abierto, se reconstruye en el nuevo idioma.
    onLangChange(function (lang) {
      var openId = modalEl.getAttribute('data-case');
      if (!openId) return;
      var c = findCase(openId);
      if (c) modalBody.innerHTML = buildModalHtml(c, lang);
    });
  }

  /* ---------- Arranque ---------- */

  ready(function () {
    initLang();
    initNav();
    initReveal();
    initAurora();
    initScramble();
    initCounters();
    initFilters();
    initModal();
  });

  /* ---------- API pública ---------- */

  return {
    state: state,
    reduceMotion: reduceMotion,
    setLang: setLang,
    onLangChange: onLangChange,
    ready: ready,
    observeReveal: observeReveal,
    splitWords: splitWords,
    getCardById: getCardById,
    renderCards: renderCards,
    openCase: openCase,
    closeCase: closeCase
  };
});
