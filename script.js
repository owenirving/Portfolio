document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initFooterYear();
});

function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealElements = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
        revealElements.forEach((element) => element.classList.add("revealed"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -40px 0px",
        },
    );

    revealElements.forEach((element) => observer.observe(element));
}

function initNavbar() {
    const navbar = document.getElementById("navbar");
    const navLinks = document.querySelectorAll(".nav-links a:not(.nav-pill)");
    const sections = document.querySelectorAll("main section[id]");

    if (!navbar) {
        return;
    }

    const onScroll = () => {
        const scrollTop = window.scrollY;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const progress =
            scrollHeight > 0 ? `${(scrollTop / scrollHeight) * 100}%` : "0%";

        document.documentElement.style.setProperty(
            "--scroll-progress",
            progress,
        );
        navbar.classList.toggle("scrolled", scrollTop > 16);

        let currentSection = "";
        sections.forEach((section) => {
            const top = section.offsetTop - 140;
            if (scrollTop >= top) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${currentSection}`,
            );
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

function initMobileMenu() {
    const toggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const overlay = document.getElementById("nav-overlay");

    if (!toggle || !navLinks || !overlay) {
        return;
    }

    const links = navLinks.querySelectorAll("a");

    const closeMenu = () => {
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
        overlay.classList.remove("open");
        document.body.classList.remove("menu-open");
    };

    const openMenu = () => {
        toggle.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
        navLinks.classList.add("open");
        overlay.classList.add("open");
        document.body.classList.add("menu-open");
    };

    toggle.addEventListener("click", () => {
        if (navLinks.classList.contains("open")) {
            closeMenu();
            return;
        }

        openMenu();
    });

    overlay.addEventListener("click", closeMenu);
    links.forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
        if (window.innerWidth > 820) {
            closeMenu();
        }
    });
}

function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const targetSelector = anchor.getAttribute("href");
            const target = document.querySelector(targetSelector);

            if (!target) {
                return;
            }

            event.preventDefault();
            const navOffset = 86;
            const top =
                target.getBoundingClientRect().top + window.scrollY - navOffset;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
}

function initFooterYear() {
    const footerYear = document.getElementById("footer-year");
    if (!footerYear) {
        return;
    }

    footerYear.textContent = new Date().getFullYear();
}
