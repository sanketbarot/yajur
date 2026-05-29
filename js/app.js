/* ============================================
   NANDIINDIA - MAIN APPLICATION JS
   Version 2.0 - All Fixes + New Features
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== PRELOADER =====
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => preloader.classList.add('loaded'), 400);
        });
        setTimeout(() => preloader.classList.add('loaded'), 2500);
    }

    // ===== NAVBAR =====
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // FIX: Declare backToTop ONCE
    const backToTop = document.getElementById('backToTop');

    // FIX: Use requestAnimationFrame for scroll performance
    let ticking = false;

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    function handleScroll() {
        const scrollY = window.scrollY;

        // Navbar scrolled class
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }

        // Back to top button
        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 500);
        }

        // Scroll progress bar
        updateScrollProgress(scrollY);

        // Active nav link
        updateActiveNavLink(scrollY);
    }

    // Scroll progress bar
    function updateScrollProgress(scrollY) {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    // Active nav link on scroll
    function updateActiveNavLink(scrollY) {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle(
                        'active',
                        link.getAttribute('href') === `#${id}`
                    );
                });
            }
        });
    }

    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow =
                navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) hamburger.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close nav on outside click
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            hamburger && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Back to top
    if (backToTop) {
        backToTop.addEventListener('click', () =>
            window.scrollTo({ top: 0, behavior: 'smooth' })
        );
    }

    // ===== COUNTER ANIMATION =====
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.target) || 0;
            const duration = 1800;
            const increment = target / (duration / 16);
            let current = 0;

            counter.dataset.animated = 'true';

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            updateCounter();
        });
    }
    setTimeout(animateCounters, 600);

    // ===== VISIBILITY: Force all elements visible =====
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
            document.querySelectorAll('.faq-item')
                    .forEach(faq => faq.classList.remove('active'));
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
            currentSlide = currentSlide < getTotalSlides()
                ? currentSlide + 1 : 0;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = currentSlide > 0
                ? currentSlide - 1 : getTotalSlides();
            goToSlide(currentSlide);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, 4500);
        }

        updateSlidesPerView();
        createDots();
        autoSlideInterval = setInterval(nextSlide, 4500);

        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

        // FIX: Debounced resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateSlidesPerView();
                createDots();
                goToSlide(Math.min(currentSlide, getTotalSlides()));
            }, 200);
        });

        // Touch swipe
        let touchStartX = 0;
        track.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        track.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
                resetAutoSlide();
            }
        }, { passive: true });
    }

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');

    // FIX: Rate limiting
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 30000;

    // FIX: Phone input — numbers only, 10 digits max
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Rate limit check
            const now = Date.now();
            if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
                const wait = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
                showError('nameError', `Please wait ${wait}s before submitting again.`);
                return;
            }

            const name = document.getElementById('fullName');
            const phone = document.getElementById('phone');
            const email = document.getElementById('email');
            const goal = document.getElementById('investmentGoal');
            let isValid = true;

            // Clear errors
            document.querySelectorAll('.form-error').forEach(err => {
                err.classList.remove('show');
                err.textContent = '';
            });

            // Validate
            if (!name || name.value.trim().length < 2) {
                showError('nameError', 'Please enter your full name');
                isValid = false;
            }
            if (!phone || !/^[6-9][0-9]{9}$/.test(phone.value.replace(/\s/g, ''))) {
                showError('phoneError', 'Please enter a valid 10-digit Indian mobile number');
                isValid = false;
            }
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError('emailError', 'Please enter a valid email address');
                isValid = false;
            }
            if (!goal || !goal.value) {
                showError('goalError', 'Please select an investment goal');
                isValid = false;
            }

            if (isValid) {
                lastSubmitTime = Date.now();
                showToast('Your enquiry submitted! We\'ll contact you soon.');
                contactForm.reset();
            }
        });
    }

    function showError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.classList.add('show'); }
    }

    // FIX: Toast with custom message
    function showToast(message) {
        if (!toast) return;
        const toastMsg = toast.querySelector('p');
        if (toastMsg && message) toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 5000);
    }

    if (toastClose) {
        toastClose.addEventListener('click', () =>
            toast.classList.remove('show')
        );
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80 +
                    (window.innerWidth > 768 ? 36 : 0);
                window.scrollTo({
                    top: target.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== SERVICE FILTER TABS =====
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn')
                    .forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;
            document.querySelectorAll('.service-card').forEach(card => {
                const show = filter === 'all' ||
                             card.dataset.category === filter;
                card.classList.toggle('hidden', !show);
            });
        });
    });

    // ===== CALCULATOR TABS =====
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.calc-tab')
                    .forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.calc-panel')
                    .forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            const target = document.getElementById(
                this.dataset.calc + 'Panel'
            );
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
        // FIX: Desktop only exit intent
        const isDesktop = window.innerWidth > 768;

        if (isDesktop) {
            document.addEventListener('mouseleave', function(e) {
                if (e.clientY < 10 && !exitShown) {
                    exitShown = true;
                    setTimeout(() => exitPopup.classList.add('show'), 500);
                }
            });
        }

        if (exitClose) {
            exitClose.addEventListener('click', () =>
                exitPopup.classList.remove('show')
            );
        }
        if (exitOverlay) {
            exitOverlay.addEventListener('click', () =>
                exitPopup.classList.remove('show')
            );
        }
        if (exitSubmit) {
            exitSubmit.addEventListener('click', () => {
                const name = document.getElementById('exitName')?.value;
                const phone = document.getElementById('exitPhone')?.value;
                if (name && phone) {
                    exitPopup.classList.remove('show');
                    showToast('Thank you! We\'ll contact you for your free consultation.');
                } else {
                    alert('Please fill in your details.');
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') exitPopup.classList.remove('show');
        });
    }

    // ===== LIVE CLOCK =====
    function updateClock() {
        const clock = document.getElementById('liveClock');
        if (!clock) return;
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // FIX: Smooth live visitors counter
    const liveVisitors = document.getElementById('liveVisitors');
    let currentVisitors = 24;
    if (liveVisitors) {
        setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1;
            currentVisitors = Math.min(
                Math.max(currentVisitors + change, 18), 40
            );
            liveVisitors.textContent = currentVisitors;
        }, 5000);
    }

    // ===== TYPING EFFECT =====
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const words = [
            'SIP Investments',
            'Mutual Funds',
            'Wealth Management',
            'Tax Saving',
            'Retirement Planning',
            'Child Education'
        ];
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

    // FIX: Download Guide — use toast instead of alert
    const downloadGuide = document.getElementById('downloadGuide');
    if (downloadGuide) {
        downloadGuide.addEventListener('click', function(e) {
            e.preventDefault();
            showToast('Investment Guide coming soon! Contact us for free consultation.');
        });
    }

    // ===== MARKET TICKER (NEW FEATURE) =====
    const tickerData = [
        { name: 'SENSEX', value: '72,845', change: '+234', up: true },
        { name: 'NIFTY 50', value: '22,126', change: '+89', up: true },
        { name: 'GOLD', value: '₹62,450', change: '-120', up: false },
        { name: 'USD/INR', value: '₹83.12', change: '+0.05', up: false },
        { name: 'SBI MF', value: '18.4%', change: 'YTD', up: true },
        { name: 'HDFC MF', value: '21.2%', change: 'YTD', up: true },
        { name: 'NIFTY NEXT 50', value: '55,432', change: '+312', up: true },
        { name: 'SILVER', value: '₹76,200', change: '+450', up: true }
    ];

    function buildTicker() {
        const tickerEl = document.querySelector('.ticker-content');
        if (!tickerEl) return;

        // Build ticker items twice for seamless loop
        const items = [...tickerData, ...tickerData];
        tickerEl.innerHTML = items.map(item => `
            <div class="ticker-item">
                <span class="t-name">${item.name}</span>
                <span>${item.value}</span>
                <span class="${item.up ? 't-up' : 't-down'}">
                    ${item.up ? '▲' : '▼'} ${item.change}
                </span>
            </div>
        `).join('');
    }
    buildTicker();

    // ===== GOAL PLANNER (NEW FEATURE) =====
    const goalData = {
        home:       { amount: 5000000,  years: 10, label: '₹50L in 10 Years' },
        car:        { amount: 1000000,  years: 3,  label: '₹10L in 3 Years' },
        education:  { amount: 3000000,  years: 15, label: '₹30L in 15 Years' },
        retirement: { amount: 10000000, years: 20, label: '₹1Cr in 20 Years' },
        travel:     { amount: 500000,   years: 2,  label: '₹5L in 2 Years' }
    };

    function calculateSIPForGoal(targetAmount, ratePercent, years) {
        const r = ratePercent / 100 / 12;
        const n = years * 12;
        if (r === 0) return targetAmount / n;
        return (targetAmount * r) / (Math.pow(1 + r, n) - 1);
    }

    // Set goal plan buttons
    document.querySelectorAll('.goal-card[data-goal]').forEach(card => {
        const goalKey = card.dataset.goal;
        const btn = card.querySelector('.btn');
        if (!btn || !goalData[goalKey]) return;

        btn.addEventListener('click', function() {
            const goal = goalData[goalKey];
            const sip = Math.ceil(calculateSIPForGoal(goal.amount, 12, goal.years));

            // Scroll to calculator
            const calcSection = document.getElementById('calculator');
            if (calcSection) {
                window.scrollTo({
                    top: calcSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }

            // Pre-fill SIP calculator after scroll
            setTimeout(() => {
                const sipAmountEl = document.getElementById('sipAmount');
                const sipAmountRangeEl = document.getElementById('sipAmountRange');
                const sipYearsEl = document.getElementById('sipYears');
                const sipYearsRangeEl = document.getElementById('sipYearsRange');

                if (sipAmountEl) sipAmountEl.value = sip;
                if (sipAmountRangeEl) sipAmountRangeEl.value = Math.min(sip, 100000);
                if (sipYearsEl) sipYearsEl.value = goal.years;
                if (sipYearsRangeEl) sipYearsRangeEl.value = goal.years;

                // Trigger recalculation
                sipAmountEl?.dispatchEvent(new Event('input'));
                sipYearsEl?.dispatchEvent(new Event('input'));

                // Switch to SIP tab
                const sipTab = document.querySelector('[data-calc="sip"]');
                sipTab?.click();
            }, 900);
        });
    });

    // Custom goal calculator
    window.calculateCustomGoal = function() {
        const amount = parseFloat(
            document.getElementById('goalAmount')?.value
        );
        const years = parseFloat(
            document.getElementById('goalYears')?.value
        );
        const result = document.getElementById('goalResult');

        if (!result) return;

        if (!amount || !years || amount <= 0 || years <= 0) {
            result.textContent = 'Please enter valid values';
            result.classList.add('show');
            return;
        }

        const sip = Math.ceil(calculateSIPForGoal(amount, 12, years));
        result.textContent = `SIP Needed: ₹${sip.toLocaleString('en-IN')}/month`;
        result.classList.add('show');
    };

    // ===== RISK PROFILE QUIZ (NEW FEATURE) =====
    let currentQ = 1;
    const totalQ = 5;
    const quizAnswers = {};

    const quizNextBtn = document.getElementById('quizNext');
    const quizPrevBtn = document.getElementById('quizPrev');

    if (quizNextBtn) {
        quizNextBtn.addEventListener('click', () => {
            const selected = document.querySelector(
                `input[name="q${currentQ}"]:checked`
            );
            if (!selected) {
                // Highlight unanswered
                const options = document.querySelectorAll(
                    `.quiz-q[data-q="${currentQ}"] .quiz-option`
                );
                options.forEach(opt => {
                    opt.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        opt.style.borderColor = '';
                    }, 1000);
                });
                return;
            }

            quizAnswers[`q${currentQ}`] = parseInt(selected.value);

            if (currentQ < totalQ) {
                document.querySelector(
                    `.quiz-q[data-q="${currentQ}"]`
                ).classList.remove('active');
                currentQ++;
                document.querySelector(
                    `.quiz-q[data-q="${currentQ}"]`
                ).classList.add('active');

                // Update progress
                document.getElementById('qNum').textContent = currentQ;
                const fill = document.getElementById('quizProgress');
                if (fill) fill.style.width = (currentQ / totalQ * 100) + '%';

                if (quizPrevBtn) quizPrevBtn.disabled = false;

                if (currentQ === totalQ) {
                    quizNextBtn.innerHTML =
                        'See Result <i class="fas fa-trophy"></i>';
                }
            } else {
                showQuizResult();
            }
        });
    }

    if (quizPrevBtn) {
        quizPrevBtn.addEventListener('click', () => {
            if (currentQ > 1) {
                document.querySelector(
                    `.quiz-q[data-q="${currentQ}"]`
                ).classList.remove('active');
                currentQ--;
                document.querySelector(
                    `.quiz-q[data-q="${currentQ}"]`
                ).classList.add('active');

                document.getElementById('qNum').textContent = currentQ;
                const fill = document.getElementById('quizProgress');
                if (fill) fill.style.width = (currentQ / totalQ * 100) + '%';

                if (quizNextBtn) {
                    quizNextBtn.innerHTML =
                        'Next <i class="fas fa-arrow-right"></i>';
                }
                if (currentQ === 1 && quizPrevBtn) {
                    quizPrevBtn.disabled = true;
                }
            }
        });
    }

    function showQuizResult() {
        const total = Object.values(quizAnswers)
                            .reduce((a, b) => a + b, 0);

        const profiles = [
            {
                min: 5, max: 8,
                icon: '🛡️',
                title: 'Conservative Investor',
                desc: 'You prefer safety over high returns. Stable, low-risk investments suit you best.',
                funds: [
                    'Liquid Funds',
                    'Debt Mutual Funds',
                    'Short-term FDs',
                    'Gold ETFs'
                ]
            },
            {
                min: 9, max: 12,
                icon: '⚖️',
                title: 'Moderate Investor',
                desc: 'You want balanced growth with manageable risk. A blend of equity and debt is ideal.',
                funds: [
                    'Balanced Advantage Funds',
                    'Hybrid Funds',
                    'Large Cap Funds',
                    'Index Funds via SIP'
                ]
            },
            {
                min: 13, max: 16,
                icon: '📈',
                title: 'Growth Investor',
                desc: 'You can handle market volatility for better long-term returns.',
                funds: [
                    'Mid Cap Funds',
                    'Large & Mid Cap Funds',
                    'Flexi Cap Funds',
                    'ELSS (Tax Saving) Funds'
                ]
            },
            {
                min: 17, max: 20,
                icon: '🚀',
                title: 'Aggressive Investor',
                desc: 'Maximum wealth creation is your goal. High risk, high reward strategy.',
                funds: [
                    'Small Cap Funds',
                    'Sectoral/Thematic Funds',
                    'International Funds',
                    'Momentum Funds'
                ]
            }
        ];

        const profile = profiles.find(
            p => total >= p.min && total <= p.max
        ) || profiles[1];

        // Hide questions, show result
        const questionsEl = document.getElementById('quizQuestions');
        const navEl = document.querySelector('.quiz-nav');
        const resultEl = document.getElementById('quizResult');

        if (questionsEl) questionsEl.style.display = 'none';
        if (navEl) navEl.style.display = 'none';

        if (resultEl) {
            document.getElementById('qrIcon').textContent = profile.icon;
            document.getElementById('qrTitle').textContent = profile.title;
            document.getElementById('qrDesc').textContent = profile.desc;
            document.getElementById('qrRecommendation').innerHTML = `
                <h4><i class="fas fa-star"></i> Recommended Funds For You:</h4>
                <ul>
                    ${profile.funds.map(f => `<li>${f}</li>`).join('')}
                </ul>
            `;
            resultEl.style.display = 'block';

            // Update progress to 100%
            const fill = document.getElementById('quizProgress');
            if (fill) fill.style.width = '100%';
        }
    }

    window.resetQuiz = function() {
        currentQ = 1;
        Object.keys(quizAnswers).forEach(k => delete quizAnswers[k]);

        document.querySelectorAll('.quiz-q')
                .forEach(q => q.classList.remove('active'));

        const firstQ = document.querySelector('.quiz-q[data-q="1"]');
        if (firstQ) firstQ.classList.add('active');

        const questionsEl = document.getElementById('quizQuestions');
        const navEl = document.querySelector('.quiz-nav');
        const resultEl = document.getElementById('quizResult');

        if (questionsEl) questionsEl.style.display = 'block';
        if (navEl) navEl.style.display = 'flex';
        if (resultEl) resultEl.style.display = 'none';

        const fill = document.getElementById('quizProgress');
        if (fill) fill.style.width = '20%';

        const numEl = document.getElementById('qNum');
        if (numEl) numEl.textContent = '1';

        if (quizNextBtn) {
            quizNextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
        }
        if (quizPrevBtn) quizPrevBtn.disabled = true;

        document.querySelectorAll('input[type="radio"]')
                .forEach(r => r.checked = false);
    };

    // ===== SIDEBAR ENQUIRY (NEW FEATURE) =====
    const seToggle = document.getElementById('seToggle');
    const sePanel = document.getElementById('sePanel');
    const seSend = document.getElementById('seSend');

    if (seToggle && sePanel) {
        seToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sePanel.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebarEnquiry');
            if (sidebar && !sidebar.contains(e.target)) {
                sePanel.classList.remove('open');
            }
        });
    }

    if (seSend) {
        seSend.addEventListener('click', () => {
            const name = document.getElementById('seName')?.value;
            const phone = document.getElementById('sePhone')?.value;

            if (name && phone) {
                sePanel.classList.remove('open');
                showToast('Enquiry received! We\'ll call you soon.');
                document.getElementById('seName').value = '';
                document.getElementById('sePhone').value = '';
            } else {
                showToast('Please fill in your name and phone number.');
            }
        });
    }

    // ===== COOKIE CONSENT (NEW FEATURE) =====
    const cookieBar = document.getElementById('cookieBar');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    if (cookieBar && !localStorage.getItem('cookieConsent')) {
        setTimeout(() => cookieBar.classList.add('visible'), 2000);
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBar.classList.remove('visible');
        });
    }
    if (cookieDecline) {
        cookieDecline.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBar.classList.remove('visible');
        });
    }

    // ===== INITIAL SCROLL CALL =====
    handleScroll();

});