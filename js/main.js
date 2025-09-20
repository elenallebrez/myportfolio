// ========================
// 1) REVEAL ANIMATION
// ========================
const revealElements = document.querySelectorAll(".reveal");

function checkReveal() {
  const triggerBottom = window.innerHeight * 0.85; // Punto de activación (85% de la pantalla)

  revealElements.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add("show"); // visible
    } else {
      el.classList.remove("show"); // oculto si vuelves arriba
    }
  });
}

window.addEventListener("scroll", checkReveal);
checkReveal();

// ========================
// 2) NAV ACTIVE LINKS
// ========================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav ul li a");

function setActiveLink() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100; // margen para header sticky
    const sectionHeight = section.clientHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);

// ========================
// 3) BACK TO TOP BUTTON
// ========================
const backToTop = document.createElement("button");
backToTop.innerText = "↑";
document.body.appendChild(backToTop);

// Estilo inline básico (puedes moverlo a CSS)
backToTop.style.position = "fixed";
backToTop.style.bottom = "20px";
backToTop.style.right = "20px";
backToTop.style.padding = "10px 15px";
backToTop.style.fontSize = "18px";
backToTop.style.display = "none";
backToTop.style.borderRadius = "50%";
backToTop.style.cursor = "pointer";
backToTop.style.zIndex = "1000";

window.addEventListener("scroll", () => {
  backToTop.style.display = window.scrollY > 400 ? "block" : "none";
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
