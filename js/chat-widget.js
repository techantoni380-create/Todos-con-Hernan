/* Asistente flotante de Todos con Hernán.
   Bot de reglas 100% local: sin IA, sin backend, sin API externa.
   No envía mensajes a ningún servidor ni guarda el historial de conversación. */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '41765956318';
  const LANG_STORAGE_KEY = 'todosConHernanLanguage';


  const localHelp = {
    openLabel: 'Abrir asistente', closeLabel: 'Cerrar asistente', title: 'Asistente de Todos con Hernán',
    welcome: '¡Hola! 👋 Soy el asistente de la web. Estoy aquí para ayudarte a encontrar información y descubrir Suiza. ¿Qué te gustaría hacer? Puedes consultar los próximos eventos, descubrir el Mundial del Plato Típico o preparar tu visita a Suiza.',
    whatsappLabel: 'Hablar con Hernán por WhatsApp', inputPlaceholder: 'Escribe tu pregunta…', sendLabel: 'Enviar', linkLabel: 'Ver sección',
    greetingPhrases: ['hola','buenas','buenos dias','buenas tardes','buenas noches','hey','holi','holaa','holaaa','buen dia','saludos','hello'],
    thanksPhrases: ['gracias','muchas gracias','perfecto','genial','muy amable','te lo agradezco','gracias por todo'], byePhrases: ['adios','hasta luego','chao','hasta manana','hasta pronto','nos vemos','me voy'],
    greeting: '¡Hola! 😊 ¿Buscas un viaje, un evento, un vídeo o quieres contactar con Hernán?',
    greetingAgain: '¡Aquí sigo! 😊 Cuéntame, ¿qué necesitas?', thanks: '¡De nada! 😊 Si te apetece seguir explorando, puedes consultar los próximos eventos o descubrir el Mundial del Plato Típico en las opciones de abajo.', bye: '¡Hasta pronto! Que disfrutes de la web 😊',
    fallback: 'No he entendido del todo lo que buscas. ¿Me lo cuentas de otra manera? Puedo ayudarte con viajes, vivir en Suiza, eventos y vídeos. Si prefieres hablar con Hernán, tienes su WhatsApp abajo.',
    categories: [
      {id:'languages',label:'Aprende Idiomas',keywords:['aleman','alemanes','idiomas','idioma','laura','clases','aprender aleman','deutsch','curso de aleman','no hablo aleman'],response:'Si quieres aprender alemán, visita nuestra sección Aprende Idiomas 😊. Allí encontrarás Alemán con Laura y el enlace a su web para conocer sus clases y contactar con ella.',href:'idiomas.html',linkLabel:'Aprende alemán con Laura',followup:'En Aprende Idiomas tienes el enlace a la web de Laura. Consulta allí los cursos disponibles o contacta con ella para preguntar por niveles, horarios y precios.'},
      {id:'transport',label:'Transporte',keywords:['transporte','tren','trenes','sbb','billete','billetes','ticket','tickets','tike','tikes','autobus','estacion','horario de tren','comprar billete'],response:'Para preparar tu viaje, entra en Transporte y elige origen, destino y fecha. Allí puedes consultar las conexiones y continuar en SBB para comprobar el precio y comprar el billete.',href:'transporte.html',linkLabel:'Buscar mi viaje',followup:'El precio final y el pago se consultan en SBB. El asistente no tiene acceso a tarifas ni disponibilidad en tiempo real.'},
      {id:'events',label:'Eventos',keywords:['evento','eventos','calendario','agenda','festivo','festivos','fiesta','fiestas'],response:'El calendario está en Inicio. Desde allí puedes abrir Google Calendar para consultar los eventos y festivos. Algunos festivos dependen del cantón.',href:'inicio.html#eventsCalendarLink',linkLabel:'Ver calendario',followup:'Abre el calendario de Inicio para ver las fechas publicadas. No puedo confirmar desde el chat si hay nuevos eventos.'},
      {id:'worldcup',label:'Mundial',keywords:['mundial','plato','platos','votar','voto','votacion','bandera','banderas','concurso','paises','participantes','quienes participan','que paises participan'],response:'¡El Mundial del Plato Típico! 🏆 Elige una bandera con vídeo disponible para abrirlo en YouTube y comentar o dar me gusta allí. Pulsar la bandera por sí solo no cuenta como voto.',href:'proyectos.html#mundial-2026',linkLabel:'Ver países · Edición 2026',followup:'Los comentarios y los me gusta se hacen directamente en YouTube, con tu cuenta. Consulta las indicaciones de Hernán en cada vídeo para saber cómo participar.'},
      {id:'videos',label:'Vídeos',keywords:['video','videos','youtube','canal','ver a hernan'],response:'Puedes explorar los vídeos desde la web o visitar el canal de Todos con Hernán en YouTube. ¿Buscas alguno sobre un lugar o un tema concreto?',href:'videos.html',linkLabel:'Explorar vídeos',followup:'En la sección Vídeos puedes explorar el contenido disponible. Si no encuentras uno concreto, puedes preguntarle a Hernán por WhatsApp.'},
      {id:'contact',label:'Contacto',keywords:['contacto','contactar','telefono','correo','email','whatsapp','hablar con hernan','escribir a hernan','persona','humano'],response:'Claro 😊 Puedes escribirle a Hernán por WhatsApp usando el botón de abajo, o visitar Contacto. Él podrá leer tu mensaje y responder cuando esté disponible.',href:'contacto.html',linkLabel:'Ir a Contacto',followup:'Puedes usar el botón de WhatsApp para abrir la conversación con Hernán. El mensaje solo se envía cuando tú lo confirmas allí.'},
      {id:'tour',label:'Grand Tour',keywords:['grand tour','gran tour','ruta','rutas','mapa','photo spot','photo spots','photospots','turismo','visitar','lugares','viajar','viaje','vacaciones','ir a suiza','conocer suiza','visitar suiza','viajar a suiza'],response:'¡Qué bien que quieras conocer Suiza! 😊 ¿Vienes de vacaciones o estás pensando en quedarte a vivir? Para una visita, puedes empezar por el mapa del Grand Tour y descubrir lugares para tu recorrido.',href:'grand-tour.html',linkLabel:'Explorar el mapa',followup:'Abre el mapa y selecciona el lugar que te interese. Allí encontrarás la información disponible de ese punto.'},
      {id:'living',label:'Vivir en Suiza',keywords:['vivir','mudanza','mudarme','trabajo','trabajar','empleo','vivienda','alquiler','permiso','documentos'],response:'¡Entiendo! 😊 Si te gustaría ir a vivir a Suiza, empieza por la sección Vivir en Suiza. Allí puedes explorar la información de la web para preparar ese cambio. ¿Te interesa más el trabajo, la vivienda o los primeros pasos?',href:'vivir-en-suiza.html',linkLabel:'Ver Vivir en Suiza',followup:'Los requisitos y los gastos dependen de tu situación y del lugar. Consulta la información de la sección y confirma los trámites con el organismo correspondiente.'}
    ]
  };
  function enrichStrings(base, lang) {
    if (lang !== 'es' && base) return base;
    const merged = Object.assign({}, base || {}, localHelp);
    const extra = (base && base.categories || []).filter(c => !localHelp.categories.some(n => n.id === c.id));
    merged.categories = localHelp.categories.concat(extra);
    return merged;
  }

  function addSharedStyles() {
    if (!document.querySelector('link[href="css/chat-widget.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'css/chat-widget.css';
      document.head.appendChild(link);
    }
  }

  function loadKnowledge(callback) {
    if (window.BOT_KNOWLEDGE) { callback(); return; }
    const existing = document.querySelector('script[src="data/bot-knowledge.js"]');
    if (existing) { if(window.BOT_KNOWLEDGE){callback();return;} existing.addEventListener('load', callback, {once:true}); existing.addEventListener('error',callback,{once:true}); setTimeout(callback,2500); return; }
    const script = document.createElement('script');
    script.src = 'data/bot-knowledge.js';
    script.addEventListener('load', callback, {once:true});
    script.addEventListener('error', callback, {once:true});
    setTimeout(callback,2500);
    document.head.appendChild(script);
  }

  function getStrings() {
    const bank = window.BOT_KNOWLEDGE || {};
    let lang = 'es';
    try { lang = localStorage.getItem(LANG_STORAGE_KEY) || 'es'; } catch (_) {}
    /* Los demás idiomas se irán añadiendo en data/bot-knowledge.js;
       mientras tanto se usa siempre el bloque "es" como base. */
    return enrichStrings(bank[lang] || bank.es, bank[lang] ? lang : 'es');
  }

  function normalize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* Coincidencia con límites de palabra para evitar falsos positivos
     (por ejemplo, que "buscar" active la palabra clave "bus"). */
  function keywordMatches(normalized, keyword) {
    const pattern = new RegExp('(^|[^a-z0-9])' + escapeRegExp(normalize(keyword)) + '([^a-z0-9]|$)');
    return pattern.test(normalized);
  }

  function matchesAnyPhrase(normalized, phrases) {
    return (phrases || []).some(function (phrase) { return keywordMatches(normalized, phrase); });
  }

  /* Intención principal: gana la categoría con más palabras clave
     coincidentes; en caso de empate, la que tenga la coincidencia más
     larga (más específica) y, si persiste el empate, el orden del array. */
  function findCategory(strings, message) {
    const normalized = normalize(message);
    if (!normalized) return null;
    let best = null;
    let bestScore = 0;
    let bestLength = 0;
    strings.categories.forEach(function (category) {
      let score = 0;
      let longest = 0;
      (category.keywords || []).forEach(function (keyword) {
        if (keywordMatches(normalized, keyword)) {
          score++;
          const keyLength = normalize(keyword).length;
          if (keyLength > longest) longest = keyLength;
        }
      });
      if (score > bestScore || (score > 0 && score === bestScore && longest > bestLength)) {
        bestScore = score;
        bestLength = longest;
        best = category;
      }
    });
    return bestScore ? best : null;
  }

  function photoSpotsExtra() {
    if (!Array.isArray(window.SPOTS) || !window.SPOTS.length) return '';
    const sample = window.SPOTS.slice(0, 5).map(function (spot) { return spot.name; }).join(', ');
    return ' Algunos ejemplos: ' + sample + ', y muchos más en el mapa.';
  }

  function categoryAnswer(category) {
    let text = category.response;
    if (category.id === 'photospots') text += photoSpotsExtra();
    return text;
  }

  function buildWidget() {
    if (document.querySelector('.chatWidgetButton')) return;
    let strings = getStrings();
    if (!strings) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chatWidgetButton';
    button.setAttribute('aria-label', strings.openLabel);
    button.innerHTML = '<img src="img/HernanManager.png" alt="">';

    const panel = document.createElement('div');
    panel.className = 'chatWidgetPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', strings.title);

    /* Interfaz limpia: solo cabecera, cierre, conversación, botón de
       WhatsApp y formulario. No se muestran botones de categorías ni de
       temas; TODA la lógica de detección de intención y las respuestas
       sobre los temas se mantienen intactas (el usuario escribe libremente). */

    panel.innerHTML =
      '<div class="chatWidgetHeader">' +
        '<span>' + strings.title + '</span>' +
        '<button type="button" class="chatWidgetClose" aria-label="' + strings.closeLabel + '">&times;</button>' +
      '</div>' +
      '<div class="chatWidgetBody" id="chatWidgetBody">' +
        '<div class="chatWidgetMessage bot">' + strings.welcome + '</div>' +
      '</div>' +
      '<a class="chatWidgetWhatsapp" href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener noreferrer">' +
        strings.whatsappLabel +
      '</a>' +
      '<form class="chatWidgetForm">' +
        '<input type="text" class="chatWidgetInput" placeholder="' + strings.inputPlaceholder + '" aria-label="' + strings.inputPlaceholder + '">' +
        '<button type="submit" class="chatWidgetSend">' + strings.sendLabel + '</button>' +
      '</form>';

    document.body.appendChild(button);
    document.body.appendChild(panel);

    const body = panel.querySelector('#chatWidgetBody');
    const form = panel.querySelector('.chatWidgetForm');
    const input = panel.querySelector('.chatWidgetInput');
    const closeBtn = panel.querySelector('.chatWidgetClose');

    /* Memoria básica de la conversación mientras la página esté abierta. */
    const context = { greeted: false, lastCategory: null };
    input.maxLength = 1000;
    body.setAttribute('role','log'); body.setAttribute('aria-live','polite');
    button.setAttribute('aria-expanded','false');
    const choices = document.createElement('div');
    choices.className = 'chatWidgetChoices';
    choices.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px';
    choices.setAttribute('aria-label','Temas de ayuda');
    form.before(choices);
    function refreshChoices(){
      choices.replaceChildren();
      strings.categories.slice(0,8).forEach(c=>{const option=document.createElement('button');option.type='button';option.textContent=c.label||c.linkLabel||c.id;option.style.cssText='padding:6px 9px;border:1px solid #7996a8;border-radius:16px;background:#092536;color:white;cursor:pointer;font:inherit;font-size:12px';option.addEventListener('click',()=>{addMessage(option.textContent,'user');respondWithCategory(c,false);input.focus()});choices.appendChild(option)});
    }
    refreshChoices();

    function addMessage(text, who) {
      const bubble = document.createElement('div');
      bubble.className = 'chatWidgetMessage ' + who;
      if (who === 'user') bubble.textContent = text;
      else bubble.innerHTML = text;
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
    }

    function respondWithCategory(category, withGreeting) {
      let text = categoryAnswer(category);
      if (withGreeting) text = '👋 ¡Hola! ' + text;
      text += '<br><a class="chatWidgetLinkBtn" href="' + category.href + '">' +
        (category.linkLabel || strings.linkLabel) + '</a>';
      addMessage(text, 'bot');
      context.lastCategory = category.id;
    }

    function openPanel() {
      strings = getStrings(); refreshChoices();
      panel.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      input.focus();
    }

    function closePanel() {
      panel.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }

    button.addEventListener('click', function () {
      if (panel.classList.contains('is-open')) closePanel();
      else openPanel();
    });

    closeBtn.addEventListener('click', closePanel);

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      addMessage(message, 'user');
      input.value = '';

      const normalized = normalize(message);
      const category = findCategory(strings, message);
      const isGreeting = matchesAnyPhrase(normalized, strings.greetingPhrases);

      const last = strings.categories.find(c=>c.id===context.lastCategory);
      const followup = matchesAnyPhrase(normalized,['cuanto cuesta','precio','cuanto vale','como lo hago','como hago','donde lo encuentro','donde esta','mas informacion','y eso','como compro','y para comprar']);
      const germanGreeting = matchesAnyPhrase(normalized,['guten tag','guten morgen','guten morguen','guten morguin','guten morgun','guten abend','hallo','gruezi','grüezi','gruezi mitenand','wie gehts','wie geht es dir','wie geht es ihnen']);
      if (germanGreeting && (!category || category.id === 'languages')) {
        const morning = matchesAnyPhrase(normalized,['guten morgen','guten morguen','guten morguin','guten morgun']);
        const evening = matchesAnyPhrase(normalized,['guten abend']);
        const greeting = morning ? 'Guten Morgen! ☀️ ¡Buenos días!' : evening ? 'Guten Abend! 🌙 ¡Buenas tardes/noches!' : matchesAnyPhrase(normalized,['guten tag']) ? 'Guten Tag! 👋 ¡Buen día!' : 'Hallo! 👋 ¡Hola!';
        addMessage(greeting+' 😊 ¿Qué tal? Si te apetece aprender alemán, en nuestra sección Aprende Idiomas encontrarás a Laura y podrás acceder a su web para conocer sus clases y contactar con ella.<br><a class="chatWidgetLinkBtn" href="idiomas.html">Conocer Alemán con Laura</a>','bot');
        context.greeted = true; context.lastCategory = 'languages';
      } else if (last && followup && !category) {
        addMessage(last.followup || ('Puedes encontrar más información aquí: <a class="chatWidgetLinkBtn" href="'+last.href+'">'+(last.linkLabel||strings.linkLabel)+'</a>'),'bot');
      } else if (matchesAnyPhrase(normalized,['si','vale','ok','de acuerdo']) && normalized.split(/\s+/).length<4) {
        addMessage(last ? 'Perfecto 😊 Puedes abrir el enlace de arriba. Si necesitas otra cosa, elige una opción o escríbeme.' : 'Dime qué necesitas o elige una de las opciones de abajo 😊','bot');
      } else if (matchesAnyPhrase(normalized,['que puedes hacer','ayuda','menu','opciones'])) {
        addMessage('Puedo ayudarte a encontrar transporte, eventos, vídeos, el Mundial y las secciones de la web. Elige una opción de abajo o dime qué buscas.','bot');
      } else if (matchesAnyPhrase(normalized,['como estas','como esta','que tal','como te va','todo bien','como andas'])) {
        addMessage('¡Gracias por preguntar! 😊 Soy el asistente de la web de Hernán. Estoy aquí para echarte una mano. ¿Qué te gustaría saber sobre Suiza?','bot');
      } else if (matchesAnyPhrase(normalized,['eres hernan','hablo con hernan','eres una persona','eres un robot','quien eres'])) {
        addMessage('Soy el asistente de la web, no Hernán en persona 😊. Si quieres hablar directamente con él, pulsa el botón de WhatsApp de abajo.','bot');
      } else if (matchesAnyPhrase(normalized,['que hora es','que hora tienes','hora en suiza'])) {
        addMessage('En Suiza son las '+new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Zurich',hour:'2-digit',minute:'2-digit'}).format(new Date())+' 🕒','bot');
      } else if (matchesAnyPhrase(normalized,['que dia es','que fecha es','fecha de hoy'])) {
        addMessage('Hoy es '+new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Zurich',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date())+'.','bot');
      } else if (matchesAnyPhrase(normalized,['que tiempo hace','hace frio','va a llover','temperatura','clima'])) {
        addMessage('¿En qué ciudad de Suiza? El tiempo cambia según la zona. Puedes consultar las ciudades disponibles junto al calendario de <a class="chatWidgetLinkBtn" href="inicio.html#eventsCalendarLink">Inicio</a>. No recibo el tiempo en directo en este chat.','bot');
      } else if (matchesAnyPhrase(normalized,['que haces','que cuentas','estas ahi'])) {
        addMessage('¡Aquí estoy! 😊 Puedo ayudarte a encontrar lo que buscas en la web. ¿Tienes algún viaje en mente o quieres conocer más sobre Suiza?','bot');
      } else if (matchesAnyPhrase(normalized,['buen provecho','feliz dia','buen fin de semana','feliz domingo','que descanses'])) {
        addMessage('¡Gracias, igualmente! 😊 Que pases un buen día.','bot');
      } else if (matchesAnyPhrase(normalized,['estoy bien','muy bien','todo genial','bien gracias'])) {
        addMessage('¡Me alegro! 😊 ¿Te apetece descubrir algún lugar de Suiza o necesitas ayuda con algo de la web?','bot');
      } else if (matchesAnyPhrase(normalized,['jajaja','jaja','jeje','jejeje'])) {
        addMessage('😄 ¿Qué te gustaría ver ahora?','bot');
      } else if (matchesAnyPhrase(normalized,['no entiendo','no lo entiendo','explicamelo','no se'])) {
        addMessage('Claro, vamos paso a paso 😊. Puedes elegir una opción de abajo o decirme, por ejemplo: «quiero viajar a Suiza», «busco eventos» o «quiero hablar con Hernán».','bot');
      } else if (matchesAnyPhrase(normalized,['perdon','disculpa','lo siento'])) {
        addMessage('No pasa nada 😊. Dime en qué puedo ayudarte.','bot');
      } else if (category && category.id === 'worldcup' && matchesAnyPhrase(normalized,['paises','participantes','quienes participan'])) {
        addMessage('En el panel del Mundial aparecen banderas de Bolivia, República Dominicana, Nicaragua, Venezuela, Ecuador, Honduras, El Salvador, Perú, Guatemala, Paraguay, Argentina, Chile, Colombia, Costa Rica, Cuba, España, México, Panamá, Brasil y Uruguay. Las que ya tienen vídeo te permiten abrirlo en YouTube; las demás quedan a la espera de contenido.<br><a class="chatWidgetLinkBtn" href="proyectos.html#mundial-2026">Ver países · Edición 2026</a>','bot');
        context.lastCategory = 'worldcup';
      } else if (category) {
        /* Si saluda y pregunta a la vez, se responde con saludo + tema. */
        respondWithCategory(category, isGreeting && !context.greeted);
        context.greeted = context.greeted || isGreeting;
      } else if (isGreeting) {
        const greeting = matchesAnyPhrase(normalized,['buenos dias','buen dia']) ? '¡Buenos días! ☀️ ¿En qué puedo ayudarte hoy?' : matchesAnyPhrase(normalized,['buenas tardes']) ? '¡Buenas tardes! 😊 ¿Qué te gustaría consultar?' : matchesAnyPhrase(normalized,['buenas noches']) ? '¡Buenas noches! 🌙 ¿Te ayudo a encontrar algo en la web?' : (context.greeted ? strings.greetingAgain : strings.greeting);
        addMessage(greeting+' También puedes echar un vistazo a los próximos eventos o descubrir los países del Mundial del Plato Típico. 👇', 'bot');
        context.greeted = true;
      } else if (matchesAnyPhrase(normalized, strings.thanksPhrases)) {
        addMessage(strings.thanks, 'bot');
      } else if (matchesAnyPhrase(normalized, strings.byePhrases)) {
        addMessage(strings.bye, 'bot');
      } else {
        addMessage(strings.fallback, 'bot');
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
    });
  }

  function init() {
    if (document.querySelector('.chatWidgetButton')) return;
    addSharedStyles();
    loadKnowledge(buildWidget);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}());
