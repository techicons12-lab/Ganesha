/**
 * WEB AUDIO API SOUND SYNTHESIZER
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playBell() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(523.25, this.ctx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.2);
    }

    playFlip() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(250, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playMatch() {
        if (!this.enabled) return;
        this.init();
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.04);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.04);
            osc.stop(this.ctx.currentTime + idx * 0.04 + 0.6);
        });
    }

    playWrong() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    playVictory() {
        if (!this.enabled) return;
        this.init();
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
            setTimeout(() => this.playBell(), i * 160);
        });
    }
}

const sounds = new SoundEngine();

/**
 * CANVAS PARTICLE & CONFETTI ENGINE
 */
class ParticleEngine {
    constructor() {
        this.pCanvas = document.getElementById('particlesCanvas');
        this.pCtx = this.pCanvas.getContext('2d');
        this.cCanvas = document.getElementById('confettiCanvas');
        this.cCtx = this.cCanvas.getContext('2d');

        this.particles = [];
        this.confetti = [];

        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initParticles();
        this.animate();
    }

    resize() {
        this.pCanvas.width = window.innerWidth;
        this.pCanvas.height = window.innerHeight;
        this.cCanvas.width = window.innerWidth;
        this.cCanvas.height = window.innerHeight;
    }

    initParticles() {
        this.particles = [];
        const count = Math.min(Math.floor(window.innerWidth / 25), 40);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.pCanvas.width,
                y: Math.random() * this.pCanvas.height,
                size: Math.random() * 6 + 4,
                speedY: Math.random() * 0.7 + 0.3,
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 2,
                opacity: Math.random() * 0.6 + 0.3,
                color: Math.random() > 0.5 ? '#FF9933' : '#FFD700'
            });
        }
    }

    triggerConfetti() {
        this.confetti = [];
        for (let i = 0; i < 100; i++) {
            this.confetti.push({
                x: this.cCanvas.width / 2,
                y: this.cCanvas.height / 2,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.8) * 15,
                size: Math.random() * 8 + 4,
                color: ['#FFD700', '#FF7700', '#FF1493', '#00FFCC', '#FFFFFF'][Math.floor(Math.random() * 5)],
                life: 1.0
            });
        }
    }

    animate() {
        // Background petals
        this.pCtx.clearRect(0, 0, this.pCanvas.width, this.pCanvas.height);
        this.particles.forEach(p => {
            p.y += p.speedY;
            p.rotation += p.rotSpeed;
            if (p.y > this.pCanvas.height + 10) p.y = -10;

            this.pCtx.save();
            this.pCtx.translate(p.x, p.y);
            this.pCtx.rotate((p.rotation * Math.PI) / 180);
            this.pCtx.globalAlpha = p.opacity;
            this.pCtx.fillStyle = p.color;
            this.pCtx.beginPath();
            this.pCtx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
            this.pCtx.fill();
            this.pCtx.restore();
        });

        // Win Confetti
        this.cCtx.clearRect(0, 0, this.cCanvas.width, this.cCanvas.height);
        this.confetti.forEach((c, idx) => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.3; // gravity
            c.life -= 0.015;

            if (c.life > 0) {
                this.cCtx.save();
                this.cCtx.globalAlpha = c.life;
                this.cCtx.fillStyle = c.color;
                this.cCtx.fillRect(c.x, c.y, c.size, c.size);
                this.cCtx.restore();
            }
        });

        requestAnimationFrame(() => this.animate());
    }
}

let particlesInstance;
window.addEventListener('load', () => {
    particlesInstance = new ParticleEngine();
});

/**
 * SACRED SYMBOLS & EDUCATIONAL LORE DATA
 */
const FESTIVAL_ITEMS = [
    { symbol: '🐘', name: 'Ganesha', lore: 'Lord Ganesha is the Vighnaharta (Remover of Obstacles) and Deity of Wisdom!' },
    { symbol: '🍬', name: 'Modak', lore: 'Modak is Lord Ganesha\'s favorite sweet dumpling offering!' },
    { symbol: '🐭', name: 'Mushak', lore: 'Mooshika the mouse is Lord Ganesha\'s loyal sacred vehicle!' },
    { symbol: '🪔', name: 'Holy Diya', lore: 'Diyas symbolize light, purity, and driving away spiritual darkness!' },
    { symbol: '🌿', name: 'Durva Grass', lore: '21 blades of sacred Durva grass are traditionally offered during puja!' },
    { symbol: '🌺', name: 'Hibiscus', lore: 'Red Hibiscus (Jaswand) is the beloved flower offered to Bappa!' },
    { symbol: '🥥', name: 'Coconut', lore: 'Coconut represents surrendering the ego to divine consciousness!' },
    { symbol: '🎨', name: 'Rangoli', lore: 'Rangoli decorates entrances to welcome prosperity and divine energy!' },
    { symbol: '🥁', name: 'Festival Dhol', lore: 'Dhol & Tasha beats echo joyfully during Ganesha Aarti & Visarjan!' },
    { symbol: '🪷', name: 'Lotus', lore: 'Lotus represents purity, divine knowledge, and spiritual enlightenment!' }
];

const OBSERVATION_SCENES = [
    {
        image: 'Carde/imaage1/imaage.jpeg',
        questionFile: 'Carde/imaage1/questions.html',
        questions: [
            { text: 'What is Ganesha holding in his right hand?', answer: 'An axe', options: ['A conch', 'An axe', 'A book', 'A drum'] },
            { type: 'text', text: 'Which flower is visible in Ganesha\'s left hand?', answer: 'A lotus' },
            { text: 'What sweet offering is in the bowl?', answer: 'Modaks', options: ['Laddus', 'Modaks', 'Bananas', 'Coconuts'] },
            { text: 'What animal is near the lower right side?', answer: 'A mouse', options: ['A peacock', 'A deer', 'A mouse', 'A cow'] }
        ]
    },
    {
        image: 'Carde/imaage2/imaage.jpeg',
        questionFile: 'Carde/imaage2/questions.html',
        questions: [
            { text: 'Who is seated beside Ganesha in the center?', answer: 'Shiva and Parvati', options: ['Shiva and Parvati', 'Rama and Sita', 'Krishna and Radha', 'Two musicians'] },
            { type: 'text', text: 'What large animal is near the left side?', answer: 'A cow' },
            { text: 'What colorful floor design is in the foreground?', answer: 'A rangoli', options: ['A map', 'A rangoli', 'A carpet', 'A pond'] },
            { text: 'What bird is visible on the right side?', answer: 'A peacock', options: ['A parrot', 'A peacock', 'A swan', 'An eagle'] }
        ]
    },
    {
        image: 'Carde/imaage3/imaage.jpeg',
        questionFile: 'Carde/imaage3/questions.html',
        questions: [
            { text: 'What is at the center of the temple platform?', answer: 'Ganesha', options: ['Ganesha', 'A cow', 'A peacock', 'A musician'] },
            { type: 'text', text: 'What animals are hanging from the large tree?', answer: 'Ganesha figures' },
            { text: 'Which animal is at the bottom left?', answer: 'A cow', options: ['A cow', 'A dog', 'A deer', 'A goat'] },
            { text: 'What is being sold at the market on the right?', answer: 'Fruits and sweets', options: ['Books and toys', 'Fruits and sweets', 'Clothes only', 'Flowers only'] }
        ]
    },
    {
        image: 'Carde/imaage4/imaage.jpeg',
        questionFile: 'Carde/imaage4/questions.html',
        questions: [
            { text: 'Which deity is seated beside Ganesha?', answer: 'Shiva', options: ['Vishnu', 'Shiva', 'Brahma', 'Indra'] },
            { type: 'text', text: 'What is burning in front of the family?', answer: 'A sacred fire' },
            { text: 'Which birds are perched in the trees?', answer: 'Parrots', options: ['Parrots', 'Peacocks', 'Swans', 'Crows'] },
            { text: 'What animal is seated on the left side of the scene?', answer: 'A deer', options: ['A deer', 'A cow', 'A horse', 'A monkey'] }
        ]
    },
    {
        image: 'Carde/imaage5/imaage.jpeg',
        questionFile: 'Carde/imaage5/questions.html',
        questions: [
            { text: 'What is Ganesha seated on?', answer: 'A decorated throne', options: ['A rock', 'A decorated throne', 'A boat', 'A swing'] },
            { type: 'text', text: 'What hangs from the ceiling of the temple?', answer: 'A bell' },
            { text: 'What is the cow looking toward?', answer: 'The temple', options: ['The river', 'The temple', 'The mountain', 'The market'] },
            { text: 'Which colors are visible on the market awnings?', answer: 'Blue and orange', options: ['Blue and orange', 'Pink and white', 'Black and green', 'Purple and silver'] }
        ]
    },
    {
        image: 'Carde/imaage6/imaage.jpeg',
        questionFile: 'Carde/imaage6/questions.html',
        questions: [
            { text: 'What is Ganesha holding in the center?', answer: 'A sweet', options: ['A sweet', 'A flower', 'A bell', 'A flag'] },
            { type: 'text', text: 'What is behind the figures in the scene?', answer: 'A waterfall' },
            { text: 'Which animal appears many times in the trees?', answer: 'A squirrel', options: ['A squirrel', 'A cow', 'A camel', 'A rabbit'] },
            { text: 'What is in front of the seated figures?', answer: 'A cooking fire', options: ['A cooking fire', 'A fountain', 'A stage', 'A pond'] }
        ]
    },
    {
        image: 'Carde/imaage7/imaage.jpeg',
        questionFile: 'Carde/imaage7/questions.html',
        questions: [
            { text: 'Who is seated in the center of the first scene?', answer: 'Ganesha', options: ['Ganesha', 'Shiva', 'A priest', 'A child'] },
            { type: 'text', text: 'What is held in Ganesha\'s lower right hand?', answer: 'A sweet' },
            { text: 'What is hanging from the top of the scene?', answer: 'Temple bells', options: ['Temple bells', 'Banners', 'Lanterns', 'Fruit'] },
            { text: 'What is in the large bowl at the bottom?', answer: 'Modaks', options: ['Modaks', 'Rice', 'Flowers', 'Coins'] }
        ]
    },
    {
        image: 'Carde/imaage8/image.jpeg',
        questionFile: 'Carde/imaage8/questions.html',
        questions: [
            { text: 'Who is seated beside Ganesha on the left?', answer: 'Shiva', options: ['Shiva', 'Vishnu', 'Brahma', 'A priest'] },
            { type: 'text', text: 'What large bird is standing on the right side of the garden?', answer: 'A peacock' },
            { text: 'What can be seen in the background behind the family?', answer: 'A waterfall', options: ['A waterfall', 'A palace', 'A desert', 'A marketplace'] },
            { text: 'What fills the foreground pond?', answer: 'Lotus flowers', options: ['Lotus flowers', 'Boats', 'Gold coins', 'Rocks'] }
        ]
    }
];

class GaneshaQuestApp {
    constructor() {
        this.currentSlide = 0;
        this.playerName = 'Seeker';
        this.playerCombo = '108';
        this.gameMode = 'match'; // 'match' | 'observation'
        this.level = 1;
        this.score = 0;
        this.streak = 1;
        this.lives = 3;
        this.timer = null;
        this.timeLeft = 45;
        this.obsLoadToken = 0; // guards against stale async scene loads
        this.obsFsOpening = Promise.resolve(); // resolves when the maximise animation ends

        // The leaderboard uses the configured Supabase project only.
        this.supabaseUrl = 'https://bbonclhkcgpjeskovchr.supabase.co';
        this.supabaseKey = 'sb_publishable_H9_xzuxrGJQnSH5zbTgZyw_PKFxu6VL';
        this.supabaseClient = null;

        this.initSupabaseClient();
    }

    initSupabaseClient() {
        if (!this.supabaseUrl || !this.supabaseKey || !window.supabase) {
            console.error('Supabase client is unavailable');
            return;
        }

        try {
            this.supabaseClient = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
        } catch (error) {
            console.warn('Leaderboard service unavailable', error);
        }
    }

    // Slide Navigation
    slideTo(index) {
        sounds.playFlip();
        if (index !== 2) this.closeObsFullscreen(false);
        this.currentSlide = index;
        const slider = document.getElementById('viewportSlider');
        slider.style.transform = `translateX(-${index * 100}vw)`;
    }

    toggleAudio() {
        sounds.enabled = !sounds.enabled;
        document.getElementById('soundIcon').textContent = sounds.enabled ? '🔔' : '🔕';
        document.getElementById('soundText').textContent = sounds.enabled ? 'Sound ON' : 'Sound OFF';
        if (sounds.enabled) sounds.playBell();
    }

    selectSetupMode(m) {
        this.gameMode = m;
        document.getElementById('setupModeMatch').classList.toggle('active', m === 'match');
        document.getElementById('setupModeObs').classList.toggle('active', m === 'observation');
        sounds.playFlip();
    }

    confirmPlayerAndStart() {
        const nameVal = document.getElementById('playerNameInput').value.trim();
        const comboVal = document.getElementById('playerComboInput').value.trim();

        if (!nameVal || !comboVal) {
            document.getElementById('playerNameInput').reportValidity();
            document.getElementById('playerComboInput').reportValidity();
            return;
        }

        this.playerName = nameVal;
        this.playerCombo = comboVal;

        // Update HUD
        document.getElementById('hudPlayerName').textContent = this.playerName;
        document.getElementById('hudPlayerCombo').textContent = '#' + this.playerCombo;

        this.level = 1;
        this.score = 0;
        this.streak = 1;
        this.lives = 3;

        this.slideTo(2);
        this.startLevel();
    }

    startLevel() {
        this.updateHUD();
        document.getElementById('educationalLoreBanner').classList.add('hidden');

        if (this.gameMode === 'match') {
            this.initMatchLevel();
        } else {
            this.initObsLevel();
        }
    }

    updateHUD() {
        document.getElementById('hudScore').textContent = this.score.toLocaleString();
        document.getElementById('hudCombo').textContent = `🔥 ${this.streak}x`;
        document.getElementById('hudLives').textContent = '❤️ '.repeat(Math.max(0, this.lives));

        // Mirror into the full-screen stage HUD
        const mirror = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };
        mirror('fsScore', this.score.toLocaleString());
        mirror('fsCombo', `🔥 ${this.streak}x`);
        mirror('fsLives', '❤️ '.repeat(Math.max(0, this.lives)));

        let levelDesc = `Level ${this.level}`;
        if (this.level === 1) levelDesc += ' (4x2 Grid)';
        else if (this.level === 2) levelDesc += ' (4x3 Grid)';
        else if (this.level === 3) levelDesc += ' (4x4 Grid)';
        else levelDesc += ' (5x4 Grid)';

        document.getElementById('hudLevelBadge').textContent = levelDesc;
    }

    // MODE A: SACRED CARD MATCH
    initMatchLevel() {
        document.getElementById('matchBoardContainer').classList.remove('hidden');
        document.getElementById('obsBoardContainer').classList.add('hidden');
        this.closeObsFullscreen(false);

        // Level configuration pair count
        let pairCount = 4;
        if (this.level === 2) pairCount = 6;
        else if (this.level === 3) pairCount = 8;
        else if (this.level >= 4) pairCount = 10;

        this.matchedPairs = 0;
        this.totalPairs = pairCount;
        this.flippedCards = [];
        this.lives = 3;
        this.matchPreview = true;
        clearTimeout(this.matchPreviewTimer);

        const pool = [...FESTIVAL_ITEMS].sort(() => 0.5 - Math.random()).slice(0, pairCount);
        const deck = [...pool, ...pool].sort(() => 0.5 - Math.random());

        const grid = document.getElementById('matchGrid');
        grid.innerHTML = '';

        // Dynamic grid cols
        if (pairCount === 4) grid.className = 'grid grid-cols-4 gap-3 max-w-xl mx-auto w-full p-4 rounded-2xl bg-slate-950/70 border border-gold-500/20';
        else if (pairCount === 6) grid.className = 'grid grid-cols-4 sm:grid-cols-4 gap-3 max-w-2xl mx-auto w-full p-4 rounded-2xl bg-slate-950/70 border border-gold-500/20';
        else if (pairCount === 8) grid.className = 'grid grid-cols-4 gap-3 max-w-3xl mx-auto w-full p-4 rounded-2xl bg-slate-950/70 border border-gold-500/20';
        else grid.className = 'grid grid-cols-4 sm:grid-cols-5 gap-3 max-w-4xl mx-auto w-full p-3 rounded-2xl bg-slate-950/70 border border-gold-500/20';

        deck.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'flip-card h-24 sm:h-28 perspective-1000 cursor-pointer';
            card.dataset.symbol = item.symbol;

            card.innerHTML = `
                        <div class="flip-card-inner">
                            <div class="flip-card-front glass-card flex flex-col items-center justify-center p-2 text-gold-400">
                                <span class="text-2xl sm:text-3xl">🕉️</span>
                                <span class="text-[9px] font-bold uppercase tracking-widest text-amber-200/60 mt-1">Bappa</span>
                            </div>
                            <div class="flip-card-back glass-panel bg-gradient-to-b from-maroon-900 to-slate-950 border-2 border-gold-400 flex flex-col items-center justify-center p-2 text-center">
                                <span class="text-3xl sm:text-4xl">${item.symbol}</span>
                                <span class="text-[10px] font-serif font-bold text-gold-300 mt-1 leading-tight">${item.name}</span>
                            </div>
                        </div>
                    `;

            card.onclick = () => this.handleCardClick(card, item);
            grid.appendChild(card);
        });

        const cards = [...grid.querySelectorAll('.flip-card')];
        cards.forEach(card => card.classList.add('flipped'));
        this.matchPreviewTimer = setTimeout(() => {
            cards.forEach(card => card.classList.remove('flipped'));
            this.matchPreview = false;
            this.matchPreviewTimer = null;
            this.startTimer(pairCount * 8);
        }, 3000);
    }

    handleCardClick(card, item) {
        if (this.matchPreview || this.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

        sounds.playFlip();
        card.classList.add('flipped');
        this.flippedCards.push({ card, item });

        if (this.flippedCards.length === 2) {
            const [c1, c2] = this.flippedCards;
            if (c1.item.symbol === c2.item.symbol) {
                // Match Found!
                setTimeout(() => {
                    sounds.playMatch();
                    c1.card.classList.add('matched');
                    c2.card.classList.add('matched');

                    // Show Educational Lore Banner
                    document.getElementById('loreSymbol').textContent = c1.item.symbol;
                    document.getElementById('loreTitle').textContent = `${c1.item.name} Lore`;
                    document.getElementById('loreText').textContent = c1.item.lore;
                    document.getElementById('educationalLoreBanner').classList.remove('hidden');

                    this.matchedPairs++;
                    this.score += 200 * this.streak;
                    this.streak++;
                    this.updateHUD();
                    this.flippedCards = [];

                    if (this.matchedPairs === this.totalPairs) {
                        this.handleLevelComplete();
                    }
                }, 400);
            } else {
                // Wrong Match
                setTimeout(() => {
                    sounds.playWrong();
                    c1.card.classList.remove('flipped');
                    c2.card.classList.remove('flipped');
                    this.streak = 1;
                    this.lives--;
                    this.updateHUD();
                    this.flippedCards = [];

                    if (this.lives <= 0) {
                        this.handleGameOver();
                    }
                }, 900);
            }
        }
    }

    // MODE B: OBSERVATION QUEST
    initObsLevel() {
        document.getElementById('matchBoardContainer').classList.add('hidden');
        document.getElementById('obsBoardContainer').classList.remove('hidden');
        document.getElementById('obsBoardContainer').classList.add('flex');

        // Hide any stale image from a previous run until the new one has loaded
        const image = document.getElementById('obsSceneImage');
        image.classList.add('is-loading');
        image.removeAttribute('src');
        document.getElementById('obsSceneBackdrop').classList.remove('ready');

        // Open the scene full screen (Mac-style "maximise" animation)
        this.openObsFullscreen();

        this.obsScenes = [...OBSERVATION_SCENES].sort(() => 0.5 - Math.random());
        this.obsSceneIndex = 0;

        // Show the full time but do NOT start counting down yet.
        // The clock starts only after the first scene image has loaded.
        this.pauseTimer();
        this.timeLeft = 300;
        this.updateTimerDisplay();

        this.showNextObservationScene();
    }

    // ---- Full-screen stage --------------------------------------------
    openObsFullscreen() {
        const layer = document.getElementById('obsFullscreen');
        const frame = document.getElementById('obsFsFrame');
        document.getElementById('obsMemoryCard').classList.remove('flipped');
        document.getElementById('obsMemoryCardInner').style.transform = '';

        if (layer.classList.contains('open')) {
            this.obsFsOpening = Promise.resolve();
            return;
        }
        layer.classList.add('open');
        layer.setAttribute('aria-hidden', 'false');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !frame.animate) {
            this.obsFsOpening = Promise.resolve();
            return;
        }

        // Grow from a smaller rounded window to the full screen, like a Mac maximise
        const opts = { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' };
        layer.animate(
            [{ backgroundColor: 'rgba(5, 2, 11, 0)' }, { backgroundColor: 'rgba(5, 2, 11, 1)' }],
            opts
        );
        const grow = frame.animate([
            { transform: 'scale(0.55)', borderRadius: '32px', opacity: 0.2 },
            { transform: 'scale(1)', borderRadius: '0px', opacity: 1 }
        ], opts);
        this.obsFsOpening = grow.finished.catch(() => { });
    }

    async closeObsFullscreen(animate = true) {
        const layer = document.getElementById('obsFullscreen');
        const frame = document.getElementById('obsFsFrame');
        if (!layer.classList.contains('open')) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (animate && !reduceMotion && frame.animate) {
            const opts = { duration: 260, easing: 'ease-in', fill: 'forwards' };
            const fade = layer.animate(
                [{ backgroundColor: 'rgba(5, 2, 11, 1)' }, { backgroundColor: 'rgba(5, 2, 11, 0)' }],
                opts
            );
            const shrink = frame.animate([
                { transform: 'scale(1)', borderRadius: '0px', opacity: 1 },
                { transform: 'scale(0.55)', borderRadius: '32px', opacity: 0 }
            ], opts);
            await shrink.finished.catch(() => { });
            layer.classList.remove('open');
            fade.cancel();
            shrink.cancel();
        } else {
            layer.classList.remove('open');
        }
        layer.setAttribute('aria-hidden', 'true');
    }

    // Exit button on the full-screen stage
    async exitObservation() {
        this.obsLoadToken++; // cancel any scene that is still loading
        clearTimeout(this.obsRevealTimer);
        this.obsRevealTimer = null;
        this.pauseTimer();
        await this.closeObsFullscreen(true);
        this.slideTo(0);
    }

    // Loads `src` into the visible <img> and resolves true once it has fully
    // loaded (false on error/timeout). The card is hidden or flipped while this
    // runs, so the player never sees a half-loaded image.
    loadSceneImage(image, src, timeoutMs = 15000) {
        return new Promise(resolve => {
            let finished = false;
            let timeoutId = null;
            const finish = ok => {
                if (finished) return;
                finished = true;
                clearTimeout(timeoutId);
                image.onload = image.onerror = null;
                resolve(ok);
            };
            timeoutId = setTimeout(() => finish(false), timeoutMs);
            image.onload = () => finish(true);
            image.onerror = () => finish(false);
            image.src = src;
            if (image.complete && image.naturalWidth > 0) finish(true);
        });
    }

    async loadObservationQuestions(scene) {
        try {
            const response = await fetch(scene.questionFile, { cache: 'no-store' });
            if (!response.ok) throw new Error(`Question file returned ${response.status}`);

            const html = await response.text();
            const documentFromFile = new DOMParser().parseFromString(html, 'text/html');
            const questionData = JSON.parse(documentFromFile.getElementById('questions').textContent);
            if (!Array.isArray(questionData) || questionData.length === 0) throw new Error('Question file is empty');
            return questionData;
        } catch (error) {
            console.warn(`Using backup questions for ${scene.image}`, error);
            return scene.questions;
        }
    }

    async showNextObservationScene() {
        const token = ++this.obsLoadToken;
        const scene = this.obsScenes[this.obsSceneIndex];
        const revealSeconds = 6;
        const card = document.getElementById('obsMemoryCard');
        const cardInner = document.getElementById('obsMemoryCardInner');
        const image = document.getElementById('obsSceneImage');
        const progressBar = document.getElementById('obsProgressBar');

        // Freeze every clock until the image is actually on screen
        this.pauseTimer();
        clearTimeout(this.obsRevealTimer);
        this.obsRevealTimer = null;
        this.obsQuestionLocked = true;

        document.getElementById('obsSceneCounter').textContent = `Scene ${this.obsSceneIndex + 1} of ${this.obsScenes.length}`;
        document.getElementById('obsRevealLabel').textContent = 'Loading scene…';
        progressBar.style.transitionDuration = '0s';
        progressBar.style.width = '100%';

        // Wait for the question file AND the image to finish loading
        const [questions, imageLoaded] = await Promise.all([
            this.loadObservationQuestions(scene),
            this.loadSceneImage(image, scene.image)
        ]);
        if (token !== this.obsLoadToken) return; // a newer load took over

        if (!imageLoaded) {
            // Don't make the player lose time on an image they can't see
            console.warn(`Could not load scene image, skipping: ${scene.image}`);
            this.obsSceneIndex++;
            if (this.obsSceneIndex >= this.obsScenes.length) {
                this.handleLevelComplete();
            } else {
                this.showNextObservationScene();
            }
            return;
        }

        const question = questions[Math.floor(Math.random() * questions.length)];
        const wasFlipped = card.classList.contains('flipped');

        card.classList.remove('flipped');
        cardInner.style.transform = '';
        image.classList.remove('is-loading');
        const backdrop = document.getElementById('obsSceneBackdrop');
        backdrop.style.backgroundImage = `url("${scene.image}")`;
        backdrop.classList.add('ready');
        document.getElementById('obsRevealLabel').textContent = 'Memorize this scene';
        document.getElementById('quizQuestionText').textContent = question.text;

        const optionsGrid = document.getElementById('quizOptionsGrid');
        optionsGrid.innerHTML = '';
        if (question.type === 'text') {
            optionsGrid.className = 'flex flex-col gap-3 pt-2';
            optionsGrid.innerHTML = `
                <input id="obsTextAnswer" type="text" autocomplete="off"
                    placeholder="Type your answer"
                    class="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-gold-500/30 text-gold-200 placeholder-slate-500 focus:outline-none focus:border-gold-400 font-medium text-sm">
                <button id="obsTextSubmit" type="button"
                    class="py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-gold-400 text-maroon-950 font-bold uppercase tracking-wide">
                    Submit Answer
                </button>`;
            const input = document.getElementById('obsTextAnswer');
            document.getElementById('obsTextSubmit').onclick = () => {
                const typedAnswer = input.value.trim();
                if (!typedAnswer) {
                    input.focus();
                    return;
                }
                const acceptedAnswers = Array.isArray(question.answer) ? question.answer : [question.answer];
                const isCorrect = acceptedAnswers.some(answer => typedAnswer.toLowerCase() === answer.trim().toLowerCase());
                this.answerObservationQuestion(isCorrect, optionsGrid);
            };
            input.onkeydown = event => {
                if (event.key === 'Enter') document.getElementById('obsTextSubmit').click();
            };
        } else {
            optionsGrid.className = 'grid grid-cols-2 gap-3 pt-2';
            [...question.options].sort(() => 0.5 - Math.random()).forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'py-3 rounded-xl glass-card hover:border-gold-400 text-gold-300 font-bold text-lg';
                btn.textContent = option;
                btn.onclick = () => {
                    this.answerObservationQuestion(option === question.answer, optionsGrid);
                };
                optionsGrid.appendChild(btn);
            });
        }

        // Let the flip-back animation finish so the image is fully visible
        if (wasFlipped) await new Promise(resolve => setTimeout(resolve, 800));
        // ...and let the full-screen "maximise" animation finish
        await this.obsFsOpening;
        if (token !== this.obsLoadToken) return;

        // Image is loaded and visible: NOW start the game timer,
        // the progress bar and the 6-second memorise countdown.
        this.resumeTimer();
        progressBar.style.transitionDuration = '0s';
        progressBar.style.width = '100%';
        setTimeout(() => {
            progressBar.style.transitionDuration = revealSeconds + 's';
            progressBar.style.width = '0%';
        }, 50);

        clearTimeout(this.obsRevealTimer);
        this.obsRevealTimer = setTimeout(() => {
            sounds.playBell();
            card.classList.add('flipped');
            document.getElementById('obsRevealLabel').textContent = 'Answer the question';
            this.obsQuestionLocked = false;
            this.obsRevealTimer = null;
        }, revealSeconds * 1000);
    }

    answerObservationQuestion(isCorrect, optionsGrid) {
        if (this.obsQuestionLocked) return;
        this.obsQuestionLocked = true;
        clearTimeout(this.obsRevealTimer);
        this.obsRevealTimer = null;
        [...optionsGrid.querySelectorAll('button')].forEach(button => {
            button.disabled = true;
            button.classList.add('opacity-60');
        });

        if (isCorrect) {
            sounds.playMatch();
            this.score += 500 * this.streak;
            this.streak++;
        } else {
            sounds.playWrong();
            this.lives--;
            this.streak = 1;
        }
        this.updateHUD();

        if (this.lives <= 0) {
            this.handleGameOver();
            return;
        }

        this.obsSceneIndex++;
        if (this.obsSceneIndex >= this.obsScenes.length) {
            this.handleLevelComplete();
        } else {
            setTimeout(() => this.showNextObservationScene(), 500);
        }
    }

    startTimer(seconds) {
        clearInterval(this.timer);
        this.timeLeft = seconds;
        this.updateTimerDisplay();
        this.resumeTimer();
    }

    pauseTimer() {
        clearInterval(this.timer);
        this.timer = null;
    }

    resumeTimer() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                sounds.playWrong();
                this.handleGameOver();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const m = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
        const s = (this.timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('hudTimer').textContent = `${m}:${s}`;
        const fsTimer = document.getElementById('fsTimer');
        if (fsTimer) fsTimer.textContent = `${m}:${s}`;
    }

    handleLevelComplete() {
        clearInterval(this.timer);
        this.closeObsFullscreen(false);
        sounds.playVictory();
        if (particlesInstance) particlesInstance.triggerConfetti();

        document.getElementById('victoryTitle').textContent = `Level ${this.level} Cleared! 🎉`;
        document.getElementById('victorySubtitle').textContent = 'Blessed with divine focus and memory!';
        document.getElementById('vicFinalScore').textContent = this.score.toLocaleString();
        document.getElementById('vicLevel').textContent = `Level ${this.level}`;
        document.getElementById('vicNextBtn').textContent = 'Next Level ➡️';

        this.saveScoreToDatabase();
        this.openModal('victoryModal');
    }

    handleGameOver() {
        clearInterval(this.timer);
        this.closeObsFullscreen(false);
        document.getElementById('victoryTitle').textContent = 'Quest Complete';
        document.getElementById('victorySubtitle').textContent = 'May Bappa bless you with even greater focus next time!';
        document.getElementById('vicFinalScore').textContent = this.score.toLocaleString();
        document.getElementById('vicLevel').textContent = `Level ${this.level}`;
        document.getElementById('vicNextBtn').textContent = 'Try Again 🔄';

        this.saveScoreToDatabase();
        this.openModal('victoryModal');
    }

    nextLevelOrRestart() {
        this.closeModal('victoryModal');
        if (this.lives > 0) {
            this.level++;
        } else {
            this.level = 1;
            this.score = 0;
            this.lives = 3;
            this.streak = 1;
        }
        this.startLevel();
    }

    async saveScoreToDatabase() {
        const record = {
            player_name: this.playerName,
            combination_id: this.playerCombo,
            score: this.score,
            level: this.level,
            time_seconds: 45 - this.timeLeft,
            created_at: new Date().toISOString()
        };

        if (!this.supabaseClient) {
            console.error('Score was not saved because Supabase is unavailable');
            return;
        }

        try {
            const { error } = await this.supabaseClient.from('ganesha_memory_scores').insert([record]);
            if (error) throw error;
        } catch (error) {
            console.error('Could not save score to Supabase', error);
        }
    }

    async openLeaderboardScreen() {
        this.closeModal('victoryModal');
        this.slideTo(3);
        await this.loadLeaderboardData();
    }

    async loadLeaderboardData() {
        const tbody = document.getElementById('leaderboardTbody');
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-amber-200/60">Loading scores...</td></tr>';

        if (!this.supabaseClient) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-300">Leaderboard connection unavailable.</td></tr>';
            return;
        }

        let scores;
        try {
            const { data, error } = await this.supabaseClient
                .from('ganesha_memory_scores')
                .select('*')
                .order('score', { ascending: false })
                .order('level', { ascending: false })
                .order('time_seconds', { ascending: true });
            if (error) throw error;
            this.leaderboardRecords = data || [];
            const uniquePlayers = new Map();
            this.leaderboardRecords.forEach(score => {
                const playerName = (score.player_name || 'Seeker').trim();
                const playerKey = playerName.toLowerCase();
                if (!uniquePlayers.has(playerKey)) {
                    uniquePlayers.set(playerKey, { ...score, player_name: playerName });
                }
            });
            scores = [...uniquePlayers.values()].slice(0, 20);
        } catch (error) {
            console.error('Could not load scores from Supabase', error);
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-300">Leaderboard unavailable. Please try again.</td></tr>';
            return;
        }

        if (scores.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-amber-200/50">No scores logged yet. Be the first seeker!</td></tr>';
            return;
        }

        tbody.innerHTML = '';
        scores.forEach((s, idx) => {
            const row = document.createElement('tr');
            row.className = idx % 2 === 0 ? 'bg-slate-900/40' : 'bg-slate-950/60';
            row.innerHTML = `
                <td class="p-3 font-bold ${idx === 0 ? 'text-gold-400 text-base' : 'text-slate-300'}">#${idx + 1}</td>
                <td class="p-3"></td>
                <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">${s.combination_id || '#108'}</span></td>
                <td class="p-3 font-serif font-bold text-gold-300">${(s.score || 0).toLocaleString()}</td>
                <td class="p-3">Lvl ${s.level || 1}</td>
                <td class="p-3 text-slate-400">${s.time_seconds || 0}s</td>
            `;
            const nameButton = document.createElement('button');
            nameButton.type = 'button';
            nameButton.className = 'font-bold text-amber-200 hover:text-gold-300 underline decoration-amber-500/40 underline-offset-4';
            nameButton.textContent = s.player_name || 'Seeker';
            nameButton.onclick = () => this.openPlayerRecords(s.player_name || 'Seeker');
            row.children[1].appendChild(nameButton);
            tbody.appendChild(row);
        });
    }

    openPlayerRecords(playerName) {
        const playerKey = playerName.trim().toLowerCase();
        const records = (this.leaderboardRecords || [])
            .filter(record => (record.player_name || 'Seeker').trim().toLowerCase() === playerKey)
            .sort((a, b) => (b.score || 0) - (a.score || 0) || (b.level || 0) - (a.level || 0));
        const title = document.getElementById('playerRecordsTitle');
        const body = document.getElementById('playerRecordsTbody');
        title.textContent = `${playerName} - All Records`;
        body.innerHTML = '';
        records.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="p-3">Lvl ${record.level || 1}</td>
                <td class="p-3 font-serif font-bold text-gold-300">${(record.score || 0).toLocaleString()}</td>
                <td class="p-3">${record.combination_id || '#108'}</td>
                <td class="p-3 text-slate-400">${record.time_seconds || 0}s</td>
                <td class="p-3 text-slate-400">${record.created_at ? new Date(record.created_at).toLocaleDateString() : '-'}</td>
            `;
            body.appendChild(row);
        });
        this.openModal('playerRecordsModal');
    }

    openModal(id) {
        document.getElementById(id).classList.remove('hidden');
    }

    closeModal(id) {
        document.getElementById(id).classList.add('hidden');
    }
}

let gameApp;
window.addEventListener('DOMContentLoaded', () => {
    gameApp = new GaneshaQuestApp();
});