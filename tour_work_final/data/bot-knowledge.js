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
    fallback: '🤔 No estoy seguro de haber entendido tu pregunta.<br><br>Puedo ayudarte con:<br>🇨🇭 Vivir en Suiza<br>💼 Trabajo<br>🏠 Vivienda<br>🚆 Transporte<br>📄 Documentación<br>🗣️ Idiomas<br>📝 CV Suizo<br><br>¿Sobre qué quieres información?',
    linkLabel: 'Ver más →',
    /* Conversación básica (saludo, gracias, despedida). */
    greeting: '👋 ¡Hola! ¿Cómo estás? ¿En qué podemos ayudarte?',
    greetingAgain: '👋 ¡Hola de nuevo! ¿En qué más puedo ayudarte?',
    greetingPhrases: ['hola', 'holaa', 'holaaa', 'buenas', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'ey', 'saludos', 'que tal', 'qué tal', 'holi'],
    thanks: '😊 ¡De nada! Si necesitas algo más sobre Suiza, aquí estoy.',
    thanksPhrases: ['gracias', 'muchas gracias', 'mil gracias', 'merci', 'te lo agradezco'],
    bye: '👋 ¡Hasta pronto! Mucha suerte con tu proyecto en Suiza.',
    byePhrases: ['adios', 'adiós', 'hasta luego', 'chao', 'chau', 'nos vemos', 'hasta pronto'],
    /* Temas que se muestran como botones de opción dentro del chat
       (tras el saludo, tras "Quiero irme a Suiza" y tras el fallback). */
    topics: ['trabajo', 'vivienda', 'documentacion', 'coste', 'transporte', 'idiomas', 'vivir'],
    /* Orden de los accesos rápidos fijos bajo el chat. Los once primeros
       mantienen exactamente el orden visual que ya tenían. */
    chipOrder: ['vivir', 'trabajo', 'vivienda', 'coste', 'transporte', 'grandtour', 'photospots', 'cv', 'idiomas', 'videos', 'contacto', 'documentacion', 'integracion'],
    /* El orden del array también es la prioridad de detección de intención
       cuando dos categorías empatan en número de coincidencias. */
    categories: [
      {
        id: 'empezar',
        chip: false,
        icon: '🇨🇭',
        label: 'Quiero irme a Suiza',
        href: 'vivir-en-suiza.html',
        linkLabel: '🇨🇭 Ver Vivir en Suiza →',
        showTopics: true,
        keywords: ['irme a suiza', 'quiero irme', 'emigrar a suiza', 'emigrar', 'mudarme a suiza', 'trasladarme a suiza', 'instalarme en suiza', 'nueva vida en suiza', 'venirme a suiza', 'mudanza a suiza'],
        response: '🇨🇭 ¡Claro! Podemos ayudarte a preparar tu llegada a Suiza.<br><br>En nuestra web encontrarás información sobre vivir en Suiza, trabajo, vivienda, transporte, integración, idiomas y otros aspectos importantes.<br><br>¿Qué quieres saber?'
      },
      {
        id: 'vivir',
        icon: '<img src="img/bandera-suiza-cuadrada.svg" alt="" class="chatFlagIcon">',
        label: 'Vivir en Suiza',
        href: 'vivir-en-suiza.html',
        linkLabel: '🇨🇭 Ver Vivir en Suiza →',
        keywords: ['vivir en suiza', 'vida en suiza', 'como es suiza', 'cómo es suiza', 'como es vivir', 'cómo es vivir', 'ciudades de suiza', 'cantones'],
        response: 'En la sección "Vivir en Suiza" encontrarás información general para orientarte antes y después de instalarte en el país: ciudades y pueblos, emprendedores, folklore y vida cotidiana.'
      },
      {
        id: 'coste',
        icon: '💰',
        label: 'Coste de vida',
        href: 'coste-vida.html',
        linkLabel: '💰 Ver Coste de vida →',
        keywords: ['coste de vida', 'cuanto cuesta', 'cuánto cuesta', 'cuanto vale', 'cuánto vale', 'precio', 'precios', 'precios en suiza', 'coste', 'costo', 'dinero', 'gastos', 'salario', 'presupuesto', 'caro'],
        response: '💰 En la sección "Coste de vida" encontrarás información orientativa para hacerte una idea del gasto en Suiza.'
      },
      {
        id: 'trabajo',
        icon: '💼',
        label: 'Trabajo',
        href: 'trabajos-suiza.html',
        linkLabel: '💼 Ver Trabajos en Suiza →',
        keywords: ['buscar trabajo', 'encontrar trabajo', 'ofertas de trabajo', 'oferta de trabajo', 'trabajar en suiza', 'entrevista de trabajo', 'trabajo', 'trabajar', 'empleo', 'empleos', 'contrato', 'sueldo', 'salario', 'laboral', 'curro', 'oportunidades'],
        response: '💼 Si estás pensando en trabajar en Suiza, en la sección "Trabajos en Suiza" tienes portales de empleo suizos, recursos y oportunidades para empezar tu carrera profesional allí.'
      },
      {
        id: 'documentacion',
        icon: '📄',
        label: 'Documentación',
        href: 'trabajo.html#permisos',
        linkLabel: '📄 Ver Permisos y documentación →',
        keywords: ['documentacion', 'documentación', 'documentos', 'papeles', 'permiso', 'permisos', 'permiso de residencia', 'permiso de trabajo', 'residencia', 'visado', 'visa', 'tramites', 'trámites', 'registro'],
        response: '📄 En la guía "Integrarse en Suiza" tienes un apartado dedicado a los permisos de trabajo y residencia (permiso L, permiso B…), con la documentación necesaria según tu situación.'
      },
      {
        id: 'vivienda',
        icon: '🏠',
        label: 'Vivienda',
        href: 'vivienda.html',
        linkLabel: '🏠 Ver Vivienda →',
        keywords: ['buscar piso', 'vivienda', 'piso', 'alquiler', 'alquilar', 'apartamento', 'habitacion', 'habitación', 'casa', 'alojamiento', 'vivir'],
        response: '🏠 En la sección "Vivienda" encontrarás información sobre el alquiler en Suiza: requisitos, documentación habitual, registro y consejos para buscar piso.'
      },
      {
        id: 'transporte',
        icon: '🚆',
        label: 'Transporte',
        href: 'transporte.html',
        linkLabel: '🚆 Ver Transporte →',
        keywords: ['viajar por suiza', 'transporte', 'tren', 'trenes', 'bus', 'autobus', 'autobús', 'tranvia', 'tranvía', 'moverse', 'moverme', 'billete', 'billetes', 'sbb', 'horarios'],
        response: '🚆 En la sección "Transporte" tienes una guía para moverte por Suiza: precios de referencia, pago y validación, rutas tipo, mapas descargables y enlaces oficiales para consultar horarios y comprar billetes.'
      },
      {
        id: 'idiomas',
        icon: '🗣️',
        label: 'Idiomas',
        href: 'idiomas.html',
        linkLabel: '🗣️ Ver Idiomas →',
        keywords: ['aleman suizo', 'alemán suizo', 'aprender aleman', 'aprender alemán', 'idioma', 'idiomas', 'aleman', 'alemán', 'frances', 'francés', 'italiano', 'ingles', 'inglés', 'hablar suizo'],
        response: '🗣️ En la sección "Idiomas" encontrarás contenido sobre los idiomas que se hablan en Suiza (alemán, alemán suizo, francés, italiano…) y recursos para aprenderlos.'
      },
      {
        id: 'cv',
        icon: '📄',
        label: 'CV suizo',
        href: 'creador-cv-suizo.html',
        linkLabel: '📝 Crear mi CV Suizo →',
        keywords: ['curriculum', 'currículum', 'curriculo', 'hoja de vida', 'hacer cv', 'preparar cv', 'crear cv', 'hacer un cv', 'hacer curriculum', 'hacer currículum', 'cv'],
        response: '📝 En "Crea tu CV Suizo" tienes una herramienta para preparar tu currículum en formato suizo, con tus datos guardados solo en tu propio navegador.'
      },
      {
        id: 'integracion',
        icon: '🤝',
        label: 'Integración',
        href: 'trabajo.html',
        linkLabel: '🤝 Ver Integrarse en Suiza →',
        keywords: ['integrarme', 'integrarse', 'integracion', 'integración', 'adaptarme', 'adaptacion', 'adaptación', 'comunidad', 'hacer amigos', 'cultura suiza', 'costumbres'],
        response: '🤝 La guía "Integrarse en Suiza" te acompaña para empezar con información y confianza: empleo, permisos, contratos, idiomas, vivienda, coste de vida y salud.'
      },
      {
        id: 'grandtour',
        icon: '📍',
        label: 'Grand Tour de Suiza',
        href: 'grand-tour.html',
        linkLabel: '📍 Ver el Grand Tour →',
        keywords: ['grand tour', 'ruta', 'recorrido', 'itinerario', 'mapa'],
        response: 'El "Grand Tour de Suiza" es la sección con el mapa interactivo, la ruta turística y la navegación GPS.'
      },
      {
        id: 'photospots',
        icon: '📸',
        label: 'Photo Spots',
        href: 'grand-tour.html',
        linkLabel: '📸 Ver Photo Spots →',
        keywords: ['photo spot', 'photo spots', 'fotos', 'lugares para fotos', 'puntos fotograficos', 'puntos fotográficos'],
        response: 'Los 92 Photo Spots oficiales de Suiza están disponibles en el mapa del Grand Tour.'
      },
      {
        id: 'videos',
        icon: '🎥',
        label: 'Vídeos',
        href: 'videos.html',
        linkLabel: '🎥 Ver Vídeos →',
        keywords: ['video', 'vídeo', 'videos', 'vídeos', 'youtube'],
        response: 'En la sección "Vídeos" están todos los vídeos del proyecto organizados por tema.'
      },
      {
        id: 'contacto',
        icon: '📞',
        label: 'Contactar con Hernán',
        href: 'contacto.html',
        linkLabel: '📞 Ir a Contacto →',
        keywords: ['contacto', 'contactar', 'hablar con hernan', 'hablar con hernán', 'llamada', 'escribir a hernan'],
        response: 'Puedes escribir a Hernán desde la página de contacto o directamente por WhatsApp con el botón de abajo.'
      }
    ]
  };

  window.BOT_KNOWLEDGE = { es: es };
}());
