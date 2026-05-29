/* ============================================
   NANDIINDIA - ANIMATIONS JS
   Purple & Orange Theme - Version 3.0
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

    // ===== RIPPLE EFFECT =====
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Smart color based on button type
            const isDark =
                btn.classList.contains('btn-primary') ||
                btn.classList.contains('btn-accent') ||
                btn.classList.contains('btn-whatsapp');

            const rippleColor = isDark
                ? 'rgba(255,255,255,0.28)'
                : 'rgba(124,58,237,0.14)';

            // Remove old ripples
            btn.querySelectorAll('.ripple').forEach(r => r.remove());

            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.classList.add('ripple');
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${rippleColor};
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
            `;

            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 700);
        });
    });

    // ===== TILT EFFECT ON CARDS =====
    const tiltCards = document.querySelectorAll(
        '.service-card, .about-card, .why-card'
    );

    tiltCards.forEach(card => {
        if (card.classList.contains('featured')) return;

        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rX = ((y - cy) / cy) * 4;
            const rY = ((x - cx) / cx) * 4;

            card.style.transform = `
                perspective(1000px)
                rotateX(${-rX}deg)
                rotateY(${rY}deg)
                translateY(-4px)
            `;
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });

    // ===== FORCE ALL ELEMENTS VISIBLE =====
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    document.querySelectorAll(
        '.animate-fade-up, .animate-fade-left'
    ).forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

});