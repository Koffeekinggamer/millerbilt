/*
 * BOOKING URLS — the only place to set appointment schedules.
 *
 * Replace LANDRUM_BOOKING_URL or CHARLESTON_BOOKING_URL with that
 * showroom's Google Calendar appointment link:
 * https://calendar.google.com/calendar/appointments/schedules/…
 * or a https://calendar.app.google/… booking link.
 *
 * A schedules link is embedded. A calendar.app.google link opens in a
 * new tab and is not embedded.
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
    CHARLESTON_BOOKING_URL: "https://calendar.app.google/rnWxmnkiUnAPbouN6"
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

  function appointmentLink(value, placeholder) {
    if (typeof value !== "string") return null;
    var raw = value.trim();
    if (!raw || raw === placeholder) return null;
    var parsed;
    try {
      parsed = new URL(raw);
    } catch (error) {
      return null;
    }
    if (parsed.protocol !== "https:") return null;
    if (parsed.username || parsed.password) return null;
    if (parsed.hostname === "calendar.app.google") {
      if (!parsed.pathname || parsed.pathname === "/") return null;
      return { href: raw, embed: "" };
    }
    if (parsed.hostname !== "calendar.google.com") return null;
    if (parsed.pathname.indexOf("/appointments/") === -1) return null;
    parsed.searchParams.set("gv", "true");
    var embed = parsed.toString();
    return { href: embed, embed: embed };
  }

  function applySchedule(key) {
    var showroom = showrooms[key];
    var panel = document.querySelector('[data-book-panel="' + key + '"]');
    if (!showroom || !panel) return;
    var fallback = panel.querySelector("[data-book-fallback]");
    var live = panel.querySelector("[data-book-live]");
    var frame = panel.querySelector("iframe");
    var clip = panel.querySelector(".book-clip");
    var open = panel.querySelector("[data-book-open]");
    var link = appointmentLink(showroom.url, showroom.placeholder);
    if (!link) {
      if (fallback) fallback.hidden = false;
      if (live) live.hidden = true;
      if (frame) frame.removeAttribute("src");
      if (open) open.removeAttribute("href");
      if (clip) clip.hidden = true;
      return;
    }
    if (open) {
      open.href = link.href;
      open.target = "_blank";
      open.rel = "noopener noreferrer";
    }
    if (frame) {
      if (link.embed && frame.getAttribute("src") !== link.embed) frame.setAttribute("src", link.embed);
      if (!link.embed) frame.removeAttribute("src");
    }
    if (clip) clip.hidden = !link.embed;
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

  var phoneQuery = window.matchMedia("(max-width: 759px)");
  var heroCopy = document.querySelector(".hero-copy");
  var steps = document.querySelector(".steps");
  var driftHosts = document.querySelectorAll(".series, .note, .visit, .site-footer");
  var panNodes = document.querySelectorAll(
    ".hero-parallax, .plate-open img, .bleed-frame img, .person-frame img, .partner-mark img, .about-mark"
  );
  var progress = null;
  var ticking = false;

  function markReveal(selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "");
    });
  }

  markReveal(".project-head");
  markReveal(".note-body");
  markReveal("#book");
  markReveal(".footer-grid");
  markReveal(".footer-base");

  var tierWrap = document.querySelector(".tiers");
  if (tierWrap) {
    tierWrap.removeAttribute("data-reveal");
    tierWrap.querySelectorAll(".tier").forEach(function (tier) {
      tier.setAttribute("data-reveal", "");
    });
  }

  function stagger(selector, step) {
    document.querySelectorAll(selector).forEach(function (el, index) {
      el.style.setProperty("--d", Math.min(index, 6) * step + "ms");
    });
  }

  stagger(".offer-list > [data-reveal]", 90);
  stagger(".steps > [data-reveal]", 110);
  stagger(".team-grid > [data-reveal]", 80);
  stagger(".partners-list > [data-reveal]", 90);
  stagger(".book-grid > [data-reveal]", 120);
  stagger(".tiers > [data-reveal]", 80);

  function mountDrifts() {
    driftHosts.forEach(function (host) {
      if (host.querySelector(".drift")) return;
      var veil = document.createElement("div");
      var near = document.createElement("span");
      var far = document.createElement("span");
      veil.className = "drift";
      veil.setAttribute("aria-hidden", "true");
      near.className = "drift-a";
      far.className = "drift-b";
      veil.appendChild(near);
      veil.appendChild(far);
      host.insertBefore(veil, host.firstChild);
    });
  }

  function mountProgress() {
    if (progress) return;
    progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.appendChild(document.createElement("span"));
    document.body.appendChild(progress);
  }

  function clearMotionVars() {
    root.style.removeProperty("--scroll-p");
    if (heroCopy) heroCopy.style.removeProperty("--copy-y");
    if (steps) steps.style.removeProperty("--steps-p");
    panNodes.forEach(function (el) {
      el.style.removeProperty("--py");
    });
    driftHosts.forEach(function (host) {
      host.style.removeProperty("--layer-a");
      host.style.removeProperty("--layer-b");
    });
  }

  function maxTravel(el) {
    var phone = phoneQuery.matches;
    var cap = phone ? 12 : desktopQuery.matches ? 34 : 20;
    if (el.classList.contains("hero-parallax")) {
      var frame = el.parentElement;
      var extra = frame ? el.offsetHeight - frame.clientHeight : 0;
      return Math.max(0, Math.min(cap, extra / 2 - 3));
    }
    if (el.classList.contains("about-mark")) return phone ? 6 : 14;
    var scaleRoom = phone ? 0.03 : 0.05;
    return Math.max(0, Math.min(cap, el.clientHeight * scaleRoom));
  }

  function paint() {
    ticking = false;
    if (motionQuery.matches) return;

    var viewH = window.innerHeight || 1;
    var viewW = window.innerWidth || 1;
    var phone = viewW <= 759;
    var speed = phone ? 0.045 : desktopQuery.matches ? 0.11 : 0.07;
    var maxScroll = root.scrollHeight - viewH;
    var reads = [];
    var i;

    for (i = 0; i < panNodes.length; i++) {
      var el = panNodes[i];
      var rect = el.getBoundingClientRect();
      var limit = 0;
      if (rect.height >= 2 && rect.bottom >= -80 && rect.top <= viewH + 80) limit = maxTravel(el);
      reads.push({ rect: rect, limit: limit });
    }

    var hostReads = [];
    for (i = 0; i < driftHosts.length; i++) {
      hostReads.push(driftHosts[i].getBoundingClientRect());
    }

    var heroRect = heroCopy ? heroCopy.getBoundingClientRect() : null;
    var stepRect = steps ? steps.getBoundingClientRect() : null;

    root.style.setProperty("--scroll-p", maxScroll > 0 ? (window.scrollY / maxScroll).toFixed(4) : "0");

    for (i = 0; i < panNodes.length; i++) {
      var node = panNodes[i];
      var box = reads[i].rect;
      if (box.height < 2 || box.bottom < -80 || box.top > viewH + 80) {
        if (node.style.getPropertyValue("--py")) node.style.setProperty("--py", "0px");
        continue;
      }
      var center = box.top + box.height / 2 - viewH / 2;
      var shift = Math.max(-reads[i].limit, Math.min(reads[i].limit, center * speed * -1));
      var next = shift.toFixed(2) + "px";
      if (node.style.getPropertyValue("--py") !== next) node.style.setProperty("--py", next);
    }

    if (heroCopy && heroRect) {
      var copyAmp = phone ? 6 : 16;
      var copyShift = ((heroRect.top + heroRect.height / 2 - viewH / 2) / viewH) * copyAmp;
      heroCopy.style.setProperty("--copy-y", copyShift.toFixed(2) + "px");
    }

    for (i = 0; i < driftHosts.length; i++) {
      var hostBox = hostReads[i];
      if (hostBox.bottom < 0 || hostBox.top > viewH) continue;
      var depth = (hostBox.top + hostBox.height / 2 - viewH / 2) / viewH;
      var layerAmp = phone ? 10 : 26;
      driftHosts[i].style.setProperty("--layer-a", (depth * layerAmp * -1).toFixed(2) + "px");
      driftHosts[i].style.setProperty("--layer-b", (depth * layerAmp * 0.45).toFixed(2) + "px");
    }

    if (steps && stepRect) {
      var amount = (viewH * 0.92 - stepRect.top) / (viewH * 0.5);
      steps.style.setProperty("--steps-p", Math.min(1, Math.max(0, amount)).toFixed(3));
    }
  }

  function requestPaint() {
    if (ticking || motionQuery.matches) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  function syncMode() {
    var reduce = motionQuery.matches;
    root.classList.toggle("reduce-motion", reduce);
    root.classList.add("motion");
    if (reduce) {
      clearMotionVars();
      if (progress) progress.remove();
      progress = null;
      document.querySelectorAll(".drift").forEach(function (veil) {
        veil.remove();
      });
      return;
    }
    mountProgress();
    mountDrifts();
    paint();
  }

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));

  syncMode();

  if ("IntersectionObserver" in window && nodes.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.12 }
    );

    nodes.forEach(function (node) {
      observer.observe(node);
    });

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        nodes.forEach(function (node) {
          var rect = node.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
            node.classList.add("is-in");
          }
        });
      });
    });
  } else {
    nodes.forEach(function (node) {
      node.classList.add("is-in");
    });
  }

  window.addEventListener("scroll", requestPaint, { passive: true });
  window.addEventListener("resize", requestPaint, { passive: true });
  document.querySelectorAll(".see-more").forEach(function (button) {
    button.addEventListener("click", function () {
      window.requestAnimationFrame(requestPaint);
    });
  });

  motionQuery.addEventListener("change", function () {
    if (motionQuery.matches) {
      nodes.forEach(function (node) {
        node.classList.add("is-in");
      });
    }
    syncMode();
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
