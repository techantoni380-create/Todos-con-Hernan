/* ==========================================================================
   COMPONENTE ÚNICO DE CABECERA · Todos con Hernán
   --------------------------------------------------------------------------
   ÚNICA fuente del header/navbar principal de TODA la web.

   - Genera el nav completo (9 enlaces) o, en páginas secundarias, la barra
     con marca + botón "← Volver", según el atributo data del <body>:
       <body>                              -> nav principal completo
       <body data-header-back="vivir-en-suiza.html|Vivir en Suiza">
                                           -> barra secundaria con regreso
       <body data-no-site-header>          -> esta página no lleva cabecera
   - Añade el selector de idiomas (banderas) y el menú hamburguesa móvil.
   - Marca automáticamente el enlace activo según la página actual.
   - Expone window.SiteHeader.LANGUAGES para que i18n.js reutilice las
     banderas. i18n.js se encarga de traducir los textos del nav.

   Diseño, espaciado, clases (.topbar/.mainNav/.top-header/.back-button),
   responsive y comportamiento se mantienen EXACTAMENTE igual que antes:
   los estilos viven en css/style.css, css/site-enhancements.css y
   css/language-selector.css, que no se modifican.
   ========================================================================== */
(function () {
  'use strict';

  /* Catálogo de idiomas (compartido con i18n.js). */
  const LANGUAGES = {
    es: { name: 'Español', flag: 'img/bandera-es.svg' },
    de: { name: 'Deutsch', flag: 'img/bandera-de.svg' },
    fr: { name: 'Français', flag: 'img/bandera-fr.svg' },
    it: { name: 'Italiano', flag: 'img/bandera-it.svg' },
    en: { name: 'English', flag: 'img/bandera-en.svg' },
    zh: { name: '中文', flag: 'img/bandera-zh.svg' },
    pt: { name: 'Português', flag: 'img/bandera-pt.svg' }
  };

  /* Enlaces del nav principal: [href, clave i18n, texto por defecto]. */
  const NAV_ITEMS = [
    ['inicio.html', 'nav.inicio', 'INICIO'],
    ['index.html', 'nav.tour', 'EL GRAND TOUR'],
    ['videos.html', 'nav.videos', 'VÍDEOS'],
    ['vivir-en-suiza.html', 'nav.vivir', 'VIVIR EN SUIZA'],
    ['trabajos-suiza.html', 'nav.trabajos', 'TRABAJOS EN SUIZA'],
    ['comunidad.html', 'nav.comunidad', 'COMUNIDAD'],
    ['proyectos.html', 'nav.proyectos', 'PROYECTOS'],
    ['sponsors.html', 'nav.sponsors', 'SPONSORS'],
    ['contacto.html', 'nav.contacto', 'CONTACTO']
  ];

  const MOBILE_QUERY = '(max-width: 760px)';

  function currentPage() {
    return (location.pathname.split('/').pop() || 'inicio.html').toLowerCase();
  }

  /* ---- Marcado ---------------------------------------------------------- */

  function mainNavMarkup() {
    const here = currentPage();
    const links = NAV_ITEMS.map(function (item) {
      const active = item[0].toLowerCase() === here ? ' class="active"' : '';
      return '<a href="' + item[0] + '"' + active + '>' +
        '<span data-i18n="' + item[1] + '">' + item[2] + '</span></a>';
    }).join('');
    return '<nav class="mainNav" aria-label="Navegación principal">' + links + '</nav>';
  }

  function headerMarkup() {
    return '<header class="topbar site-header">' + mainNavMarkup() + '</header>';
  }

  function backHeaderMarkup(href, label, headerId) {
    /* Doble clase para compatibilidad con los estilos originales de cada
       página secundaria: unas definen .logo y otras .brand; igual con
       .back-button / .back-link. El id opcional reactiva las reglas CSS
       originales que apuntaban al id de la cabecera (p. ej. transporte y
       trabajo). No cambia el diseño: solo permite que el CSS propio de
       cada página se aplique como antes. */
    const idAttr = headerId ? ' id="' + headerId + '"' : '';
    return '<header class="top-header"' + idAttr + '>' +
      '<a href="inicio.html" class="logo brand">Todos con <span>Hernán</span></a>' +
      '<a href="' + href + '" class="back-button back-link">← ' + label + '</a>' +
      '</header>';
  }

  /* ---- Selector de idiomas ---------------------------------------------- */

  function buildLanguageSelector() {
    const selector = document.createElement('div');
    selector.className = 'languageSelector';
    selector.setAttribute('aria-label', 'Selector de idioma');
    selector.innerHTML = Object.keys(LANGUAGES).map(function (code) {
      const item = LANGUAGES[code];
      return '<button class="languageFlag" data-lang="' + code + '" type="button" title="' +
        item.name + '" aria-label="' + item.name + '"><img src="' + item.flag +
        '" alt="' + item.name + '"></button>';
    }).join('');
    return selector;
  }

  /* ---- Menú móvil (hamburguesa) ------------------------------------------ */

  function ensureMobileMenu(header) {
    if (!header.querySelector('.mainNav a') || header.querySelector('.mobileMenuToggle')) return;

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
    header.addEventListener('click', function (event) {
      if (event.target.closest('.mainNav .languageFlag')) setMenu(false);
    });
  }

  /* En móvil las banderas pasan al panel del menú; en escritorio vuelven
     a su posición en la cabecera. */
  function syncLanguagePlacement(header) {
    const nav = header.querySelector('.mainNav');
    const selector = header.querySelector('.languageSelector');
    if (!nav || !selector) return;

    const isMobile = window.matchMedia(MOBILE_QUERY).matches;
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

  /* ---- Construcción ------------------------------------------------------ */

  function build() {
    if (document.body.hasAttribute('data-no-site-header')) return null;

    // Elimina cualquier cabecera duplicada ya presente en el HTML estático.
    document.querySelectorAll('.topbar, .top-header').forEach(function (node) {
      node.remove();
    });

    let header;
    const back = document.body.getAttribute('data-header-back');
    if (back) {
      const parts = back.split('|');
      document.body.insertAdjacentHTML('afterbegin',
        backHeaderMarkup(parts[0].trim(), (parts[1] || 'Volver').trim(), (parts[2] || '').trim()));
    } else {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup());
    }
    header = document.querySelector('.topbar, .top-header');
    if (!header) return null;

    header.appendChild(buildLanguageSelector());
    ensureMobileMenu(header);
    syncLanguagePlacement(header);
    return header;
  }

  function init() {
    const header = build();
    if (!header) return;
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = function () { syncLanguagePlacement(header); };
    if (media.addEventListener) media.addEventListener('change', onChange);
    else if (media.addListener) media.addListener(onChange);
  }

  window.SiteHeader = { LANGUAGES: LANGUAGES, NAV_ITEMS: NAV_ITEMS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
