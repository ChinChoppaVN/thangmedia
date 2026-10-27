/* ==========================================================================
   Thắng Media - Modern Minimalist Scripts
   Video Modal • Filterable Projects • Smooth Interactions
   ========================================================================== */

// 1. YouTube Embed URL Builder
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

// 2. Video Modal Manager
const videoModal = {
    init() {
        this.modal = document.getElementById('videoModal');
        this.iframe = document.getElementById('videoIframe');
        this.scrollY = 0;
        if (!this.modal || !this.iframe) return;
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.close();
            }
        });

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.cleanup();
        });
    },

    open(videoUrl, title) {
        if (!this.modal || !this.iframe) return;
        this.scrollY = window.scrollY || window.pageYOffset || 0;

        this.iframe.src = buildEmbedUrl(videoUrl);
        const labelEl = document.getElementById('videoModalLabel');
        if (labelEl) labelEl.textContent = title;

        const modalInstance = bootstrap.Modal.getOrCreateInstance(this.modal, {
            backdrop: true,
            keyboard: true,
            focus: false
        });
        modalInstance.show();
    },

    close() {
        const modalInstance = bootstrap.Modal.getInstance(this.modal);
        if (modalInstance) modalInstance.hide();
    },

    cleanup() {
        if (this.iframe) this.iframe.src = '';
        const restoreY = Number.isFinite(this.scrollY) ? this.scrollY : 0;
        const htmlEl = document.documentElement;
        const prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        requestAnimationFrame(() => {
            window.scrollTo(0, restoreY);
            htmlEl.style.scrollBehavior = prevBehavior;
        });
    }
};

// 3. Flipbook Modal Manager
const flipbookModal = {
    init() {
        this.modal = document.getElementById('flipbookModal');
        this.iframe = document.getElementById('flipbookIframe');
        this.scrollY = 0;
        if (!this.modal || !this.iframe) return;
        this.bindEvents();
    },

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal && this.modal.classList.contains('show')) {
                this.close();
            }
        });

        this.modal.addEventListener('hidden.bs.modal', () => {
            this.cleanup();
        });
    },

    open(flipbookUrl, title) {
        if (!this.modal || !this.iframe) return;
        this.scrollY = window.scrollY || window.pageYOffset || 0;

        this.iframe.src = flipbookUrl;
        const labelEl = document.getElementById('flipbookModalLabel');
        if (labelEl) labelEl.textContent = title;

        const directLinkEl = document.getElementById('flipbookDirectLink');
        if (directLinkEl) directLinkEl.href = flipbookUrl;

        const modalInstance = bootstrap.Modal.getOrCreateInstance(this.modal, {
            backdrop: true,
            keyboard: true,
            focus: false
        });
        modalInstance.show();
    },

    close() {
        const modalInstance = bootstrap.Modal.getInstance(this.modal);
        if (modalInstance) modalInstance.hide();
    },

    cleanup() {
        if (this.iframe) this.iframe.src = '';
        const restoreY = Number.isFinite(this.scrollY) ? this.scrollY : 0;
        const htmlEl = document.documentElement;
        const prevBehavior = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        requestAnimationFrame(() => {
            window.scrollTo(0, restoreY);
            htmlEl.style.scrollBehavior = prevBehavior;
        });
    }
};

// 4. Projects Category Filter
const initProjectFilter = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue || category?.includes(filterValue)) {
                    card.style.display = 'flex';
                    requestAnimationFrame(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
};

// 4. Smooth Scroll Reveal Animation
const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
};

// 5. Quick Inquiry Form (Connect directly to Zalo)
const initInquiryForm = () => {
    const form = document.getElementById('quickInquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName')?.value.trim();
        const phone = document.getElementById('clientPhone')?.value.trim();
        const service = document.getElementById('clientService')?.value;
        const note = document.getElementById('clientNote')?.value.trim();

        if (!name || !phone) {
            alert('Vui lòng nhập tên và số điện thoại / Zalo để tôi tiện liên hệ trao đổi.');
            return;
        }

        const message = `Chào Thắng, tôi là ${name} (SĐT: ${phone}). Tôi muốn trao đổi về: ${service}. Nội dung: ${note || 'Tư vấn dự án'}`;
        const zaloUrl = `https://zalo.me/0931503305?text=${encodeURIComponent(message)}`;

        window.open(zaloUrl, '_blank');
    });
};

// 6. Active Nav Link Scroll Spy
const initScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link-item');
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 140;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }, { passive: true });
};

// 8. Global DOM Ready Init
document.addEventListener('DOMContentLoaded', () => {
    videoModal.init();
    flipbookModal.init();
    initProjectFilter();
    initScrollReveal();
    initInquiryForm();
    initScrollSpy();

    // Event delegation for video and flipbook triggers
    document.addEventListener('click', (e) => {
        const videoTrigger = e.target.closest('.video-trigger, [data-video-url]');
        if (videoTrigger) {
            e.preventDefault();
            const url = videoTrigger.getAttribute('data-video-url');
            const title = videoTrigger.getAttribute('data-video-title') || 'Dự án';
            if (url) {
                videoModal.open(url, title);
            }
            return;
        }

        const flipbookTrigger = e.target.closest('.flipbook-trigger, [data-flipbook-url]');
        if (flipbookTrigger) {
            e.preventDefault();
            const url = flipbookTrigger.getAttribute('data-flipbook-url');
            const title = flipbookTrigger.getAttribute('data-flipbook-title') || 'Tạp chí';
            if (url) {
                flipbookModal.open(url, title);
            }
        }
    });

    // Update current year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
