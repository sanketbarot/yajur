/* ============================================
   NANDIINDIA - ANIMATIONS JS
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== PARALLAX PARTICLES (Hero Section) =====
    const particlesContainer = document.getElementById('particles');
    
    if (particlesContainer) {
        // Create floating particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add particle animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== MOUSE PARALLAX (Hero Visual) =====
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        document.addEventListener('mousemove', function(e) {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            
            const moveX = (clientX - innerWidth / 2) / innerWidth * 20;
            const moveY = (clientY - innerHeight / 2) / innerHeight * 20;

            const mainCard = heroVisual.querySelector('.main-card');
            if (mainCard) {
                mainCard.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            }

            const floatingCards = heroVisual.querySelectorAll('.floating-card');
            floatingCards.forEach((card, index) => {
                const factor = (index + 1) * 0.3;
                card.style.transform = `translate(${moveX * factor}px, ${moveY * factor}px)`;
            });
        });
    }

    // ===== TILT EFFECT ON CARDS =====
    const tiltCards = document.querySelectorAll('.service-card, .plan-card, .about-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ===== MAGNETIC BUTTONS =====
    const magneticBtns = document.querySelectorAll('.btn-primary, .nav-cta');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            btn.style.transform = '';
        });
    });

    // ===== TEXT REVEAL ANIMATION =====
    function revealText(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';
        
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.cssText = `
                opacity: 0;
                animation: charReveal 0.3s ease forwards;
                animation-delay: ${i * 0.02}s;
                display: inline-block;
            `;
            element.appendChild(span);
        });
    }

    // Add char reveal animation
    const charRevealStyle = document.createElement('style');
    charRevealStyle.textContent = `
        @keyframes charReveal {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(charRevealStyle);

    // ===== SMOOTH NUMBER COUNTING =====
    function smoothCount(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (target - start) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // ===== RIPPLE EFFECT ON BUTTONS =====
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
                transform: scale(0);
                animation: rippleEffect 0.6s ease;
                pointer-events: none;
            `;
            
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to { transform: scale(4); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ===== SCROLL PROGRESS BAR =====
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #2563eb, #60a5fa);
        z-index: 10001;
        transition: width 0.1s linear;
        border-radius: 0 2px 2px 0;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // ===== CURSOR FOLLOWER (Desktop Only) =====
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid rgba(37, 99, 235, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 99998;
            transition: transform 0.15s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Enlarge on hover over interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, .service-card, .plan-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.borderColor = 'rgba(37, 99, 235, 0.8)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.borderColor = 'rgba(37, 99, 235, 0.5)';
            });
        });
    }

    // ===== LAZY LOADING SECTIONS =====
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        lazyObserver.observe(section);
    });

});