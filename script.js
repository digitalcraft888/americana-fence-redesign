/* Americana Iron Works & Fence — interactions */
(function () {
  "use strict";

  /* Year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* Sticky header shadow */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-stuck", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.getElementById("navToggle");
  var drawer = document.getElementById("mobileNav");
  var backdrop = document.createElement("div");
  backdrop.className = "backdrop";
  document.body.appendChild(backdrop);

  function setNav(open) {
    if (!drawer || !toggle) return;
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setNav(!drawer.classList.contains("is-open"));
    });
  }
  backdrop.addEventListener("click", function () { setNav(false); });
  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setNav(false); });
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setNav(false);
  });

  /* Scroll reveal */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el, i) {
      // subtle stagger within a shared parent row
      el.style.transitionDelay = (Math.min(i % 4, 3) * 60) + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Gallery filter */
  var chips = document.querySelectorAll(".gal__filters .chip");
  var tiles = document.querySelectorAll("#masonry .tile");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      var f = chip.getAttribute("data-filter");
      tiles.forEach(function (t) {
        var show = f === "all" || t.getAttribute("data-cat") === f;
        t.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* Quote form (demo — no backend) */
  var form = document.getElementById("quoteForm");
  var ok = document.getElementById("formOk");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (ok) {
        ok.hidden = false;
        ok.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.querySelector('button[type="submit"]').textContent = "Request Received ✓";
      form.querySelector('button[type="submit"]').disabled = true;
    });
  }

  /* Active nav link on scroll (scroll spy) */
  var navLinks = document.querySelectorAll(".nav__link");
  var sections = [];
  navLinks.forEach(function (l) {
    var id = l.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var sec = document.querySelector(id);
      if (sec) sections.push({ link: l, sec: sec });
    }
  });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var match = sections.find(function (s) { return s.sec === en.target; });
        if (match && en.isIntersecting) {
          navLinks.forEach(function (l) { l.style.color = ""; });
          match.link.style.color = "var(--red)";
        }
      });
    }, { threshold: 0.4 });
    sections.forEach(function (s) { spy.observe(s.sec); });
  }
})();
