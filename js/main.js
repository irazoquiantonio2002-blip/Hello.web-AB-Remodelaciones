(() => {
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const loader = qs("#loader");
  const navbar = qs("#navbar");
  const hamburger = qs("#hamburger");
  const mobMenu = qs("#mob-menu");
  const marquee = qs("#marquee");
  const year = qs("#year");
  const form = qs("#wa-form");
  const canvas = qs("#hero-canvas");

  const phone = "5219984835867";

  const setNavState = () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 18);
  };

  const closeMenu = () => {
    hamburger?.classList.remove("is-active");
    hamburger?.setAttribute("aria-expanded", "false");
    mobMenu?.classList.remove("open");
    navbar?.classList.remove("menu-open");
  };

  const openMenu = () => {
    hamburger?.classList.add("is-active");
    hamburger?.setAttribute("aria-expanded", "true");
    mobMenu?.classList.add("open");
    navbar?.classList.add("menu-open");
  };

  const initMenu = () => {
    hamburger?.addEventListener("click", () => {
      if (mobMenu?.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    qsa("a", mobMenu).forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  };

  const initReveal = () => {
    const reveals = qsa(".reveal");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

    reveals.forEach((el) => observer.observe(el));
  };

  const initCounters = () => {
    const counters = qsa(".stat-num");
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = Number(el.dataset.count || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 1050;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });

    counters.forEach((counter) => observer.observe(counter));
  };

  const initMarquee = () => {
    if (!marquee) return;
    const items = [
      "Construcción de obra nueva",
      "Remodelaciones y ampliaciones",
      "Albañilería en general",
      "Impermeabilización",
      "Instalaciones eléctricas",
      "Plomería",
      "Pisos y pintura",
      "Herrería",
      "Mantenimiento residencial y comercial"
    ];
    const content = [...items, ...items].map((item) => `<span>${item}</span>`).join("");
    marquee.innerHTML = content;
  };

  const initForm = () => {
    form?.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = qs("#f-name")?.value.trim();
      const interest = qs("#f-interest")?.value;
      const message = qs("#f-msg")?.value.trim();

      if (!name || !message) {
        form.reportValidity();
        return;
      }

      const text = [
        "Hola AB Remodelaciones, quiero cotizar un proyecto.",
        `Nombre: ${name}`,
        `Servicio: ${interest}`,
        `Detalle: ${message}`
      ].join("\n");

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    });
  };

  const initCanvas = () => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let raf = 0;

    const makeParticles = () => {
      const count = Math.min(72, Math.max(34, Math.floor(width / 24)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: 0.12 + Math.random() * 0.28,
        size: 0.7 + Math.random() * 1.9,
        alpha: 0.12 + Math.random() * 0.32
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(110, 211, 93, 0.35)";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y > height + 8) {
          p.y = -8;
          p.x = Math.random() * width;
        }
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;

        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.rect(p.x, p.y, p.size, p.size);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pagehide", () => cancelAnimationFrame(raf), { once: true });
  };

  document.addEventListener("DOMContentLoaded", () => {
    year && (year.textContent = new Date().getFullYear());
    initMenu();
    initReveal();
    initCounters();
    initMarquee();
    initForm();
    initCanvas();
    setNavState();
  });

  window.addEventListener("scroll", setNavState, { passive: true });
  window.addEventListener("load", () => {
    window.setTimeout(() => {
      loader?.classList.add("hidden");
      document.body.classList.remove("is-loading");
    }, 450);
  });
})();
