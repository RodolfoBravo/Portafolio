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

  /* ---------- Arranque ---------- */

  ready(function () {
    initLang();
    initNav();
    initReveal();
    initAurora();
    initScramble();
  });

  /* ---------- API pública ---------- */

  return {
    state: state,
    reduceMotion: reduceMotion,
    setLang: setLang,
    onLangChange: onLangChange,
    ready: ready,
    observeReveal: observeReveal,
    splitWords: splitWords
  };
});
