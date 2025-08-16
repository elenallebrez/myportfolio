const revealElements = document.querySelectorAll(".reveal");

function checkReveal() {
  const triggerBottom = window.innerHeight * 0.85; // Punto de activación (85% de la pantalla)

  revealElements.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;

    if (boxTop < triggerBottom) {
      el.classList.add("show"); // Añade clase visible
    } else {
      el.classList.remove("show"); // Quita clase (si quieres que desaparezca al volver arriba)
    }
  });
}

window.addEventListener("scroll", checkReveal);
checkReveal();

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
  if (window.scrollY > 400) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
});

// Acción del botón → scroll suave al top
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
