// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

// ===== HERO BACKGROUND SLIDESHOW =====
const heroBgSlides = document.querySelectorAll(".hero-bg-slide");
let heroBgCurrent = 0;

setInterval(() => {
  heroBgSlides[heroBgCurrent].classList.remove("active");
  heroBgCurrent = (heroBgCurrent + 1) % heroBgSlides.length;
  heroBgSlides[heroBgCurrent].classList.add("active");
}, 5000);

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, suffix) {
  let current = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 30);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(document.getElementById("statAnos"), 15, "+");
        animateCounter(document.getElementById("statProjetos"), 500, "+");
        statsObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 },
);

statsObserver.observe(document.querySelector(".hero-stats"));

// ===== PORTFOLIO CAROUSEL =====
const carouselSlides = document.querySelectorAll(".carousel-slide");
const carouselThumbs = document.querySelectorAll(".carousel-thumb");
const carouselCurrentEl = document.getElementById("carouselCurrent");
const progressBar = document.getElementById("carouselProgress");
let carouselIndex = 0;
let carouselTimer;
const CAROUSEL_INTERVAL = 6000;

function updateCarousel(index) {
  carouselSlides.forEach((s) => s.classList.remove("active"));
  carouselThumbs.forEach((t) => t.classList.remove("active"));

  carouselSlides[index].classList.add("active");
  carouselThumbs[index].classList.add("active");
  carouselCurrentEl.textContent = String(index + 1).padStart(2, "0");

  // Scroll thumb into view
  const thumbsContainer = document.getElementById("carouselThumbs");
  const activeThumb = carouselThumbs[index];
  const thumbLeft = activeThumb.offsetLeft;
  const thumbWidth = activeThumb.offsetWidth;
  const containerWidth = thumbsContainer.offsetWidth;
  const scrollLeft = thumbLeft - containerWidth / 2 + thumbWidth / 2;
  thumbsContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });

  // Reset progress bar
  progressBar.style.animation = "none";
  progressBar.offsetHeight; // reflow
  progressBar.style.animation = `progressFill ${CAROUSEL_INTERVAL}ms linear`;

  carouselIndex = index;
}

function carouselNext() {
  const next = (carouselIndex + 1) % carouselSlides.length;
  updateCarousel(next);
  resetAutoplay();
}

function carouselPrev() {
  const prev =
    (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
  updateCarousel(prev);
  resetAutoplay();
}

function goToSlide(index) {
  updateCarousel(index);
  resetAutoplay();
}

function resetAutoplay() {
  clearInterval(carouselTimer);
  carouselTimer = setInterval(carouselNext, CAROUSEL_INTERVAL);
}

// Start autoplay
carouselTimer = setInterval(carouselNext, CAROUSEL_INTERVAL);

// Init progress bar
progressBar.style.animation = `progressFill ${CAROUSEL_INTERVAL}ms linear`;

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") carouselNext();
  if (e.key === "ArrowLeft") carouselPrev();
  if (e.key === "Escape") closeLightbox();
});

// Touch/swipe support
let touchStartX = 0;
const carouselMain = document.querySelector(".carousel-main");

carouselMain.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

carouselMain.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? carouselNext() : carouselPrev();
    }
  },
  { passive: true },
);

// ===== LIGHTBOX =====
let lightboxIndex = 0;
const lightboxImages = [];

carouselSlides.forEach((slide, i) => {
  const img = slide.querySelector("img");
  lightboxImages.push(img.src);
});

// Click on carousel to open lightbox
carouselMain.addEventListener("click", (e) => {
  if (
    e.target.closest(".carousel-arrow") ||
    e.target.closest(".carousel-counter")
  )
    return;
  lightboxIndex = carouselIndex;
  document.getElementById("lightboxImg").src = lightboxImages[lightboxIndex];
  document.getElementById("lightbox").classList.add("active");
  document.body.style.overflow = "hidden";
});

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.body.style.overflow = "";
}

function lightboxPrev(e) {
  e.stopPropagation();
  lightboxIndex =
    (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  document.getElementById("lightboxImg").src = lightboxImages[lightboxIndex];
}

function lightboxNext(e) {
  e.stopPropagation();
  lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
  document.getElementById("lightboxImg").src = lightboxImages[lightboxIndex];
}

document.getElementById("lightbox").addEventListener("click", (e) => {
  if (e.target === document.getElementById("lightbox")) closeLightbox();
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 },
);

reveals.forEach((el) => revealObserver.observe(el));

// ===== FORM -> WHATSAPP =====
function enviarWhatsApp(e) {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const servico = document.getElementById("servico").value;
  const mensagem = document.getElementById("mensagem").value;

  let texto = `Olá! Vim pelo site da JS Esquadrias.%0A%0A`;
  texto += `*Nome:* ${nome}%0A`;
  texto += `*Telefone:* ${telefone}%0A`;
  if (email) texto += `*E-mail:* ${email}%0A`;
  texto += `*Servico:* ${servico}%0A`;
  if (mensagem) texto += `*Mensagem:* ${mensagem}%0A`;

  window.open(`https://wa.me/5511961179315?text=${texto}`, "_blank");
}

// ===== PHONE MASK =====
document.getElementById("telefone").addEventListener("input", function (e) {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 6) {
    v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  } else if (v.length > 2) {
    v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  e.target.value = v;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const pos = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  });
});

// ===== DARK MODE TOGGLE =====
const darkModeToggle = document.getElementById("darkModeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

// Load preference from localStorage
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "enabled" || (savedMode === null && prefersDark.matches)) {
  document.body.classList.add("dark-mode");
  if (darkModeToggle) darkModeToggle.innerHTML = "☀️";
}

// Toggle button handler
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    darkModeToggle.innerHTML = isDark ? "☀️" : "🌙";
  });
}

// ===== STAGGER ANIMATIONS =====
// Apply stagger animation to service cards
const servicoCards = document.querySelectorAll(".servico-card");
servicoCards.forEach((card, index) => {
  card.classList.add("stagger-item");
  card.style.animationDelay = `${index * 0.1}s`;
});

// Apply stagger animation to differential cards
const diferencialCards = document.querySelectorAll(".diferencial-card");
diferencialCards.forEach((card, index) => {
  card.classList.add("stagger-item");
  card.style.animationDelay = `${index * 0.1}s`;
});

// Parallax effect on scroll
window.addEventListener("scroll", () => {
  const parallaxElements = document.querySelectorAll(".parallax-bg");
  parallaxElements.forEach((el) => {
    const scrollPos = window.scrollY;
    const yPos = scrollPos * 0.5;
    el.style.backgroundPosition = `center ${yPos}px`;
  });
});

// ===== ABSURD EFFECTS & ANIMATIONS =====

// 1. Typing Effect Logic
const typingTextElement = document.getElementById("typingEffect");
const wordsToType = ["Qualidade", "Elegância", "Segurança", "Modernidade"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriterEffect() {
  if (!typingTextElement) return;

  const currentWord = wordsToType[wordIndex];

  if (isDeleting) {
    typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % wordsToType.length;
    typeSpeed = 500;
  }

  setTimeout(typeWriterEffect, typeSpeed);
}

// Start typing
if (typingTextElement) typeWriterEffect();

// 3. Scroll Progress Bar
window.addEventListener("scroll", () => {
  const bar = document.getElementById("scrollProgress");
  if (bar) {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    bar.style.width = `${progress}%`;
  }
});

// 4. 3D Tilt Effect for Cards
const tiltCards = document.querySelectorAll(".servico-card, .diferencial-card");

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.zIndex = "10";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
    card.style.zIndex = "1";
  });
});

// 5. Hero Particles Canvas
const pCanvas = document.getElementById("particles-canvas");
if (pCanvas) {
  const ctx = pCanvas.getContext("2d");
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;

  let particlesArray = [];
  const numberOfParticles = 80;

  class Particle {
    constructor() {
      this.x = Math.random() * pCanvas.width;
      this.y = Math.random() * pCanvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 1 - 0.5;
      this.color = `rgba(212, 168, 67, ${Math.random() * 0.4 + 0.1})`; // Gold with varying opacity
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > pCanvas.width || this.x < 0) this.speedX = -this.speedX;
      if (this.y > pCanvas.height || this.y < 0) this.speedY = -this.speedY;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particlesArray = [];
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }

    // Connect particles with lines if close enough
    connectParticles();

    requestAnimationFrame(animateParticles);
  }

  function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
      for (let b = a; b < particlesArray.length; b++) {
        let dx = particlesArray[a].x - particlesArray[b].x;
        let dy = particlesArray[a].y - particlesArray[b].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(212, 168, 67, ${0.1 - distance / 1000})`; // Fade line
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
          ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  initParticles();
  animateParticles();

  window.addEventListener("resize", () => {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    initParticles();
  });
}

// ===== CHROMA KEY VIDEO EFFECT (MILAGRE DO DEUS EX MACHINA) =====
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("sourceVideo");
  const canvas = document.getElementById("videoCanvas");

  if (video && canvas) {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // Resize function
    function resizeCanvas() {
      if (video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    if (video.readyState >= 1) {
      resizeCanvas();
    }
    video.addEventListener("loadedmetadata", resizeCanvas);

    // Flag para evitar erros repetitivos de CORS em file:// local
    let isCorsError = false;
    let hasHitThisLoop = false; // Flag para controlar o impacto único no loop atual
    let functionTriggerCount = 0; // Contador de quantas vezes o evento ocorreu
    const HIT_TIME_START = 6.0;
    const HIT_TIME_END = 6.8;

    // Função de resize automática
    function ensureCanvasSize() {
      if (
        video.videoWidth &&
        (canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight)
      ) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    // Tentar forçar o play, caso o autoplay tenha falhado
    video.play().catch((e) => console.log("Autoplay blocked:", e));

    // Função de processamento frame a frame
    function chromaKey() {
      if (video.paused || video.ended) {
        // Se pausado, tentar dar play novamente (loop de persistência)
        if (!isCorsError) {
          video.play().catch(() => {});
        }
        requestAnimationFrame(chromaKey);
        return;
      }

      // Lógica de Impacto
      const time = video.currentTime;
      const btn = document.querySelector(".video-target");
      const promoCard = document.querySelector(".promo-card");

      // Reseta a flag se o vídeo voltar ao início (loop)
      if (time < 1.0) {
        hasHitThisLoop = false;
      }

      // Se estiver no momento exato (entre ~6.0s e 6.8s) e ainda não executou neste loop
      if (time >= HIT_TIME_START && time < HIT_TIME_END && !hasHitThisLoop) {
        hasHitThisLoop = true;
        functionTriggerCount++;

        // Primeiro impacto: MOSTRAR o card
        if (functionTriggerCount === 1) {
          if (promoCard) {
            promoCard.classList.add("visible");
          }
        } else {
          // Próximos impactos: TREMER o card E PULSAR o botão
          if (promoCard) {
            promoCard.classList.remove("shake");
            void promoCard.offsetWidth;
            promoCard.classList.add("shake");
          }
          // Ativar pulso do botão NAS PRÓXIMAS VEZES
          if (btn) {
            btn.classList.add("hit-effect");
          }
        }
      }

      // Garantir resolução correta a cada frame se necessário (segurança)
      ensureCanvasSize();

      // Desenhar o frame atual no canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Se já detectamos erro de segurança (CORS/file://), apenas desenhamos e usamos o fallback CSS
      if (isCorsError) {
        requestAnimationFrame(chromaKey);
        return;
      }

      // Tentar pegar os dados dos pixels
      let frame;
      try {
        if (canvas.width === 0 || canvas.height === 0) return;
        frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // Se falhar (CORS/file://), não podemos manipular pixels.
        // O vídeo será exibido com fundo branco original, mas visível.
        console.warn(
          "CORS Error: Não é possível remover fundo rodando localmente (file://). Use um servidor local.",
        );
        isCorsError = true;

        // Ativar fallback para não sumir o boneco
        // canvas.style.mixBlendMode = "multiply";

        requestAnimationFrame(chromaKey);
        return;
      }

      const l = frame.data.length;
      const data = frame.data;

      // Loop por cada pixel (R, G, B, A)
      for (let i = 0; i < l; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Sonhamos com fundo transparente, mas não queremos que desapareça em telas claras
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const saturation = max - min;

        // Só remover pixels quase brancos (luminância alta + baixa saturação)
        if (luminance > 245 && saturation < 20) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(frame, 0, 0);
      requestAnimationFrame(chromaKey);
    }

    video.addEventListener("play", () => {
      chromaKey();
    });

    if (!video.paused) {
      chromaKey();
    }
  }
});
