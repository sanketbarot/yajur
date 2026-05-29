/* ============================================
   NANDIINDIA - MAIN APPLICATION JS
   Blue & White Light Theme
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => preloader.classList.add('loaded'), 400);
        });
        // Fallback
        setTimeout(() => preloader.classList.add('loaded'), 2000);
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        const backToTop = document.getElementById('backToTop');
        if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);

        updateActiveNavLink();
    });

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ===== COUNTER ANIMATION (runs once on load) =====
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            if (counter.dataset.animated) return;
            
            const target = parseInt(counter.dataset.target);
            const duration = 1800;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                    counter.dataset.animated = 'true';
                }
            };
            updateCounter();
        });
    }

    // Run counters shortly after load
    setTimeout(animateCounters, 600);

    // ===== NO SCROLL ANIMATIONS — just ensure visibility =====
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(faq => faq.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ===== TESTIMONIAL SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('tcPrev');
    const nextBtn = document.getElementById('tcNext');
    const dotsContainer = document.getElementById('tcDots');

    if (track) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        let slidesPerView = 3;
        let autoSlideInterval;

        function updateSlidesPerView() {
            if (window.innerWidth <= 768) slidesPerView = 1;
            else if (window.innerWidth <= 1024) slidesPerView = 2;
            else slidesPerView = 3;
        }

        function getTotalSlides() {
            return Math.max(0, cards.length - slidesPerView);
        }

        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            const total = getTotalSlides() + 1;
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.classList.add('tc-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            if (!dotsContainer) return;
            dotsContainer.querySelectorAll('.tc-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = Math.min(index, getTotalSlides());
            const cardWidth = cards[0].offsetWidth + 16;
            track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
            updateDots();
        }

        function nextSlide() {
            currentSlide = currentSlide < getTotalSlides() ? currentSlide + 1 : 0;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : getTotalSlides();
            goToSlide(currentSlide);
        }

        updateSlidesPerView();
        createDots();
        autoSlideInterval = setInterval(nextSlide, 4500);

        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4500);
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4500);
        });

        window.addEventListener('resize', () => {
            updateSlidesPerView();
            createDots();
            goToSlide(Math.min(currentSlide, getTotalSlides()));
        });

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
        }, { passive: true });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('fullName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const goal = document.getElementById('investmentGoal');
            let isValid = true;

            document.querySelectorAll('.form-error').forEach(err => {
                err.classList.remove('show');
                err.textContent = '';
            });

            if (!name || name.value.trim().length < 2) { showError('nameError', 'Please enter your full name'); isValid = false; }
            if (!phone || !/^[0-9]{10}$/.test(phone.value.replace(/\s/g, ''))) { showError('phoneError', 'Please enter a valid 10-digit phone number'); isValid = false; }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError('emailError', 'Please enter a valid email address'); isValid = false; }
            if (!goal || !goal.value) { showError('goalError', 'Please select an investment goal'); isValid = false; }

            if (isValid) { showToast(); contactForm.reset(); }
        });
    }

    function showError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.classList.add('show'); }
    }

    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
    }

    if (toastClose) toastClose.addEventListener('click', () => toast.classList.remove('show'));

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        });
    });

    // ===== MOBILE MENU CLOSE ON OUTSIDE CLICK =====
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            hamburger && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ===== SERVICE FILTER TABS =====
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            document.querySelectorAll('.service-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ===== CALCULATOR TABS =====
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(this.dataset.calc + 'Panel');
            if (target) target.classList.add('active');
        });
    });

    // ===== EXIT INTENT POPUP =====
    const exitPopup = document.getElementById('exitPopup');
    const exitClose = document.getElementById('exitClose');
    const exitOverlay = document.getElementById('exitOverlay');
    const exitSubmit = document.getElementById('exitSubmit');
    let exitShown = false;

    if (exitPopup) {
        document.addEventListener('mouseleave', function(e) {
            if (e.clientY < 10 && !exitShown) {
                exitShown = true;
                setTimeout(() => exitPopup.classList.add('show'), 500);
            }
        });

        if (exitClose) exitClose.addEventListener('click', () => exitPopup.classList.remove('show'));
        if (exitOverlay) exitOverlay.addEventListener('click', () => exitPopup.classList.remove('show'));
        if (exitSubmit) exitSubmit.addEventListener('click', () => {
            exitPopup.classList.remove('show');
            showToast();
        });
    }

    // ===== LIVE CLOCK =====
    function updateClock() {
        const clock = document.getElementById('liveClock');
        if (!clock) return;
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // ===== LIVE VISITORS (random) =====
    const liveVisitors = document.getElementById('liveVisitors');
    if (liveVisitors) {
        setInterval(() => {
            const base = 20 + Math.floor(Math.random() * 15);
            liveVisitors.textContent = base;
        }, 5000);
    }

    // ===== TYPING EFFECT =====
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = ['SIP Investments', 'Mutual Funds', 'Wealth Management', 'Tax Saving', 'Retirement Planning', 'Child Education'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const word = words[wordIndex];
            if (isDeleting) {
                typingEl.textContent = word.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingEl.textContent = word.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === word.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }

            setTimeout(type, isDeleting ? 60 : 90);
        }
        type();
    }

    // ===== DOWNLOAD GUIDE =====
    const downloadGuide = document.getElementById('downloadGuide');
    if (downloadGuide) {
        downloadGuide.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Investment Guide will be available soon! Meanwhile, contact us for a free consultation.');
        });
    }

    // ===== SCROLL PROGRESS BAR =====
    window.addEventListener('scroll', function() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        scrollProgress.style.width = ((scrollTop / docHeight) * 100) + '%';
    });

});