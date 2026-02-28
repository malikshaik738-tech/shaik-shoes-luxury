/**
 * SHAIK LUXURY — MAIN JS
 * Loader, Cursor, Navbar, Scroll Animations, Stats Counter, Testimonials
 */

// ===== CUSTOM CURSOR =====
const cursorDot = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mouseover', (e) => {
    if (e.target.matches('a, button, [data-hover], .product-card, .size-btn, .filter-btn')) {
        cursorRing.classList.add('hovering');
    }
});
document.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, [data-hover], .product-card, .size-btn, .filter-btn')) {
        cursorRing.classList.remove('hovering');
    }
});

// ===== SCROLL PROGRESS BAR =====
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress-bar';
document.body.appendChild(progressBar);
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.transform = `scaleX(${scrolled})`;
});

// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => { loader.style.display = 'none'; }, 800);
        }
        // Start stats counter after page loads
        initStatsCounter();
    }, 2800);

    // Generate loader particles
    const loaderParticles = document.getElementById('loaderParticles');
    if (loaderParticles) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle loader-particle';
            p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        animation: particleFall ${Math.random() * 3 + 2}s linear ${Math.random() * 2}s infinite;
        opacity: ${Math.random() * 0.6 + 0.2};
      `;
            loaderParticles.appendChild(p);
        }
    }
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = hamburger.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        } else {
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        }
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== REVEAL ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ===== STATS COUNTER =====
function initStatsCounter() {
    document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const duration = 2000;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, 16);
    });
}

// ===== HERO PARTICLES =====
function createHeroParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px; height: ${size}px;
      background: rgba(201, 168, 76, ${Math.random() * 0.5 + 0.1});
      border-radius: 50%;
      animation: particleFall ${Math.random() * 8 + 4}s linear ${Math.random() * 4}s infinite;
    `;
        container.appendChild(p);
    }
}
createHeroParticles();

// ===== SEARCH =====
const searchBtn = document.getElementById('searchBtn');
const searchClose = document.getElementById('searchClose');
const searchOverlay = document.getElementById('searchOverlay');
const searchInput = document.getElementById('searchInput');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        setTimeout(() => searchInput && searchInput.focus(), 300);
    });
}
if (searchClose) {
    searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (searchOverlay) searchOverlay.classList.remove('active');
    }
});

// ===== TESTIMONIALS SLIDER =====
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (!track) return;
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideTimer;

    // Create dots
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `t-dot ${i === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentIndex = index;
        const cardWidth = cards[0].offsetWidth + 30;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
        dotsContainer.querySelectorAll('.t-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        goToSlide((currentIndex + 1) % cards.length);
    }

    autoSlideTimer = setInterval(nextSlide, 4000);

    track.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    track.addEventListener('mouseleave', () => {
        autoSlideTimer = setInterval(nextSlide, 4000);
    });

    // Touch support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(Math.min(currentIndex + 1, cards.length - 1));
            else goToSlide(Math.max(currentIndex - 1, 0));
        }
    });
}
initTestimonialsSlider();

// ===== ABOUT SEQUENCE IMAGE =====
function initAboutSequence() {
    const img = document.getElementById('aboutSequenceImg');
    if (!img) return;
    const frames = 200;
    let current = 50;
    let dir = 1;
    setInterval(() => {
        current += dir;
        if (current >= frames) dir = -1;
        if (current <= 1) dir = 1;
        const frameNum = String(current).padStart(3, '0');
        img.src = `assets/frames/ezgif-frame-${frameNum}.jpg`;
    }, 80);
}
initAboutSequence();

// ===== TILT EFFECT =====
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== TOAST NOTIFICATION =====
function showToast(title, message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✦' : '⚠'}</div>
    <div class="toast-msg">
      <strong>${title}</strong>
      ${message}
    </div>
  `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}
window.showToast = showToast;

// ===== SIZE BUTTONS =====
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
        e.target.closest('.size-grid').querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});

// ===== RIPPLE EFFECT =====
function addRipple(element) {
    element.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-wave';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
}
document.querySelectorAll('.btn-primary, .btn-ghost').forEach(addRipple);

// ===== FILTER BUTTONS =====
const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        window.filterProducts && window.filterProducts(filter);
    });
});

console.log('%cSHAIK LUXURY', 'font-size: 24px; font-weight: bold; color: #C9A84C;');
console.log('%cWhere luxury meets performance.', 'color: #999; font-size: 12px;');
