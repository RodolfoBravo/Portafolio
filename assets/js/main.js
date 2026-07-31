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

  /* ---------- Arranque ---------- */

  ready(function () {
    initLang();
    initNav();
  });

  /* ---------- API pública ---------- */

  return {
    state: state,
    reduceMotion: reduceMotion,
    setLang: setLang,
    onLangChange: onLangChange,
    ready: ready
  };
});
