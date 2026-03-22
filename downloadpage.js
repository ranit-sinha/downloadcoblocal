/* COB LOCAL - DOWNLOAD PAGE JS */

var sliderIndex  = 0;
var sliderTotal  = 0;
var sliderTimer  = null;
var sliderPaused = false;

function initSlider() {
  var track  = document.getElementById("sliderTrack");
  var dotsEl = document.getElementById("sliderDots");
  if (!track || !dotsEl) return;
  var slides = track.querySelectorAll(".slide");
  sliderTotal = slides.length;
  if (sliderTotal === 0) return;

  dotsEl.innerHTML = "";
  for (var i = 0; i < sliderTotal; i++) {
    var dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("data-i", i);
    dot.addEventListener("click", function() { goSlide(+this.getAttribute("data-i")); });
    dotsEl.appendChild(dot);
  }

  /* Touch swipe */
  var tx = 0;
  track.parentElement.addEventListener("touchstart", function(e) { tx = e.touches[0].clientX; sliderPaused = true; }, {passive:true});
  track.parentElement.addEventListener("touchend", function(e) {
    var diff = tx - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? sliderNext() : sliderPrev();
    setTimeout(function(){ sliderPaused = false; }, 3000);
  }, {passive:true});
  track.parentElement.addEventListener("mouseenter", function(){ sliderPaused = true; });
  track.parentElement.addEventListener("mouseleave", function(){ sliderPaused = false; });

  goSlide(0);
  sliderTimer = setInterval(function(){ if (!sliderPaused) sliderNext(); }, 3000);
}

function goSlide(idx) {
  if (idx < 0) idx = sliderTotal - 1;
  if (idx >= sliderTotal) idx = 0;
  sliderIndex = idx;
  document.getElementById("sliderTrack").style.transform = "translateX(-" + (idx * 100) + "%)";
  document.querySelectorAll(".dot").forEach(function(d, i) {
    d.className = "dot" + (i === idx ? " active" : "");
  });
}

function sliderNext() { goSlide(sliderIndex + 1); resetTimer(); }
function sliderPrev() { goSlide(sliderIndex - 1); resetTimer(); }

function resetTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(function(){ if (!sliderPaused) sliderNext(); }, 3000);
}

/* Download button feedback */
function initDownload() {
  var btn = document.getElementById("downloadBtn");
  if (!btn) return;
  btn.addEventListener("click", function() {
    var orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Starting download...';
    setTimeout(function() {
      btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Download started!';
      setTimeout(function() { btn.innerHTML = orig; }, 3000);
    }, 1500);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  initSlider();
  initDownload();
});