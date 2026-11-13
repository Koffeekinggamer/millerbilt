/*
 * BOOKING URLS — the only place to set appointment schedules.
 *
 * Replace LANDRUM_BOOKING_URL or CHARLESTON_BOOKING_URL with that
 * showroom's Google Calendar appointment link:
 * https://calendar.google.com/calendar/appointments/schedules/…
 *
 * Landrum is Michael Holladay (michael@millerbilt.com).
 * Charleston is Lauren Manzin (lauren@millerbilt.com).
 *
 * Leave the placeholder text until the real URL exists.
 * An unfilled showroom asks the visitor to call. It does not embed a calendar.
 */
(function () {
  var BOOKING_URLS = {
    LANDRUM_BOOKING_URL: "LANDRUM_BOOKING_URL",
    CHARLESTON_BOOKING_URL: "CHARLESTON_BOOKING_URL"
  };

  var showrooms = {
    landrum: {
      placeholder: "LANDRUM_BOOKING_URL",
      url: BOOKING_URLS.LANDRUM_BOOKING_URL,
      hash: "#book-landrum"
    },
    charleston: {
      placeholder: "CHARLESTON_BOOKING_URL",
      url: BOOKING_URLS.CHARLESTON_BOOKING_URL,
      hash: "#book-charleston"
    }
  };

  function appointmentUrl(value, placeholder) {
    if (typeof value !== "string") return "";
    var raw = value.trim();
    if (!raw || raw === placeholder) return "";
    var parsed;
    try {
      parsed = new URL(raw);
    } catch (error) {
      return "";
    }
    if (parsed.protocol !== "https:") return "";
    if (parsed.hostname !== "calendar.google.com") return "";
    if (parsed.pathname.indexOf("/appointments/") === -1) return "";
    parsed.searchParams.set("gv", "true");
    return parsed.toString();
  }

  function applySchedule(key) {
    var showroom = showrooms[key];
    var panel = document.querySelector('[data-book-panel="' + key + '"]');
    if (!showroom || !panel) return;
    var fallback = panel.querySelector("[data-book-fallback]");
    var live = panel.querySelector("[data-book-live]");
    var frame = panel.querySelector("iframe");
    var open = panel.querySelector("[data-book-open]");
    var embed = appointmentUrl(showroom.url, showroom.placeholder);
    if (!embed) {
      if (fallback) fallback.hidden = false;
      if (live) live.hidden = true;
      if (frame) frame.removeAttribute("src");
      if (open) open.removeAttribute("href");
      return;
    }
    if (frame && frame.getAttribute("src") !== embed) frame.setAttribute("src", embed);
    if (open) open.href = embed;
    if (fallback) fallback.hidden = true;
    if (live) live.hidden = false;
  }

  function select(key) {
    var showroom = showrooms[key];
    if (!showroom) return;
    var radio = document.querySelector('.book-radio[data-book-select="' + key + '"]');
    if (radio && !radio.checked) radio.checked = true;
    applySchedule(key);
  }

  document.querySelectorAll(".book-radio").forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (!radio.checked) return;
      var key = radio.getAttribute("data-book-select");
      applySchedule(key);
      var showroom = showrooms[key];
      if (showroom && location.hash !== showroom.hash) {
        history.replaceState(null, "", showroom.hash);
      }
    });
  });

  document.querySelectorAll("[data-book]").forEach(function (link) {
    link.addEventListener("click", function () {
      select(link.getAttribute("data-book"));
    });
  });

  window.addEventListener("hashchange", function () {
    if (location.hash === "#book-landrum") select("landrum");
    if (location.hash === "#book-charleston") select("charleston");
  });

  if (location.hash === "#book-landrum") select("landrum");
  if (location.hash === "#book-charleston") select("charleston");
})();

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

(function () {
  var dialog = document.querySelector(".viewer");
  var viewerImg = dialog && dialog.querySelector("img");
  var viewerCap = dialog && dialog.querySelector("figcaption");
  if (!dialog || !viewerImg || typeof dialog.showModal !== "function") return;

  document.querySelectorAll(".plate-open").forEach(function (link) {
    link.addEventListener("click", function (event) {
      var img = link.querySelector("img");
      var figure = link.closest("figure");
      var cap = figure && figure.querySelector("figcaption");
      if (!img) return;
      event.preventDefault();
      viewerImg.src = img.currentSrc || img.src;
      viewerImg.alt = img.alt || "";
      viewerImg.width = img.naturalWidth || img.width;
      viewerImg.height = img.naturalHeight || img.height;
      if (viewerCap) {
        viewerCap.textContent = cap ? cap.textContent.trim() : "";
        viewerCap.hidden = !viewerCap.textContent;
      }
      dialog.showModal();
    });
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) dialog.close();
  });

  var closeBtn = dialog.querySelector(".viewer-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      dialog.close();
    });
  }
})();

(function () {
  document.querySelectorAll(".see-more").forEach(function (button) {
    var project = button.closest(".project");
    if (!project) return;

    button.addEventListener("click", function () {
      var open = project.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.textContent = open ? "See fewer" : "See more";
      if (!open) {
        project.scrollIntoView({ block: "start" });
      }
    });
  });
})();
