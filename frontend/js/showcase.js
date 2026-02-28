/**
 * SHAIK LUXURY — 360° SHOWCASE VIEWER
 * Drag to rotate using canvas sequence animation
 */

(function () {
    const canvas = document.getElementById('showcaseCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const TOTAL_FRAMES = 200;
    const PREFIX = 'ezgif-frame-';
    const EXT = '.jpg';

    let frames = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let velocity = 0;
    let autoRotate = true;
    let autoRotateDir = 1;
    let autoRotateSpeed = 0.3;
    let zoom = 1;
    const MIN_ZOOM = 0.8;
    const MAX_ZOOM = 2.0;
    let animFrame;

    const dragHint = document.getElementById('dragHint');

    // Resize canvas responsively
    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        drawFrame(frames[Math.floor(currentFrame)]);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getFrameIndex(n) {
        return Math.round(((n % TOTAL_FRAMES) + TOTAL_FRAMES) % TOTAL_FRAMES);
    }

    function drawFrame(img) {
        if (!img || !img.complete || !img.naturalWidth) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();

        const scale = zoom;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.translate(-cx, -cy);

        const iw = img.naturalWidth;
        const ih = img.naturalHeight;
        const cw = canvas.width;
        const ch = canvas.height;
        const imgAspect = iw / ih;
        const canvasAspect = cw / ch;

        let dw, dh, dx, dy;
        if (imgAspect > canvasAspect) {
            dh = ch; dw = dh * imgAspect; dx = (cw - dw) / 2; dy = 0;
        } else {
            dw = cw; dh = dw / imgAspect; dx = 0; dy = (ch - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
    }

    function render() {
        const idx = getFrameIndex(Math.floor(currentFrame));
        drawFrame(frames[idx]);

        if (!isDragging && autoRotate) {
            currentFrame += autoRotateSpeed * autoRotateDir;
            if (currentFrame < 0) currentFrame += TOTAL_FRAMES;
            if (currentFrame >= TOTAL_FRAMES) currentFrame -= TOTAL_FRAMES;
        }

        // Apply velocity (momentum after drag)
        if (!isDragging && !autoRotate && Math.abs(velocity) > 0.05) {
            currentFrame += velocity;
            velocity *= 0.92;
        }

        animFrame = requestAnimationFrame(render);
    }

    // ===== PRELOAD FRAMES =====
    function loadFrames() {
        // Load every frame
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const num = String(i).padStart(3, '0');
            img.src = `assets/frames/${PREFIX}${num}${EXT}`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) {
                    drawFrame(img);
                    render();
                }
            };
            img.onerror = () => { loadedCount++; };
            frames[i - 1] = img;
        }
    }

    // ===== MOUSE DRAG =====
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        autoRotate = false;
        startX = e.clientX;
        lastX = e.clientX;
        velocity = 0;
        canvas.style.cursor = 'grabbing';
        if (dragHint) dragHint.classList.add('hidden');
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        currentFrame -= dx * 0.4; // sensitivity
        velocity = -dx * 0.4;
        lastX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        canvas.style.cursor = 'grab';
    });

    // ===== TOUCH DRAG =====
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        autoRotate = false;
        startX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        velocity = 0;
        if (dragHint) dragHint.classList.add('hidden');
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - lastX;
        currentFrame -= dx * 0.4;
        velocity = -dx * 0.4;
        lastX = e.touches[0].clientX;
        e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchend', () => { isDragging = false; });

    // ===== CONTROLS =====
    const autoRotateBtn = document.getElementById('autoRotateBtn');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');

    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', () => {
            autoRotate = !autoRotate;
            autoRotateBtn.style.background = autoRotate ? 'rgba(201,168,76,0.2)' : '';
            autoRotateBtn.style.color = autoRotate ? '#C9A84C' : '';
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            zoom = Math.min(zoom + 0.2, MAX_ZOOM);
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            zoom = Math.max(zoom - 0.2, MIN_ZOOM);
        });
    }

    // Mouse wheel zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom - e.deltaY * 0.001));
    }, { passive: false });

    // ===== KEYBOARD CONTROL =====
    document.addEventListener('keydown', (e) => {
        const showcaseSection = document.getElementById('showcase');
        if (!showcaseSection) return;
        const rect = showcaseSection.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;

        if (e.key === 'ArrowLeft') { currentFrame -= 3; autoRotate = false; }
        if (e.key === 'ArrowRight') { currentFrame += 3; autoRotate = false; }
        if (e.key === 'r' || e.key === 'R') { autoRotate = !autoRotate; }
    });

    // ===== INIT =====
    loadFrames();

    // Observe section visibility for auto-rotate performance
    const showcaseSection = document.getElementById('showcase');
    if (showcaseSection) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    cancelAnimationFrame(animFrame);
                } else {
                    render();
                }
            });
        }, { threshold: 0.2 });
        obs.observe(showcaseSection);
    }
})();
