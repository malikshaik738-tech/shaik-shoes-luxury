/**
 * SHAIK LUXURY — HERO SEQUENCE ANIMATION
 * Frame-by-frame canvas animation using all 200 frames
 */

(function () {
    const canvas = document.getElementById('sequenceCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const TOTAL_FRAMES = 200;
    const FPS = 30;
    const FRAME_DURATION = 1000 / FPS;
    const BASE_PATH = '../../';
    const FILE_PREFIX = 'ezgif-frame-';
    const FILE_EXT = '.jpg';

    let frames = [];
    let loadedCount = 0;
    let currentFrame = 0;
    let isPlaying = false;
    let lastFrameTime = 0;
    let animationId = null;

    // Resize canvas to fill parent
    function resizeCanvas() {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); drawFrame(frames[currentFrame]); });

    // Show loading progress on canvas
    function drawLoading(progress) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // SHAIK text
        ctx.font = 'bold 80px "Bebas Neue", Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const grad = ctx.createLinearGradient(cx - 100, 0, cx + 100, 0);
        grad.addColorStop(0, '#C9A84C');
        grad.addColorStop(0.5, '#E8C87A');
        grad.addColorStop(1, '#C9A84C');
        ctx.fillStyle = grad;
        ctx.fillText('SHAIK', cx, cy - 30);

        // Progress bar
        const barW = 240;
        const barH = 2;
        const barX = cx - barW / 2;
        const barY = cy + 20;
        ctx.fillStyle = 'rgba(201,168,76,0.15)';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = grad;
        ctx.fillRect(barX, barY, barW * progress, barH);

        // Percentage text
        ctx.font = '12px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText(`Loading ${Math.floor(progress * 100)}%`, cx, cy + 44);
    }

    // Draw a single image frame on canvas
    function drawFrame(img) {
        if (!img || !img.complete) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Cover fit
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = canvas.width / canvas.height;
        let drawW, drawH, drawX, drawY;

        if (imgAspect > canvasAspect) {
            drawH = canvas.height;
            drawW = drawH * imgAspect;
            drawX = (canvas.width - drawW) / 2;
            drawY = 0;
        } else {
            drawW = canvas.width;
            drawH = drawW / imgAspect;
            drawX = 0;
            drawY = (canvas.height - drawH) / 2;
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // Animation loop
    function animate(timestamp) {
        if (!isPlaying) return;

        if (timestamp - lastFrameTime >= FRAME_DURATION) {
            drawFrame(frames[currentFrame]);
            currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
            lastFrameTime = timestamp;
        }

        animationId = requestAnimationFrame(animate);
    }

    // Start animation
    function startAnimation() {
        if (!isPlaying) {
            isPlaying = true;
            lastFrameTime = 0;
            animationId = requestAnimationFrame(animate);
        }
    }

    // Load frames progressively
    function loadFrames() {
        drawLoading(0);

        // Load all frames
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            const frameNum = String(i).padStart(3, '0');
            img.src = `${BASE_PATH}${FILE_PREFIX}${frameNum}${FILE_EXT}`;

            img.onload = () => {
                loadedCount++;
                const progress = loadedCount / TOTAL_FRAMES;

                // Draw first frame as soon as it's ready
                if (i === 1) {
                    drawFrame(img);
                }

                // Update loading indicator
                if (!isPlaying) {
                    drawLoading(progress);
                }

                // Start playing once we have enough frames buffered (first 20%)
                if (loadedCount === Math.floor(TOTAL_FRAMES * 0.2) && !isPlaying) {
                    startAnimation();
                }

                // All loaded
                if (loadedCount === TOTAL_FRAMES) {
                    console.log('SHAIK: All frames loaded. Smooth animation active.');
                }
            };

            img.onerror = () => {
                loadedCount++;
                // Create a blank placeholder
                const placeholder = new Image();
                placeholder.complete = false;
                frames[i - 1] = placeholder;

                if (loadedCount === Math.floor(TOTAL_FRAMES * 0.2) && !isPlaying) {
                    startAnimation();
                }
            };

            frames[i - 1] = img;
        }
    }

    // Scroll-linked animation toggle
    const heroSection = document.getElementById('hero');
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!isPlaying && loadedCount > 20) startAnimation();
            } else {
                isPlaying = false;
                if (animationId) cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.1 });

    if (heroSection) heroObserver.observe(heroSection);

    // Initialize
    loadFrames();

    // Expose for external control
    window.heroSequence = {
        pause: () => { isPlaying = false; if (animationId) cancelAnimationFrame(animationId); },
        play: () => startAnimation(),
        goToFrame: (n) => { currentFrame = Math.max(0, Math.min(n, TOTAL_FRAMES - 1)); drawFrame(frames[currentFrame]); }
    };
})();
