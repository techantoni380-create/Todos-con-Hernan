(function () {
  "use strict";
  var root = document.getElementById("antoni-tech-banner");
  if (!root) return;
  var video = root.querySelector("video"), button = root.querySelector(".atb-motion");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var paused = reduced.matches, visible = false;
  video.muted = true;
  function sync() {
    root.classList.toggle("atb-paused", paused || !visible || document.hidden);
    button.setAttribute("aria-pressed", String(paused));
    var label = paused ? "Reanudar vídeo y carrusel" : "Pausar vídeo y carrusel";
    button.setAttribute("aria-label", label); button.title = label;
    button.firstElementChild.textContent = paused ? "▶" : "Ⅱ";
    if (paused || !visible || document.hidden) video.pause();
    else { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  }
  button.addEventListener("click", function () { paused = !paused; sync(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; sync(); }, {threshold: 0.05}).observe(root);
  } else { visible = true; }
  document.addEventListener("visibilitychange", sync);
  function preference() { paused = reduced.matches; sync(); }
  if (reduced.addEventListener) reduced.addEventListener("change", preference);
  sync();
})();
