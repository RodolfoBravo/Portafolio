# Rediseño de portafolio a perfil AI Engineer — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reescribir el portafolio de Rodolfo Bravo desde cero en HTML/CSS/JS vanilla, reposicionándolo de Fullstack (3 años) a AI Engineer (7 años), bilingüe ES/EN, con estética Editorial Noir y animaciones tipo React Bits.

**Architecture:** Un `index.html` estático con HTML semántico. CSS único con custom properties como sistema de diseño. Tres archivos JS con patrón UMD ligero (funcionan en el navegador vía `window.*` y son requeribles desde Node para tests). Los case studies viven como datos en `data.js` y se renderizan a cartas y modales, de modo que el contenido bilingüe existe en un solo lugar. Sin build, sin dependencias, sin framework.

**Tech Stack:** HTML5, CSS moderno (custom properties, grid, `clamp()`, `@media (prefers-reduced-motion)`), JavaScript vanilla (`IntersectionObserver`, `requestAnimationFrame`, `pointermove`), Google Fonts, Formspree, `node --test` para tests de lógica pura, `python -m http.server` para desarrollo local.

**Spec:** [docs/superpowers/specs/2026-07-30-portafolio-ai-engineer-design.md](../specs/2026-07-30-portafolio-ai-engineer-design.md)

---

## Global Constraints

Estas reglas aplican a **todas** las tareas. Los requisitos de cada tarea las incluyen implícitamente.

**Patrón de módulo JS (obligatorio en los tres archivos JS).** Cada archivo termina exponiéndose de dos formas, para que funcione al abrir el HTML con doble clic (`file://`) y sea testeable en Node:

```js
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.NOMBRE_GLOBAL = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  // ... implementación
  return { /* API pública */ };
});
```

No usar `type="module"`: los módulos ES fallan por CORS en `file://` y romperían la vista previa local.

**Tokens de color (valores exactos, no aproximar):**
`--bg:#0B0B0C` · `--surface:#121214` · `--raised:#17171A` · `--hairline:rgba(244,241,234,.12)` · `--text:#F4F1EA` · `--muted:rgba(244,241,234,.62)` · `--faint:rgba(244,241,234,.38)` · `--accent:#C8FF00` · `--accent-ink:#0B0B0C` · `--live:#4ADE80`

**Tipografía:** Instrument Serif (display), Inter (UI), JetBrains Mono (datos técnicos). Todo dato técnico — kickers, etiquetas, métricas, nombres de tecnología — va en mono con `letter-spacing:.14em` y `text-transform:uppercase`.

**Un solo acento.** `--accent` se reserva para: kicker del hero, una palabra del h1, números de métricas, hover de enlaces, CTA primario. Nunca como fondo de bloques grandes.

**Motion:** todo efecto va dentro de `@media (prefers-reduced-motion: no-preference)`. Con `reduce`, el contenido debe quedar **visible y completo** — jamás oculto. Ninguna animación supera 400ms.

**Accesibilidad:** `<meta viewport>` sin `maximum-scale` ni `user-scalable=no`. `:focus-visible` visible en todo lo interactivo. Sin saltos en la jerarquía de encabezados. Contraste AA.

**Idioma:** todo texto visible se resuelve por `data-i18n`. Ningún texto en español o inglés queda hardcodeado en el HTML salvo nombres propios y nombres de tecnología.

**Marcadores:** las cifras van como `[XX]`, empresas como `[Empresa]`, email como `[EMAIL_PUBLICO]`, Formspree como `[FORMSPREE_ID]`. Deben quedar **visibles** en el render, no ocultos — son un recordatorio para Rodolfo.

**Commits:** uno por tarea, en la rama `redesign-ai-engineer`. Mensajes en español, formato convencional, terminando con:
`Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

**Servidor de desarrollo:** `python -m http.server 8000` desde la raíz del proyecto. Verificar en `http://localhost:8000`.

---

## Estructura de archivos

| Archivo | Responsabilidad |
|---|---|
| `index.html` | Estructura semántica y contenido estático con atributos `data-i18n`. No contiene lógica ni estilos. |
| `assets/css/main.css` | Sistema de diseño completo: tokens → reset → base → layout → componentes → motion → utilidades. |
| `assets/js/i18n.js` | Diccionario ES/EN, resolución de claves, aplicación al DOM, persistencia. Lógica pura testeable. |
| `assets/js/data.js` | Los 6 case studies como datos con texto en ambos idiomas. Sin lógica de render. |
| `assets/js/main.js` | Todo el comportamiento: nav, reveal, contadores, tilt, marquee, render de cartas, modal, formulario. |
| `tests/i18n.test.js` | Tests de `i18n.js` con `node --test`. |
| `tests/data.test.js` | Tests de integridad de `data.js` con `node --test`. |
| `.nojekyll` | Evita que GitHub Pages procese el sitio con Jekyll. |
| `README.md` | Cómo correr el sitio localmente y la lista de acciones pendientes de Rodolfo. |

Se conservan: `cv/CVRodolfoBravo.pdf`, `images/favicon.ico`, `images/apple-touch-icon.png`, `uploads/avatar.png`.

Se eliminan: `style.css`, `css/`, `js/`, `mail/`, `fonts/`, `index.md`, `_config.yml`, `images/prettyPhoto/`, `images/ajax-loader.gif`, `images/bg.png`, `images/country-quilt-dark.png`, `images/logo.png`, `uploads/banner-01.jpg`, `uploads/gallery_img-0*.jpg`.

---

## Task 1: Limpieza, andamiaje y sistema de diseño

Deja el proyecto con un `index.html` válido que carga tipografías y tokens, y una página oscura vacía con nav y footer. Nada de contenido todavía.

**Files:**
- Delete: `style.css`, `css/`, `js/`, `mail/`, `fonts/`, `index.md`, `_config.yml`, `images/prettyPhoto/`, `images/ajax-loader.gif`, `images/bg.png`, `images/country-quilt-dark.png`, `images/logo.png`, `uploads/banner-01.jpg`, `uploads/gallery_img-01.jpg`…`gallery_img-06.jpg`
- Create: `.nojekyll`, `assets/css/main.css`
- Rewrite: `index.html`

**Interfaces:**
- Consumes: nada (primera tarea)
- Produces: los tokens CSS y las clases base `.container`, `.section`, `.kicker`, `.mono`, `.btn`, `.btn--primary`, `.hairline`, `.sr-only`, `.skip-link` que todas las tareas siguientes usan. La estructura de `index.html` con los landmarks `<header>`, `<main>`, `<footer>` y los `<section id>` vacíos: `#hero`, `#proof`, `#work`, `#stack`, `#production`, `#experience`, `#about`, `#contact`.

- [ ] **Step 1: Borrar el legacy**

```bash
cd "d:/Frontend/Portafolio"
git rm -r --cached css js mail fonts images/prettyPhoto >/dev/null
rm -rf css js mail fonts images/prettyPhoto
rm -f style.css index.md _config.yml
rm -f images/ajax-loader.gif images/bg.png images/country-quilt-dark.png images/logo.png
rm -f uploads/banner-01.jpg uploads/gallery_img-0*.jpg
```

- [ ] **Step 2: Verificar qué quedó**

Run: `ls -R . | head -40`
Expected: solo quedan `index.html`, `README.md`, `cv/`, `images/` (favicon.ico, apple-touch-icon.png), `uploads/avatar.png`, `docs/`, `.gitignore`.

- [ ] **Step 3: Crear `.nojekyll`**

```bash
touch .nojekyll
```

- [ ] **Step 4: Escribir `assets/css/main.css` — tokens y base**

```css
/* ============================================================
   Rodolfo Bravo — AI Engineer · Editorial Noir
   1. Tokens  2. Reset  3. Base  4. Layout  5. Componentes
   6. Secciones  7. Motion  8. Utilidades
   ============================================================ */

/* ---------- 1. Tokens ---------- */
:root {
  --bg: #0B0B0C;
  --surface: #121214;
  --raised: #17171A;
  --hairline: rgba(244, 241, 234, .12);
  --text: #F4F1EA;
  --muted: rgba(244, 241, 234, .62);
  --faint: rgba(244, 241, 234, .38);
  --accent: #C8FF00;
  --accent-ink: #0B0B0C;
  --live: #4ADE80;

  --font-display: "Instrument Serif", Georgia, "Times New Roman", serif;
  --font-ui: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Consolas, "SF Mono", monospace;

  --fs-display: clamp(2.5rem, 1.2rem + 5.4vw, 5.75rem);
  --fs-h2: clamp(1.9rem, 1.2rem + 2.4vw, 3.25rem);
  --fs-h3: clamp(1.15rem, 1rem + .6vw, 1.5rem);
  --fs-body: clamp(.95rem, .9rem + .25vw, 1.0625rem);
  --fs-small: .875rem;
  --fs-mono: .6875rem;

  --sp-1: 4px;  --sp-2: 8px;  --sp-3: 12px; --sp-4: 16px;
  --sp-5: 24px; --sp-6: 32px; --sp-7: 48px; --sp-8: 64px;
  --sp-9: 96px; --sp-10: 128px;

  --gutter: clamp(20px, 5vw, 64px);
  --measure: 68ch;
  --radius: 6px;
  --section-y: clamp(88px, 12vh, 168px);
  --nav-h: 68px;

  --ease: cubic-bezier(.22, .61, .36, 1);
}

/* ---------- 2. Reset ---------- */
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { -webkit-text-size-adjust: 100%; }
body { min-height: 100vh; -webkit-font-smoothing: antialiased; }
img, picture, svg { display: block; max-width: 100%; }
button, input, textarea { font: inherit; color: inherit; }
button { background: none; border: 0; cursor: pointer; }
a { color: inherit; text-decoration: none; }
ul, ol { list-style: none; padding: 0; }

/* ---------- 3. Base ---------- */
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
  font-size: var(--fs-body);
  line-height: 1.65;
  font-feature-settings: "cv11", "ss01";
}

h1, h2, h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: -.022em; }
h1 { font-size: var(--fs-display); line-height: .98; }
h2 { font-size: var(--fs-h2); line-height: 1.04; }
h3 { font-size: var(--fs-h3); line-height: 1.2; }
p { color: var(--muted); max-width: var(--measure); }

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}
::selection { background: var(--accent); color: var(--accent-ink); }

/* ---------- 4. Layout ---------- */
.container { width: min(1180px, 100% - 2 * var(--gutter)); margin-inline: auto; }
.section { padding-block: var(--section-y); border-top: 1px solid var(--hairline); }
.section__head { margin-bottom: var(--sp-8); }
.section__head h2 { max-width: 22ch; }
.section__head p { margin-top: var(--sp-4); }

/* ---------- 5. Componentes base ---------- */
.kicker {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--accent);
  display: block;
}
.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--faint);
}
.accent { color: var(--accent); }

.btn {
  display: inline-flex; align-items: center; gap: var(--sp-2);
  padding: 13px 22px; border-radius: var(--radius);
  border: 1px solid var(--hairline);
  font-size: var(--fs-small); font-weight: 500;
  transition: border-color .2s var(--ease), background-color .2s var(--ease), color .2s var(--ease);
}
.btn:hover { border-color: var(--text); }
.btn--primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); font-weight: 600; }
.btn--primary:hover { background: var(--text); border-color: var(--text); color: var(--bg); }

/* ---------- 8. Utilidades ---------- */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0;
  margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}
.skip-link {
  position: absolute; left: var(--sp-4); top: -100px; z-index: 100;
  background: var(--accent); color: var(--accent-ink);
  padding: var(--sp-3) var(--sp-4); border-radius: var(--radius); font-weight: 600;
  transition: top .2s var(--ease);
}
.skip-link:focus { top: var(--sp-4); }
```

- [ ] **Step 5: Escribir `index.html` — shell semántico**

Nota: el `<head>` ahora sí abre correctamente (el archivo original no tenía la etiqueta de apertura) y el `viewport` ya no bloquea el zoom.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Rodolfo Bravo — AI Engineer</title>
  <meta name="description" content="AI Engineer con 7 años construyendo software. Sistemas RAG, agentes con herramientas y evaluación de LLMs en producción. Next.js, Python, AWS, GCP, Azure.">
  <meta name="author" content="Rodolfo Bravo">

  <link rel="shortcut icon" href="images/favicon.ico" type="image/x-icon">
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">

  <link rel="stylesheet" href="assets/css/main.css">
</head>
<body>
  <a class="skip-link" href="#main" data-i18n="a11y.skip">Ir al contenido</a>

  <header id="nav"><!-- Task 3 --></header>

  <main id="main">
    <section id="hero"><!-- Task 4 --></section>
    <section id="proof" class="section"><!-- Task 5 --></section>
    <section id="work" class="section"><!-- Task 6 --></section>
    <section id="stack" class="section"><!-- Task 8 --></section>
    <section id="production" class="section"><!-- Task 9 --></section>
    <section id="experience" class="section"><!-- Task 10 --></section>
    <section id="about" class="section"><!-- Task 10 --></section>
    <section id="contact" class="section"><!-- Task 11 --></section>
  </main>

  <footer id="footer"><!-- Task 11 --></footer>

  <script src="assets/js/i18n.js"></script>
  <script src="assets/js/data.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>
```

Los tres `<script>` apuntan a archivos que aún no existen; el navegador reportará 404 y eso es esperado hasta la Task 2. No añadir los archivos vacíos ahora.

- [ ] **Step 6: Verificar en el navegador**

Run: `python -m http.server 8000` y abrir `http://localhost:8000`
Expected: página en negro `#0B0B0C`. Al presionar `Tab`, aparece el skip link verde lima arriba a la izquierda. En consola solo tres 404 de los JS. Verificar en DevTools → Network que las tres fuentes de Google cargan.

- [ ] **Step 7: Validar el HTML**

Abrir DevTools → Elements y confirmar que `<head>` y `<body>` están correctamente anidados (el archivo original tenía `</head>` sin apertura, lo que hacía que el navegador moviera elementos al body).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: limpiar plantilla legacy y crear andamiaje con sistema de diseño

Elimina Bootstrap, jQuery y los 28 scripts de js/, junto con las imágenes
de stock y el formulario PHP que nunca funcionó en GitHub Pages.

Reescribe index.html con head bien formado (el original no tenía etiqueta
de apertura) y viewport sin user-scalable=no, que bloqueaba el zoom.

Añade assets/css/main.css con los tokens de Editorial Noir y .nojekyll.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: Internacionalización con tests

Lógica pura, primera tarea con TDD real. El diccionario completo y el aplicador al DOM.

**Files:**
- Create: `assets/js/i18n.js`, `tests/i18n.test.js`

**Interfaces:**
- Consumes: nada
- Produces: `window.I18n` con esta API exacta, usada por `main.js` en las tareas 3 a 11:
  - `I18n.DICT` — objeto `{ es: {...}, en: {...} }` con claves planas separadas por punto
  - `I18n.t(lang, key)` → `string`. Devuelve la traducción; si falta la clave, devuelve la clave misma.
  - `I18n.detect(stored, navLang)` → `'es' | 'en'`. `stored` es el valor de localStorage (puede ser `null`); `navLang` es `navigator.language`.
  - `I18n.apply(root, lang)` → `number`. Traduce todos los `[data-i18n]` y `[data-i18n-attr]` dentro de `root`, ajusta `root.lang` si `root` es un `<html>`, y devuelve cuántos nodos tradujo.

- [ ] **Step 1: Escribir el test que falla**

Crear `tests/i18n.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const I18n = require('../assets/js/i18n.js');

test('t devuelve la traducción de la clave', () => {
  assert.strictEqual(I18n.t('es', 'nav.work'), 'Casos');
  assert.strictEqual(I18n.t('en', 'nav.work'), 'Work');
});

test('t devuelve la clave cuando no existe la traducción', () => {
  assert.strictEqual(I18n.t('es', 'clave.inexistente'), 'clave.inexistente');
});

test('detect prioriza el valor guardado', () => {
  assert.strictEqual(I18n.detect('en', 'es-MX'), 'en');
  assert.strictEqual(I18n.detect('es', 'en-US'), 'es');
});

test('detect ignora valores guardados inválidos', () => {
  assert.strictEqual(I18n.detect('fr', 'en-US'), 'en');
  assert.strictEqual(I18n.detect('', 'es-MX'), 'es');
});

test('detect cae al navegador cuando no hay valor guardado', () => {
  assert.strictEqual(I18n.detect(null, 'es-MX'), 'es');
  assert.strictEqual(I18n.detect(null, 'en-GB'), 'en');
  assert.strictEqual(I18n.detect(null, 'pt-BR'), 'en');
  assert.strictEqual(I18n.detect(null, undefined), 'en');
});

test('los diccionarios es y en tienen exactamente las mismas claves', () => {
  const es = Object.keys(I18n.DICT.es).sort();
  const en = Object.keys(I18n.DICT.en).sort();
  assert.deepStrictEqual(es, en, 'es y en deben tener las mismas claves');
});

test('ninguna traducción está vacía', () => {
  for (const lang of ['es', 'en']) {
    for (const [key, value] of Object.entries(I18n.DICT[lang])) {
      assert.ok(String(value).trim().length > 0, `${lang}.${key} está vacía`);
    }
  }
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module '../assets/js/i18n.js'`

- [ ] **Step 3: Escribir `assets/js/i18n.js`**

Diccionario completo del sitio. Las claves siguen el patrón `seccion.elemento`.

```js
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.I18n = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var DICT = {
    es: {
      'a11y.skip': 'Ir al contenido',
      'a11y.langToggle': 'Cambiar idioma a inglés',
      'a11y.menu': 'Abrir menú de navegación',
      'a11y.closeModal': 'Cerrar detalle del proyecto',

      'nav.work': 'Casos',
      'nav.stack': 'Stack',
      'nav.production': 'Producción',
      'nav.experience': 'Experiencia',
      'nav.about': 'Sobre mí',
      'nav.contact': 'Contacto',

      'hero.kicker': 'AI Engineer · 7 años construyendo software · [XX] en sistemas de IA',
      'hero.available': 'Disponible para proyectos',
      'hero.h1a': 'Construyo IA que',
      'hero.h1accent': 'sobrevive',
      'hero.h1b': 'a producción.',
      'hero.lede': 'Siete años desarrollando software, los últimos [XX] enfocados en sistemas con LLMs: RAG, agentes con herramientas y evaluación continua. No demos — sistemas con usuarios reales, costos bajo control y observabilidad.',
      'hero.endToEnd': 'Del retrieval al checkout: diseño el sistema completo, no solo la llamada al modelo.',
      'hero.ctaWork': 'Ver casos de estudio',
      'hero.ctaCv': 'Descargar CV',
      'hero.ctaMail': 'Escríbeme',

      'proof.years': 'Años construyendo software',
      'proof.systems': 'Sistemas con LLM en producción',
      'proof.clouds': 'Clouds en producción · AWS, GCP, Azure',
      'proof.users': 'Usuarios impactados',

      'work.kicker': 'Casos de estudio',
      'work.title': 'Sistemas con LLMs que llegaron a usuarios reales.',
      'work.lede': 'Cada caso incluye el problema, la arquitectura, el stack y el impacto medido. Haz clic para ver el detalle completo.',
      'work.filterAll': 'Todos',
      'work.filterRag': 'RAG',
      'work.filterAgents': 'Agentes',
      'work.filterLlmops': 'LLMOps',
      'work.filterProduct': 'Producto',
      'work.filterDocuments': 'Documentos',
      'work.filterIntegrations': 'Integraciones',
      'work.readMore': 'Ver caso completo',
      'work.private': 'Proyecto privado',
      'work.labelProblem': 'Problema',
      'work.labelSolution': 'Solución',
      'work.labelArchitecture': 'Arquitectura',
      'work.labelStack': 'Stack',
      'work.labelImpact': 'Impacto',
      'work.labelLearned': 'Lo que aprendí',

      'stack.kicker': 'Stack',
      'stack.title': 'Lo que uso, y para qué lo uso.',
      'stack.lede': 'Sin porcentajes de autoevaluación: cada tecnología con el contexto real en el que la he usado.',
      'stack.groupAi': 'IA y LLMs',
      'stack.groupLlmops': 'LLMOps y evaluación',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupCloud': 'Cloud y DevOps',
      'stack.groupPayments': 'Pagos e integraciones',

      'production.kicker': 'Método',
      'production.title': 'Cómo llevo IA a producción.',
      'production.lede': 'La diferencia entre un prototipo que impresiona en una demo y un sistema que aguanta usuarios reales está en cuatro decisiones.',
      'production.p1t': 'Evaluar antes de desplegar',
      'production.p1d': 'Dataset dorado y gate en CI. Si el score baja del umbral, el cambio no sale. Sin evaluaciones, «mejoramos el prompt» es una opinión.',
      'production.p2t': 'El costo es un requisito, no una sorpresa',
      'production.p2d': 'Presupuesto por token, caché semántica y enrutamiento al modelo más pequeño que resuelva la tarea. Instrumentar el consumo desde el día uno es más barato que reconstruirlo después.',
      'production.p3t': 'Fallar bien',
      'production.p3d': 'Timeouts, reintentos con backoff, degradación explícita y modelo de respaldo. Un proveedor caído no debe tumbar el producto.',
      'production.p4t': 'Observar todo',
      'production.p4d': 'Traza por request, latencia p95, fundamentación de la respuesta y costo por usuario. Lo que no se mide no se puede mejorar ni defender.',
      'production.diagramLabel': 'Arquitectura de referencia',

      'experience.kicker': 'Trayectoria',
      'experience.title': 'Siete años, una dirección.',
      'experience.lede': 'De la electrónica al software, y del software a los sistemas con IA. Cada etapa construida sobre la anterior.',

      'about.kicker': 'Sobre mí',
      'about.title': 'Ingeniero antes que programador.',
      'about.body': 'Soy Ingeniero Electrónico y llevo siete años construyendo software. La electrónica me dejó una forma de pensar que sigo usando todos los días: todo sistema tiene restricciones — latencia, costo, energía, tolerancia a fallos — y el trabajo consiste en diseñar dentro de ellas. Hoy aplico exactamente eso a sistemas con LLMs, donde las restricciones son el costo por token, la latencia y la confiabilidad de un modelo que no es determinista. Me interesa la parte que suele quedar sin resolver: llevar la IA del prototipo a algo que aguante usuarios reales.',
      'about.portraitAlt': 'Retrato de Rodolfo Bravo',

      'contact.kicker': 'Contacto',
      'contact.title': '¿Tienes un rol o un proyecto de IA en mente?',
      'contact.lede': 'Respondo en menos de 24 horas.',
      'contact.name': 'Nombre',
      'contact.email': 'Correo',
      'contact.company': 'Empresa (opcional)',
      'contact.message': 'Cuéntame del rol o del proyecto',
      'contact.send': 'Enviar mensaje',
      'contact.sending': 'Enviando…',
      'contact.success': 'Mensaje enviado. Te respondo en menos de 24 horas.',
      'contact.error': 'No se pudo enviar. Escríbeme directo por correo.',
      'contact.orDirect': 'O directo, sin formulario:',

      'footer.rights': 'Todos los derechos reservados.',
      'footer.built': 'Sitio hecho a mano en HTML, CSS y JavaScript. Sin frameworks.'
    },
    en: {
      'a11y.skip': 'Skip to content',
      'a11y.langToggle': 'Switch language to Spanish',
      'a11y.menu': 'Open navigation menu',
      'a11y.closeModal': 'Close project detail',

      'nav.work': 'Work',
      'nav.stack': 'Stack',
      'nav.production': 'Production',
      'nav.experience': 'Experience',
      'nav.about': 'About',
      'nav.contact': 'Contact',

      'hero.kicker': 'AI Engineer · 7 years building software · [XX] in AI systems',
      'hero.available': 'Available for work',
      'hero.h1a': 'I build AI that',
      'hero.h1accent': 'survives',
      'hero.h1b': 'production.',
      'hero.lede': 'Seven years building software, the last [XX] focused on LLM systems: RAG, tool-using agents, and continuous evaluation. Not demos — systems with real users, costs under control, and observability.',
      'hero.endToEnd': 'From retrieval to checkout: I design the whole system, not just the model call.',
      'hero.ctaWork': 'View case studies',
      'hero.ctaCv': 'Download CV',
      'hero.ctaMail': 'Get in touch',

      'proof.years': 'Years building software',
      'proof.systems': 'LLM systems in production',
      'proof.clouds': 'Clouds in production · AWS, GCP, Azure',
      'proof.users': 'Users impacted',

      'work.kicker': 'Case studies',
      'work.title': 'LLM systems that reached real users.',
      'work.lede': 'Each case includes the problem, the architecture, the stack, and the measured impact. Click for the full detail.',
      'work.filterAll': 'All',
      'work.filterRag': 'RAG',
      'work.filterAgents': 'Agents',
      'work.filterLlmops': 'LLMOps',
      'work.filterProduct': 'Product',
      'work.filterDocuments': 'Documents',
      'work.filterIntegrations': 'Integrations',
      'work.readMore': 'Read full case',
      'work.private': 'Private project',
      'work.labelProblem': 'Problem',
      'work.labelSolution': 'Solution',
      'work.labelArchitecture': 'Architecture',
      'work.labelStack': 'Stack',
      'work.labelImpact': 'Impact',
      'work.labelLearned': 'What I learned',

      'stack.kicker': 'Stack',
      'stack.title': 'What I use, and what I use it for.',
      'stack.lede': 'No self-rated percentages: every technology with the real context I have used it in.',
      'stack.groupAi': 'AI and LLMs',
      'stack.groupLlmops': 'LLMOps and evaluation',
      'stack.groupFrontend': 'Frontend',
      'stack.groupBackend': 'Backend',
      'stack.groupCloud': 'Cloud and DevOps',
      'stack.groupPayments': 'Payments and integrations',

      'production.kicker': 'Method',
      'production.title': 'How I ship AI to production.',
      'production.lede': 'The difference between a prototype that impresses in a demo and a system that holds up with real users comes down to four decisions.',
      'production.p1t': 'Evaluate before deploying',
      'production.p1d': 'Golden dataset and a CI gate. If the score drops below threshold, the change does not ship. Without evals, "we improved the prompt" is an opinion.',
      'production.p2t': 'Cost is a requirement, not a surprise',
      'production.p2d': 'Per-token budget, semantic caching, and routing to the smallest model that solves the task. Instrumenting spend on day one is cheaper than rebuilding it later.',
      'production.p3t': 'Fail well',
      'production.p3d': 'Timeouts, retries with backoff, explicit degradation, and a fallback model. A provider outage should not take the product down.',
      'production.p4t': 'Observe everything',
      'production.p4d': 'Per-request traces, p95 latency, answer groundedness, and cost per user. What is not measured cannot be improved or defended.',
      'production.diagramLabel': 'Reference architecture',

      'experience.kicker': 'Track record',
      'experience.title': 'Seven years, one direction.',
      'experience.lede': 'From electronics to software, and from software to AI systems. Each stage built on the one before it.',

      'about.kicker': 'About',
      'about.title': 'Engineer before programmer.',
      'about.body': "I'm an Electronics Engineer and I've spent seven years building software. Electronics left me with a way of thinking I still use every day: every system has constraints — latency, cost, power, fault tolerance — and the work is designing within them. Today I apply exactly that to LLM systems, where the constraints are cost per token, latency, and the reliability of a model that isn't deterministic. I'm drawn to the part that usually goes unsolved: taking AI from prototype to something that holds up with real users.",
      'about.portraitAlt': 'Portrait of Rodolfo Bravo',

      'contact.kicker': 'Contact',
      'contact.title': 'Have an AI role or project in mind?',
      'contact.lede': 'I reply within 24 hours.',
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.company': 'Company (optional)',
      'contact.message': 'Tell me about the role or the project',
      'contact.send': 'Send message',
      'contact.sending': 'Sending…',
      'contact.success': 'Message sent. I reply within 24 hours.',
      'contact.error': 'Could not send. Email me directly instead.',
      'contact.orDirect': 'Or reach me directly:',

      'footer.rights': 'All rights reserved.',
      'footer.built': 'Hand-built in HTML, CSS and JavaScript. No frameworks.'
    }
  };

  var LANGS = ['es', 'en'];

  function t(lang, key) {
    var table = DICT[lang] || DICT.en;
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : key;
  }

  function detect(stored, navLang) {
    if (LANGS.indexOf(stored) !== -1) return stored;
    return String(navLang || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en';
  }

  function apply(rootEl, lang) {
    var count = 0;

    var nodes = rootEl.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].textContent = t(lang, nodes[i].getAttribute('data-i18n'));
      count++;
    }

    // data-i18n-attr="placeholder:contact.name" o varios separados por coma
    var attrNodes = rootEl.querySelectorAll('[data-i18n-attr]');
    for (var j = 0; j < attrNodes.length; j++) {
      var pairs = attrNodes[j].getAttribute('data-i18n-attr').split(',');
      for (var k = 0; k < pairs.length; k++) {
        var parts = pairs[k].split(':');
        if (parts.length !== 2) continue;
        attrNodes[j].setAttribute(parts[0].trim(), t(lang, parts[1].trim()));
        count++;
      }
    }

    if (rootEl.tagName === 'HTML') rootEl.lang = lang;
    return count;
  }

  return { DICT: DICT, LANGS: LANGS, t: t, detect: detect, apply: apply };
});
```

- [ ] **Step 4: Correr los tests**

Run: `node --test tests/`
Expected: PASS, 7 tests. Si el test de paridad de claves falla, indica exactamente qué clave falta en cuál idioma — corregirla.

- [ ] **Step 5: Commit**

```bash
git add assets/js/i18n.js tests/i18n.test.js
git commit -m "feat: sistema de i18n bilingüe con tests

Diccionario ES/EN completo del sitio, resolución de claves con fallback,
detección de idioma inicial y aplicador al DOM vía data-i18n.

Los tests garantizan paridad de claves entre idiomas: si se agrega un
texto en español y se olvida en inglés, node --test lo detecta.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Navegación, toggle de idioma y progreso de scroll

**Files:**
- Create: `assets/js/main.js`
- Modify: `index.html` (reemplazar `<header id="nav">`), `assets/css/main.css` (añadir sección de nav)

**Interfaces:**
- Consumes: `I18n.detect`, `I18n.apply`, `I18n.t`
- Produces: `window.App` con:
  - `App.state.lang` — idioma activo
  - `App.setLang(lang)` — cambia idioma, aplica al DOM, persiste, y llama a todos los suscriptores
  - `App.onLangChange(fn)` — registra un callback `fn(lang)` que se ejecuta en cada cambio. Las tareas 6 y 11 lo usan para re-renderizar contenido dinámico.
  - `App.ready(fn)` — ejecuta `fn` cuando el DOM está listo

- [ ] **Step 1: Escribir el HTML del nav**

Reemplazar `<header id="nav"><!-- Task 3 --></header>` en `index.html`:

```html
  <header class="nav" id="nav">
    <div class="nav__progress" id="navProgress" aria-hidden="true"></div>
    <div class="container nav__inner">
      <a class="nav__brand" href="#hero">
        Rodolfo Bravo
        <span class="nav__brandRole mono">AI Engineer</span>
      </a>

      <nav class="nav__links" id="navLinks" aria-label="Principal">
        <a href="#work" data-i18n="nav.work">Casos</a>
        <a href="#stack" data-i18n="nav.stack">Stack</a>
        <a href="#production" data-i18n="nav.production">Producción</a>
        <a href="#experience" data-i18n="nav.experience">Experiencia</a>
        <a href="#about" data-i18n="nav.about">Sobre mí</a>
        <a href="#contact" data-i18n="nav.contact">Contacto</a>
      </nav>

      <div class="nav__actions">
        <button class="nav__lang mono" id="langToggle" type="button"
                aria-pressed="false" data-i18n-attr="aria-label:a11y.langToggle">
          <span class="nav__langOn">ES</span><span class="nav__langSep">/</span><span class="nav__langOff">EN</span>
        </button>
        <button class="nav__burger" id="navBurger" type="button"
                aria-expanded="false" aria-controls="navLinks"
                data-i18n-attr="aria-label:a11y.menu">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
```

- [ ] **Step 2: Añadir el CSS del nav a `main.css`**

Insertar antes de la sección `/* ---------- 8. Utilidades ---------- */`:

```css
/* ---------- 6. Nav ---------- */
.nav {
  position: fixed; inset: 0 0 auto; z-index: 50;
  height: var(--nav-h);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--hairline);
}
@supports not (backdrop-filter: blur(1px)) { .nav { background: var(--bg); } }

.nav__progress {
  position: absolute; left: 0; bottom: -1px; height: 2px; width: 0%;
  background: var(--accent);
}
.nav__inner { display: flex; align-items: center; gap: var(--sp-6); height: 100%; }

.nav__brand { font-family: var(--font-display); font-size: 1.0625rem; letter-spacing: -.01em; line-height: 1; }
.nav__brandRole { display: block; margin-top: 3px; color: var(--faint); font-size: .5625rem; }

.nav__links { display: flex; gap: var(--sp-6); margin-left: auto; }
.nav__links a {
  position: relative; font-size: var(--fs-small); color: var(--muted);
  transition: color .2s var(--ease);
}
.nav__links a:hover { color: var(--text); }
.nav__links a[aria-current="true"] { color: var(--text); }
.nav__links a[aria-current="true"]::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -6px;
  height: 1px; background: var(--accent);
}

.nav__actions { display: flex; align-items: center; gap: var(--sp-3); }
.nav__lang {
  display: inline-flex; gap: 3px; padding: 7px 11px;
  border: 1px solid var(--hairline); border-radius: 999px; color: var(--faint);
  transition: border-color .2s var(--ease);
}
.nav__lang:hover { border-color: var(--text); }
.nav__langOn { color: var(--accent); }
.nav__langSep { opacity: .35; }
.nav__lang[aria-pressed="true"] .nav__langOn { color: var(--faint); }
.nav__lang[aria-pressed="true"] .nav__langOff { color: var(--accent); }

.nav__burger { display: none; flex-direction: column; gap: 5px; padding: 10px 6px; }
.nav__burger span { display: block; width: 20px; height: 1.5px; background: var(--text); transition: transform .2s var(--ease); }
.nav__burger[aria-expanded="true"] span:first-child { transform: translateY(3.25px) rotate(45deg); }
.nav__burger[aria-expanded="true"] span:last-child { transform: translateY(-3.25px) rotate(-45deg); }

@media (max-width: 880px) {
  .nav__burger { display: flex; }
  .nav__links {
    position: fixed; inset: var(--nav-h) 0 auto; flex-direction: column; gap: 0;
    background: var(--bg); border-bottom: 1px solid var(--hairline);
    padding: var(--sp-3) var(--gutter) var(--sp-5);
    transform: translateY(-8px); opacity: 0; pointer-events: none;
    transition: opacity .2s var(--ease), transform .2s var(--ease);
  }
  .nav__links[data-open="true"] { transform: none; opacity: 1; pointer-events: auto; }
  .nav__links a { padding: var(--sp-4) 0; border-bottom: 1px solid var(--hairline); font-size: 1rem; }
}

#main { padding-top: var(--nav-h); }
```

- [ ] **Step 3: Escribir `assets/js/main.js` con el núcleo de la app**

```js
(function (root, factory) {
  var api = factory(root);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.App = api;
})(typeof self !== 'undefined' ? self : this, function (win) {
  'use strict';

  var doc = win.document;
  var LS_KEY = 'rb.lang';
  var langSubscribers = [];
  var state = { lang: 'es' };

  var reduceMotion = win.matchMedia
    ? win.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

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

  ready(function () {
    initLang();
    initNav();
  });

  return {
    state: state,
    reduceMotion: reduceMotion,
    setLang: setLang,
    onLangChange: onLangChange,
    ready: ready
  };
});
```

- [ ] **Step 4: Verificar el nav en el navegador**

Run: `python -m http.server 8000`, abrir `http://localhost:8000`
Expected:
- Nav fijo arriba con el nombre y los 6 enlaces.
- Al hacer clic en `ES/EN`, los 6 enlaces cambian a inglés (`Work`, `Stack`, `Production`, `Experience`, `About`, `Contact`) y el acento lima salta de `ES` a `EN`.
- Recargar: el idioma elegido se mantiene.
- En DevTools → Application → Local Storage debe existir `rb.lang`.
- Al hacer scroll (la página aún es corta; usar zoom 200% o esperar a la Task 4) la barra lima crece bajo el nav.
- Reducir el ancho a menos de 880px: aparece el botón hamburguesa y el menú se despliega y se cierra al elegir un enlace.
- Consola: solo un 404 de `data.js`.

- [ ] **Step 5: Verificar accesibilidad del nav con teclado**

Presionar `Tab` desde el inicio: skip link → marca → 6 enlaces → toggle de idioma. Todo con contorno lima visible. El botón de idioma debe anunciar su `aria-label` traducido (verificar en DevTools que el atributo cambia al alternar).

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/main.css assets/js/main.js
git commit -m "feat: nav sticky con toggle ES/EN, progreso de scroll y sección activa

Núcleo de la app (window.App) con estado de idioma, persistencia en
localStorage y sistema de suscripción para que el contenido dinámico se
re-renderice al cambiar idioma.

Nav con barra de progreso de scroll, indicador de sección activa vía
IntersectionObserver y menú hamburguesa accesible en móvil.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: Hero con aurora, reveal de texto y scramble del rol

Primera sección con contenido. Incluye el motor de reveal genérico porque el hero es su primer consumidor.

**Files:**
- Modify: `index.html` (sección `#hero`), `assets/css/main.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: `App.reduceMotion`, `App.ready`, `App.onLangChange`, `I18n.t`
- Produces:
  - `App.observeReveal(selector)` — observa los elementos que coincidan y les pone `data-revealed="true"` al entrar en viewport. Usado por las tareas 5 a 11.
  - `App.splitWords(el)` — envuelve cada palabra del elemento en `<span class="word"><span>…</span></span>` para el efecto de reveal escalonado. Idempotente: si ya fue procesado, no hace nada.
  - Convención CSS: cualquier elemento con `data-reveal` empieza oculto y se muestra al recibir `data-revealed="true"`.

- [ ] **Step 1: Escribir el HTML del hero**

Reemplazar `<section id="hero"><!-- Task 4 --></section>`:

```html
    <section class="hero" id="hero">
      <div class="hero__aurora" aria-hidden="true"></div>
      <div class="container hero__inner">
        <div class="hero__main">
          <span class="kicker hero__kicker" data-reveal data-i18n="hero.kicker">AI Engineer</span>

          <p class="hero__available" data-reveal>
            <span class="hero__dot" aria-hidden="true"></span>
            <span class="mono" data-i18n="hero.available">Disponible para proyectos</span>
          </p>

          <h1 class="hero__title" data-reveal-words>
            <span data-i18n="hero.h1a">Construyo IA que</span>
            <em class="accent" data-i18n="hero.h1accent">sobrevive</em>
            <span data-i18n="hero.h1b">a producción.</span>
          </h1>

          <p class="hero__lede" data-reveal data-i18n="hero.lede"></p>

          <p class="hero__endToEnd mono" data-reveal data-i18n="hero.endToEnd"></p>

          <div class="hero__ctas" data-reveal>
            <a class="btn btn--primary" href="#work" data-i18n="hero.ctaWork">Ver casos</a>
            <a class="btn" href="cv/CVRodolfoBravo.pdf" download data-i18n="hero.ctaCv">Descargar CV</a>
            <a class="btn" href="mailto:[EMAIL_PUBLICO]" data-i18n="hero.ctaMail">Escríbeme</a>
          </div>
        </div>

        <aside class="hero__aside" data-reveal>
          <div class="hero__role">
            <span class="mono hero__roleLabel">Rol</span>
            <span class="hero__roleText" id="roleScramble">AI Engineer</span>
          </div>
          <div class="hero__years">
            <span class="hero__yearsNum">07</span>
            <span class="mono hero__yearsLabel" data-i18n="proof.years">Años construyendo software</span>
          </div>
        </aside>
      </div>

      <div class="container hero__rule" data-reveal>
        <span class="mono">Next.js</span><span class="mono">Angular</span><span class="mono">Python</span>
        <span class="mono">Claude API</span><span class="mono">AWS · GCP · Azure</span><span class="mono">Stripe</span>
      </div>
    </section>
```

- [ ] **Step 2: Añadir el CSS del hero y del sistema de reveal**

Insertar en `main.css` antes de `/* ---------- 8. Utilidades ---------- */`:

```css
/* ---------- 7. Motion: sistema de reveal ---------- */
@media (prefers-reduced-motion: no-preference) {
  [data-reveal] {
    opacity: 0;
    transform: translateY(16px);
    transition: opacity .6s var(--ease), transform .6s var(--ease);
  }
  [data-reveal][data-revealed="true"] { opacity: 1; transform: none; }

  .word { display: inline-block; overflow: hidden; vertical-align: bottom; }
  .word > span {
    display: inline-block;
    transform: translateY(105%);
    transition: transform .7s var(--ease);
    transition-delay: var(--d, 0ms);
  }
  [data-revealed="true"] .word > span { transform: none; }
}
/* Con reduce, nada se oculta: [data-reveal] no recibe estilos y todo es visible. */

/* ---------- 6. Hero ---------- */
.hero { position: relative; overflow: hidden; padding-block: clamp(64px, 10vh, 120px) var(--sp-8); }

.hero__aurora {
  position: absolute; inset: -20% -10% auto; height: 130%;
  pointer-events: none;
  background:
    radial-gradient(38% 46% at calc(18% + var(--mx, 0px) * .04) calc(12% + var(--my, 0px) * .04),
      rgba(200, 255, 0, .11), transparent 62%),
    radial-gradient(34% 40% at calc(84% - var(--mx, 0px) * .03) calc(72% - var(--my, 0px) * .03),
      rgba(200, 255, 0, .05), transparent 66%);
}

.hero__inner {
  position: relative; z-index: 1;
  display: grid; grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(var(--sp-6), 5vw, var(--sp-9)); align-items: end;
}

.hero__available { display: inline-flex; align-items: center; gap: var(--sp-2); margin-top: var(--sp-4); }
.hero__available .mono { color: var(--muted); }
.hero__dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--live); box-shadow: 0 0 10px var(--live);
}
@media (prefers-reduced-motion: no-preference) {
  .hero__dot { animation: pulse 2.4s var(--ease) infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .35; } }
}

.hero__title { margin-top: var(--sp-5); max-width: 19ch; }
.hero__title em { font-style: italic; }
.hero__lede { margin-top: var(--sp-5); max-width: 46ch; }
.hero__endToEnd {
  margin-top: var(--sp-4); padding-left: var(--sp-4);
  border-left: 2px solid var(--accent);
  color: var(--muted); letter-spacing: .08em; max-width: 52ch; line-height: 1.8;
}
.hero__ctas { display: flex; flex-wrap: wrap; gap: var(--sp-3); margin-top: var(--sp-7); }

.hero__aside { display: grid; gap: var(--sp-6); text-align: right; padding-bottom: var(--sp-2); }
.hero__role { display: grid; gap: var(--sp-1); }
.hero__roleLabel { color: var(--faint); }
.hero__roleText { font-family: var(--font-mono); font-size: .8125rem; color: var(--accent); }
.hero__years { display: grid; gap: var(--sp-2); }
.hero__yearsNum {
  font-family: var(--font-display); font-size: clamp(4rem, 9vw, 7rem);
  line-height: .78; letter-spacing: -.05em; color: var(--text); opacity: .18;
}
.hero__yearsLabel { color: var(--faint); max-width: 14ch; margin-left: auto; line-height: 1.6; }

.hero__rule {
  position: relative; z-index: 1;
  display: flex; flex-wrap: wrap; gap: var(--sp-3) var(--sp-6);
  margin-top: clamp(var(--sp-8), 9vh, var(--sp-10));
  padding-top: var(--sp-4); border-top: 1px solid var(--hairline);
}
.hero__rule .mono { color: var(--faint); }

@media (max-width: 780px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__aside { text-align: left; grid-auto-flow: column; justify-content: start; gap: var(--sp-8); align-items: end; }
  .hero__yearsLabel { margin-left: 0; }
}
```

- [ ] **Step 3: Añadir el motor de reveal, la aurora y el scramble a `main.js`**

Insertar antes del bloque `ready(function () { … })`:

```js
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
```

Y actualizar el bloque `ready` y el `return`:

```js
  ready(function () {
    initLang();
    initNav();
    initReveal();
    initAurora();
    initScramble();
  });

  return {
    state: state,
    reduceMotion: reduceMotion,
    setLang: setLang,
    onLangChange: onLangChange,
    ready: ready,
    observeReveal: observeReveal,
    splitWords: splitWords
  };
```

- [ ] **Step 4: Verificar el hero en el navegador**

Run: `python -m http.server 8000`
Expected:
- Al cargar, el h1 aparece palabra por palabra de abajo hacia arriba, escalonado.
- El punto verde junto a «Disponible para proyectos» pulsa suavemente.
- Al mover el mouse sobre el hero, los halos lima se desplazan sutilmente.
- El texto junto a «Rol» se mezcla con caracteres aleatorios y cambia entre los tres títulos cada ~4s.
- El `07` grande aparece a la derecha en serif, muy tenue.
- El kicker dice `AI Engineer · 7 años construyendo software · [XX] en sistemas de IA` — con el `[XX]` visible.

- [ ] **Step 5: Verificar el cambio de idioma en el hero**

Hacer clic en `ES/EN`.
Expected: el h1 cambia a `I build AI that survives production.` **y sigue visible** (no debe desaparecer al reescribirse). Todo el bloque, incluido `hero.endToEnd`, queda en inglés.

- [ ] **Step 6: Verificar `prefers-reduced-motion`**

En DevTools → Rendering → «Emulate CSS prefers-reduced-motion: reduce», recargar.
Expected: todo el contenido visible de inmediato, sin animación de entrada, sin pulso, sin scramble (el rol muestra `AI Engineer` fijo) y la aurora estática.

- [ ] **Step 7: Commit**

```bash
git add index.html assets/css/main.css assets/js/main.js
git commit -m "feat: hero con aurora reactiva, reveal por palabras y scramble del rol

Posicionamiento explícito: 7 años construyendo software, [XX] en sistemas
de IA. Incluye la línea end-to-end que diferencia el perfil de alguien que
solo consume una API.

Añade el motor de reveal reutilizable (App.observeReveal / App.splitWords)
que usan el resto de las secciones, con re-split al cambiar de idioma para
que el título no quede oculto.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Barra de credibilidad con contadores animados

**Files:**
- Modify: `index.html` (sección `#proof`), `assets/css/main.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: `App.observeReveal`, `App.reduceMotion`
- Produces: el atributo `data-count-to` en cualquier elemento lo convierte en contador animado. Formato: `data-count-to="7"`, con `data-count-suffix="k"` y `data-count-pad="2"` opcionales.

- [ ] **Step 1: Escribir el HTML de la barra**

Reemplazar `<section id="proof" class="section"><!-- Task 5 --></section>`:

```html
    <section class="section proof" id="proof" aria-label="Métricas">
      <div class="container proof__grid">
        <div class="proof__item" data-reveal>
          <span class="proof__num" data-count-to="7" data-count-pad="2">07</span>
          <span class="mono proof__label" data-i18n="proof.years">Años construyendo software</span>
        </div>
        <div class="proof__item" data-reveal>
          <span class="proof__num">[XX]</span>
          <span class="mono proof__label" data-i18n="proof.systems">Sistemas con LLM en producción</span>
        </div>
        <div class="proof__item" data-reveal>
          <span class="proof__num" data-count-to="3" data-count-pad="2">03</span>
          <span class="mono proof__label" data-i18n="proof.clouds">Clouds en producción</span>
        </div>
        <div class="proof__item" data-reveal>
          <span class="proof__num">[XX]k</span>
          <span class="mono proof__label" data-i18n="proof.users">Usuarios impactados</span>
        </div>
      </div>
    </section>
```

Los dos valores que Rodolfo debe completar quedan como `[XX]` literal y **sin** `data-count-to`, así que no animan — es intencional: el marcador debe destacar.

- [ ] **Step 2: Añadir el CSS**

```css
/* ---------- 6. Proof ---------- */
.proof { padding-block: clamp(var(--sp-8), 8vh, var(--sp-9)); }
.proof__grid {
  display: grid; gap: var(--sp-7);
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.proof__item { display: grid; gap: var(--sp-3); }
.proof__num {
  font-family: var(--font-display);
  font-size: clamp(2.75rem, 5.5vw, 4.25rem);
  line-height: .9; letter-spacing: -.04em; color: var(--accent);
  font-variant-numeric: tabular-nums;
}
.proof__label { color: var(--muted); max-width: 22ch; line-height: 1.7; }
```

- [ ] **Step 3: Añadir el contador a `main.js`**

```js
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
```

Añadir `initCounters();` al bloque `ready`.

- [ ] **Step 4: Verificar**

Expected:
- Al hacer scroll hasta la barra, `07` cuenta desde `00` y `03` desde `00`, deteniéndose exactamente en el valor con dos dígitos.
- Los dos `[XX]` permanecen literales y visibles en lima.
- Con `prefers-reduced-motion: reduce`, los números aparecen ya en su valor final.
- El contador corre **una sola vez**: hacer scroll arriba y abajo no lo reinicia.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/css/main.css assets/js/main.js
git commit -m "feat: barra de credibilidad con contadores animados

Los valores que Rodolfo debe completar quedan como [XX] literal y sin
animación, para que el marcador destaque en lugar de disimularse.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Datos de case studies, cartas con tilt y filtros

**Files:**
- Create: `assets/js/data.js`, `tests/data.test.js`
- Modify: `index.html` (sección `#work`), `assets/css/main.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: `App.observeReveal`, `App.onLangChange`, `App.state.lang`, `I18n.t`
- Produces:
  - `window.CaseStudies` — array de 6 objetos con esta forma exacta:
    `{ id, category, stack: string[], architecture: string[], link, es: {…}, en: {…} }`
    donde cada bloque de idioma es `{ title, tagline, problem, solution, impact: string[], learned }`
  - `App.getCardById(id)` → el elemento `<article>` de la carta, usado por la Task 7 para devolver el foco.

- [ ] **Step 1: Escribir el test que falla**

Crear `tests/data.test.js`:

```js
const { test } = require('node:test');
const assert = require('node:assert');
const CaseStudies = require('../assets/js/data.js');

const CATEGORIES = ['rag', 'agents', 'llmops', 'product', 'documents', 'integrations'];
const LANG_FIELDS = ['title', 'tagline', 'problem', 'solution', 'learned'];

test('hay exactamente 6 case studies', () => {
  assert.strictEqual(CaseStudies.length, 6);
});

test('los ids son únicos', () => {
  const ids = CaseStudies.map(c => c.id);
  assert.strictEqual(new Set(ids).size, 6, 'hay ids duplicados: ' + ids.join(', '));
});

test('cada categoría válida aparece una vez', () => {
  const cats = CaseStudies.map(c => c.category).sort();
  assert.deepStrictEqual(cats, [...CATEGORIES].sort());
});

test('cada case study tiene stack y arquitectura no vacíos', () => {
  for (const c of CaseStudies) {
    assert.ok(Array.isArray(c.stack) && c.stack.length >= 3, `${c.id}: stack insuficiente`);
    assert.ok(Array.isArray(c.architecture) && c.architecture.length >= 3, `${c.id}: arquitectura insuficiente`);
  }
});

test('cada case study tiene los dos idiomas completos', () => {
  for (const c of CaseStudies) {
    for (const lang of ['es', 'en']) {
      assert.ok(c[lang], `${c.id}: falta el bloque ${lang}`);
      for (const field of LANG_FIELDS) {
        assert.ok(String(c[lang][field] || '').trim().length > 0, `${c.id}.${lang}.${field} está vacío`);
      }
      assert.ok(Array.isArray(c[lang].impact) && c[lang].impact.length >= 2,
        `${c.id}.${lang}.impact necesita al menos 2 entradas`);
    }
  }
});

test('ningún case study contiene HTML crudo en sus textos', () => {
  // Los textos se insertan vía innerHTML al construir cartas y modal, así que
  // una etiqueta suelta rompería el layout. Este test la detecta antes.
  for (const c of CaseStudies) {
    for (const lang of ['es', 'en']) {
      const blob = [c[lang].title, c[lang].tagline, c[lang].problem,
                    c[lang].solution, c[lang].learned, ...c[lang].impact].join(' ');
      assert.ok(!/<[a-z/]/i.test(blob), `${c.id}.${lang} contiene HTML crudo`);
    }
  }
});
```

- [ ] **Step 2: Correr el test para verificar que falla**

Run: `node --test tests/`
Expected: FAIL — `Cannot find module '../assets/js/data.js'`

- [ ] **Step 3: Escribir `assets/js/data.js`**

Los seis casos, con el contenido definitivo del spec sección 8.3.

```js
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CaseStudies = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  return [
    {
      id: 'rag-knowledge',
      category: 'rag',
      stack: ['Next.js', 'Python / FastAPI', 'PostgreSQL + pgvector', 'AWS Bedrock', 'Redis'],
      architecture: ['Ingesta', 'Chunking', 'Embeddings', 'Retrieval híbrido', 'Reranking', 'LLM', 'Citas'],
      link: null,
      es: {
        title: 'Asistente de conocimiento interno con RAG',
        tagline: 'Búsqueda semántica sobre documentación dispersa, con citas verificables.',
        problem: 'El equipo de soporte de [Empresa] consultaba documentación repartida en [XX] fuentes distintas. Cada respuesta tomaba [XX] minutos y variaba según quién la contestara.',
        solution: 'Pipeline de ingesta con chunking semántico y metadatos por fuente, embeddings en pgvector, recuperación híbrida (vectorial más palabra clave) con reranking, y respuestas con cita obligatoria al documento origen. Streaming de tokens al cliente para percepción de inmediatez.',
        impact: [
          'Tiempo de respuesta −[XX]%',
          '[XX]% de respuestas con cita verificable',
          '[XX] consultas al mes'
        ],
        learned: 'El reranking aportó más precisión que cambiar a un modelo más grande, a una fracción del costo. Exigir cita al documento origen eliminó las alucinaciones reportadas por los usuarios.'
      },
      en: {
        title: 'Internal knowledge assistant (RAG)',
        tagline: 'Semantic search over scattered documentation, with verifiable citations.',
        problem: 'The support team at [Empresa] was searching documentation spread across [XX] different sources. Each answer took [XX] minutes and varied depending on who wrote it.',
        solution: 'Ingestion pipeline with semantic chunking and per-source metadata, embeddings in pgvector, hybrid retrieval (vector plus keyword) with reranking, and answers that must cite the source document. Token streaming to the client for perceived immediacy.',
        impact: [
          'Response time −[XX]%',
          '[XX]% of answers carry a verifiable citation',
          '[XX] queries per month'
        ],
        learned: 'Reranking bought more accuracy than switching to a larger model, at a fraction of the cost. Requiring a source citation eliminated the hallucinations users had been reporting.'
      }
    },
    {
      id: 'ops-agent',
      category: 'agents',
      stack: ['Claude API (tool use)', 'Node.js / TypeScript', 'Angular', 'Azure Functions', 'Colas'],
      architecture: ['Trigger', 'Planificación', 'Herramientas tipadas', 'Gate humano', 'Ejecución', 'Traza'],
      link: null,
      es: {
        title: 'Agente operativo con function calling',
        tagline: 'Automatización de un proceso multi-paso con confirmación humana en lo irreversible.',
        problem: 'Un proceso interno de [XX] pasos manuales entre el CRM, correo y hojas de cálculo consumía [XX] horas por semana del equipo de operaciones.',
        solution: 'Agente con herramientas tipadas y atómicas, límite máximo de pasos por ejecución, confirmación humana obligatoria antes de cualquier acción irreversible, reintentos idempotentes, y traza completa de cada ejecución para auditoría.',
        impact: [
          '[XX] horas por semana recuperadas',
          '[XX]% de ejecuciones sin intervención humana',
          'Cero acciones irreversibles no autorizadas'
        ],
        learned: 'El diseño de las herramientas pesa más que el prompt. Herramientas atómicas e idempotentes convirtieron los fallos en reintentos seguros en lugar de en incidentes.'
      },
      en: {
        title: 'Operational agent with tool use',
        tagline: 'Multi-step automation with a human gate on anything irreversible.',
        problem: 'An internal [XX]-step manual process spanning the CRM, email, and spreadsheets consumed [XX] hours per week from the operations team.',
        solution: 'Agent with typed, atomic tools, a hard step limit per run, mandatory human confirmation before any irreversible action, idempotent retries, and a full trace of every run for auditing.',
        impact: [
          '[XX] hours per week recovered',
          '[XX]% of runs completed with no human intervention',
          'Zero unauthorized irreversible actions'
        ],
        learned: 'Tool design matters more than the prompt. Atomic, idempotent tools turned failures into safe retries instead of incidents.'
      }
    },
    {
      id: 'llm-evals',
      category: 'llmops',
      stack: ['Python', 'pytest', 'OpenTelemetry', 'Azure AI Foundry', 'GitHub Actions', 'Next.js'],
      architecture: ['Dataset dorado', 'Suite de evals', 'LLM-as-judge', 'Gate en CI', 'Dashboards'],
      link: null,
      es: {
        title: 'Plataforma de evaluación y observabilidad de LLM',
        tagline: 'Un gate en CI que impide desplegar si la calidad baja del umbral.',
        problem: 'Cada cambio de prompt o de modelo era una apuesta. No existía forma de saber si una versión mejoraba o empeoraba antes de que los usuarios lo notaran.',
        solution: 'Dataset dorado de [XX] casos representativos; evaluaciones automáticas de exactitud, fundamentación en la fuente y conformidad de formato; LLM-as-judge con rúbrica explícita para criterios subjetivos; gate en CI que bloquea el despliegue si el score baja del umbral; dashboards de latencia p95, costo por request y tasa de error por versión.',
        impact: [
          'Regresiones detectadas antes de producción',
          'Incidentes en producción −[XX]%',
          'Decisiones de modelo tomadas con datos'
        ],
        learned: 'Sin evaluaciones, «mejoramos el prompt» es una opinión. Es la pieza que más falta en los equipos que adoptan IA, y la que convierte un prototipo en un producto.'
      },
      en: {
        title: 'LLM evaluation & observability platform',
        tagline: 'A CI gate that blocks deploys when quality drops below threshold.',
        problem: 'Every prompt or model change was a gamble. There was no way to know whether a version was better or worse before users noticed.',
        solution: 'Golden dataset of [XX] representative cases; automated evaluations for accuracy, groundedness, and format conformance; LLM-as-judge with an explicit rubric for subjective criteria; a CI gate that blocks deployment when the score drops below threshold; dashboards for p95 latency, cost per request, and error rate per version.',
        impact: [
          'Regressions caught before production',
          'Production incidents −[XX]%',
          'Model decisions made on data'
        ],
        learned: 'Without evals, "we improved the prompt" is an opinion. This is the piece most missing in teams adopting AI, and the one that turns a prototype into a product.'
      }
    },
    {
      id: 'ai-billing',
      category: 'product',
      stack: ['Stripe (metered billing)', 'Next.js', 'GCP Cloud Run', 'PostgreSQL'],
      architecture: ['Request', 'Conteo de tokens', 'Créditos', 'Stripe metered', 'Alertas y límites'],
      link: null,
      es: {
        title: 'Feature de IA monetizada con billing por uso',
        tagline: 'De centro de costo a línea de ingreso, con el costo por token instrumentado.',
        problem: 'La funcionalidad de IA era el mayor costo variable del producto y no se cobraba aparte. Los usuarios más intensivos generaban margen negativo.',
        solution: 'Medición de tokens por request mapeada a un sistema de créditos, Stripe metered billing con webhooks idempotentes, límites y alertas de consumo por plan, y caché semántica que reutiliza respuestas equivalentes para reducir el costo por llamada.',
        impact: [
          'Costo de IA por usuario −[XX]%',
          'La feature pasó a representar [XX]% del MRR',
          'Margen positivo en todos los planes'
        ],
        learned: 'El costo por token es una decisión de producto, no solo de infraestructura. Instrumentar el consumo desde el primer día es más barato que reconstruirlo después.'
      },
      en: {
        title: 'Monetized AI feature with usage-based billing',
        tagline: 'From cost center to revenue line, with cost per token instrumented.',
        problem: 'The AI feature was the product\'s largest variable cost and was not billed separately. Heavy users produced negative margin.',
        solution: 'Per-request token metering mapped to a credit system, Stripe metered billing with idempotent webhooks, per-plan usage limits and alerts, and a semantic cache that reuses equivalent answers to cut cost per call.',
        impact: [
          'AI cost per user −[XX]%',
          'The feature grew to [XX]% of MRR',
          'Positive margin across every plan'
        ],
        learned: 'Cost per token is a product decision, not just an infrastructure one. Instrumenting spend on day one is cheaper than rebuilding it later.'
      }
    },
    {
      id: 'doc-extraction',
      category: 'documents',
      stack: ['Python', 'Google Document AI', 'Claude API (structured outputs)', 'GCP', 'Angular'],
      architecture: ['OCR', 'Extracción con schema', 'Validación', 'Score de confianza', 'Revisión humana'],
      link: null,
      es: {
        title: 'Extracción documental estructurada',
        tagline: 'PDF a JSON validado, con revisión humana solo donde hace falta.',
        problem: '[XX] documentos al mes ([tipo de documento]) capturados a mano, con [XX]% de error de captura y un rezago constante.',
        solution: 'OCR seguido de extracción con LLM forzada a un esquema estricto, validación del resultado contra el esquema antes de persistir, score de confianza por campo, y enrutamiento automático de los documentos de baja confianza a una cola de revisión humana.',
        impact: [
          '[XX]% de documentos procesados sin intervención',
          'Tiempo por documento de [XX] min a [XX] s',
          'Error de captura −[XX]%'
        ],
        learned: 'Validar contra esquema y enrutar la baja confianza a un humano es lo que hace la diferencia entre una demo y algo que un área operativa acepta usar todos los días.'
      },
      en: {
        title: 'Structured document extraction',
        tagline: 'PDF to validated JSON, with human review only where it is needed.',
        problem: '[XX] documents per month ([document type]) captured by hand, with a [XX]% capture error rate and a constant backlog.',
        solution: 'OCR followed by schema-constrained LLM extraction, validation against the schema before persisting, per-field confidence scoring, and automatic routing of low-confidence documents to a human review queue.',
        impact: [
          '[XX]% of documents processed with no intervention',
          'Time per document from [XX] min to [XX] s',
          'Capture errors −[XX]%'
        ],
        learned: 'Validating against a schema and routing low confidence to a human is what separates a demo from something an operations team will actually use every day.'
      }
    },
    {
      id: 'omnichannel-bot',
      category: 'integrations',
      stack: ['WhatsApp Cloud API', 'Meta Graph API', 'Node.js', 'Angular', 'AWS Lambda', 'DynamoDB'],
      architecture: ['Webhook Meta', 'Contexto de conversación', 'LLM', 'Criterio de handoff', 'Bandeja unificada'],
      link: null,
      es: {
        title: 'Automatización conversacional multicanal',
        tagline: 'WhatsApp e Instagram atendidos 24/7, con escalamiento a humano bien definido.',
        problem: '[XX] mensajes diarios en WhatsApp e Instagram quedaban sin atender fuera de horario, con [XX]% de leads perdidos por falta de respuesta.',
        solution: 'Asistente con memoria de conversación por contacto, criterios explícitos de escalamiento a humano, plantillas aprobadas por Meta para mensajes iniciados por el negocio, y bandeja unificada donde el equipo retoma cualquier conversación con todo el contexto.',
        impact: [
          'Primera respuesta en menos de [XX] segundos, 24/7',
          '[XX]% de conversaciones resueltas sin humano',
          'Leads calificados +[XX]%'
        ],
        learned: 'Un criterio de escalamiento a humano bien definido es lo que impide que el bot dañe la relación con el cliente. Saber cuándo no responder es parte del diseño.'
      },
      en: {
        title: 'Multichannel conversational automation',
        tagline: 'WhatsApp and Instagram covered 24/7, with a well-defined human handoff.',
        problem: '[XX] daily messages on WhatsApp and Instagram went unanswered outside business hours, losing [XX]% of leads to slow response.',
        solution: 'Assistant with per-contact conversation memory, explicit human-escalation criteria, Meta-approved templates for business-initiated messages, and a unified inbox where the team picks up any conversation with full context.',
        impact: [
          'First response under [XX] seconds, 24/7',
          '[XX]% of conversations resolved without a human',
          'Qualified leads +[XX]%'
        ],
        learned: 'A well-defined human handoff is what keeps the bot from damaging the customer relationship. Knowing when not to answer is part of the design.'
      }
    }
  ];
});
```

- [ ] **Step 4: Correr los tests**

Run: `node --test tests/`
Expected: PASS, 13 tests (7 de i18n + 6 de data).

- [ ] **Step 5: Escribir el HTML de la sección de trabajo**

Reemplazar `<section id="work" class="section"><!-- Task 6 --></section>`:

```html
    <section class="section work" id="work">
      <div class="container">
        <div class="section__head" data-reveal>
          <span class="kicker" data-i18n="work.kicker">Casos de estudio</span>
          <h2 data-reveal-words><span data-i18n="work.title">Sistemas con LLMs que llegaron a usuarios reales.</span></h2>
          <p data-i18n="work.lede"></p>
        </div>

        <div class="work__filters" id="workFilters" role="group" aria-label="Filtros">
          <button type="button" class="work__filter" data-filter="all" aria-pressed="true" data-i18n="work.filterAll">Todos</button>
          <button type="button" class="work__filter" data-filter="rag" aria-pressed="false" data-i18n="work.filterRag">RAG</button>
          <button type="button" class="work__filter" data-filter="agents" aria-pressed="false" data-i18n="work.filterAgents">Agentes</button>
          <button type="button" class="work__filter" data-filter="llmops" aria-pressed="false" data-i18n="work.filterLlmops">LLMOps</button>
          <button type="button" class="work__filter" data-filter="product" aria-pressed="false" data-i18n="work.filterProduct">Producto</button>
          <button type="button" class="work__filter" data-filter="documents" aria-pressed="false" data-i18n="work.filterDocuments">Documentos</button>
          <button type="button" class="work__filter" data-filter="integrations" aria-pressed="false" data-i18n="work.filterIntegrations">Integraciones</button>
        </div>

        <div class="work__grid" id="workGrid"></div>
      </div>
    </section>
```

- [ ] **Step 6: Añadir el CSS de cartas, tilt y filtros**

```css
/* ---------- 6. Work ---------- */
.work__filters { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-bottom: var(--sp-7); }
.work__filter {
  font-family: var(--font-mono); font-size: var(--fs-mono);
  letter-spacing: .14em; text-transform: uppercase;
  padding: 9px 14px; border: 1px solid var(--hairline); border-radius: 999px;
  color: var(--faint); transition: color .2s var(--ease), border-color .2s var(--ease);
}
.work__filter:hover { color: var(--text); border-color: var(--text); }
.work__filter[aria-pressed="true"] { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }

.work__grid { display: grid; gap: var(--sp-5); grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }

.card {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; gap: var(--sp-4);
  padding: var(--sp-6); text-align: left; width: 100%;
  background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--radius);
  transition: border-color .25s var(--ease), background-color .25s var(--ease);
}
.card:hover { border-color: rgba(244, 241, 234, .28); background: var(--raised); }
.card[hidden] { display: none; }

.card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0;
  background: radial-gradient(340px circle at var(--px, 50%) var(--py, 50%), rgba(200, 255, 0, .07), transparent 70%);
  transition: opacity .25s var(--ease);
}
.card:hover::before { opacity: 1; }

.card__top { display: flex; align-items: center; gap: var(--sp-3); }
.card__cat { color: var(--accent); }
.card__lock { margin-left: auto; color: var(--faint); }
.card__title { font-size: var(--fs-h3); }
.card__tagline { color: var(--muted); font-size: var(--fs-small); }
.card__stack { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-top: auto; padding-top: var(--sp-2); }
.card__chip {
  font-family: var(--font-mono); font-size: var(--fs-mono); letter-spacing: .1em;
  padding: 5px 9px; border: 1px solid var(--hairline); border-radius: 4px; color: var(--faint);
}
.card__more { display: inline-flex; align-items: center; gap: var(--sp-2); font-size: var(--fs-small); color: var(--accent); }
.card__more span:last-child { transition: transform .2s var(--ease); }
.card:hover .card__more span:last-child { transform: translateX(4px); }

@media (prefers-reduced-motion: no-preference) {
  .work__grid { perspective: 1000px; }
  .card {
    transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
    transform-style: preserve-3d;
    transition: border-color .25s var(--ease), background-color .25s var(--ease), transform .18s var(--ease);
  }
}
```

- [ ] **Step 7: Añadir el render, los filtros y el tilt a `main.js`**

```js
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
```

Registrar el suscriptor de idioma en el nivel superior del IIFE (junto a los otros
`onLangChange`), **no** dentro de `ready`:

```js
  onLangChange(function (lang) { renderCards(lang); });
```

Y añadir al bloque `ready`, después de `initLang()`, solo el enlace de los filtros:

```js
    initFilters();
```

Añadir `getCardById: getCardById` y `renderCards: renderCards` al objeto `return`.

**Nota de orden (importante).** `initLang()` dispara `setLang`, que recorre los suscriptores;
ahí es donde se renderizan las cartas por primera vez. Por eso **no** hay que llamar
`renderCards` desde `ready`: sería un render redundante que destruye y recrea los nodos que el
observer de reveal acaba de empezar a observar. El suscriptor es la única vía de render.

- [ ] **Step 8: Verificar en el navegador**

Expected:
- Seis cartas en grid responsivo, cada una con su categoría en lima, el sello «Proyecto privado», título, tagline, hasta 4 chips de stack y el enlace «Ver caso completo →».
- Al pasar el cursor sobre una carta: se inclina ligeramente en 3D siguiendo el mouse y un halo lima sigue al cursor dentro de la carta.
- Al salir, la carta vuelve a plano.
- Los filtros: al elegir `RAG` solo queda una carta; `Todos` las restaura. El botón activo se pinta en lima.
- Al cambiar a inglés, las 6 cartas se re-renderizan en inglés y las etiquetas de categoría también.
- Con `reduce`, las cartas están visibles, sin tilt ni halo.

- [ ] **Step 9: Commit**

```bash
git add assets/js/data.js tests/data.test.js index.html assets/css/main.css assets/js/main.js
git commit -m "feat: case studies data-driven con tilt 3D, spotlight y filtros

Los 6 casos viven en data.js con ambos idiomas; las cartas se renderizan
desde ahí y se re-renderizan al cambiar de idioma.

Los tests validan integridad: 6 casos, ids únicos, una categoría por caso,
ambos idiomas completos y que no se pierdan los marcadores pendientes.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Modal de detalle accesible

**Files:**
- Modify: `index.html` (añadir el contenedor del modal antes de `</body>`), `assets/css/main.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: `window.CaseStudies`, `App.getCardById`, `App.state.lang`, `I18n.t`
- Produces: `App.openCase(id)` y `App.closeCase()`

- [ ] **Step 1: Añadir el contenedor del modal al HTML**

Insertar en `index.html` justo antes de los `<script>`:

```html
  <div class="modal" id="modal" hidden>
    <div class="modal__backdrop" id="modalBackdrop"></div>
    <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <button class="modal__close" type="button" id="modalClose"
              data-i18n-attr="aria-label:a11y.closeModal">
        <span aria-hidden="true">✕</span>
      </button>
      <div class="modal__body" id="modalBody"></div>
    </div>
  </div>
```

- [ ] **Step 2: Añadir el CSS del modal**

```css
/* ---------- 6. Modal ---------- */
.modal { position: fixed; inset: 0; z-index: 80; display: grid; place-items: center; padding: var(--sp-4); }
.modal[hidden] { display: none; }
.modal__backdrop { position: absolute; inset: 0; background: rgba(5, 5, 6, .82); backdrop-filter: blur(6px); }

.modal__panel {
  position: relative; z-index: 1;
  width: min(760px, 100%); max-height: 88vh; overflow-y: auto;
  background: var(--raised); border: 1px solid var(--hairline); border-radius: var(--radius);
  padding: clamp(var(--sp-6), 4vw, var(--sp-8));
}
.modal__close {
  position: sticky; top: 0; float: right; margin: calc(var(--sp-4) * -1) calc(var(--sp-4) * -1) 0 0;
  width: 38px; height: 38px; border: 1px solid var(--hairline); border-radius: 50%;
  color: var(--muted); display: grid; place-items: center;
  transition: color .2s var(--ease), border-color .2s var(--ease);
}
.modal__close:hover { color: var(--text); border-color: var(--text); }

.modal__cat { color: var(--accent); }
.modal__title { margin: var(--sp-3) 0 var(--sp-2); font-size: var(--fs-h2); }
.modal__tagline { color: var(--muted); }

.modal__block { margin-top: var(--sp-6); padding-top: var(--sp-5); border-top: 1px solid var(--hairline); }
.modal__label { display: block; color: var(--faint); margin-bottom: var(--sp-3); }
.modal__block p { color: var(--muted); }

.modal__arch { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-2); }
.modal__archStep {
  font-family: var(--font-mono); font-size: var(--fs-mono); letter-spacing: .1em;
  padding: 7px 11px; border: 1px solid var(--hairline); border-radius: 4px; color: var(--text);
}
.modal__archArrow { color: var(--accent); font-size: .75rem; }

.modal__chips { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.modal__impact { display: grid; gap: var(--sp-3); }
.modal__impact li { display: flex; gap: var(--sp-3); align-items: baseline; color: var(--text); }
.modal__impact li::before { content: "→"; color: var(--accent); flex: none; }

@media (prefers-reduced-motion: no-preference) {
  .modal__backdrop { animation: fadeIn .24s var(--ease); }
  .modal__panel { animation: panelIn .24s var(--ease); }
  @keyframes fadeIn { from { opacity: 0; } }
  @keyframes panelIn { from { opacity: 0; transform: scale(.98); } }
}

body[data-modal-open="true"] { overflow: hidden; }
```

- [ ] **Step 3: Añadir la lógica del modal a `main.js`**

```js
  // ---------- Modal ----------
  var modalEl, modalBody, lastFocused = null;
  var FOCUSABLE = 'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';

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

    lastFocused = getCardById(id);
    modalBody.innerHTML = buildModalHtml(c, state.lang);
    modalEl.removeAttribute('hidden');
    modalEl.setAttribute('data-case', id);
    doc.body.setAttribute('data-modal-open', 'true');
    doc.getElementById('modalClose').focus();
  }

  function closeCase() {
    if (!modalEl || modalEl.hasAttribute('hidden')) return;
    modalEl.setAttribute('hidden', '');
    modalEl.removeAttribute('data-case');
    doc.body.removeAttribute('data-modal-open');
    if (lastFocused) {
      var btn = lastFocused.querySelector('[data-open]');
      (btn || lastFocused).focus();
    }
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
```

Añadir `initModal();` al bloque `ready` y `openCase: openCase, closeCase: closeCase` al `return`.

- [ ] **Step 4: Verificar el modal con mouse**

Expected: clic en cualquier parte de una carta o en «Ver caso completo» abre el modal con los siete bloques (categoría, título, tagline, Problema, Solución, Arquitectura como cadena de pasos separados por flechas lima, Stack, Impacto con flechas, Lo que aprendí). El fondo se difumina y la página no hace scroll detrás.

- [ ] **Step 5: Verificar el modal con teclado**

Expected:
- Al abrir, el foco queda en el botón de cerrar.
- `Tab` cicla **solo** dentro del modal, sin escapar al contenido de detrás.
- `Shift+Tab` desde el primer elemento salta al último.
- `Esc` cierra.
- Al cerrar, el foco regresa al botón «Ver caso completo» de la carta que se abrió.

- [ ] **Step 6: Verificar el modal con cambio de idioma**

Abrir un caso, cambiar a inglés sin cerrar.
Expected: el contenido del modal se reconstruye en inglés en el sitio, sin cerrarse.

- [ ] **Step 7: Commit**

```bash
git add index.html assets/css/main.css assets/js/main.js
git commit -m "feat: modal de detalle de case study accesible

Focus trap, cierre con Esc y backdrop, retorno de foco a la carta de origen,
bloqueo de scroll del body y reconstrucción en vivo al cambiar de idioma.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: Sección de stack con marquee

**Files:**
- Modify: `index.html` (sección `#stack`), `assets/css/main.css`, `assets/js/i18n.js` (añadir claves), `tests/i18n.test.js` no cambia (el test de paridad valida las claves nuevas automáticamente)

**Interfaces:**
- Consumes: `App.observeReveal`
- Produces: nada nuevo

- [ ] **Step 1: Añadir las claves de highlights al diccionario**

En `assets/js/i18n.js`, agregar dentro de `es` (junto a las otras claves `stack.*`):

```js
      'stack.hl1t': 'Next.js',
      'stack.hl1d': '[XX] años · App Router, RSC y streaming de respuestas de LLM al cliente.',
      'stack.hl2t': 'Claude API',
      'stack.hl2d': 'Tool use, structured outputs y control de costo por token en producción.',
      'stack.hl3t': 'AWS · GCP · Azure',
      'stack.hl3d': 'Bedrock, Cloud Run y Document AI, Functions y AI Foundry. Tres nubes, no una demo en cada una.',
      'stack.endToEnd': 'Base fullstack: entrego el sistema completo alrededor del modelo — frontend, API, base de datos, pagos y despliegue.',
```

Y dentro de `en`:

```js
      'stack.hl1t': 'Next.js',
      'stack.hl1d': '[XX] years · App Router, RSC, and streaming LLM responses to the client.',
      'stack.hl2t': 'Claude API',
      'stack.hl2d': 'Tool use, structured outputs, and per-token cost control in production.',
      'stack.hl3t': 'AWS · GCP · Azure',
      'stack.hl3d': 'Bedrock, Cloud Run and Document AI, Functions and AI Foundry. Three clouds, not one demo each.',
      'stack.endToEnd': 'Full-stack foundation: I ship the whole system around the model — frontend, API, database, payments, and deployment.',
```

- [ ] **Step 2: Correr los tests de paridad**

Run: `node --test tests/`
Expected: PASS. Si falta una clave en un idioma, el test `los diccionarios es y en tienen exactamente las mismas claves` la señala por nombre.

- [ ] **Step 3: Escribir el HTML del stack**

Reemplazar `<section id="stack" class="section"><!-- Task 8 --></section>`:

```html
    <section class="section stack" id="stack">
      <div class="container">
        <div class="section__head" data-reveal>
          <span class="kicker" data-i18n="stack.kicker">Stack</span>
          <h2 data-reveal-words><span data-i18n="stack.title">Lo que uso, y para qué lo uso.</span></h2>
          <p data-i18n="stack.lede"></p>
        </div>

        <div class="stack__highlights">
          <article class="stack__hl" data-reveal>
            <h3 class="stack__hlTitle" data-i18n="stack.hl1t">Next.js</h3>
            <p data-i18n="stack.hl1d"></p>
          </article>
          <article class="stack__hl" data-reveal>
            <h3 class="stack__hlTitle" data-i18n="stack.hl2t">Claude API</h3>
            <p data-i18n="stack.hl2d"></p>
          </article>
          <article class="stack__hl" data-reveal>
            <h3 class="stack__hlTitle" data-i18n="stack.hl3t">AWS · GCP · Azure</h3>
            <p data-i18n="stack.hl3d"></p>
          </article>
        </div>

        <p class="stack__endToEnd" data-reveal data-i18n="stack.endToEnd"></p>

        <div class="stack__groups">
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupAi">IA y LLMs</span>
            <ul class="stack__list">
              <li>Claude API</li><li>OpenAI API</li><li>RAG</li><li>Embeddings</li>
              <li>pgvector</li><li>Retrieval híbrido</li><li>Reranking</li>
              <li>Function calling</li><li>Structured outputs</li><li>Caché semántica</li>
            </ul>
          </div>
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupLlmops">LLMOps y evaluación</span>
            <ul class="stack__list">
              <li>Golden datasets</li><li>LLM-as-judge</li><li>Evals en CI</li>
              <li>OpenTelemetry</li><li>Trazas por request</li><li>Costo por token</li>
            </ul>
          </div>
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupFrontend">Frontend</span>
            <ul class="stack__list">
              <li>Next.js</li><li>Angular</li><li>React</li><li>TypeScript</li>
              <li>JavaScript</li><li>SASS</li><li>HTML5 &amp; CSS3</li>
            </ul>
          </div>
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupBackend">Backend</span>
            <ul class="stack__list">
              <li>Node.js</li><li>Python</li><li>FastAPI</li><li>Flask</li><li>Express</li>
              <li>PostgreSQL</li><li>MySQL</li><li>MSSQL</li><li>Redis</li>
            </ul>
          </div>
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupCloud">Cloud y DevOps</span>
            <ul class="stack__list">
              <li>AWS Bedrock</li><li>Lambda</li><li>S3</li><li>DynamoDB</li>
              <li>GCP Cloud Run</li><li>Document AI</li><li>Azure Functions</li>
              <li>Azure AI Foundry</li><li>Docker</li><li>GitHub Actions</li>
            </ul>
          </div>
          <div class="stack__group" data-reveal>
            <span class="mono stack__groupTitle" data-i18n="stack.groupPayments">Pagos e integraciones</span>
            <ul class="stack__list">
              <li>Stripe</li><li>Metered billing</li><li>Webhooks</li>
              <li>Meta Graph API</li><li>WhatsApp Cloud API</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="marquee" aria-hidden="true">
        <div class="marquee__track" id="marqueeTrack">
          <span>Next.js</span><span>·</span><span>Angular</span><span>·</span><span>Claude API</span><span>·</span>
          <span>RAG</span><span>·</span><span>pgvector</span><span>·</span><span>Python</span><span>·</span>
          <span>TypeScript</span><span>·</span><span>AWS Bedrock</span><span>·</span><span>Google Cloud</span><span>·</span>
          <span>Azure</span><span>·</span><span>Stripe</span><span>·</span><span>Docker</span><span>·</span>
          <span>OpenTelemetry</span><span>·</span><span>WhatsApp Cloud API</span><span>·</span>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Añadir el CSS del stack y del marquee**

```css
/* ---------- 6. Stack ---------- */
.stack__highlights {
  display: grid; gap: var(--sp-5);
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.stack__hl { padding-top: var(--sp-4); border-top: 2px solid var(--accent); }
.stack__hlTitle { font-family: var(--font-mono); font-size: .875rem; letter-spacing: .04em; margin-bottom: var(--sp-3); }
.stack__hl p { font-size: var(--fs-small); }

.stack__endToEnd {
  margin: var(--sp-7) 0 var(--sp-8);
  padding: var(--sp-5) var(--sp-6);
  background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--radius);
  color: var(--text); max-width: 78ch;
}

.stack__groups {
  display: grid; gap: var(--sp-7);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}
.stack__groupTitle { display: block; color: var(--accent); margin-bottom: var(--sp-4); }
.stack__list { display: flex; flex-wrap: wrap; gap: var(--sp-2); }
.stack__list li {
  font-size: var(--fs-small); color: var(--muted);
  padding: 5px 10px; border: 1px solid var(--hairline); border-radius: 4px;
  transition: color .2s var(--ease), border-color .2s var(--ease);
}
.stack__list li:hover { color: var(--text); border-color: var(--text); }

/* ---------- 6. Marquee ---------- */
.marquee {
  margin-top: clamp(var(--sp-8), 9vh, var(--sp-9));
  padding-block: var(--sp-5);
  border-top: 1px solid var(--hairline); border-bottom: 1px solid var(--hairline);
  overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee__track { display: flex; gap: var(--sp-5); width: max-content; }
.marquee__track span {
  font-family: var(--font-display); font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: var(--text); opacity: .22; white-space: nowrap;
}
@media (prefers-reduced-motion: no-preference) {
  .marquee__track { animation: marquee 42s linear infinite; }
  .marquee:hover .marquee__track { animation-play-state: paused; }
  @keyframes marquee { to { transform: translateX(-50%); } }
}
```

- [ ] **Step 5: Duplicar el track del marquee en `main.js`**

La animación desplaza el track un 50%, así que el contenido debe estar duplicado para que el bucle sea continuo.

```js
  // ---------- Marquee ----------
  function initMarquee() {
    var track = doc.getElementById('marqueeTrack');
    if (!track || reduceMotion) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
  }
```

Añadir `initMarquee();` al bloque `ready`.

- [ ] **Step 6: Verificar**

Expected:
- Tres destacados con línea lima arriba; el de Next.js muestra `[XX] años`.
- La caja de «Base fullstack» destaca sobre `--surface` — es el argumento diferenciador y debe verse.
- Seis grupos con sus chips; hover aclara el borde y el texto.
- El marquee se desplaza continuamente sin salto visible al reiniciar, con degradado en los bordes, y se pausa al pasar el mouse.
- Con `reduce`, el marquee queda estático (sin duplicar) y legible.
- Al cambiar idioma, los títulos de grupo y los textos de los destacados cambian; los nombres de tecnología no (correcto: son nombres propios).

- [ ] **Step 7: Commit**

```bash
git add index.html assets/css/main.css assets/js/i18n.js assets/js/main.js
git commit -m "feat: sección de stack con contexto de uso y marquee

Reemplaza las barras de porcentaje por seis grupos por dominio y tres
destacados con contexto real. Incluye la caja de base fullstack, que es el
argumento diferenciador del posicionamiento.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Sección «Cómo llevo IA a producción»

Sección diferenciadora: diagrama de arquitectura en HTML/CSS y los cuatro principios.

**Files:**
- Modify: `index.html` (sección `#production`), `assets/css/main.css`

**Interfaces:**
- Consumes: `App.observeReveal`
- Produces: nada nuevo

- [ ] **Step 1: Escribir el HTML**

Reemplazar `<section id="production" class="section"><!-- Task 9 --></section>`:

```html
    <section class="section production" id="production">
      <div class="container">
        <div class="section__head" data-reveal>
          <span class="kicker" data-i18n="production.kicker">Método</span>
          <h2 data-reveal-words><span data-i18n="production.title">Cómo llevo IA a producción.</span></h2>
          <p data-i18n="production.lede"></p>
        </div>

        <figure class="diagram" data-reveal>
          <figcaption class="mono diagram__caption" data-i18n="production.diagramLabel">Arquitectura de referencia</figcaption>
          <div class="diagram__flow">
            <span class="diagram__node">Cliente</span>
            <span class="diagram__arrow" aria-hidden="true">→</span>
            <span class="diagram__node">API Gateway</span>
            <span class="diagram__arrow" aria-hidden="true">→</span>
            <span class="diagram__node diagram__node--core">Orquestador</span>
          </div>
          <div class="diagram__branches">
            <span class="diagram__node">Retrieval · pgvector + rerank</span>
            <span class="diagram__node">Herramientas · function calling</span>
            <span class="diagram__node">LLM + modelo de respaldo</span>
          </div>
          <div class="diagram__base">
            <span class="mono">Evals</span><span class="mono">Trazas</span>
            <span class="mono">Costo por token</span><span class="mono">Caché</span>
          </div>
        </figure>

        <ol class="principles">
          <li class="principle" data-reveal>
            <span class="principle__num mono">01</span>
            <h3 class="principle__title" data-i18n="production.p1t">Evaluar antes de desplegar</h3>
            <p data-i18n="production.p1d"></p>
          </li>
          <li class="principle" data-reveal>
            <span class="principle__num mono">02</span>
            <h3 class="principle__title" data-i18n="production.p2t">El costo es un requisito</h3>
            <p data-i18n="production.p2d"></p>
          </li>
          <li class="principle" data-reveal>
            <span class="principle__num mono">03</span>
            <h3 class="principle__title" data-i18n="production.p3t">Fallar bien</h3>
            <p data-i18n="production.p3d"></p>
          </li>
          <li class="principle" data-reveal>
            <span class="principle__num mono">04</span>
            <h3 class="principle__title" data-i18n="production.p4t">Observar todo</h3>
            <p data-i18n="production.p4d"></p>
          </li>
        </ol>
      </div>
    </section>
```

- [ ] **Step 2: Añadir el CSS**

```css
/* ---------- 6. Production ---------- */
.diagram {
  margin: 0 0 var(--sp-9);
  padding: clamp(var(--sp-5), 4vw, var(--sp-7));
  background: var(--surface); border: 1px solid var(--hairline); border-radius: var(--radius);
}
.diagram__caption { color: var(--accent); margin-bottom: var(--sp-5); }
.diagram__flow { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-3); }
.diagram__node {
  font-family: var(--font-mono); font-size: .75rem; letter-spacing: .04em;
  padding: 10px 14px; border: 1px solid var(--hairline); border-radius: 4px;
  color: var(--text); background: var(--bg);
}
.diagram__node--core { border-color: var(--accent); color: var(--accent); }
.diagram__arrow { color: var(--accent); }

.diagram__branches {
  display: grid; gap: var(--sp-3); margin-top: var(--sp-4);
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  padding-left: var(--sp-5); border-left: 1px solid var(--hairline);
}
.diagram__base {
  display: flex; flex-wrap: wrap; gap: var(--sp-3) var(--sp-6);
  margin-top: var(--sp-5); padding-top: var(--sp-4); border-top: 1px dashed var(--hairline);
}
.diagram__base .mono { color: var(--muted); }

.principles { display: grid; gap: var(--sp-6); grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.principle { padding-top: var(--sp-4); border-top: 1px solid var(--hairline); }
.principle__num { display: block; color: var(--accent); margin-bottom: var(--sp-3); }
.principle__title { font-size: var(--fs-h3); margin-bottom: var(--sp-3); max-width: 20ch; }
.principle p { font-size: var(--fs-small); }
```

- [ ] **Step 3: Verificar**

Expected:
- El diagrama muestra la cadena Cliente → API Gateway → Orquestador, con «Orquestador» destacado en lima, las tres ramas indentadas con una línea vertical, y la base con las cuatro preocupaciones transversales separadas por una línea punteada.
- Los cuatro principios en grid, con su número en lima.
- A 360px de ancho el diagrama no genera scroll horizontal: los nodos hacen wrap.
- Al cambiar idioma, los títulos y descripciones de los cuatro principios cambian.

- [ ] **Step 4: Commit**

```bash
git add index.html assets/css/main.css
git commit -m "feat: sección de método con diagrama de arquitectura y 4 principios

Sección diferenciadora del portafolio: evidencia de criterio de producción
(evals, costo, fallbacks, observabilidad) que separa a un AI Engineer de
alguien que solo consume una API.

Diagrama construido en HTML y CSS, no como imagen, para que escale y sea
legible por lectores de pantalla.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: Experiencia y Sobre mí

**Files:**
- Modify: `index.html` (secciones `#experience` y `#about`), `assets/css/main.css`, `assets/js/i18n.js`

**Interfaces:**
- Consumes: `App.observeReveal`
- Produces: nada nuevo

- [ ] **Step 1: Añadir las claves del timeline al diccionario**

En `assets/js/i18n.js`, dentro de `es`:

```js
      'exp.r1period': '2019 — 20XX',
      'exp.r1role': '[Rol] · [Empresa]',
      'exp.r1desc': 'Primer rol en desarrollo de software tras titularme en Ingeniería Electrónica. Sitios y aplicaciones web con JavaScript y Python; primer contacto con bases de datos relacionales en producción.',
      'exp.r2period': '20XX — 20XX',
      'exp.r2role': '[Rol] · [Empresa]',
      'exp.r2desc': 'Desarrollo fullstack con React y Angular sobre APIs propias. Diseño de esquemas de base de datos y contenedores con Docker para estandarizar los despliegues.',
      'exp.r3period': '20XX — 20XX',
      'exp.r3role': '[Rol] · [Empresa]',
      'exp.r3desc': 'Integraciones cloud y de pagos: Stripe, APIs de Meta y despliegues en AWS y Google Cloud. Aquí empezó el trabajo con costos variables y con servicios de terceros que fallan.',
      'exp.r4period': '20XX — 2026',
      'exp.r4role': 'AI Engineer · [Empresa]',
      'exp.r4desc': 'Sistemas con LLMs en producción: RAG con citas verificables, agentes con function calling, evaluación automatizada en CI y control de costo por token. Del prototipo al uptime.',
      'exp.note': 'Los periodos y nombres de empresa marcados con [ ] están pendientes de completar.',
```

Y dentro de `en`:

```js
      'exp.r1period': '2019 — 20XX',
      'exp.r1role': '[Rol] · [Empresa]',
      'exp.r1desc': 'First software role after graduating in Electronics Engineering. Web sites and applications in JavaScript and Python; first exposure to relational databases in production.',
      'exp.r2period': '20XX — 20XX',
      'exp.r2role': '[Rol] · [Empresa]',
      'exp.r2desc': 'Full-stack development with React and Angular on top of in-house APIs. Database schema design and Docker containers to standardize deployments.',
      'exp.r3period': '20XX — 20XX',
      'exp.r3role': '[Rol] · [Empresa]',
      'exp.r3desc': 'Cloud and payment integrations: Stripe, Meta APIs, and deployments on AWS and Google Cloud. This is where the work with variable costs and failing third-party services began.',
      'exp.r4period': '20XX — 2026',
      'exp.r4role': 'AI Engineer · [Empresa]',
      'exp.r4desc': 'LLM systems in production: RAG with verifiable citations, agents with function calling, automated evaluation in CI, and per-token cost control. From prototype to uptime.',
      'exp.note': 'Periods and company names marked with [ ] are pending completion.',
```

- [ ] **Step 2: Correr los tests de paridad**

Run: `node --test tests/`
Expected: PASS.

- [ ] **Step 3: Escribir el HTML de las dos secciones**

Reemplazar `<section id="experience" class="section"><!-- Task 10 --></section>`:

```html
    <section class="section experience" id="experience">
      <div class="container">
        <div class="section__head" data-reveal>
          <span class="kicker" data-i18n="experience.kicker">Trayectoria</span>
          <h2 data-reveal-words><span data-i18n="experience.title">Siete años, una dirección.</span></h2>
          <p data-i18n="experience.lede"></p>
        </div>

        <ol class="timeline">
          <li class="tl" data-reveal>
            <span class="mono tl__period" data-i18n="exp.r1period">2019 — 20XX</span>
            <div class="tl__body">
              <h3 class="tl__role" data-i18n="exp.r1role">[Rol] · [Empresa]</h3>
              <p data-i18n="exp.r1desc"></p>
            </div>
          </li>
          <li class="tl" data-reveal>
            <span class="mono tl__period" data-i18n="exp.r2period">20XX — 20XX</span>
            <div class="tl__body">
              <h3 class="tl__role" data-i18n="exp.r2role">[Rol] · [Empresa]</h3>
              <p data-i18n="exp.r2desc"></p>
            </div>
          </li>
          <li class="tl" data-reveal>
            <span class="mono tl__period" data-i18n="exp.r3period">20XX — 20XX</span>
            <div class="tl__body">
              <h3 class="tl__role" data-i18n="exp.r3role">[Rol] · [Empresa]</h3>
              <p data-i18n="exp.r3desc"></p>
            </div>
          </li>
          <li class="tl tl--current" data-reveal>
            <span class="mono tl__period" data-i18n="exp.r4period">20XX — 2026</span>
            <div class="tl__body">
              <h3 class="tl__role" data-i18n="exp.r4role">AI Engineer · [Empresa]</h3>
              <p data-i18n="exp.r4desc"></p>
            </div>
          </li>
        </ol>

        <p class="mono timeline__note" data-i18n="exp.note"></p>
      </div>
    </section>
```

Reemplazar `<section id="about" class="section"><!-- Task 10 --></section>`:

```html
    <section class="section about" id="about">
      <div class="container about__grid">
        <div class="about__media" data-reveal>
          <img src="uploads/avatar.png" width="640" height="640" loading="lazy"
               alt="Retrato de Rodolfo Bravo" data-i18n-attr="alt:about.portraitAlt">
        </div>
        <div class="about__text" data-reveal>
          <span class="kicker" data-i18n="about.kicker">Sobre mí</span>
          <h2 data-reveal-words><span data-i18n="about.title">Ingeniero antes que programador.</span></h2>
          <p class="about__body" data-i18n="about.body"></p>
          <a class="btn" href="cv/CVRodolfoBravo.pdf" download data-i18n="hero.ctaCv">Descargar CV</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 4: Añadir el CSS**

```css
/* ---------- 6. Timeline ---------- */
.timeline { display: grid; gap: 0; }
.tl {
  display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: var(--sp-6);
  padding-block: var(--sp-6); border-top: 1px solid var(--hairline);
}
.tl:last-child { border-bottom: 1px solid var(--hairline); }
.tl__period { color: var(--faint); padding-top: 5px; }
.tl__role { font-size: var(--fs-h3); margin-bottom: var(--sp-3); }
.tl--current .tl__period { color: var(--accent); }
.tl--current .tl__role::after {
  content: ""; display: inline-block; width: 6px; height: 6px; margin-left: var(--sp-3);
  border-radius: 50%; background: var(--live); vertical-align: middle;
}
.timeline__note { margin-top: var(--sp-5); color: var(--faint); }

@media (max-width: 700px) {
  .tl { grid-template-columns: 1fr; gap: var(--sp-3); }
}

/* ---------- 6. About ---------- */
.about__grid {
  display: grid; gap: clamp(var(--sp-6), 5vw, var(--sp-9));
  grid-template-columns: minmax(200px, 300px) minmax(0, 1fr);
  align-items: start;
}
.about__media { border: 1px solid var(--hairline); border-radius: var(--radius); overflow: hidden; }
.about__media img {
  width: 100%; height: auto;
  filter: grayscale(1) contrast(1.08) brightness(.92);
  transition: filter .4s var(--ease);
}
.about__media:hover img { filter: grayscale(.55) contrast(1.05); }
.about__body { margin: var(--sp-5) 0 var(--sp-7); max-width: 60ch; }

@media (max-width: 760px) {
  .about__grid { grid-template-columns: 1fr; }
  .about__media { max-width: 220px; }
}
```

- [ ] **Step 5: Verificar**

Expected:
- Cuatro entradas de timeline con el periodo a la izquierda en mono y el rol a la derecha; la última con el periodo en lima y un punto verde tras el rol.
- Los marcadores `[Rol]`, `[Empresa]` y `20XX` son visibles, y la nota al pie los explica.
- El retrato aparece en escala de grises y recupera color parcial al pasar el mouse.
- A menos de 700px el timeline pasa a una columna; a menos de 760px el retrato va arriba y limitado a 220px.
- Al cambiar idioma, las cuatro descripciones, la nota y el `alt` de la imagen cambian (verificar el `alt` en DevTools).

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/main.css assets/js/i18n.js
git commit -m "feat: timeline de experiencia y sección Sobre mí

El timeline narra la transición electrónica → software → IA como progresión
deliberada. Los periodos y empresas quedan como marcadores visibles con una
nota al pie que lo explica.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Contacto, formulario y footer

**Files:**
- Modify: `index.html` (sección `#contact` y `<footer>`), `assets/css/main.css`, `assets/js/main.js`

**Interfaces:**
- Consumes: `I18n.t`, `App.state.lang`, `App.onLangChange`
- Produces: nada nuevo

- [ ] **Step 1: Escribir el HTML de contacto y footer**

Reemplazar `<section id="contact" class="section"><!-- Task 11 --></section>`:

```html
    <section class="section contact" id="contact">
      <div class="container contact__grid">
        <div class="contact__intro" data-reveal>
          <span class="kicker" data-i18n="contact.kicker">Contacto</span>
          <h2 data-reveal-words><span data-i18n="contact.title">¿Tienes un rol o un proyecto de IA en mente?</span></h2>
          <p data-i18n="contact.lede"></p>

          <div class="contact__direct">
            <span class="mono contact__directLabel" data-i18n="contact.orDirect">O directo, sin formulario:</span>
            <ul class="contact__links">
              <li><a href="mailto:[EMAIL_PUBLICO]">[EMAIL_PUBLICO]</a></li>
              <li><a href="https://www.linkedin.com/in/[LINKEDIN_USER]" target="_blank" rel="noopener">LinkedIn</a></li>
              <li><a href="https://github.com/RodolfoBravo" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="cv/CVRodolfoBravo.pdf" download data-i18n="hero.ctaCv">Descargar CV</a></li>
            </ul>
          </div>
        </div>

        <form class="form" id="contactForm" data-reveal
              action="https://formspree.io/f/[FORMSPREE_ID]" method="POST">
          <div class="form__row">
            <label class="mono form__label" for="cName" data-i18n="contact.name">Nombre</label>
            <input class="form__input" id="cName" name="name" type="text" required autocomplete="name">
          </div>
          <div class="form__row">
            <label class="mono form__label" for="cEmail" data-i18n="contact.email">Correo</label>
            <input class="form__input" id="cEmail" name="email" type="email" required autocomplete="email">
          </div>
          <div class="form__row">
            <label class="mono form__label" for="cCompany" data-i18n="contact.company">Empresa (opcional)</label>
            <input class="form__input" id="cCompany" name="company" type="text" autocomplete="organization">
          </div>
          <div class="form__row">
            <label class="mono form__label" for="cMessage" data-i18n="contact.message">Cuéntame del rol</label>
            <textarea class="form__input form__textarea" id="cMessage" name="message" rows="5" required></textarea>
          </div>

          <button class="btn btn--primary form__submit" type="submit" id="formSubmit" data-i18n="contact.send">
            Enviar mensaje
          </button>

          <p class="form__status" id="formStatus" role="status" aria-live="polite"></p>
        </form>
      </div>
    </section>
```

Reemplazar `<footer id="footer"><!-- Task 11 --></footer>`:

```html
  <footer class="footer" id="footer">
    <div class="container footer__inner">
      <p class="mono footer__legal">
        © <span id="footerYear">2026</span> Rodolfo Bravo. <span data-i18n="footer.rights">Todos los derechos reservados.</span>
      </p>
      <p class="mono footer__built" data-i18n="footer.built"></p>
    </div>
  </footer>
```

- [ ] **Step 2: Añadir el CSS**

```css
/* ---------- 6. Contact ---------- */
.contact__grid {
  display: grid; gap: clamp(var(--sp-7), 6vw, var(--sp-9));
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  align-items: start;
}
.contact__direct { margin-top: var(--sp-7); padding-top: var(--sp-5); border-top: 1px solid var(--hairline); }
.contact__directLabel { display: block; color: var(--faint); margin-bottom: var(--sp-4); }
.contact__links { display: grid; gap: var(--sp-3); }
.contact__links a {
  display: inline-block; font-size: var(--fs-small); color: var(--muted);
  border-bottom: 1px solid transparent; transition: color .2s var(--ease), border-color .2s var(--ease);
}
.contact__links a:hover { color: var(--accent); border-color: var(--accent); }

.form { display: grid; gap: var(--sp-5); }
.form__row { display: grid; gap: var(--sp-2); }
.form__label { color: var(--faint); }
.form__input {
  background: var(--surface); color: var(--text);
  border: 1px solid var(--hairline); border-radius: var(--radius);
  padding: 13px 15px; font-size: var(--fs-small);
  transition: border-color .2s var(--ease);
}
.form__input:hover { border-color: rgba(244, 241, 234, .26); }
.form__input:focus-visible { border-color: var(--accent); }
.form__textarea { resize: vertical; min-height: 120px; }
.form__submit { justify-self: start; }
.form__submit[disabled] { opacity: .55; cursor: progress; }
.form__status { font-size: var(--fs-small); min-height: 1.5em; }
.form__status[data-state="ok"] { color: var(--live); }
.form__status[data-state="error"] { color: #F87171; }

/* ---------- 6. Footer ---------- */
.footer { border-top: 1px solid var(--hairline); padding-block: var(--sp-7); }
.footer__inner { display: flex; flex-wrap: wrap; gap: var(--sp-4) var(--sp-7); justify-content: space-between; }
.footer .mono { color: var(--faint); }
```

- [ ] **Step 3: Añadir la lógica del formulario y el año a `main.js`**

```js
  // ---------- Formulario ----------
  function initForm() {
    var form = doc.getElementById('contactForm');
    var status = doc.getElementById('formStatus');
    var submit = doc.getElementById('formSubmit');
    if (!form || !status || !submit) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      if (form.getAttribute('action').indexOf('[FORMSPREE_ID]') !== -1) {
        status.setAttribute('data-state', 'error');
        status.textContent = 'Falta configurar el ID de Formspree en el atributo action del formulario.';
        return;
      }

      submit.disabled = true;
      status.removeAttribute('data-state');
      status.textContent = win.I18n.t(state.lang, 'contact.sending');

      win.fetch(form.getAttribute('action'), {
        method: 'POST',
        body: new win.FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        status.setAttribute('data-state', 'ok');
        status.textContent = win.I18n.t(state.lang, 'contact.success');
      }).catch(function () {
        status.setAttribute('data-state', 'error');
        status.textContent = win.I18n.t(state.lang, 'contact.error');
      }).then(function () {
        submit.disabled = false;
      });
    });
  }

  function initYear() {
    var el = doc.getElementById('footerYear');
    if (el) el.textContent = String(new Date().getFullYear());
  }
```

Añadir `initForm(); initYear();` al bloque `ready`.

- [ ] **Step 4: Verificar el formulario**

Expected:
- Enviar con campos vacíos: el navegador muestra su validación nativa y no se hace ninguna petición.
- Llenar todo y enviar **sin** configurar Formspree: aparece en rojo el aviso de que falta el ID. Esto es intencional — es el recordatorio para Rodolfo, no un fallo silencioso.
- El mensaje de estado se anuncia por `aria-live`: verificar en DevTools que `#formStatus` tiene `role="status"`.
- El año del footer es el año actual.
- Los enlaces directos muestran `[EMAIL_PUBLICO]` y `[LINKEDIN_USER]` visibles como marcadores.

- [ ] **Step 5: Verificar el formulario en inglés**

Cambiar a inglés, enviar de nuevo.
Expected: las etiquetas de los cuatro campos y el botón están en inglés, y el mensaje de estado también.

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/main.css assets/js/main.js
git commit -m "feat: sección de contacto con Formspree, accesos directos y footer

Sustituye el formulario PHP que no funcionaba en GitHub Pages. Envío por
fetch con estados anunciados vía aria-live y validación nativa.

Si el ID de Formspree no está configurado, el formulario avisa en pantalla
en lugar de fallar en silencio.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Task 12: SEO, README y verificación final

**Files:**
- Modify: `index.html` (metadatos y JSON-LD), `README.md`

**Interfaces:**
- Consumes: todo lo anterior
- Produces: el sitio terminado

- [ ] **Step 1: Añadir Open Graph, Twitter Card y JSON-LD**

En `index.html`, insertar dentro de `<head>` después de la `<meta name="author">`:

```html
  <link rel="canonical" href="https://rodolfobravo.github.io/Portafolio/">

  <meta property="og:type" content="website">
  <meta property="og:title" content="Rodolfo Bravo — AI Engineer">
  <meta property="og:description" content="AI Engineer con 7 años construyendo software. Sistemas RAG, agentes con herramientas y evaluación de LLMs en producción.">
  <meta property="og:url" content="https://rodolfobravo.github.io/Portafolio/">
  <meta property="og:image" content="https://rodolfobravo.github.io/Portafolio/images/og-image.png">
  <meta property="og:locale" content="es_MX">
  <meta property="og:locale:alternate" content="en_US">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Rodolfo Bravo — AI Engineer">
  <meta name="twitter:description" content="Sistemas RAG, agentes con herramientas y evaluación de LLMs en producción.">
  <meta name="twitter:image" content="https://rodolfobravo.github.io/Portafolio/images/og-image.png">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rodolfo Bravo",
    "jobTitle": "AI Engineer",
    "alternateName": ["AI Engineer", "Full-Stack Engineer", "LLM Systems Engineer"],
    "url": "https://rodolfobravo.github.io/Portafolio/",
    "sameAs": [
      "https://github.com/RodolfoBravo",
      "https://www.linkedin.com/in/[LINKEDIN_USER]"
    ],
    "alumniOf": { "@type": "EducationalOrganization", "name": "Ingeniería Electrónica" },
    "knowsAbout": [
      "AI Engineering", "Large Language Models", "Retrieval-Augmented Generation",
      "Prompt Engineering", "LLMOps", "LLM Evaluation", "AI Agents", "Function Calling",
      "Full-Stack Development", "Next.js", "Angular", "React", "TypeScript",
      "Python", "Node.js", "FastAPI", "PostgreSQL", "pgvector",
      "AWS", "AWS Bedrock", "Google Cloud", "Microsoft Azure", "Docker",
      "Stripe", "Meta Graph API", "WhatsApp Cloud API"
    ],
    "knowsLanguage": ["es", "en"]
  }
  </script>
```

Nota: si el sitio se sirve en un dominio propio, hay que cambiar las cuatro URLs absolutas. Queda anotado en el README.

- [ ] **Step 2: Reescribir `README.md`**

```markdown
# Portafolio — Rodolfo Bravo · AI Engineer

Sitio estático sin dependencias ni build. HTML, CSS y JavaScript vanilla.

## Correr localmente

Los archivos JS usan un patrón que funciona también con `file://`, así que puedes
abrir `index.html` con doble clic. Aun así conviene usar un servidor, porque es
como se sirve en producción:

```bash
python -m http.server 8000
# http://localhost:8000
```

## Tests

Validan la lógica pura: paridad de claves entre idiomas e integridad de los case studies.

```bash
node --test tests/
```

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html` | Estructura y contenido estático con atributos `data-i18n` |
| `assets/css/main.css` | Sistema de diseño completo |
| `assets/js/i18n.js` | Diccionario ES/EN y aplicación al DOM |
| `assets/js/data.js` | Los 6 case studies, con ambos idiomas |
| `assets/js/main.js` | Nav, reveal, contadores, tilt, modal, formulario |

Para editar un case study se modifica su objeto en `assets/js/data.js`. Las cartas
y el modal se regeneran desde ahí; no hay que tocar el HTML.

Para agregar o cambiar un texto se edita `assets/js/i18n.js` **en los dos idiomas**.
Si olvidas uno, `node --test tests/` lo detecta.

## Pendientes antes de publicar

| # | Acción | Dónde |
|---|---|---|
| 1 | **Revocar la API key de Google Maps** que estuvo expuesta en el repo | Google Cloud Console |
| 2 | Sustituir todos los `[XX]` por cifras reales | `assets/js/data.js`, `assets/js/i18n.js`, `index.html` |
| 3 | Sustituir `[Empresa]` y `[Rol]` por los reales | `assets/js/i18n.js`, `assets/js/data.js` |
| 4 | Crear cuenta en Formspree y pegar el ID | `index.html`, atributo `action` del formulario |
| 5 | Definir el email público (`[EMAIL_PUBLICO]`) | `index.html` |
| 6 | Poner el usuario de LinkedIn (`[LINKEDIN_USER]`) | `index.html` |
| 7 | Actualizar el CV en PDF: 7 años y perfil AI Engineer | `cv/CVRodolfoBravo.pdf` |
| 8 | Generar `images/og-image.png` de 1200×630 | `images/` |
| 9 | Si usas dominio propio, actualizar las URLs absolutas de OG y canonical | `index.html` |

Buscar todos los marcadores pendientes:

```bash
grep -rn "\[XX\]\|\[Empresa\]\|\[Rol\]\|\[EMAIL_PUBLICO\]\|\[LINKEDIN_USER\]\|\[FORMSPREE_ID\]" index.html assets/
```

## Nota sobre los case studies

Los seis casos están redactados como plantillas con la estructura que evalúa un
entrevistador técnico. **Las cifras son marcadores, no datos reales.** Sustitúyelas
por números que puedas explicar y defender: si un entrevistador pregunta cómo se
midió una métrica y no hay respuesta, la candidatura se cae ahí.
```

- [ ] **Step 3: Correr la suite completa de tests**

Run: `node --test tests/`
Expected: PASS, 13 tests.

- [ ] **Step 4: Contar los marcadores pendientes**

Run:
```bash
grep -rc "\[XX\]" index.html assets/js/*.js
grep -rn "\[Empresa\]\|\[Rol\]\|\[EMAIL_PUBLICO\]\|\[LINKEDIN_USER\]\|\[FORMSPREE_ID\]" index.html assets/js/*.js | wc -l
```
Expected: un número mayor a cero en ambos. **Registrar los conteos exactos en el reporte final** — es la lista de trabajo que le queda a Rodolfo, y no debe presentarse el sitio como terminado sin decirlo.

- [ ] **Step 5: Verificación funcional completa**

Con `python -m http.server 8000`, recorrer los 11 puntos del spec sección 9 y anotar el resultado de cada uno:

1. Consola sin errores ni warnings.
2. Toggle ES/EN cambia todos los textos, incluidos cartas, modal abierto, `alt` del retrato, placeholders y `<html lang>`.
3. La preferencia de idioma persiste al recargar.
4. Los 6 modales abren, cierran con `Esc` y backdrop, y devuelven el foco.
5. `Tab` recorre en orden lógico con foco siempre visible.
6. Con `prefers-reduced-motion: reduce`, todo visible y legible sin animación.
7. Responsive a 360, 768, 1024 y 1440px sin scroll horizontal.
8. Zoom al 200% sin pérdida de contenido.
9. Lighthouse ≥95 en Performance y ≥95 en Accessibility.
10. El formulario anuncia carga, éxito y error.
11. Conteo de marcadores documentado.

- [ ] **Step 6: Correr Lighthouse**

DevTools → Lighthouse → Mobile y Desktop, categorías Performance y Accessibility.
Expected: ≥95 en ambas.
Si Performance baja de 95, la causa más probable son las fuentes de Google: en ese caso descargar los `.woff2` a `assets/fonts/` y servirlos con `@font-face` y `font-display: swap` en lugar del `<link>` externo. Documentar el cambio si se hace.

- [ ] **Step 7: Commit final**

```bash
git add index.html README.md
git commit -m "feat: metadatos SEO, JSON-LD y README con pendientes

JSON-LD Person con knowsAbout que incluye tanto los términos de IA como los
fullstack, para no salir de los filtros de búsqueda de esos roles.

README documenta los 9 pendientes de Rodolfo antes de publicar, incluida la
revocación de la API key de Google Maps que estuvo expuesta.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

## Notas de revisión del plan

**Cobertura del spec.** Cada sección del spec tiene tarea asignada: arquitectura de página
(tareas 3–11), sistema de diseño (1), motion (4, 5, 6, 7, 8), arquitectura técnica (1, 2, 6),
contenido (2, 6, 8, 10, 11), accesibilidad (1, 3, 7), SEO (12), verificación (12).
Los 10 efectos de motion del spec 6 están cubiertos: reveal por palabra (4), scroll reveal (4),
tilt y spotlight (6), contadores (5), marquee (8), aurora (4), progreso de scroll (3),
scramble (4), sección activa (3), transición de modal (7).

**Dónde vive cada marcador.** `[XX]` aparece en `i18n.js` (hero, stack), `data.js` (los 6 casos)
e `index.html` (barra de credibilidad). `[Empresa]` y `[Rol]` en `i18n.js` y `data.js`.
`[EMAIL_PUBLICO]`, `[LINKEDIN_USER]` y `[FORMSPREE_ID]` solo en `index.html`.

**Consistencia de nombres entre tareas.** `App.observeReveal`, `App.splitWords`,
`App.getCardById`, `App.renderCards`, `App.openCase`, `App.closeCase`, `App.onLangChange`,
`App.setLang`, `App.state.lang`, `App.reduceMotion`, `I18n.t`, `I18n.apply`, `I18n.detect`,
`I18n.DICT`, `window.CaseStudies`. Los ids de DOM compartidos entre tareas: `langToggle`,
`navLinks`, `navBurger`, `navProgress`, `roleScramble`, `workGrid`, `workFilters`,
`marqueeTrack`, `modal`, `modalBody`, `modalClose`, `modalBackdrop`, `contactForm`,
`formStatus`, `formSubmit`, `footerYear`.

**Riesgo conocido.** El reveal por palabras y el cambio de idioma compiten por el mismo nodo:
`I18n.apply` reescribe `textContent` y destruye los `<span class="word">`. La Task 4 lo resuelve
con un suscriptor que vuelve a partir el texto y marca el título como revelado. Si al cambiar de
idioma algún titular queda invisible, ése es el punto a revisar.

**Bugs de orden de inicialización, ya corregidos en el plan.** `initLang()` dispara `setLang`
en el arranque, que recorre los suscriptores de `onLangChange` antes de que corran
`initReveal()` y el resto. Dos consecuencias que este plan resuelve explícitamente:
la bandera `langInitialized` en la Task 4, para que el re-split no revele los titulares antes de
que empiece la animación de entrada; y el render de cartas exclusivamente desde el suscriptor en
la Task 6, para no recrear nodos ya observados. Al ejecutar, no simplificar ninguna de las dos.

**Desviación deliberada del spec.** El spec sección 6, efecto 7, propone la barra de progreso con
`animation-timeline: scroll()` y fallback JS. El plan implementa **solo** la vía JS con
`requestAnimationFrame`: son doce líneas, se comporta igual en todos los navegadores y evita
mantener dos caminos para el mismo efecto. El resultado visible es idéntico.
