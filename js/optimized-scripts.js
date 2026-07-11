/* Optimized Scripts for Thắng Media */

// Performance optimization: Use requestAnimationFrame for smooth animations
const optimizedScroll = () => {
    let ticking = false;
    
    return () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbarShrink();
                ticking = false;
            });
            ticking = true;
        }
    };
};

// Enhanced navbar functionality
const navbarShrink = () => {
    const navbar = document.querySelector('#mainNav');
    if (!navbar) return;
    
    if (window.scrollY === 0) {
        navbar.classList.remove('navbar-shrink');
    } else {
        navbar.classList.add('navbar-shrink');
    }
};

// Lazy loading for images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Enhanced video modal with better performance
const videoModal = {
    init() {
        this.modal = document.getElementById('videoModal');
        this.iframe = document.getElementById('videoIframe');
        this.scrollY = 0;
        if (!this.modal || !this.iframe) return;
        this.bindEvents();
    },
    
    bindEvents() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.close();
            }
        });
        
        // Handle modal close
        this.modal.addEventListener('hidden.bs.modal', () => {
            this.cleanup();
        });
    },
    
    open(videoUrl, title) {
        if (!this.modal || !this.iframe) return;
        this.scrollY = window.scrollY || window.pageYOffset || 0;
        
        this.iframe.src = videoUrl;
        document.getElementById('videoModalLabel').textContent = title;
        
        const modal = bootstrap.Modal.getOrCreateInstance(this.modal, {
            backdrop: true,
            keyboard: true,
            focus: false
        });
        modal.show();
        
        this.lockScroll();
    },
    
    close() {
        const modal = bootstrap.Modal.getInstance(this.modal);
        if (modal) modal.hide();
    },
    
    lockScroll() {
        if (!Number.isFinite(this.scrollY)) this.scrollY = 0;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
    },
    
    unlockScroll() {
        const topStr = document.body.style.top || '';
        const parsedTop = parseInt(topStr, 10);
        const restoreY = Number.isFinite(parsedTop) ? Math.abs(parsedTop) : (Number.isFinite(this.scrollY) ? this.scrollY : 0);

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';

        const htmlEl = document.documentElement;
        const prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        window.scrollTo(0, restoreY);
        htmlEl.style.scrollBehavior = prevBehavior || '';
    },
    
    cleanup() {
        if (this.iframe) this.iframe.src = '';
        this.unlockScroll();
    }
};

// Smooth scrolling for navigation links
const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Bootstrap ScrollSpy
const initScrollSpy = () => {
    const mainNav = document.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }
};

// Add fade-in animations
const addFadeAnimations = () => {
    const elements = document.querySelectorAll('.portfolio-box, .software-icon, .btn');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    navbarShrink();
    initScrollSpy();

    videoModal.init();
    smoothScroll();
    addFadeAnimations();

    window.addEventListener('scroll', optimizedScroll());
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Responsive navbar collapse
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinks = document.querySelectorAll('#navbarResponsive .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

// Global function for opening video modal (for backward compatibility)
window.openVideoModal = (videoUrl, title) => {
    videoModal.open(videoUrl, title);
};

