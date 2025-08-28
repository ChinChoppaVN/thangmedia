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
        this.bindEvents();
    },
    
    bindEvents() {
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.close();
            }
        });
        
        // Handle modal close
        this.modal.addEventListener('hidden.bs.modal', () => {
            this.cleanup();
        });
    },
    
    open(videoUrl, title) {
        // Store scroll position
        this.scrollY = window.scrollY;
        
        // Set modal content
        this.iframe.src = videoUrl;
        document.getElementById('videoModalLabel').textContent = title;
        
        // Show modal
        const modal = new bootstrap.Modal(this.modal);
        modal.show();
        
        // Lock body scroll
        this.lockScroll();
    },
    
    close() {
        const modal = bootstrap.Modal.getInstance(this.modal);
        if (modal) modal.hide();
    },
    
    lockScroll() {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${this.scrollY}px`;
        document.body.style.width = '100%';
    },
    
    unlockScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, this.scrollY);
    },
    
    cleanup() {
        this.iframe.src = '';
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

// Performance monitoring
const performanceMonitor = {
    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }, 0);
            });
        }
    }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize video modal
    videoModal.init();
    
    // Add smooth scrolling
    smoothScroll();
    
    // Add fade animations
    addFadeAnimations();
    
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Bind scroll events with optimization
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

