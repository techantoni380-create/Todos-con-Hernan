/* Shared language controller for Todos con Hernán.
   The selected language is retained for every page in this site.

   La CABECERA (nav principal, botón "← Volver", banderas y menú hamburguesa)
   vive en js/site-header.js, que es la ÚNICA fuente del header y se carga
   antes que este archivo en cada página. Aquí solo queda la traducción. */
(function () {
  'use strict';

  /* Idiomas reutilizados del componente de cabecera (fallback por si acaso). */
  const LANGUAGES = (window.SiteHeader && window.SiteHeader.LANGUAGES) || {
    es: { name: 'Español', flag: 'img/bandera-es.svg' },
    de: { name: 'Deutsch', flag: 'img/bandera-de.svg' },
    fr: { name: 'Français', flag: 'img/bandera-fr.svg' },
    it: { name: 'Italiano', flag: 'img/bandera-it.svg' },
    en: { name: 'English', flag: 'img/bandera-en.svg' },
    zh: { name: '中文', flag: 'img/bandera-zh.svg' },
    pt: { name: 'Português', flag: 'img/bandera-pt.svg' }
  };
  const TRANSLATE_API_LANG = {
    zh: 'zh-CN',
    pt: 'pt-PT'
  };
  const STORAGE_KEY = 'todosConHernanLanguage';
  const CACHE_PREFIX = 'todosConHernanTranslation:';
  const originals = new WeakMap();
  let changeId = 0;

  function addSharedStyles() {
    if (!document.querySelector('link[href="css/site-enhancements.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/site-enhancements.css';
      document.head.appendChild(link);
    }
  }

  function ensureGrandTourMobilePanels() {
    const mapPanel = document.querySelector('.mapPanel');
    const sidePanel = document.querySelector('.sidePanel');
    const infoPanel = document.querySelector('.infoPanel');
    if (!mapPanel || !sidePanel || !infoPanel || mapPanel.querySelector('.grandTourMobileTools')) return;
    const tools = document.createElement('div');
    tools.className = 'grandTourMobileTools';
    tools.innerHTML = '<button type="button" data-tour-panel="sidePanel">&#128269; Lista y búsqueda</button>' +
      '<button type="button" data-tour-panel="infoPanel" data-scroll-target="gpsPanel">&#128205; GPS y destino</button>';
    mapPanel.appendChild(tools);
    [sidePanel, infoPanel].forEach(function (panel) {
      const close = document.createElement('button');
      close.className = 'mobileTourClose';
      close.type = 'button';
      close.setAttribute('aria-label', 'Cerrar panel');
      close.innerHTML = '&times;';
      close.addEventListener('click', function () { panel.classList.remove('mobile-tour-panel-open'); });
      panel.appendChild(close);
    });
    tools.addEventListener('click', function (event) {
      const button = event.target.closest('[data-tour-panel]');
      if (!button) return;
      const panel = button.dataset.tourPanel === 'sidePanel' ? sidePanel : infoPanel;
      sidePanel.classList.remove('mobile-tour-panel-open');
      infoPanel.classList.remove('mobile-tour-panel-open');
      panel.classList.add('mobile-tour-panel-open');
      if (button.dataset.scrollTarget) {
        window.setTimeout(function () {
          const target = document.getElementById(button.dataset.scrollTarget);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    });
  }

  function excluded(node) {
    const parent = node.parentElement;
    return !parent || parent.closest('script, style, noscript, code, pre, .languageSelector, [data-no-translate]');
  }

  function textNodes() {
    const result = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return excluded(node) || !node.nodeValue.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      if (!originals.has(node)) originals.set(node, node.nodeValue);
      result.push(node);
    }
    return result;
  }

  function translatableAttributes() {
    const attrs = ['placeholder', 'title', 'aria-label', 'alt'];
    const result = [];
    document.querySelectorAll('input, textarea, button, img, a, iframe').forEach(function (el) {
      if (el.closest('.languageSelector, [data-no-translate]')) return;
      attrs.forEach(function (attr) {
        const value = el.getAttribute(attr);
        if (!value || !value.trim()) return;
        const key = '__i18n_' + attr;
        if (!originals.has(el)) originals.set(el, {});
        const saved = originals.get(el);
        if (!saved[key]) saved[key] = value;
        result.push({ el: el, attr: attr, source: saved[key] });
      });
    });
    return result;
  }

  function restoreSource() {
    textNodes().forEach(function (node) { node.nodeValue = originals.get(node); });
    translatableAttributes().forEach(function (item) { item.el.setAttribute(item.attr, item.source); });
  }

  function cacheKey(lang, source) { return CACHE_PREFIX + lang + ':' + source; }
  async function translate(source, lang) {
    if (lang === 'es' || !source.trim()) return source;
    const key = cacheKey(lang, source);
    const cached = localStorage.getItem(key);
    if (cached) return cached;
    const apiLang = TRANSLATE_API_LANG[lang] || lang;
    const endpoint = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=' + apiLang + '&dt=t&q=' + encodeURIComponent(source);
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Translation service unavailable');
    const data = await response.json();
    const value = data[0].map(function (part) { return part[0]; }).join('');
    try { localStorage.setItem(key, value); } catch (_) { /* cache is optional */ }
    return value;
  }

  async function translateAll(lang, id) {
    const nodes = textNodes();
    const attributes = translatableAttributes();
    const work = nodes.map(function (node) { return { source: originals.get(node), set: function (value) { node.nodeValue = value; } }; })
      .concat(attributes.map(function (item) { return { source: item.source, set: function (value) { item.el.setAttribute(item.attr, value); } }; }));
    const unique = new Map();
    work.forEach(function (item) { if (!unique.has(item.source)) unique.set(item.source, []); unique.get(item.source).push(item); });
    const entries = Array.from(unique.entries());
    let cursor = 0;
    async function worker() {
      while (cursor < entries.length) {
        const current = entries[cursor++];
        try {
          const value = await translate(current[0], lang);
          if (id === changeId) current[1].forEach(function (item) { item.set(value); });
        } catch (_) { /* Keep Spanish source text if the service is temporarily unreachable. */ }
      }
    }
    await Promise.all(Array.from({ length: 5 }, worker));
  }

  async function setLanguage(lang) {
    if (!LANGUAGES[lang]) return;
    const id = ++changeId;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('.languageFlag').forEach(function (button) {
      button.classList.toggle('active', button.dataset.lang === lang);
    });
    restoreSource();
    if (lang === 'es') return;
    const selector = document.querySelector('.languageSelector');
    if (selector) selector.classList.add('is-translating');
    await translateAll(lang, id);
    if (id === changeId && selector) selector.classList.remove('is-translating');
  }

  function init() {
    addSharedStyles();
    ensureGrandTourMobilePanels();
    document.addEventListener('click', function (event) {
      const button = event.target.closest('.languageFlag');
      if (button) setLanguage(button.dataset.lang);
    });
    /* Start loading an internal page before the visitor clicks its menu item. */
    const prefetched = new Set();
    document.addEventListener('pointerover', function (event) {
      const link = event.target.closest('a[href]');
      if (!link || link.target || link.origin !== location.origin || prefetched.has(link.href)) return;
      const url = new URL(link.href);
      if (!/\.html$/i.test(url.pathname)) return;
      const preload = document.createElement('link');
      preload.rel = 'prefetch';
      preload.href = link.href;
      document.head.appendChild(preload);
      prefetched.add(link.href);
    }, { passive: true });
    setLanguage(localStorage.getItem(STORAGE_KEY) || 'es');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
