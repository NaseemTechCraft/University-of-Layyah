// DOM Elements
const navbar = document.querySelector('.navbar');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const heroSlides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
const heroContent = document.querySelector('.hero-content');
const contactForm = document.getElementById('contactForm');

// Navigation Toggle for Mobile
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Hero Slider
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    heroSlides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    heroSlides[index].classList.add('active');
    indicators[index].classList.add('active');
    currentSlide = index;

    // Animate hero content children on slide change with a small stagger
    if (heroContent) {
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const children = [
            heroContent.querySelector('.hero-badge'),
            heroContent.querySelector('.hero-title'),
            heroContent.querySelector('.hero-subtitle'),
            heroContent.querySelector('.hero-actions')
        ].filter(Boolean);

        // Clear previous inline animation styles so reflow restarts animation
        children.forEach((el) => {
            el.style.animation = 'none';
            el.style.opacity = '';
            el.style.transform = '';
        });

        if (prefersReduced) {
            // Immediately show elements without animation
            children.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        } else {
            // Apply per-child animation delay and trigger via rAF for smooth timing
            children.forEach((el, i) => {
                const delay = Math.min(i * 120, 600);
                el.style.animation = `heroFadeUp 560ms ease-out ${delay}ms both`;
            });

            // Use rAF to ensure the browser notices the animation changes
            window.requestAnimationFrame(() => {
                children.forEach((el) => {
                    // reflow then set a no-op to allow restart; we already set animation above
                    void el.offsetWidth;
                });
            });
        }
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % heroSlides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
    showSlide(currentSlide);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 7000);
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Indicator Click Events
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        showSlide(index);
        stopSlider();
        startSlider();
    });
});

// Pause slider on hover
document.querySelector('.hero').addEventListener('mouseenter', stopSlider);
document.querySelector('.hero').addEventListener('mouseleave', startSlider);

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopSlider();
        startSlider();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopSlider();
        startSlider();
    }
});

// Initialize slider
showSlide(0);
startSlider();

// Scroll-triggered animations have been DISABLED per user request.
// The IntersectionObserver that added `.fade-in-up` on scroll was removed
// to prevent scroll-triggered entrance animations. Elements are shown
// statically without scroll-based effects.

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Basic validation
    if (!data.name || !data.email || !data.program) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    contactForm.reset();
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 16px 24px;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Stats Counter Animation
function animateCounter(element, target) {
    // If user prefers reduced motion, set final value immediately
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.textContent = target + (element.textContent.includes('+') ? '+' : '');
        return;
    }

    let current = 0;
    const increment = Math.max(1, Math.floor(target / 100));
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
    }, 20);
}

// Scroll-triggered stat counters disabled: counters will not auto-animate on scroll.
// If you want counters to animate on load, we can call `animateCounter` directly,
// but for now they remain static to remove scroll-triggered motion.





// Active Navigation Link Update
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});



// Typing Effect for Hero Title (Optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Uncomment to enable typing effect
// const heroTitle = document.querySelector('.hero-title');
// if (heroTitle) {
//     const originalText = heroTitle.textContent;
//     heroTitle.textContent = '';
//     setTimeout(() => typeWriter(heroTitle, originalText), 1000);
// }