/* Shared legal footer for Todos con Hernán.
   Appends the "INFORMACIÓN LEGAL" links block to the existing footer on every
   page, without touching the footer's current copyright/credit content. */
(function () {
  'use strict';

  const LEGAL_LINKS = [
    { href: 'aviso-legal.html', label: 'Aviso legal' },
    { href: 'privacidad.html', label: 'Política de privacidad' },
    { href: 'cookies.html', label: 'Política de cookies' },
    { href: 'condiciones-uso.html', label: 'Condiciones de uso' },
    { href: 'normas-comunidad.html', label: 'Normas de la comunidad' },
    { href: 'contenidos-fotografias.html', label: 'Política de contenidos y fotografías' },
    { href: 'proteccion-datos.html', label: 'Protección de datos' },
    { href: 'accesibilidad.html', label: 'Accesibilidad' }
  ];

  function addSharedStyles() {
    if (!document.querySelector('link[href="css/legal-footer.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/legal-footer.css';
      document.head.appendChild(link);
    }
  }

  function buildLinksMarkup() {
    const items = LEGAL_LINKS.map(function (item) {
      return '<li><a href="' + item.href + '">' + item.label + '</a></li>';
    }).join('');
    /* No hay todavía un gestor de cookies (CMP) implementado: se deja el control
       visible pero deshabilitado para no simular una función inexistente. */
    const cookieSettings = '<li><button type="button" class="legalFooterCookieSettings" disabled ' +
      'title="Próximamente disponible">Configurar cookies</button></li>';
    return '<nav class="legalFooterLinks" aria-label="Información legal">' +
      '<span class="legalFooterHeading">Información legal</span>' +
      '<ul>' + items + cookieSettings + '</ul>' +
      '</nav>';
  }

  function ensureLegalFooter() {
    const footer = document.querySelector('footer.site-credits, footer.site-footer');
    if (!footer || footer.querySelector('.legalFooterLinks')) return;
    footer.insertAdjacentHTML('beforeend', buildLinksMarkup());
  }

  function init() {
    addSharedStyles();
    ensureLegalFooter();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
