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

const getYouTubeVideoId = (url) => {
    try {
        const parsed = new URL(url);
        const host = parsed.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            return parsed.pathname.slice(1).split('/')[0] || null;
        }

        if (host.includes('youtube.com') || host.includes('youtube-nocookie.com')) {
            if (parsed.pathname.startsWith('/embed/')) {
                return parsed.pathname.split('/embed/')[1]?.split('/')[0]?.split('?')[0] || null;
            }
            if (parsed.pathname === '/watch') {
                return parsed.searchParams.get('v');
            }
            if (parsed.pathname.startsWith('/shorts/')) {
                return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null;
            }
        }
    } catch {
        return null;
    }

    return null;
};

const buildEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return url;

    const params = new URLSearchParams({
        autoplay: '1',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
    });

    if (window.location.origin && window.location.protocol.startsWith('http')) {
        params.set('origin', window.location.origin);
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
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

        this.iframe.src = buildEmbedUrl(videoUrl);
        document.getElementById('videoModalLabel').textContent = title;

        const modal = bootstrap.Modal.getOrCreateInstance(this.modal, {
            backdrop: true,
            keyboard: true,
            focus: false
        });
        modal.show();
    },

    close() {
        const modal = bootstrap.Modal.getInstance(this.modal);
        if (modal) modal.hide();
    },

    restoreScrollPosition() {
        const restoreY = Number.isFinite(this.scrollY) ? this.scrollY : 0;
        const htmlEl = document.documentElement;
        const prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        requestAnimationFrame(() => {
            window.scrollTo(0, restoreY);
            htmlEl.style.scrollBehavior = prevBehavior;
        });
    },

    cleanup() {
        if (this.iframe) this.iframe.src = '';
        this.restoreScrollPosition();
    }
};

// Smooth scrolling for navigation links
const smoothScroll = () => {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#' || href === 'javascript:void(0)') return;
            
            try {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } catch {
                // Ignore invalid selectors safely
            }
        });
    });
};

// Event delegation for video modals
const initVideoTriggers = () => {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.video-trigger, [data-video-url]');
        if (trigger) {
            e.preventDefault();
            const url = trigger.getAttribute('data-video-url');
            const title = trigger.getAttribute('data-video-title') || 'Video';
            if (url) {
                videoModal.open(url, title);
            }
        }
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

// Update copyright year
const updateCopyrightYear = () => {
    const el = document.getElementById('currentYear');
    if (el) {
        el.textContent = new Date().getFullYear();
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    navbarShrink();
    initScrollSpy();

    videoModal.init();
    initVideoTriggers();
    smoothScroll();
    addFadeAnimations();
    updateCopyrightYear();

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

