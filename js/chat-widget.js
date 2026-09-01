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

  function findCategory(strings, message) {
    const normalized = normalize(message);
    if (!normalized) return null;
    let best = null;
    let bestScore = 0;
    strings.categories.forEach(function (category) {
      let score = 0;
      (category.keywords || []).forEach(function (keyword) {
        if (normalized.indexOf(normalize(keyword)) !== -1) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = category;
      }
    });
    return best;
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

    const chipsMarkup = strings.categories.map(function (category) {
      return '<button type="button" class="chatWidgetChip" data-category="' + category.id + '">' +
        category.icon + ' ' + category.label + '</button>';
    }).join('');

    panel.innerHTML =
      '<div class="chatWidgetHeader">' +
        '<span>' + strings.title + '</span>' +
        '<button type="button" class="chatWidgetClose" aria-label="' + strings.closeLabel + '">&times;</button>' +
      '</div>' +
      '<div class="chatWidgetBody" id="chatWidgetBody">' +
        '<div class="chatWidgetMessage bot">' + strings.welcome + '</div>' +
      '</div>' +
      '<div class="chatWidgetCategories">' + chipsMarkup + '</div>' +
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

    function addMessage(text, who) {
      const bubble = document.createElement('div');
      bubble.className = 'chatWidgetMessage ' + who;
      bubble.innerHTML = text;
      body.appendChild(bubble);
      body.scrollTop = body.scrollHeight;
    }

    function respondWithCategory(category) {
      addMessage(
        categoryAnswer(category) + ' <a href="' + category.href + '">' + strings.linkLabel + '</a>',
        'bot'
      );
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

    panel.querySelectorAll('.chatWidgetChip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        const category = strings.categories.filter(function (item) { return item.id === chip.dataset.category; })[0];
        if (!category) return;
        addMessage(category.icon + ' ' + category.label, 'user');
        respondWithCategory(category);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const message = input.value.trim();
      if (!message) return;
      addMessage(message, 'user');
      input.value = '';
      const category = findCategory(strings, message);
      if (category) respondWithCategory(category);
      else addMessage(strings.fallback, 'bot');
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
