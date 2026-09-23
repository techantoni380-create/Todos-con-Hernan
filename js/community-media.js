/* Render de las temporadas de podcast de comunidad.html.
   - Tarjetas con miniatura oficial de YouTube (sin descargar imágenes).
   - Un único reproductor a la vez, dentro de la página, sin autoplay.
   - Protección automática contra duplicados por ID real de la playlist. */

(function () {
  "use strict";

  var content = window.COMMUNITY_CONTENT;
  if (!content) return;

  var EMBED_BASE = "https://www.youtube-nocookie.com/embed/";
  var PLACEHOLDER_THUMB_WIDTH = 121;

  var renderedPodcastIds = new Set();

  function thumbnailUrl(id, quality) {
    return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/" + quality + ".jpg";
  }

  function buildCard(item, options) {
    var card = document.createElement("article");
    card.className = "videoCard";

    var thumbButton = document.createElement("button");
    thumbButton.type = "button";
    thumbButton.className = "videoThumbnail";
    thumbButton.setAttribute("aria-label", options.actionLabel + ": " + item.title);

    var img = document.createElement("img");
    img.src = thumbnailUrl(item.id, "maxresdefault");
    img.alt = item.title;
    img.loading = "lazy";
    img.decoding = "async";

    // YouTube devuelve un placeholder de 120px cuando el vídeo no tiene maxresdefault.
    function useFallbackThumbnail() {
      img.removeEventListener("error", useFallbackThumbnail);
      img.removeEventListener("load", checkThumbnail);
      img.src = thumbnailUrl(item.id, "hqdefault");
    }

    function checkThumbnail() {
      if (img.naturalWidth <= PLACEHOLDER_THUMB_WIDTH) useFallbackThumbnail();
      else img.removeEventListener("load", checkThumbnail);
    }

    img.addEventListener("error", useFallbackThumbnail);
    img.addEventListener("load", checkThumbnail);

    var overlay = document.createElement("div");
    overlay.className = "videoOverlay";
    var play = document.createElement("div");
    play.className = "smallPlay";
    play.textContent = "▶";
    overlay.appendChild(play);

    thumbButton.appendChild(img);
    thumbButton.appendChild(overlay);

    var info = document.createElement("div");
    info.className = "videoInfo";

    var category = document.createElement("div");
    category.className = "videoCategory";
    category.textContent = item.category || options.defaultCategory;

    var title = document.createElement("h3");
    title.textContent = item.title;

    var actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "btn outline";
    actionButton.textContent = options.buttonLabel;

    info.appendChild(category);
    info.appendChild(title);
    info.appendChild(actionButton);

    card.appendChild(thumbButton);
    card.appendChild(info);

    function open() {
      openPlayer(options.embedUrl(item), item.title);
    }

    thumbButton.addEventListener("click", open);
    actionButton.addEventListener("click", open);

    return card;
  }

  function renderPodcasts(gridId, items) {
    var grid = document.getElementById(gridId);
    if (!grid || !Array.isArray(items)) return;

    items.forEach(function (item, index) {
      if (!item || !item.id) return;
      var uniqueId = item.playlistId ? "playlist:" + item.playlistId : "video:" + item.id;
      if (renderedPodcastIds.has(uniqueId)) return;
      renderedPodcastIds.add(uniqueId);

      var card = buildCard(item, {
        defaultCategory: "PODCAST",
        actionLabel: "Reproducir podcast",
        buttonLabel: "ESCUCHAR PODCAST →",
        embedUrl: function (podcast) {
          var src = EMBED_BASE + encodeURIComponent(podcast.id);
          var params = [];
          if (podcast.playlistId) params.push("list=" + encodeURIComponent(podcast.playlistId));
          if (podcast.start) params.push("start=" + encodeURIComponent(podcast.start));
          params.push("rel=0", "modestbranding=1");
          if (/^https?:$/.test(window.location.protocol)) {
            params.push("origin=" + encodeURIComponent(window.location.origin));
          }
          return src + "?" + params.join("&");
        }
      });
      grid.appendChild(card);

      // Carga el título oficial; el nombre numerado permanece como respaldo.
      fetch("https://www.youtube.com/oembed?url=" +
        encodeURIComponent("https://www.youtube.com/watch?v=" + item.id) + "&format=json")
        .then(function (response) { return response.ok ? response.json() : null; })
        .then(function (data) {
          if (!data || !data.title) return;
          item.title = data.title;
          var heading = card.querySelector(".videoInfo h3");
          var image = card.querySelector("img");
          var thumb = card.querySelector(".videoThumbnail");
          if (heading) heading.textContent = data.title;
          if (image) image.alt = data.title;
          if (thumb) thumb.setAttribute("aria-label", "Reproducir podcast: " + data.title);
        })
        .catch(function () { /* Conservar título de respaldo si oEmbed no responde. */ });
    });
  }

  /* ===================================================
     Reproductor único dentro de la página
     =================================================== */

  var modal = document.getElementById("communityPlayerModal");
  var frame = document.getElementById("communityPlayerFrame");
  var modalTitle = document.getElementById("communityPlayerTitle");
  var closeBtn = document.getElementById("communityPlayerClose");
  var lastTrigger = null;

  function openPlayer(src, title) {
    if (!modal || !frame) return;
    lastTrigger = document.activeElement;
    if (modalTitle) modalTitle.textContent = title;
    frame.title = title;
    frame.setAttribute("aria-label", title);
    frame.src = src;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("community-modal-open");
    if (closeBtn) closeBtn.focus();
  }

  function closePlayer() {
    if (!modal || !frame) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("community-modal-open");
    frame.src = "";
    if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  }

  if (closeBtn) closeBtn.addEventListener("click", closePlayer);

  if (modal) {
    modal.addEventListener("click", function (event) {
      if (event.target === modal) closePlayer();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal && modal.classList.contains("is-open")) closePlayer();
  });

  renderPodcasts("communityPodcastsGrid", content.podcasts);
})();
