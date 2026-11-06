(function () {
  var root = document.documentElement;
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var desktopQuery = window.matchMedia("(min-width: 1040px)");
  var header = document.querySelector(".site-header");
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".menu-toggle");
  var parallax = document.querySelector("[data-parallax]");

  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (!desktopQuery.matches) setMenu(false);
      });
    });

    document.addEventListener("click", function (event) {
      if (toggle.getAttribute("aria-expanded") !== "true" || desktopQuery.matches) return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });
  }

  function onHeaderScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onHeaderScroll();
  window.addEventListener("scroll", onHeaderScroll, { passive: true });

  function clearParallax() {
    if (parallax) parallax.style.transform = "";
  }

  function enableParallax() {
    if (!parallax) return;

    var ticking = false;

    function paint() {
      ticking = false;
      if (!desktopQuery.matches || motionQuery.matches) {
        clearParallax();
        return;
      }
      var frame = parallax.parentElement;
      if (!frame) return;
      var rect = frame.getBoundingClientRect();
      var viewH = window.innerHeight || 1;
      var progress = (rect.top + rect.height / 2 - viewH / 2) / viewH;
      var shift = Math.max(-36, Math.min(36, progress * -42));
      parallax.style.transform = "translate3d(0, " + shift.toFixed(2) + "px, 0)";
    }

    function requestPaint() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener("scroll", requestPaint, { passive: true });
    window.addEventListener("resize", requestPaint, { passive: true });
  }

  enableParallax();
  desktopQuery.addEventListener("change", function () {
    if (!desktopQuery.matches) clearParallax();
  });

  if (motionQuery.matches || !("IntersectionObserver" in window)) return;

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!nodes.length) return;

  root.classList.add("motion");

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.14 }
  );

  nodes.forEach(function (node) {
    observer.observe(node);
  });

  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      nodes.forEach(function (node) {
        var rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
          node.classList.add("is-in");
        }
      });
    });
  });

  motionQuery.addEventListener("change", function () {
    if (!motionQuery.matches) return;
    root.classList.remove("motion");
    clearParallax();
    nodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  });
})();
