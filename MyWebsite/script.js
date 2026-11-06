const year = document.getElementById("year");
if (year) {
    year.textContent = new Date().getFullYear();
}

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.getElementById("primary-navigation");
const menuLabel = menuToggle.querySelector(".sr-only");
const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuLabel.textContent = "Open navigation menu";
    navigation.classList.remove("is-open");
};

menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuLabel.textContent = isExpanded ? "Open navigation menu" : "Close navigation menu";
    navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 930) {
        closeMenu();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...navigation.querySelectorAll('a[href^="#"]')];

const experienceGrid = document.querySelector(".experience-grid");
if (experienceGrid) {
    experienceGrid.addEventListener("wheel", (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
            experienceGrid.scrollWidth <= experienceGrid.clientWidth) {
            return;
        }

        const maxScrollLeft = experienceGrid.scrollWidth - experienceGrid.clientWidth;
        const canScrollHorizontally = event.deltaY > 0
            ? experienceGrid.scrollLeft < maxScrollLeft - 1
            : experienceGrid.scrollLeft > 1;
        if (!canScrollHorizontally) {
            return;
        }

        event.preventDefault();
        experienceGrid.scrollBy({
            left: Math.sign(event.deltaY) * Math.min(Math.abs(event.deltaY), maxScrollLeft),
            behavior: "smooth"
        });
    }, { passive: false });
}

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === `#${entry.target.id}`) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach((section) => sectionObserver.observe(section));
}

if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js").catch((error) => {
            console.error("Offline support could not be enabled.", error);
        });
    });
}
