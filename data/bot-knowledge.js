/* Base de conocimiento del asistente de Todos con Hernán.
   Separada de la lógica del widget (js/chat-widget.js) para poder
   actualizar textos/enlaces sin tocar la programación.

   Preparado para el sistema de idiomas existente (misma clave de
   localStorage que usa js/i18n.js: "todosConHernanLanguage"), pero de
   momento solo se rellena el bloque "es". Añadir más adelante los
   bloques "de", "fr", "it", "en", "zh", "pt" siguiendo la misma forma. */
(function () {
  'use strict';

  const es = {
    title: '🤝 Asistente de Todos con Hernán',
    welcome: '¡Hola! 👋 Soy el asistente de Todos con Hernán. ¿En qué puedo ayudarte sobre Suiza?',
    inputPlaceholder: 'Escribe tu pregunta…',
    sendLabel: 'Enviar',
    closeLabel: 'Cerrar asistente',
    openLabel: 'Abrir asistente de Todos con Hernán',
    categoriesHeading: 'Elige un tema:',
    whatsappLabel: '🟢 Contactar por WhatsApp',
    fallback: 'ℹ️ No he encontrado una respuesta concreta en mi información disponible. Puedes consultar las secciones de la web o contactar directamente con Hernán.',
    linkLabel: 'Ver más →',
    categories: [
      {
        id: 'vivir',
        icon: '<img src="img/bandera-suiza-cuadrada.svg" alt="" class="chatFlagIcon">',
        label: 'Vivir en Suiza',
        href: 'vivir-en-suiza.html',
        keywords: ['vivir en suiza', 'mudarme a suiza', 'emigrar a suiza', 'instalarme en suiza', 'vida en suiza'],
        response: 'En la sección "Vivir en Suiza" encontrarás información general para orientarte antes y después de instalarte en el país.'
      },
      {
        id: 'trabajo',
        icon: '💼',
        label: 'Trabajo',
        href: 'trabajo.html',
        keywords: ['trabajo', 'trabajar', 'empleo', 'buscar trabajo', 'contrato', 'sueldo', 'salario'],
        response: 'En la sección "Trabajo" tienes contenido sobre cómo integrarse en el mundo laboral suizo.'
      },
      {
        id: 'vivienda',
        icon: '🏠',
        label: 'Vivienda',
        href: 'vivienda.html',
        keywords: ['vivienda', 'piso', 'alquiler', 'alquilar', 'apartamento', 'casa en suiza'],
        response: 'En la sección "Vivienda" encontrarás información orientativa sobre alojamiento en Suiza.'
      },
      {
        id: 'coste',
        icon: '💰',
        label: 'Coste de vida',
        href: 'coste-vida.html',
        keywords: ['coste de vida', 'cuanto cuesta', 'cuánto cuesta', 'precios en suiza', 'gastos', 'presupuesto'],
        response: 'En la sección "Coste de vida" encontrarás información orientativa para hacerte una idea del gasto en Suiza.'
      },
      {
        id: 'transporte',
        icon: '🚆',
        label: 'Transporte',
        href: 'transporte.html',
        keywords: ['transporte', 'tren', 'billete', 'billetes', 'sbb', 'autobus', 'autobús', 'moverme'],
        response: 'En la sección "Transporte" tienes una guía sobre cómo moverte por Suiza y enlaces a servicios oficiales para consultar horarios y billetes.'
      },
      {
        id: 'grandtour',
        icon: '📍',
        label: 'Grand Tour de Suiza',
        href: 'index.html',
        keywords: ['grand tour', 'ruta', 'recorrido', 'itinerario', 'mapa'],
        response: 'El "Grand Tour de Suiza" es la sección con el mapa interactivo, la ruta turística y la navegación GPS.'
      },
      {
        id: 'photospots',
        icon: '📸',
        label: 'Photo Spots',
        href: 'index.html',
        keywords: ['photo spot', 'photo spots', 'fotos', 'lugares para fotos', 'puntos fotograficos', 'puntos fotográficos'],
        response: 'Los 92 Photo Spots oficiales de Suiza están disponibles en el mapa del Grand Tour.'
      },
      {
        id: 'cv',
        icon: '📄',
        label: 'CV suizo',
        href: 'creador-cv-suizo.html',
        keywords: ['cv', 'curriculum', 'currículum', 'crear cv', 'hacer un cv'],
        response: 'En "Crea tu CV Suizo" tienes una herramienta para preparar tu currículum en formato suizo, con tus datos guardados solo en tu propio navegador.'
      },
      {
        id: 'idiomas',
        icon: '🗣️',
        label: 'Idiomas',
        href: 'idiomas.html',
        keywords: ['idioma', 'idiomas', 'aleman', 'alemán', 'frances', 'francés', 'italiano', 'hablar suizo'],
        response: 'En la sección "Idiomas" encontrarás contenido sobre los idiomas que se hablan en Suiza y recursos para aprenderlos.'
      },
      {
        id: 'videos',
        icon: '🎥',
        label: 'Vídeos',
        href: 'videos.html',
        keywords: ['video', 'vídeo', 'videos', 'vídeos', 'youtube'],
        response: 'En la sección "Vídeos" están todos los vídeos del proyecto organizados por tema.'
      },
      {
        id: 'contacto',
        icon: '📞',
        label: 'Contactar con Hernán',
        href: 'contacto.html',
        keywords: ['contacto', 'contactar', 'hablar con hernan', 'hablar con hernán', 'llamada', 'escribir a hernan'],
        response: 'Puedes escribir a Hernán desde la página de contacto o directamente por WhatsApp con el botón de abajo.'
      }
    ]
  };

  window.BOT_KNOWLEDGE = { es: es };
}());
