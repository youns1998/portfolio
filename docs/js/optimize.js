// Optimized single‑page scroll & navigation script
// - Keeps smooth transitions & section activation
// - Removes duplicated logic, throttles heavy events
// - Works with sections that have the class "section" and buttons/nav elements that
//   reference them via [data-target="sectionId"]

(function () {
  /* ==================== Helper utilities ==================== */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const throttle = (fn, ms) => {
    let t; return (...args) => { if (!t) { fn(...args); t = setTimeout(() => t = 0, ms); } };
  };

  /* ==================== Cached DOM ==================== */
  const sections = $$(".section");
  const navButtons = $$("nav [data-target]");
  const overlay = document.body.appendChild(Object.assign(document.createElement("div"), { className: "section-transition-overlay" }));

  /* ==================== State ==================== */
  let index = 0, scrolling = false;

  /* ==================== Core actions ==================== */
  const activate = i => {
    if (i < 0 || i >= sections.length || i === index) return;
    index = i; scrolling = true;
    overlay.classList.add("active");

    // flip active / inactive classes & z‑index
    sections.forEach((sec, idx) => {
      sec.classList.toggle("active", idx === i);
      sec.classList.toggle("inactive", idx !== i);
      sec.style.zIndex = idx === i ? 2 : 1;
    });

    sections[i].scrollIntoView({ behavior: "smooth", block: "start" });
    updateUI();
    setTimeout(() => { overlay.classList.remove("active"); scrolling = false; }, 500);
  };

  const updateUI = () => {
    // indicator dots
    $$(".indicator-dot").forEach((dot, idx) => dot.classList.toggle("active", idx === index));
    // nav top / down buttons
    $(".top-button")?.classList.toggle("hidden", index === 0);
    $(".down-button")?.classList.toggle("hidden", index === sections.length - 1);
  };

  /* ==================== Build dynamic UI ==================== */
  (function buildIndicator() {
    const wrap = document.body.appendChild(Object.assign(document.createElement("div"), { className: "section-indicator" }));
    sections.forEach((sec, idx) => {
      const dot = Object.assign(document.createElement("div"), { className: "indicator-dot", dataset: { index: idx } });
      dot.title = sec.dataset.label || sec.id;
      dot.onclick = () => activate(idx);
      wrap.appendChild(dot);
    });
  })();

  (function buildNavButtons() {
    const wrap = document.body.appendChild(Object.assign(document.createElement("div"), { className: "nav-buttons" }));
    const mkBtn = (cls, icon, cb) => {
      const b = Object.assign(document.createElement("button"), { className: cls, innerHTML: icon });
      b.onclick = cb; wrap.appendChild(b); return b;
    };
    mkBtn("top-button hidden", "<i class=\"fas fa-chevron-up\"></i>", () => activate(index - 1));
    mkBtn("down-button", "<i class=\"fas fa-chevron-down\"></i>", () => activate(index + 1));
  })();

  /* ==================== Event wiring ==================== */
  navButtons.forEach(btn => btn.addEventListener("click", () => {
    const target = sections.findIndex(sec => sec.id === btn.dataset.target);
    activate(target);
  }));

  window.addEventListener("wheel", throttle(e => {
    if (scrolling) return;
    activate(index + (e.deltaY > 0 ? 1 : -1));
  }, 300), { passive: true });

  // Update scroll progress bar & reveal animations
  const progressBar = document.body.appendChild(Object.assign(document.createElement("div"), { className: "scroll-progress" }));
  const onScroll = throttle(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progressBar.style.width = `${(scrollY / max) * 100}%`;
    $$(".animate-on-scroll").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < innerHeight * 0.8 && rect.bottom > 0) el.classList.add("visible");
    });
  }, 50);
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mouse move background effect
  document.addEventListener("mousemove", e => {
    document.documentElement.style.setProperty("--mouse-x", `${(e.clientX / innerWidth) * 100}%`);
    document.documentElement.style.setProperty("--mouse-y", `${(e.clientY / innerHeight) * 100}%`);
  });

  /* ==================== Init ==================== */
  const init = () => {
    sections.forEach((sec, idx) => {
      sec.classList.add(idx ? "inactive" : "active");
      sec.style.zIndex = idx ? 1 : 2;
    });
    scrollTo(0, 0); updateUI(); onScroll();
  };
  document.addEventListener("DOMContentLoaded", init);
})();
