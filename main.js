// Wait until the full DOM is loaded before running scripts
window.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger plugin from GSAP
  gsap.registerPlugin(ScrollTrigger);

  const header = document.querySelector("header");

  // ==========================
  // Mobile Menu Toggle
  // ==========================

  // Toggles mobile nav visibility on hamburger click
  function toggleMobileNav() {
    document.getElementById("mobileMenu").classList.toggle("show");
  }

  // Expose function globally to use in inline HTML
  window.toggleMobileNav = toggleMobileNav;

  // ==========================
  // Theme Switch (green <-> amber)
  // ==========================

  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const themeLabel = themeBtn.querySelector(".theme-label");

  function applyTheme(theme) {
    const amber = theme === "amber";
    if (amber) root.setAttribute("data-theme", "amber");
    else root.removeAttribute("data-theme");
    themeBtn.setAttribute("aria-pressed", String(amber));
    themeLabel.textContent = amber ? "Amber" : "Forest";
    try { localStorage.setItem("drinkins-theme", theme); } catch (e) {}
  }

  // Sync button with the theme set in <head>
  applyTheme(root.getAttribute("data-theme") === "amber" ? "amber" : "green");

  themeBtn.addEventListener("click", () => {
    root.classList.add("theme-transition");
    applyTheme(root.getAttribute("data-theme") === "amber" ? "green" : "amber");
    setTimeout(() => root.classList.remove("theme-transition"), 650);
  });

  // ==========================
  // Initial Page Load Animations
  // ==========================

  function runInitialAnimations() {
    // Create a timeline with default easing
    const onLoadTl = gsap.timeline({ defaults: { ease: "power2.out" } });

    onLoadTl
      // Animate header border width expansion
      .to(
        "header",
        {
          "--border-width": "100%",
          duration: 3,
        },
        0
      )
      // Slide in desktop nav links & sidebar icons from above
      .from(
        ".desktop-nav a, .social-sidebar a",
        {
          y: -100,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      // Animate sidebar border height
      .to(
        ".social-sidebar",
        {
          "--border-height": "100%",
          duration: 10,
        },
        0
      )
      // Fade in hero heading
      .to(
        ".hero-content h1",
        {
          opacity: 1,
          duration: 1,
        },
        0
      )
      // Animate text stroke to solid color
      .to(
        ".hero-content h1",
        {
          delay: 0.5,
          duration: 1.2,
          color: "var(--sienna)",
          "-webkit-text-stroke": "0px var(--sienna)",
          // Hand the final colour back to CSS so the theme switch can recolour it
          onComplete: () => {
            const h1 = document.querySelector(".hero-content h1");
            h1.classList.add("filled");
            h1.style.removeProperty("color");
            h1.style.removeProperty("-webkit-text-stroke");
          },
        },
        0
      )
      // Slide in each line of the heading from the right
      .from(
        ".hero-content .line",
        {
          x: 100,
          delay: 1,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
        },
        0
      )
      // Reveal the bottle wrapper
      .to(
        ".hero-bottle-wrapper",
        {
          opacity: 1,
          scale: 1,
          delay: 1.5,
          duration: 1.3,
          ease: "power3.out",
        },
        0
      )
      // Pop-in stamp image with scaling
      .to(
        ".hero-stamp",
        {
          opacity: 1,
          scale: 1,
          delay: 2,
          duration: 0.2,
          ease: "back.out(3)",
        },
        0
      )
      // Subtle vibration/bounce effect on the stamp
      .to(
        ".hero-stamp",
        {
          y: "+=5",
          x: "-=3",
          repeat: 2,
          yoyo: true,
          duration: 0.05,
          ease: "power1.inOut",
        },
        0
      );
  }

  // ==========================
  // Reusable Scroll-Based Animation Setup
  // ==========================

 
  function pinAndAnimate({
    trigger,
    endTrigger,
    pin,
    animations,
    markers = false,
    headerOffset = 0,
  }) {
    // Define scroll end position with header offset
    const end = `top top+=${headerOffset}`;

    // Create a GSAP timeline connected to ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: `top top+=${headerOffset}`,
        endTrigger,
        end,
        scrub: true,
        pin,
        pinSpacing: false,
        markers: markers, // for debugging
        invalidateOnRefresh: true, // ensures recalculation on resize
      },
    });

    // Loop through each animation object
    animations.forEach(({ target, vars, position = 0 }) => {
      tl.to(target, vars, position);
    });
  }

  // ==========================
  // ScrollTrigger Configurations for Desktop & Mobile
  // ==========================

  function setupScrollAnimations() {
    // Use matchMedia to handle responsive behaviors
    ScrollTrigger.matchMedia({
      // Desktop scroll animations
      "(min-width: 769px)": function () {
        // 1. Bottle animates on scroll from hero to intro
        pinAndAnimate({
          trigger: ".hero",
          endTrigger: ".section-intro",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 0, scale: 0.8 } },
          ],
        });

        // 2. Bottle shifts right during the intro section
        pinAndAnimate({
          trigger: ".section-intro",
          endTrigger: ".timeline-entry:nth-child(even)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: 10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "30%" } },
          ],
          markers: false,
        });

        // 3. Bottle shifts left during the first timeline entry
        pinAndAnimate({
          trigger: ".timeline-entry:nth-child(even)",
          endTrigger: ".timeline-entry:nth-child(odd)",
          pin: ".hero-bottle-wrapper",
          animations: [
            { target: ".hero-bottle", vars: { rotate: -10, scale: 0.7 } },
            { target: ".hero-bottle-wrapper", vars: { x: "-25%" } },
          ],
          markers: false,
        });
      },

      // Mobile fallback animation (no scroll-based logic)
      "(max-width: 768px)": function () {
        gsap.to(".hero-bottle-wrapper", {
          opacity: 1,
          duration: 1,
          delay: 0.5,
        });
      },
    });
  }

  // ==========================
  // Preloader
  // ==========================

  const preloader = document.getElementById("preloader");
  const preCount = document.getElementById("preloaderCount");
  const preFill = document.getElementById("preloaderFill");
  const preLogo = preloader.querySelector(".preloader-logo span");

  // Always start at the top and keep the page locked while loading
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  document.documentElement.classList.add("is-loading");

  // Everything that must be ready before the site is revealed:
  // every <img> in the page, the custom font, and the window "load" event.
  function trackAssets(onProgress) {
    const urls = [...new Set([...document.images].map((img) => img.currentSrc || img.src))];
    // The amber bottle is hidden until the theme switch, so make sure it's ready too
    const tasks = urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = img.onerror = () => resolve();
          img.src = src;
          if (img.complete) resolve();
        })
    );

    tasks.push(
      document.fonts
        ? Promise.all([
            document.fonts.load('1em "Veneer"'),
            document.fonts.ready,
          ]).catch(() => {})
        : Promise.resolve()
    );

    tasks.push(
      new Promise((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", resolve, { once: true });
      })
    );

    let done = 0;
    tasks.forEach((t) =>
      t.then(() => {
        done++;
        onProgress(done / tasks.length);
      })
    );
    return Promise.all(tasks);
  }

  function runPreloader() {
    window.__preloaderStarted = true; // tells the failsafe in index.html that JS is running
    return new Promise((resolve) => {
      const state = { shown: 0 }; // value displayed (0 → 100), eased
      let target = 0;             // real progress (0 → 100)
      let finished = false;

      const render = () => {
        const v = Math.round(state.shown);
        preCount.textContent = v;
        preFill.style.transform = `scaleX(${state.shown / 100})`;
        preLogo.style.setProperty("--fill", state.shown + "%");
      };

      const ease = (to, dur) =>
        gsap.to(state, { shown: to, duration: dur, ease: "power2.out", onUpdate: render, overwrite: true });

      // Creep forward a little so the bar never looks frozen
      ease(8, 1.2);

      const minTime = new Promise((r) => setTimeout(r, 1400)); // avoid a flash on fast loads
      const timeout = new Promise((r) => setTimeout(r, 15000)); // never hang on a broken file

      const assets = trackAssets((p) => {
        target = Math.max(target, p * 100);
        if (!finished) ease(Math.min(target, 99), 0.6);
      });

      Promise.race([Promise.all([assets, minTime]), timeout]).then(() => {
        finished = true;
        // Finish the counter, then play the exit
        gsap.to(state, {
          shown: 100,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: render,
          onComplete: () => {
            const exit = gsap.timeline({ onComplete: resolve });
            exit
              .to(".preloader-inner", { y: -30, opacity: 0, duration: 0.5, ease: "power2.in" }, 0.2)
              .to(preloader, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power3.inOut" }, 0.45);
          },
        });
      });
    });
  }

  // ==========================
  // Init Everything on Load
  // ==========================

  setupScrollAnimations(); // register scroll animations (still locked)

  runPreloader().then(() => {
    preloader.remove();
    document.documentElement.classList.remove("is-loading");
    window.scrollTo(0, 0);
    ScrollTrigger.refresh(); // recalculate with all images/fonts loaded
    runInitialAnimations();  // hero intro plays right as the preloader leaves
  });
});