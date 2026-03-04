export default function corazones() {
    // ─── Configuración ───────────────────────────────────────────
    const NUM_HEARTS = 55;    // cantidad de corazones
    const REPEL_RADIUS = 130;   // radio de repulsión (px)
    const REPEL_FORCE = 7.5;   // intensidad de huida
    const FRICTION = 0.88;  // amortiguación (0-1)
    const RETURN_SPEED = 0.045; // velocidad de regreso al origen
    const FLOAT_SPEED = 0.4;   // velocidad de subida
    const EMOJIS = ['❤️', '🩷', '🧡', '💛', '💚', '💙', '💜', '🤍', '💗', '💖', '💝', '💞'];
    const SIZES = [16, 20, 24, 28, 34, 40];

    // ─── Estado del ratón ────────────────────────────────────────
    let mouse = { x: -9999, y: -9999 };
    const cursor = document.getElementById('cursor');

    function setPointer(x, y) {
        mouse.x = x;
        mouse.y = y;
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
    }

    // ─── Mouse ───────────────────────────────────────────────────
    window.addEventListener('mousemove', e => setPointer(e.clientX, e.clientY));

    // ─── Soporte táctil (móvil) ──────────────────────────────────
    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        setPointer(touch.clientX, touch.clientY);
    }

    function handleTouchEnd() {
        // Aleja el punto de repulsión fuera de pantalla al soltar
        mouse.x = -9999;
        mouse.y = -9999;
    }

    window.addEventListener('touchmove', handleTouch, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    // ─── Crear corazones ─────────────────────────────────────────
    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const hearts = Array.from({ length: NUM_HEARTS }, () => {
        const el = document.createElement('div');
        el.className = 'heart';
        el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const size = SIZES[Math.floor(Math.random() * SIZES.length)];
        el.style.fontSize = size + 'px';
        el.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
        document.body.appendChild(el);

        const ox = Math.random() * W();
        const oy = Math.random() * H();
        return {
            el,
            ox, oy,       // posición de origen
            x: ox, y: oy, // posición actual
            vx: 0, vy: 0  // velocidad
        };
    });

    // ─── Loop de animación ───────────────────────────────────────
    function tick() {
        for (const h of hearts) {
            // Vector desde el corazón hacia el cursor
            const dx = h.x - mouse.x;
            const dy = h.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

            if (dist < REPEL_RADIUS) {
                // Huye del cursor con más fuerza cuanto más cerca
                const strength = (1 - dist / REPEL_RADIUS) * REPEL_FORCE;
                h.vx += (dx / dist) * strength;
                h.vy += (dy / dist) * strength;
            }

            // Deriva hacia arriba continuamente
            h.vy -= FLOAT_SPEED;

            // Solo corrige en X hacia el origen
            h.vx += (h.ox - h.x) * RETURN_SPEED;

            // Si sale por arriba, reaparece por abajo
            if (h.y < -60) {
                h.y = H() + 20;
                h.oy = Math.random() * H();
                h.ox = Math.random() * W();
                h.x = h.ox;
                h.vx = 0;
                h.vy = 0;
            }

            // Fricción
            h.vx *= FRICTION;
            h.vy *= FRICTION;

            // Actualiza posición
            h.x += h.vx;
            h.y += h.vy;

            h.el.style.transform = `translate(${h.x}px, ${h.y}px)`;
        }

        requestAnimationFrame(tick);
    }

    // Inicializa posición visual
    for (const h of hearts) {
        h.el.style.left = '0';
        h.el.style.top = '0';
        h.el.style.transform = `translate(${h.x}px, ${h.y}px)`;
    }

    tick();

    // ─── Reposiciona orígenes al redimensionar ───────────────────
    window.addEventListener('resize', () => {
        for (const h of hearts) {
            h.ox = Math.random() * W();
            h.oy = Math.random() * H();
        }
    });

    // ─── Fondo con partículas de polvo ───────────────────────────
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = W();
        canvas.height = H();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * W(),
            y: Math.random() * H(),
            r: Math.random() * 1.5 + 0.3,
            a: Math.random() * Math.PI * 2,
            s: 0.2 + Math.random() * 0.4,
            o: Math.random() * 0.5 + 0.1
        });
    }

    function drawBg() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) {
            p.x += Math.cos(p.a) * p.s;
            p.y += Math.sin(p.a) * p.s;
            p.a += (Math.random() - 0.5) * 0.05;

            if (p.x < 0) p.x = W();
            if (p.x > W()) p.x = 0;
            if (p.y < 0) p.y = H();
            if (p.y > H()) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,110,247,${p.o})`;
            ctx.fill();
        }
        requestAnimationFrame(drawBg);
    }
    drawBg();
}