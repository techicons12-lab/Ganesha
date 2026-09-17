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

        this.playerName = nameVal || 'Seeker Aarav';
        this.playerCombo = comboVal || 'Aarav#108';

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

        // Level configuration pair count
        let pairCount = 4;
        if (this.level === 2) pairCount = 6;
        else if (this.level === 3) pairCount = 8;
        else if (this.level >= 4) pairCount = 10;

        this.matchedPairs = 0;
        this.totalPairs = pairCount;
        this.flippedCards = [];

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

        this.startTimer(pairCount * 8);
    }

    handleCardClick(card, item) {
        if (this.flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return;

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
        document.getElementById('obsQuizStage').classList.add('hidden');
        document.getElementById('obsGrid').classList.remove('hidden');

        const totalItems = 6 + (this.level * 2);
        const pool = [...FESTIVAL_ITEMS].sort(() => 0.5 - Math.random()).slice(0, 4);

        this.obsItems = [];
        for (let i = 0; i < totalItems; i++) {
            this.obsItems.push(pool[Math.floor(Math.random() * pool.length)]);
        }

        const grid = document.getElementById('obsGrid');
        grid.innerHTML = '';
        this.obsItems.forEach(item => {
            const cell = document.createElement('div');
            cell.className = 'h-20 glass-card rounded-xl flex flex-col items-center justify-center p-2 text-center';
            cell.innerHTML = `<span class="text-3xl">${item.symbol}</span><span class="text-[9px] text-amber-200/70 font-bold mt-1">${item.name}</span>`;
            grid.appendChild(cell);
        });

        const obsTime = 6;
        const bar = document.getElementById('obsProgressBar');
        bar.style.transitionDuration = '0s';
        bar.style.width = '100%';
        setTimeout(() => {
            bar.style.transitionDuration = obsTime + 's';
            bar.style.width = '0%';
        }, 50);

        setTimeout(() => {
            this.showObsQuiz(pool);
        }, obsTime * 1000);

        this.startTimer(obsTime + 30);
    }

    showObsQuiz(pool) {
        sounds.playBell();
        document.getElementById('obsGrid').classList.add('hidden');
        document.getElementById('obsQuizStage').classList.remove('hidden');
        document.getElementById('obsQuizStage').classList.add('flex');

        const target = pool[Math.floor(Math.random() * pool.length)];
        const actual = this.obsItems.filter(i => i.symbol === target.symbol).length;

        document.getElementById('quizQuestionText').innerHTML = `How many <span class="text-gold-400 font-bold">${target.name}s</span> (${target.symbol}) were visible?`;

        const options = new Set([actual]);
        while (options.size < 4) {
            let fake = actual + (Math.floor(Math.random() * 5) - 2);
            if (fake >= 0) options.add(fake);
        }

        const optionsArr = Array.from(options).sort((a, b) => a - b);
        const grid = document.getElementById('quizOptionsGrid');
        grid.innerHTML = '';
        optionsArr.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'py-3 rounded-xl glass-card hover:border-gold-400 text-gold-300 font-bold text-lg';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === actual) {
                    sounds.playMatch();
                    this.score += 500 * this.streak;
                    this.streak++;
                    this.handleLevelComplete();
                } else {
                    sounds.playWrong();
                    this.lives--;
                    this.updateHUD();
                    if (this.lives <= 0) this.handleGameOver();
                    else this.startLevel();
                }
            };
            grid.appendChild(btn);
        });
    }

    startTimer(seconds) {
        clearInterval(this.timer);
        this.timeLeft = seconds;
        this.updateTimerDisplay();
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
    }

    handleLevelComplete() {
        clearInterval(this.timer);
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
                .limit(20);
            if (error) throw error;
            scores = data || [];
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
                        <td class="p-3 font-bold text-amber-200">${s.player_name || 'Seeker'}</td>
                        <td class="p-3"><span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">${s.combination_id || '#108'}</span></td>
                        <td class="p-3 font-serif font-bold text-gold-300">${(s.score || 0).toLocaleString()}</td>
                        <td class="p-3">Lvl ${s.level || 1}</td>
                        <td class="p-3 text-slate-400">${s.time_seconds || 0}s</td>
                    `;
            tbody.appendChild(row);
        });
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

