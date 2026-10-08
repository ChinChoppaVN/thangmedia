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

// 3. Projects Category Filter
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

// 5. Quick Inquiry Form (Connect directly to Zalo / WhatsApp)
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
            alert('Vui lòng nhập tên và số điện thoại / Zalo để chúng tôi hỗ trợ.');
            return;
        }

        const message = `Chào Thắng Media, tôi là ${name} (SĐT: ${phone}). Tôi đang quan tâm đến dịch vụ: ${service}. Nội dung: ${note || 'Tư vấn dự án'}`;
        const zaloUrl = `https://zalo.me/0931503305?text=${encodeURIComponent(message)}`;

        window.open(zaloUrl, '_blank');
    });
};

// 6. Global DOM Ready Init
document.addEventListener('DOMContentLoaded', () => {
    videoModal.init();
    initProjectFilter();
    initScrollReveal();
    initInquiryForm();

    // Event delegation for video cards
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.video-trigger, [data-video-url]');
        if (trigger) {
            e.preventDefault();
            const url = trigger.getAttribute('data-video-url');
            const title = trigger.getAttribute('data-video-title') || 'Dự án';
            if (url) {
                videoModal.open(url, title);
            }
        }
    });

    // Update current year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
