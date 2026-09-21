/* ==========================================================================
   DHVANI'S BIRTHDAY WEBSITE - INTERACTIVE JAVASCRIPT LOGIC
   Handles: Audio Player, Countdown, Sparkle Canvas, Candle Blow, Envelope,
   Polaroid Lightbox, Balloon Pop, Scratch Card Canvas, Friendship Meter, Fireworks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSparkleCanvas();
    initCountdown();
    initScratchCards();
});

/* ==========================================================================
   1. FLOATING SPARKLE & HEART CANVAS
   ========================================================================== */
function initSparkleCanvas() {
    const canvas = document.getElementById('sparkleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const baseCount = Math.min(18, Math.floor(width / 50));
    const partyCount = Math.min(26, Math.floor(width / 35));

    class Sparkle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 80;
            this.opacity = Math.random() * 0.45 + 0.25;

            if (typeof partyModeActive !== 'undefined' && partyModeActive) {
                // Party Mode: clean, cute mini balloons, gentle hearts, and subtle twinkle
                const partyEmojis = ['🎈', '💖', '✨', '💕', '🎈'];
                this.isEmoji = Math.random() > 0.72; // Only 28% emojis, rest are soft glowing dots
                this.emoji = partyEmojis[Math.floor(Math.random() * partyEmojis.length)];
                this.size = Math.random() * 3 + 2;
                this.speedY = Math.random() * 1.1 + 0.6;
                this.speedX = (Math.random() - 0.5) * 0.6;
            } else {
                // Normal Cosmic Mode: gentle starry dots and occasional soft heart
                this.isEmoji = Math.random() > 0.8; // Mostly soft star dots
                this.emoji = Math.random() > 0.5 ? '💖' : '💕';
                this.size = Math.random() * 2.5 + 1.5;
                this.speedY = Math.random() * 0.8 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.4;
            }

            // Cosmic Blossom palette: pink, lavender, periwinkle, gold, white
            const starColors = ['#c4b5fd', '#fde68a', '#93c5fd', '#ffffff', '#a78bfa', '#f472b6'];
            this.color = starColors[Math.floor(Math.random() * starColors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            if (this.y < -30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;

            if (this.isEmoji) {
                const fontSize = this.size * 2.3; // Cute, petite emoji size (~12-16px)
                ctx.font = `${fontSize}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
                ctx.fillText(this.emoji, this.x, this.y);
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.shadowBlur = (typeof partyModeActive !== 'undefined' && partyModeActive) ? 12 : 8;
                ctx.shadowColor = this.color;
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < baseCount; i++) {
        particles.push(new Sparkle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Dynamically adjust particle count based on Party Mode
        const targetCount = (typeof partyModeActive !== 'undefined' && partyModeActive) ? partyCount : baseCount;
        if (particles.length < targetCount) {
            particles.push(new Sparkle());
        } else if (particles.length > targetCount) {
            particles.pop();
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. LIVE COUNTDOWN TIMER TO SEPTEMBER 22ND
   ========================================================================== */
function initCountdown() {
    const cdDays = document.getElementById('cdDays');
    const cdHours = document.getElementById('cdHours');
    const cdMins = document.getElementById('cdMins');
    const cdSecs = document.getElementById('cdSecs');

    function updateCountdown() {
        const now = new Date();
        const currentYear = now.getFullYear();

        // Target: Sept 22nd of current year
        let bdayTarget = new Date(currentYear, 8, 22, 0, 0, 0); // Month is 0-indexed (8 = Sept)

        // If today is past Sept 22nd of this year, target next year
        if (now > bdayTarget && now.getDate() !== 22) {
            bdayTarget = new Date(currentYear + 1, 8, 22, 0, 0, 0);
        }

        // If today IS Sept 22nd
        if (now.getMonth() === 8 && now.getDate() === 22) {
            if (cdDays) cdDays.textContent = "00";
            if (cdHours) cdHours.textContent = "00";
            if (cdMins) cdMins.textContent = "00";
            if (cdSecs) cdSecs.textContent = "00";
            const cdTitle = document.querySelector('.countdown-title');
            if (cdTitle) cdTitle.innerHTML = '🎉 IT\'S DHVANI\'S BIRTHDAY TODAY! 👑';
            return;
        }

        const diff = bdayTarget - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / 1000 / 60) % 60);
        const secs = Math.floor((diff / 1000) % 60);

        if (cdDays) cdDays.textContent = days < 10 ? '0' + days : days;
        if (cdHours) cdHours.textContent = hours < 10 ? '0' + hours : hours;
        if (cdMins) cdMins.textContent = mins < 10 ? '0' + mins : mins;
        if (cdSecs) cdSecs.textContent = secs < 10 ? '0' + secs : secs;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   3. AUDIO PLAYER TOGGLE (HBD Song & Party Song Management)
   ========================================================================== */
let partyModeActive = false;
let partyInterval = null;

const musicToggleBtn = document.getElementById('musicToggleBtn');
const bgMusic = document.getElementById('bgMusic');
const partyToggleBtn = document.getElementById('partyToggleBtn');
const partyMusic = document.getElementById('partyMusic');

function pauseBgMusic() {
    if (bgMusic && !bgMusic.paused) {
        bgMusic.pause();
    }
    if (musicToggleBtn) {
        musicToggleBtn.classList.remove('playing');
        const wrap = musicToggleBtn.closest('.fab-wrap');
        if (wrap) wrap.setAttribute('data-tooltip', 'Play Music');
    }
}

function pausePartyMusic() {
    if (partyMusic && !partyMusic.paused) {
        partyMusic.pause();
    }
}

function stopPartyMode() {
    if (!partyModeActive) return;
    partyModeActive = false;
    document.body.classList.remove('party-mode-active');
    const partyIcon = document.getElementById('partyIcon');
    const partyWrap = (partyToggleBtn || document.getElementById('partyToggleBtn'))?.closest('.fab-wrap');
    if (partyIcon) partyIcon.textContent = '🥳';
    if (partyWrap) partyWrap.setAttribute('data-tooltip', 'Party Mode');
    if (partyInterval) {
        clearInterval(partyInterval);
        partyInterval = null;
    }
    pausePartyMusic();
}

if (musicToggleBtn && bgMusic) {
    musicToggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            // Guarantee party song & party mode stop before starting HBD song
            stopPartyMode();

            bgMusic.play().then(() => {
                musicToggleBtn.classList.add('playing');
                const wrap = musicToggleBtn.closest('.fab-wrap');
                if (wrap) wrap.setAttribute('data-tooltip', 'Pause Music');
            }).catch(err => {
                console.log("HBD audio playback error:", err);
            });
        } else {
            pauseBgMusic();
        }
    });
}

/* ==========================================================================
   4. NAVIGATION SMOOTH SCROLL HELPER
   ========================================================================== */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ==========================================================================
   5. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING
   ========================================================================== */
let unlitCount = 0;

function extinguishCandle(flameElement) {
    const candle = flameElement.parentElement;
    if (candle.getAttribute('data-lit') === 'true') {
        candle.setAttribute('data-lit', 'false');
        unlitCount++;
        checkAllCandlesExtinguished();
    }
}

function extinguishAllCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach(c => {
        c.setAttribute('data-lit', 'false');
    });
    unlitCount = candles.length;
    checkAllCandlesExtinguished();
}

function checkAllCandlesExtinguished() {
    const candles = document.querySelectorAll('.candle');
    if (unlitCount >= candles.length) {
        // Trigger Confetti Celebration!
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 }
            });
        }

        const wishCard = document.getElementById('wishUnlockedCard');
        const blowBtn = document.getElementById('blowCandlesBtn');

        if (wishCard) wishCard.classList.remove('hidden');
        if (blowBtn) blowBtn.innerHTML = '<i class="fa-solid fa-check"></i> Wish Granted! 🎉';
    }
}

/* ==========================================================================
   6. 3D FLIP POLAROID CARDS (Concept 4)
   ========================================================================== */
function flipPolaroidCard(cardElement) {
    cardElement.classList.toggle('flipped');
}

/* ==========================================================================
   7. PARTY MODE TOGGLE & FULL PAGE PARTY EFFECTS (Concept 5)
   ========================================================================== */
function togglePartyMode() {
    partyModeActive = !partyModeActive;
    const body = document.body;
    const partyIcon = document.getElementById('partyIcon');
    const partyWrap = (partyToggleBtn || document.getElementById('partyToggleBtn'))?.closest('.fab-wrap');

    if (partyModeActive) {
        // Stop background HBD song so both songs never overlap
        pauseBgMusic();

        body.classList.add('party-mode-active');
        if (partyIcon) partyIcon.textContent = '🎉';
        if (partyWrap) partyWrap.setAttribute('data-tooltip', 'Party: ON!');

        // Start Party Song
        if (partyMusic) {
            partyMusic.currentTime = 0;
            partyMusic.play().catch(err => {
                console.log("Party audio playback error:", err);
            });
        }

        // Initial celebration confetti burst
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 75,
                spread: 80,
                origin: { y: 0.5 },
                scalar: 0.9
            });
        }

        // Periodic subtle confetti drift as she scrolls
        if (partyInterval) clearInterval(partyInterval);
        partyInterval = setInterval(() => {
            if (partyModeActive && typeof confetti === 'function') {
                confetti({
                    particleCount: 14,
                    spread: 60,
                    origin: { x: Math.random() * 0.8 + 0.1, y: 0.1 },
                    ticks: 140,
                    gravity: 0.8,
                    scalar: 0.75
                });
            }
        }, 5500);
    } else {
        body.classList.remove('party-mode-active');
        if (partyIcon) partyIcon.textContent = '🥳';
        if (partyWrap) partyWrap.setAttribute('data-tooltip', 'Party Mode');
        if (partyInterval) {
            clearInterval(partyInterval);
            partyInterval = null;
        }

        // Stop Party Song when party mode is toggled off
        pausePartyMusic();
    }
}

// Touch & Pointer glitter celebration sparkle bursts when Party Mode is active (Subtle micro-sparkles)
window.addEventListener('pointerdown', (e) => {
    if (partyModeActive && typeof confetti === 'function') {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        confetti({
            particleCount: 18,
            spread: 50,
            origin: { x, y },
            colors: ['#f472b6', '#c4b5fd', '#fde68a', '#93c5fd', '#f43f5e', '#a855f7'],
            ticks: 110,
            gravity: 0.9,
            scalar: 0.85
        });
    }
}, true);

/* ==========================================================================
   8. POLAROID LIGHTBOX MODAL
   ========================================================================== */
function openLightbox(imgSrc, captionText) {
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalCaption = document.getElementById('lightboxCaption');

    if (modal && modalImg) {
        modalImg.src = imgSrc;
        if (modalCaption) modalCaption.textContent = captionText;
        modal.classList.remove('hidden');
    }
}

function closeLightbox(event) {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

/* ==========================================================================
   7. SEALED ENVELOPE TOGGLE
   ========================================================================== */
function toggleEnvelope() {
    const envelope = document.getElementById('envelope');
    const letterPaper = document.getElementById('letterPaper');

    if (letterPaper.classList.contains('hidden')) {
        if (envelope) envelope.style.transform = 'scale(0.8) translateY(20px)';
        setTimeout(() => {
            if (envelope) envelope.classList.add('hidden');
            if (letterPaper) letterPaper.classList.remove('hidden');
        }, 300);

        // Confetti burst for letter
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.7 }
            });
        }
    } else {
        if (letterPaper) letterPaper.classList.add('hidden');
        if (envelope) {
            envelope.classList.remove('hidden');
            envelope.style.transform = 'scale(1)';
        }
    }
}

/* ==========================================================================
   8. POP THE BALLOONS MINI GAME
   ========================================================================== */
function popBalloon(balloonElement, messageText) {
    if (balloonElement.style.opacity === '0.2') return;

    balloonElement.style.transform = 'scale(1.4)';
    balloonElement.style.opacity = '0.2';

    const popMsg = document.getElementById('balloonPopMsg');
    if (popMsg) {
        popMsg.innerHTML = `🎈 <strong>Special Compliment:</strong> ${messageText}`;
    }

    // Mini confetti blast
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 25,
            spread: 40,
            origin: { x: Math.random() * 0.6 + 0.2, y: 0.5 }
        });
    }
}

/* ==========================================================================
   9. CANVAS SCRATCH CARD MECHANICS
   ========================================================================== */
function initScratchCards() {
    for (let i = 1; i <= 3; i++) {
        setupScratchCard(`scratchCanvas${i}`);
    }
}

function setupScratchCard(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // Fill canvas with metallic scratch surface
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, width, height);

    // Decorative gradient overlay
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, 'rgba(232, 67, 147, 0.8)');
    grad.addColorStop(1, 'rgba(249, 202, 36, 0.8)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Text instructions on scratch area
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Fredoka", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✨ Scratch Here to Reveal! ✨', width / 2, height / 2 + 5);

    let isScratching = false;

    function getPos(e) {
        const rect = canvas.getBoundingClientRect();
        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    function scratch(e) {
        if (!isScratching) return;
        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2);
        ctx.fill();
    }

    canvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    canvas.addEventListener('mouseup', () => { isScratching = false; });
    canvas.addEventListener('mouseleave', () => { isScratching = false; });

    canvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); });
    canvas.addEventListener('touchmove', scratch);
    canvas.addEventListener('touchend', () => { isScratching = false; });
}

/* ==========================================================================
   10. BESTIE FRIENDSHIP METER
   ========================================================================== */
function runFriendshipMeter() {
    const fill = document.getElementById('meterFill');
    const text = document.getElementById('meterText');
    const result = document.getElementById('meterResult');
    const btn = document.getElementById('testMeterBtn');

    if (!fill || !text) return;

    if (btn) btn.disabled = true;

    fill.style.width = '0%';
    let val = 0;

    const interval = setInterval(() => {
        val += 25;
        if (val > 1000) val = 1000;
        fill.style.width = Math.min(100, val / 10) + '%';
        text.textContent = `${val}%`;

        if (val >= 1000) {
            clearInterval(interval);
            if (result) {
                result.innerHTML = '🚀 Friendship Power: 1000% INFINITE! You & me together are Bestestttt for Life! 💖👑';
            }
            if (btn) btn.disabled = false;

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    }, 50);
}

/* ==========================================================================
   11. FIREWORKS CELEBRATION FINALE
   ========================================================================== */
function triggerFireworksFull() {
    if (typeof confetti !== 'function') return;

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}
