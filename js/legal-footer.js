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
    const cookieSettings = '<li><button type="button" class="legalFooterCookieSettings">Configurar cookies</button></li>';
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

  function preferenceDialog() {
    if (document.getElementById('legalPreferencesDialog')) return;
    const dialog = document.createElement('dialog');
    dialog.id = 'legalPreferencesDialog';
    dialog.className = 'legalPreferencesDialog';
    dialog.innerHTML = '<form method="dialog" class="legalPreferencesPanel">' +
      '<button type="submit" class="legalPreferencesClose" aria-label="Cerrar">&times;</button>' +
      '<h2>Preferencias de privacidad</h2>' +
      '<p>Este sitio no utiliza cookies propias de analítica, publicidad, cuentas o pagos. Puedes consultar y cambiar aquí las preferencias que se guardan localmente en este navegador.</p>' +
      '<label class="legalPreferenceRow"><input type="checkbox" checked disabled> Funcionamiento básico y preferencias de idioma <span>Necesario</span></label>' +
      '<p class="legalPreferenceNote">El idioma elegido y, cuando se usa, el estado del creador de CV se guardan mediante <code>localStorage</code>. La geolocalización solo se solicita cuando activas una función GPS y depende de tu navegador.</p>' +
      '<label class="legalPreferenceRow"><input type="checkbox" id="legalYoutubePreference"> Reproductores de YouTube <span>Opcional</span></label>' +
      '<p class="legalPreferenceNote">Los vídeos incorporados proceden de YouTube. La reproducción puede implicar solicitudes y tecnologías de YouTube. Esta preferencia se guarda localmente; el bloqueo técnico de un vídeo también puede gestionarse desde el navegador.</p>' +
      '<div class="legalPreferencesActions"><button type="button" class="legalPreferencesReject">Rechazar opcionales</button><button type="submit" class="legalPreferencesSave">Guardar preferencias</button></div>' +
      '</form>';
    document.body.appendChild(dialog);
    const youtube = dialog.querySelector('#legalYoutubePreference');
    const saved = localStorage.getItem('todosConHernanExternalMedia');
    youtube.checked = saved === 'allowed';
    function save(value) {
      localStorage.setItem('todosConHernanExternalMedia', value ? 'allowed' : 'denied');
      dialog.close();
    }
    dialog.querySelector('.legalPreferencesReject').addEventListener('click', function () { youtube.checked = false; save(false); });
    dialog.querySelector('.legalPreferencesPanel').addEventListener('submit', function () { save(youtube.checked); });
    document.addEventListener('click', function (event) {
      if (event.target.closest('.legalFooterCookieSettings')) {
        youtube.checked = localStorage.getItem('todosConHernanExternalMedia') === 'allowed';
        dialog.showModal();
      }
    });
  }

  function init() {
    addSharedStyles();
    ensureLegalFooter();
    preferenceDialog();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
