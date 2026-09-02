/* Shared language controller for Todos con Hernán.
   The selected language is retained for every page in this site. */
(function () {
  'use strict';

  const LANGUAGES = {
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

  function headerMarkup() {
    return '<header class="topbar site-header"><nav class="mainNav" aria-label="Navegación principal">' +
      '<a href="inicio.html">INICIO</a><a href="index.html">EL GRAND TOUR</a>' +
      '<a href="videos.html">VÍDEOS</a><a href="vivir-en-suiza.html">VIVIR EN SUIZA</a>' +
      '<a href="trabajos-suiza.html">TRABAJOS EN SUIZA</a>' +
      '<a href="comunidad.html">COMUNIDAD</a><a href="proyectos.html">PROYECTOS</a>' +
      '<a href="sponsors.html">SPONSORS</a>' +
      '<a href="contacto.html">CONTACTO</a></nav></header>';
  }

  function ensureHeaderAndFlags() {
    let header = document.querySelector('.topbar');
    if (!header && document.body.hasAttribute('data-no-main-nav')) {
      header = document.querySelector('.top-header, .top');
      if (!header) header = document.body;
    }
    if (!header) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup());
      header = document.querySelector('.topbar');
    }
    const currentPage = (location.pathname.split('/').pop() || 'inicio.html').toLowerCase();
    header.querySelectorAll('.mainNav a[href]').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href').toLowerCase() === currentPage);
    });
    if (header.querySelector('.languageSelector')) return;
    const selector = document.createElement('div');
    selector.className = 'languageSelector';
    selector.setAttribute('aria-label', 'Selector de idioma');
    selector.innerHTML = Object.keys(LANGUAGES).map(function (code) {
      const item = LANGUAGES[code];
      return '<button class="languageFlag" data-lang="' + code + '" type="button" title="' + item.name + '" aria-label="' + item.name + '"><img src="' + item.flag + '" alt="' + item.name + '"></button>';
    }).join('');
    header.appendChild(selector);
  }

  function ensureMobileMenu() {
    const header = document.querySelector('.topbar');
    // Sin menú principal no hay panel que abrir: la cabecera se deja como está.
    if (!header || !header.querySelector('.mainNav a') || header.querySelector('.mobileMenuToggle')) return;

    const brand = document.createElement('a');
    brand.className = 'mobileBrand';
    brand.href = 'inicio.html';
    brand.innerHTML = '<img src="img/LogoOficial.png" alt=""><span>TODOS CON HERNÁN</span>';
    header.insertBefore(brand, header.firstChild);

    const backdrop = document.createElement('div');
    backdrop.className = 'mobileMenuBackdrop';
    header.appendChild(backdrop);

    const button = document.createElement('button');
    button.className = 'mobileMenuToggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Abrir menú de navegación');
    button.setAttribute('aria-expanded', 'false');
    button.innerHTML = '&#9776;';
    header.appendChild(button);

    function setMenu(open) {
      header.classList.toggle('mobile-menu-open', open);
      document.body.classList.toggle('mobile-menu-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
      button.innerHTML = open ? '&#215;' : '&#9776;';
    }

    button.addEventListener('click', function () {
      setMenu(!header.classList.contains('mobile-menu-open'));
    });

    backdrop.addEventListener('click', function () { setMenu(false); });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });

    header.querySelectorAll('.mainNav a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });

    // Las banderas viven dentro del menú en móvil: al elegir idioma se cierra el panel.
    header.addEventListener('click', function (event) {
      if (event.target.closest('.mainNav .languageFlag')) setMenu(false);
    });
  }

  /* El selector de idiomas es único: en móvil se traslada al panel del menú
     y en escritorio vuelve a su posición original en la cabecera. */
  function syncLanguagePlacement() {
    const header = document.querySelector('.topbar');
    if (!header) return;
    const nav = header.querySelector('.mainNav');
    const selector = header.querySelector('.languageSelector');
    if (!nav || !selector) return;

    const isMobile = window.matchMedia('(max-width: 760px)').matches;
    let group = nav.querySelector('.mobileLanguageGroup');

    if (isMobile) {
      if (!group) {
        group = document.createElement('div');
        group.className = 'mobileLanguageGroup';
        const title = document.createElement('span');
        title.className = 'mobileLanguageTitle';
        title.textContent = 'IDIOMA';
        group.appendChild(title);
        nav.appendChild(group);
      }
      if (selector.parentElement !== group) group.appendChild(selector);
      return;
    }

    if (selector.parentElement !== header) header.appendChild(selector);
    if (group) group.remove();
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
    ensureHeaderAndFlags();
    ensureMobileMenu();
    syncLanguagePlacement();
    window.matchMedia('(max-width: 760px)').addEventListener('change', syncLanguagePlacement);
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
