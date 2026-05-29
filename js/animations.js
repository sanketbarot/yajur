/* ============================================
   NANDIINDIA - ANIMATIONS JS
   Blue & White Light Theme - No Scroll Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

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

    // ===== TILT EFFECT ON CARDS (subtle hover only) =====
    const tiltCards = document.querySelectorAll('.service-card, .plan-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ===== MAKE ALL SCROLL-ANIMATED ELEMENTS VISIBLE =====
    // Ensure everything is visible regardless of scroll position
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.classList.add('animated');
    });

    document.querySelectorAll('.animate-fade-up, .animate-fade-left').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

});