// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ===== HERO BACKGROUND SLIDESHOW =====
const heroBgSlides = document.querySelectorAll('.hero-bg-slide');
let heroBgCurrent = 0;

setInterval(() => {
    heroBgSlides[heroBgCurrent].classList.remove('active');
    heroBgCurrent = (heroBgCurrent + 1) % heroBgSlides.length;
    heroBgSlides[heroBgCurrent].classList.add('active');
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

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('statAnos'), 15, '+');
            animateCounter(document.getElementById('statProjetos'), 500, '+');
            statsObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

statsObserver.observe(document.querySelector('.hero-stats'));

// ===== PORTFOLIO CAROUSEL =====
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselThumbs = document.querySelectorAll('.carousel-thumb');
const carouselCurrentEl = document.getElementById('carouselCurrent');
const progressBar = document.getElementById('carouselProgress');
let carouselIndex = 0;
let carouselTimer;
const CAROUSEL_INTERVAL = 6000;

function updateCarousel(index) {
    carouselSlides.forEach(s => s.classList.remove('active'));
    carouselThumbs.forEach(t => t.classList.remove('active'));

    carouselSlides[index].classList.add('active');
    carouselThumbs[index].classList.add('active');
    carouselCurrentEl.textContent = String(index + 1).padStart(2, '0');

    // Scroll thumb into view
    const thumbsContainer = document.getElementById('carouselThumbs');
    const activeThumb = carouselThumbs[index];
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.offsetWidth;
    const containerWidth = thumbsContainer.offsetWidth;
    const scrollLeft = thumbLeft - (containerWidth / 2) + (thumbWidth / 2);
    thumbsContainer.scrollTo({ left: scrollLeft, behavior: 'smooth' });

    // Reset progress bar
    progressBar.style.animation = 'none';
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
    const prev = (carouselIndex - 1 + carouselSlides.length) % carouselSlides.length;
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
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') carouselNext();
    if (e.key === 'ArrowLeft') carouselPrev();
    if (e.key === 'Escape') closeLightbox();
});

// Touch/swipe support
let touchStartX = 0;
const carouselMain = document.querySelector('.carousel-main');

carouselMain.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carouselMain.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
        diff > 0 ? carouselNext() : carouselPrev();
    }
}, { passive: true });

// ===== LIGHTBOX =====
let lightboxIndex = 0;
const lightboxImages = [];

carouselSlides.forEach((slide, i) => {
    const img = slide.querySelector('img');
    lightboxImages.push(img.src);
});

// Click on carousel to open lightbox
carouselMain.addEventListener('click', (e) => {
    if (e.target.closest('.carousel-arrow') || e.target.closest('.carousel-counter')) return;
    lightboxIndex = carouselIndex;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
});

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxPrev(e) {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
}

function lightboxNext(e) {
    e.stopPropagation();
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    document.getElementById('lightboxImg').src = lightboxImages[lightboxIndex];
}

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// ===== FORM -> WHATSAPP =====
function enviarWhatsApp(e) {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const servico = document.getElementById('servico').value;
    const mensagem = document.getElementById('mensagem').value;

    let texto = `Ola! Vim pelo site da JS Esquadrias.%0A%0A`;
    texto += `*Nome:* ${nome}%0A`;
    texto += `*Telefone:* ${telefone}%0A`;
    if (email) texto += `*E-mail:* ${email}%0A`;
    texto += `*Servico:* ${servico}%0A`;
    if (mensagem) texto += `*Mensagem:* ${mensagem}%0A`;

    window.open(`https://wa.me/5511961179315?text=${texto}`, '_blank');
}

// ===== PHONE MASK =====
document.getElementById('telefone').addEventListener('input', function(e) {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) {
        v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        v = `(${v}`;
    }
    e.target.value = v;
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const pos = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        }
    });
});
