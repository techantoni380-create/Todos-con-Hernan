/* Asistente flotante de Todos con Hernán.
   Bot de reglas 100% local: sin IA, sin backend, sin API externa.
   No envía mensajes a ningún servidor ni guarda el historial de conversación. */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '41765956318';
  const LANG_STORAGE_KEY = 'todosConHernanLanguage';

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
    if (existing) { existing.addEventListener('load', callback); return; }
    const script = document.createElement('script');
    script.src = 'data/bot-knowledge.js';
    script.addEventListener('load', callback);
    document.head.appendChild(script);
  }

  function getStrings() {
    const bank = window.BOT_KNOWLEDGE || {};
    const lang = localStorage.getItem(LANG_STORAGE_KEY) || 'es';
    /* Los demás idiomas se irán añadiendo en data/bot-knowledge.js;
       mientras tanto se usa siempre el bloque "es" como base. */
    return bank[lang] || bank.es || null;
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
    const strings = getStrings();
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

    function addMessage(text, who) {
      const bubble = document.createElement('div');
      bubble.className = 'chatWidgetMessage ' + who;
      bubble.innerHTML = text;
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
      panel.classList.add('is-open');
      button.setAttribute('aria-expanded', 'true');
      input.focus();
    }

    function closePanel() {
      panel.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
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

      if (category) {
        /* Si saluda y pregunta a la vez, se responde con saludo + tema. */
        respondWithCategory(category, isGreeting && !context.greeted);
        context.greeted = context.greeted || isGreeting;
      } else if (isGreeting) {
        addMessage(context.greeted ? strings.greetingAgain : strings.greeting, 'bot');
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
