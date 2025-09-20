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


// ========================
// 4) CAROUSEL (Responsive para múltiples carruseles)
// ========================
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const nextBtn = carousel.querySelector(".next");
    const prevBtn = carousel.querySelector(".prev");

    let currentIndex = 0;
    let slidesToShow = 1;
    let slideWidth = 0;

    function setSlidesToShow() {
      const width = window.innerWidth;

      if (width < 600) {
        slidesToShow = 1; // móvil
      } else if (width < 1024) {
        slidesToShow = 2; // tablet
      } else {
        slidesToShow = 3; // desktop
      }

      slideWidth = track.clientWidth / slidesToShow;

      slides.forEach((slide) => {
        slide.style.minWidth = `${slideWidth}px`;
      });

      updateSlide();
    }

    function updateSlide() {
      track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    nextBtn.addEventListener("click", () => {
      if (currentIndex < slides.length - slidesToShow) {
        currentIndex++;
        updateSlide();
      }
    });

    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlide();
      }
    });

    window.addEventListener("resize", setSlidesToShow);
    setSlidesToShow();
  });
});
