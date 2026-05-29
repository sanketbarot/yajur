/* ============================================
   NANDIINDIA - MAIN APPLICATION JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 800);
    });

    // Fallback: hide preloader after 3 seconds
    setTimeout(() => {
        preloader.classList.add('loaded');
    }, 3000);

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll handler
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Active nav link based on scroll
        updateActiveNavLink();
    });

    // Hamburger toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ===== BACK TO TOP =====
    const backToTop = document.getElementById('backToTop');
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            if (counter.dataset.animated) return;
            
            const target = parseInt(counter.dataset.target);
            const duration = 2000;
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

    // ===== SCROLL ANIMATIONS (Intersection Observer) =====
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger counter animation when stats are visible
                if (entry.target.closest('.hero-stats') || entry.target.classList.contains('stat-item')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Also observe stat items
    document.querySelectorAll('.stat-item').forEach(el => {
        const statObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });
        statObserver.observe(el);
    });

    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked (toggle)
            if (!isActive) {
                item.classList.add('active');
            }
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
            if (window.innerWidth <= 768) {
                slidesPerView = 1;
            } else if (window.innerWidth <= 1024) {
                slidesPerView = 2;
            } else {
                slidesPerView = 3;
            }
        }

        function getTotalSlides() {
            return Math.max(0, cards.length - slidesPerView);
        }

        function createDots() {
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
            const dots = dotsContainer.querySelectorAll('.tc-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        function goToSlide(index) {
            currentSlide = Math.min(index, getTotalSlides());
            const cardWidth = cards[0].offsetWidth + 16; // including margin
            track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
            updateDots();
        }

        function nextSlide() {
            if (currentSlide < getTotalSlides()) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            goToSlide(currentSlide);
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
            } else {
                currentSlide = getTotalSlides();
            }
            goToSlide(currentSlide);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 4000);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Initialize
        updateSlidesPerView();
        createDots();
        startAutoSlide();

        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });

        window.addEventListener('resize', () => {
            updateSlidesPerView();
            createDots();
            goToSlide(Math.min(currentSlide, getTotalSlides()));
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            startAutoSlide();
        }, { passive: true });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('fullName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const goal = document.getElementById('investmentGoal');

            let isValid = true;

            // Reset errors
            document.querySelectorAll('.form-error').forEach(err => {
                err.classList.remove('show');
                err.textContent = '';
            });

            if (name.value.trim().length < 2) {
                showError('nameError', 'Please enter your full name');
                isValid = false;
            }

            if (!/^[0-9]{10}$/.test(phone.value.replace(/\s/g, ''))) {
                showError('phoneError', 'Please enter a valid 10-digit phone number');
                isValid = false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }

            if (!goal.value) {
                showError('goalError', 'Please select an investment goal');
                isValid = false;
            }

            if (isValid) {
                // Show success toast
                showToast();
                contactForm.reset();
            }
        });
    }

    function showError(id, message) {
        const errorEl = document.getElementById(id);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('show');
        }
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    if (toastClose) {
        toastClose.addEventListener('click', () => {
            toast.classList.remove('show');
        });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== NAVBAR MOBILE OVERLAY CLOSE =====
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

});