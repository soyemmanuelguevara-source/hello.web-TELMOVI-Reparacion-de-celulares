(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  document.body.classList.add("is-loading");

  window.addEventListener("load", () => {
    window.setTimeout(() => {
      $("#loader")?.classList.add("hide");
      document.body.classList.remove("is-loading");
    }, 520);
  });

  const navbar = $("#navbar");
  const hamburger = $("#hamburger");

  function setNavbarState() {
    navbar?.classList.toggle("scrolled", window.scrollY > 20);
  }

  setNavbarState();
  window.addEventListener("scroll", setNavbarState, { passive: true });

  hamburger?.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("menu-open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  $$("#mob-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar?.classList.remove("menu-open");
      hamburger?.setAttribute("aria-expanded", "false");
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  const services = [
    "Reparación de celulares mojados",
    "Cambio de pantallas",
    "Centros de carga",
    "Software y desbloqueos",
    "Gestión PayJoy / iCloud",
    "Chips",
    "Micas",
    "Fundas personalizadas",
    "Cargadores y accesorios"
  ];

  const marquee = $("#marquee");
  if (marquee) {
    marquee.innerHTML = services.concat(services).map((item) => `<span>${item}</span>`).join("");
  }

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      $$(".stat-num", entry.target).forEach((el) => {
        const target = Number(el.dataset.count || 0);
        const suffix = el.dataset.suffix || "";
        const prefix = el.dataset.prefix || "";
        const duration = 1100;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          el.textContent = `${prefix}${value.toLocaleString("es-MX")}${suffix}`;

          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      });

      statObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  const statsGrid = $(".stats-grid");
  if (statsGrid) statObserver.observe(statsGrid);

  const form = $("#wa-form");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = $("#f-name")?.value.trim();
    const interest = $("#f-interest")?.value.trim();
    const message = $("#f-msg")?.value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola TELMOVI, quiero cotizar una reparación.",
      `Nombre: ${name}`,
      `Necesito: ${interest}`,
      `Detalle: ${message}`
    ].join("\n");

    window.open(`https://wa.me/524792048527?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  const canvas = $("#hero-canvas");
  const ctx = canvas?.getContext("2d");

  if (canvas && ctx) {
    const particles = [];
    const colors = ["rgba(94,189,140,.72)", "rgba(29,117,232,.58)", "rgba(157,218,22,.56)"];

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles.length = 0;
      const count = Math.max(38, Math.floor(rect.width / 30));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.8 + 0.7,
          color: colors[i % colors.length]
        });
      }
    }

    function draw() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = p.x - other.x;
          const dy = p.y - other.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 130) {
            ctx.strokeStyle = `rgba(94, 189, 140, ${0.12 * (1 - distance / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
  }

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
