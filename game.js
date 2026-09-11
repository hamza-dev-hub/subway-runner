/**
 * Subway Runners 3D — ULTRA PROFESSIONAL EDITION
 * ════════════════════════════════════════════════
 * • Cinematic Three.js rendering — ACES tonemapping, PCF soft shadows
 * • Detailed anatomical character with smooth lerped animations
 * • Premium subway trains — metallic, window glow, nose cone, bogies
 * • Neon city buildings — window grids, rooftop details, billboards
 * • Dynamic lighting — coloured point lights, headlight cones
 * • Speed lines overlay canvas effect
 * • Full UI integration — speed bar, coin pop, screen shake
 * • 4 character skins | shop | spin wheel | powerups
 */

// ─── Pro Web Audio Engine ────────────────────────────────────────────────────
class ProSoundEngine {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.bgmPlaying = false;
        this.bgmStep = 0;
        this.timer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }

    playCoin() {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            [1046.50, 1318.51, 1567.98].forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, t + i * 0.03);
                gain.gain.setValueAtTime(0.1, t + i * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.03 + 0.14);
                osc.connect(gain); gain.connect(this.ctx.destination);
                osc.start(t + i * 0.03);
                osc.stop(t + i * 0.03 + 0.14);
            });
        } catch (e) {}
    }

    playJump() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(240, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.18);
            gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + 0.18);
        } catch (e) {}
    }

    playSlide() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.24);
            gain.gain.setValueAtTime(0.16, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.24);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + 0.24);
        } catch (e) {}
    }

    playCrash() {
        if (!this.soundEnabled) return;
        this.playTone(100, 'sawtooth', 0.45, 0.5);
        this.playTone(50, 'square', 0.5, 0.55);
    }

    playPowerUp() {
        if (!this.soundEnabled) return;
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((f, i) => {
            setTimeout(() => this.playTone(f, 'triangle', 0.14, 0.2), i * 60);
        });
    }

    playWhistle() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(2600, t);
            const lfo = this.ctx.createOscillator();
            lfo.frequency.setValueAtTime(28, t);
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.setValueAtTime(180, t);
            lfo.connect(osc.frequency);
            lfo.start(t);
            lfo.stop(t + 0.65);

            gain.gain.setValueAtTime(0.22, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.65);
        } catch (e) {}
    }

    playBark() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(320, t);
            osc.frequency.exponentialRampToValueAtTime(80, t + 0.19);
            gain.gain.setValueAtTime(0.32, t);
            gain.gain.linearRampToValueAtTime(0.01, t + 0.19);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t);
            osc.stop(t + 0.19);
        } catch (e) {}
    }

    playSprayHiss(duration = 1.2) {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const bufferSize = Math.floor(this.ctx.sampleRate * duration);
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 3400;
            filter.Q.value = 1.8;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            noise.start();
        } catch (e) {}
    }

    playKeyPickup() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            [1318.51, 1760.00, 2093.00].forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(f, t + i * 0.08);
                gain.gain.setValueAtTime(0.22, t + i * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.08);
                osc.stop(t + i * 0.08 + 0.35);
            });
        } catch(e) {}
    }

    playGiftOpen() {
        if (!this.soundEnabled) return;
        this.init(); if (!this.ctx) return;
        try {
            const t = this.ctx.currentTime;
            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(f, t + i * 0.07);
                gain.gain.setValueAtTime(0.25, t + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.07 + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(t + i * 0.07);
                osc.stop(t + i * 0.07 + 0.4);
            });
        } catch(e) {}
    }

    startBGM() {
        if (this.bgmPlaying || !this.soundEnabled) return;
        this.bgmPlaying = true;
        this.init();
        const melody = [261.63, 293.66, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66];
        const bass   = [130.81, 130.81, 164.81, 196.00, 130.81, 164.81, 196.00, 220.00];
        this.timer = setInterval(() => {
            if (!this.bgmPlaying || !this.soundEnabled) return;
            this.playTone(melody[this.bgmStep % melody.length], 'triangle', 0.12, 0.06);
            this.playTone(bass[this.bgmStep % bass.length], 'sine', 0.16, 0.07);
            this.bgmStep++;
        }, 180);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
    }
}

const audio = new ProSoundEngine();

// ─── Character Skin Definitions ─────────────────────────────────────────────
const SKINS = [
    { id: 'runner_man', name: 'Runner Man', label: 'Leather Bomber', price: 0,   jacket: 0x3e2015, hair: 0x4c2517, jeans: 0x1b232e, shoes: 0x161a22, stripe: 0xff7700, icon: '👦' },
    { id: 'jake',       name: 'Jake',       label: 'Street Blue',   price: 150, jacket: 0x0088ff, hair: 0x221811, jeans: 0x24303c, shoes: 0xff4400, stripe: 0x00ffff, icon: '🧢' },
    { id: 'tricky',     name: 'Tricky',     label: 'Gold Beanie',   price: 300, jacket: 0xffaa00, hair: 0xe63b1e, jeans: 0x111122, shoes: 0x00cc44, stripe: 0xffd700, icon: '👧' },
    { id: 'ninja',      name: 'Phantom',    label: 'Cyber Phantom', price: 600, jacket: 0x1a1a2e, hair: 0x00f0ff, jeans: 0x0d0d18, shoes: 0x00f0ff, stripe: 0x00ff88, icon: '🥷' }
];

// ─── Subway Surfers Inspired Vibrant Train Liveries ─────────────────────────
const TRAIN_LIVERIES = [
    { name: 'Ruby Metro',      body: 0xba1a1a, roof: 0xefefef, stripe: 0xffd600, rib: 0x800000, nose: 0x940000, ws: 0x050c18, win: 0xffe57f },
    { name: 'Cyan Express',    body: 0x00838f, roof: 0xe0f7fa, stripe: 0xff6d00, rib: 0x004d40, nose: 0x006064, ws: 0x050c18, win: 0xd8f5ff },
    { name: 'Sunset Commuter', body: 0xd84315, roof: 0x263238, stripe: 0xffeb3b, rib: 0xbf360c, nose: 0xbf360c, ws: 0x050c18, win: 0xfff8e1 },
    { name: 'Emerald Liner',   body: 0x1b5e20, roof: 0xf5f5f5, stripe: 0x76ff03, rib: 0x0d3311, nose: 0x144a19, ws: 0x050c18, win: 0xe8f5e9 },
    { name: 'Cyber Violet',    body: 0x4a148c, roof: 0x1a1a2e, stripe: 0x00f0ff, rib: 0x311b92, nose: 0x38006b, ws: 0x050c18, win: 0xffd6fa }
];

// ─── Main Game Engine ────────────────────────────────────────────────────────
class SubwayProGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');

        // Persistent data
        this.highScore     = parseInt(localStorage.getItem('ss_high_score')   || '10224');
        this.totalCoins    = parseInt(localStorage.getItem('ss_total_coins')  || '450');
        this.keys          = parseInt(localStorage.getItem('ss_keys')         || '5');
        this.hoverboards   = parseInt(localStorage.getItem('ss_hoverboards')  || '3');
        this.multiplier    = 1;
        this.claimedCoinAd = false;
        this.claimedVideoBonus = false;
        this.unlockedSkins = JSON.parse(localStorage.getItem('ss_skins')      || '["runner_man"]');
        let skinSaved = localStorage.getItem('ss_selected_skin');
        if (!skinSaved || skinSaved === 'madyson') skinSaved = 'runner_man';
        this.selectedSkin  = skinSaved;

        // Game state
        this.gameState   = 'LOADING';
        this.score       = 0;
        this.sessionCoins = 0;
        this.hasRevived  = false;

        // Lanes: Left=+3.6, Center=0, Right=-3.6
        this.laneWidth       = 3.6;
        this.lanes           = [this.laneWidth, 0, -this.laneWidth];
        this.currentLaneIdx  = 1;
        this.targetX         = 0;

        // Physics
        this.baseSpeed    = 28;
        this.currentSpeed = this.baseSpeed;
        this.maxSpeed     = 65;
        this.playerY      = 0;
        this.playerVy     = 0;
        this.gravity      = -48;
        this.jumpForce    = 18;
        this.isGrounded   = true;
        this.isSliding    = false;
        this.slideTimer   = 0;

        // Jetpack Flight State
        this.isFlying         = false;
        this.smokeParticles   = [];
        this.thrusterCooldown = 0;

        // Smooth animation lerp targets
        this.animLLA  = 0; // left arm
        this.animRLA  = 0; // right arm
        this.animLLeg = 0; // left leg
        this.animRLeg = 0; // right leg

        // Powerups & Durations (22s Magnet, 50s Jetpack)
        this.powerups = { magnet: 0, multiplier: 0, shield: 0, jetpack: 0 };
        this.powerupDurations = { magnet: 22.0, jetpack: 50.0, shield: 12.0, multiplier: 18.0 };

        // World objects & Collectibles
        this.trackSegments    = [];
        this.obstacles        = [];
        this.coins            = [];
        this.keyItems         = [];
        this.giftItems        = [];
        this.powerupItems     = [];
        this.particles        = [];
        this.skyCoinCooldown  = 0;

        // Speed lines overlay
        this.speedLinesCanvas = document.getElementById('speed-lines-canvas');
        this.speedLinesCtx    = this.speedLinesCanvas ? this.speedLinesCanvas.getContext('2d') : null;

        // Init subsystems
        this.initThree();
        this.buildCharacter();
        this.buildCinematicProps();
        this.buildSecurityGuard();
        this.buildGuardDog();
        this.initAtmosphere();
        this.initEnvironment();
        this.initPowerupPills();
        this.initJetpackThrusterParticles();
        this.bindEvents();
        this.setupAgeGate();
        this.updateUI();

        this.clock = new THREE.Clock();
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);

        this.initSplashScreen();
    }

    initPowerupPills() {
        this.powerupPillEls = {
            jetpack: {
                pill: document.getElementById('pill-jetpack'),
                time: document.getElementById('pill-jetpack-time'),
                bar:  document.getElementById('pill-jetpack-bar'),
                total: this.powerupDurations.jetpack
            },
            magnet: {
                pill: document.getElementById('pill-magnet'),
                time: document.getElementById('pill-magnet-time'),
                bar:  document.getElementById('pill-magnet-bar'),
                total: this.powerupDurations.magnet
            },
            shield: {
                pill: document.getElementById('pill-shield'),
                time: document.getElementById('pill-shield-time'),
                bar:  document.getElementById('pill-shield-bar'),
                total: this.powerupDurations.shield
            },
            multiplier: {
                pill: document.getElementById('pill-multiplier'),
                time: document.getElementById('pill-multiplier-time'),
                bar:  document.getElementById('pill-multiplier-bar'),
                total: this.powerupDurations.multiplier
            }
        };
    }

    initJetpackThrusterParticles() {
        this.jetpackParticlePool = [];
        const smokeGeo = new THREE.SphereGeometry(0.12, 6, 6);
        for (let i = 0; i < 36; i++) {
            const mat = new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.85 });
            const p = new THREE.Mesh(smokeGeo, mat);
            p.visible = false;
            this.scene.add(p);
            this.jetpackParticlePool.push({
                mesh: p,
                life: 0,
                maxLife: 0.45,
                vx: 0, vy: 0, vz: 0
            });
        }
    }

    spawnJetpackSmoke(x, y, z) {
        if (!this.jetpackParticlePool) return;
        const p = this.jetpackParticlePool.find(item => !item.mesh.visible);
        if (!p) return;
        p.mesh.visible = true;
        p.mesh.position.set(x + (Math.random() - 0.5) * 0.08, y, z);
        p.mesh.scale.set(1, 1, 1);
        p.mesh.material.opacity = 0.85;
        p.mesh.material.color.setHex(Math.random() > 0.4 ? 0xff5500 : 0xffaa00);
        p.life = 0;
        p.maxLife = 0.38 + Math.random() * 0.15;
        p.vx = (Math.random() - 0.5) * 0.4;
        p.vy = -1.5 - Math.random() * 1.2;
        p.vz = -(this.currentSpeed * 0.4 + 4.0);
    }

    updateJetpackParticles(dt) {
        if (!this.jetpackParticlePool) return;
        for (let i = 0; i < this.jetpackParticlePool.length; i++) {
            const p = this.jetpackParticlePool[i];
            if (!p.mesh.visible) continue;
            p.life += dt;
            if (p.life >= p.maxLife) {
                p.mesh.visible = false;
                continue;
            }
            const prog = p.life / p.maxLife;
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;
            const sc = 1.0 + prog * 2.8;
            p.mesh.scale.set(sc, sc, sc);
            p.mesh.material.opacity = (1 - prog) * 0.75;
            if (prog > 0.35) {
                p.mesh.material.color.setHex(0x555566);
            }
        }
    }

    // ─── Splash Screen ─────────────────────────────────────────────────────
    initSplashScreen() {
        const splash = document.getElementById('splash-screen');
        if (!splash) {
            this.runLoadingProgress();
            return;
        }

        let dismissed = false;
        const dismissSplash = () => {
            if (dismissed) return;
            dismissed = true;
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 700);
            this.runLoadingProgress();
        };

        // Smooth transition after 2.8 seconds (or immediate on tap)
        const timer = setTimeout(dismissSplash, 2800);

        // Immediate transition on tap / click
        splash.addEventListener('click', () => {
            clearTimeout(timer);
            dismissSplash();
        });
        splash.addEventListener('touchstart', () => {
            clearTimeout(timer);
            dismissSplash();
        }, { passive: true });
    }

    // ─── Loading Screen ────────────────────────────────────────────────────
    runLoadingProgress() {
        const barFill    = document.getElementById('loading-bar-fill');
        const pctText    = document.getElementById('loading-percent-text');
        const statusText = document.getElementById('loading-status-text');
        const screen     = document.getElementById('loading-screen');

        const messages = [
            { at: 0,  msg: 'INITIALIZING 3D ENGINE...' },
            { at: 18, msg: 'BUILDING NEON CITY...' },
            { at: 38, msg: 'SPAWNING SUBWAY TRAINS...' },
            { at: 58, msg: 'CRAFTING GOLDEN COINS...' },
            { at: 75, msg: 'LOADING CHARACTER SKINS...' },
            { at: 88, msg: 'POLISHING REFLECTIONS...' },
            { at: 96, msg: 'READY! LET\'S RUN! 🚀' }
        ];

        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 5) + 3;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);
                if (barFill)    barFill.style.width = '100%';
                if (pctText)    pctText.textContent = '100%';
                if (statusText) statusText.textContent = 'READY! LET\'S RUN! 🚀';
                setTimeout(() => {
                    if (screen) {
                        screen.style.opacity = '0';
                        screen.style.pointerEvents = 'none';
                        // Show Age Gate Confirmation Step before Cinematic Intro
                        this.showAgeGate();
                        setTimeout(() => { if (screen) screen.style.display = 'none'; }, 650);
                    }
                }, 400);
            } else {
                if (barFill) barFill.style.width = percent + '%';
                if (pctText) pctText.textContent = percent + '%';
                const msg = messages.filter(m => m.at <= percent).pop();
                if (statusText && msg) statusText.textContent = msg.msg;
            }
        }, 55);

        // Resize speed-lines canvas
        if (this.speedLinesCanvas) {
            this.speedLinesCanvas.width  = window.innerWidth;
            this.speedLinesCanvas.height = window.innerHeight;
        }
    }

    // ─── Three.js — Cinematic Renderer ────────────────────────────────────
    initThree() {
        this.scene = new THREE.Scene();
        // Deep blue-purple dusk sky
        this.scene.background = new THREE.Color(0x0a1628);
        this.scene.fog = new THREE.FogExp2(0x0a1628, 0.008);

        // Camera — slightly lower, wider FOV for immersion
        this.camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300);
        this.camera.position.set(0, 4.5, -7.5);
        this.camera.lookAt(0, 1.8, 16);
        this.cameraShake = { x: 0, y: 0, intensity: 0 };

        // Renderer — ACES Filmic + soft shadows (Optimized for Mobile 60-120fps)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping       = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.renderer.outputEncoding    = THREE.sRGBEncoding;

        // ── Sun (warm golden directional light) ──
        this.sun = new THREE.DirectionalLight(0xffd580, 1.4);
        this.sun.position.set(20, 55, -20);
        this.sun.castShadow = true;
        this.sun.shadow.mapSize.set(1024, 1024);
        this.sun.shadow.camera.near   = 5;
        this.sun.shadow.camera.far    = 180;
        this.sun.shadow.camera.left   = -20;
        this.sun.shadow.camera.right  = 20;
        this.sun.shadow.camera.top    = 35;
        this.sun.shadow.camera.bottom = -14;
        this.sun.shadow.bias          = -0.0004;
        this.sun.shadow.normalBias    = 0.02;
        this.scene.add(this.sun);

        // ── Sky hemisphere (blue-purple sky, dark ground) ──
        const hemi = new THREE.HemisphereLight(0x334466, 0x0a0a14, 0.6);
        this.scene.add(hemi);

        // ── Ambient fill ──
        const amb = new THREE.AmbientLight(0x1a2540, 0.5);
        this.scene.add(amb);

        // ── Neon accent lights along track ──
        this.trackLights = [];
        const neonColors = [0xff2a7a, 0x00f0ff, 0x9933ff, 0xffcc00];
        neonColors.forEach((col, i) => {
            const pl = new THREE.PointLight(col, 2.5, 18, 2);
            pl.position.set(
                (i % 2 === 0) ? -8 : 8,
                4,
                i * 40
            );
            this.scene.add(pl);
            this.trackLights.push(pl);
        });

        // ── Headlight point light (moves with player) ──
        this.playerLight = new THREE.PointLight(0xffeedd, 1.8, 14, 2);
        this.playerLight.position.set(0, 2.5, 2);
        this.scene.add(this.playerLight);
    }

    // ─── Ultra-Detailed Stylized 3D Character (ZERO BoxGeometry) ────────────
    buildCharacter() {
        this.playerGroup = new THREE.Group();
        this.scene.add(this.playerGroup);

        const skin = SKINS.find(s => s.id === this.selectedSkin) || SKINS[0];

        // Load reference runner texture
        const textureLoader = new THREE.TextureLoader();
        const runnerTexture = textureLoader.load('runner man.jpg');

        // Stylized character materials matching reference artwork
        const skinMat       = new THREE.MeshStandardMaterial({ color: 0xfbd5b9, roughness: 0.48, metalness: 0.04 });
        const jacketMat     = new THREE.MeshStandardMaterial({ color: skin.jacket || 0x3e2015, roughness: 0.35, metalness: 0.22 });
        const jacketTrimMat = new THREE.MeshStandardMaterial({ color: 0x24120a, roughness: 0.88 });
        const goldButtonMat = new THREE.MeshStandardMaterial({ color: 0xf6be32, roughness: 0.15, metalness: 0.95 });
        const tshirtMat     = new THREE.MeshStandardMaterial({ color: 0xf5f6f8, roughness: 0.75 });
        const hairMat       = new THREE.MeshStandardMaterial({ color: skin.hair || 0x4c2517, roughness: 0.52, metalness: 0.12 });
        const jeansMat      = new THREE.MeshStandardMaterial({ color: skin.jeans || 0x1b232e, roughness: 0.82 });
        const stripeMat     = new THREE.MeshStandardMaterial({ color: skin.stripe || 0xff7700, roughness: 0.32, metalness: 0.08 });
        const shoeMat       = new THREE.MeshStandardMaterial({ color: skin.shoes || 0x161a22, roughness: 0.38 });
        const soleMat       = new THREE.MeshStandardMaterial({ color: 0xc49359, roughness: 0.32 });
        const laceMat       = new THREE.MeshStandardMaterial({ color: 0xf7f0e0, roughness: 0.5 });

        // ── Torso Group (Organic Smooth Cylinders & Toruses — NO BOXES) ──
        this.torsoGroup = new THREE.Group();
        this.torsoGroup.position.y = 1.32;

        // Inner White T-Shirt base
        const tshirtBase = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.33, 0.62, 24), tshirtMat);
        tshirtBase.position.y = 0.22;
        this.torsoGroup.add(tshirtBase);

        // White T-Shirt rounded chest neckline
        const shirtFront = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.12, 0.36, 18, 1, false, -Math.PI * 0.4, Math.PI * 0.8), tshirtMat);
        shirtFront.position.set(0, 0.30, 0.38);
        this.torsoGroup.add(shirtFront);

        // Outer Brown Bomber Jacket Chest (smooth cylinder)
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.39, 0.58, 24), jacketMat);
        chest.position.y = 0.22;
        chest.castShadow = true;
        this.torsoGroup.add(chest);

        // Lower Bomber Belly (smooth rounded cylinder)
        const belly = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.42, 0.44, 24), jacketMat);
        belly.position.y = -0.18;
        belly.castShadow = true;
        this.torsoGroup.add(belly);

        // Ribbed Bomber Collar (smooth torus)
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.085, 12, 28), jacketTrimMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, 0.53, -0.02);
        this.torsoGroup.add(collar);

        // Bomber Front Zipper Placket Trim (smooth vertical cylinder)
        const zipSeam = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.72, 10), jacketTrimMat);
        zipSeam.position.set(0.04, 0.05, 0.42);
        this.torsoGroup.add(zipSeam);

        // Golden Snap Buttons down front placket (smooth spherical dome buttons)
        [-0.10, 0.02, 0.14, 0.26].forEach(by => {
            const btn = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), goldButtonMat);
            btn.scale.set(1.0, 1.0, 0.45);
            btn.position.set(0.08, by, 0.425);
            this.torsoGroup.add(btn);
        });

        // Left Chest Golden Pocket Flap (smooth horizontal cylinder)
        const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.14, 12), goldButtonMat);
        badge.rotation.z = Math.PI / 2;
        badge.position.set(-0.18, 0.28, 0.415);
        this.torsoGroup.add(badge);

        // Ribbed Bomber Bottom Waistband (smooth cylinder & torus)
        const hem = new THREE.Mesh(new THREE.CylinderGeometry(0.41, 0.41, 0.12, 24), jacketTrimMat);
        hem.position.y = -0.42;
        const hemTorus = new THREE.Mesh(new THREE.TorusGeometry(0.41, 0.065, 10, 28), jacketTrimMat);
        hemTorus.rotation.x = Math.PI / 2;
        hemTorus.position.y = -0.42;
        this.torsoGroup.add(hem, hemTorus);

        // Stylized Reference Chest Emblem (circular textured plane from runner man.jpg)
        const emblemGeo = new THREE.CircleGeometry(0.14, 24);
        const emblemMat = new THREE.MeshBasicMaterial({ map: runnerTexture, transparent: true, opacity: 0.95 });
        const emblem = new THREE.Mesh(emblemGeo, emblemMat);
        emblem.position.set(0, 0.14, 0.435);
        this.torsoGroup.add(emblem);

        this.playerGroup.add(this.torsoGroup);

        // ── Head Group (Cute Anime/Chibi Boy Face & Swept Brown Hair) ──
        this.headGroup = new THREE.Group();
        this.headGroup.position.set(0, 2.18, 0);

        // Chibi Proportioned Head (smooth sphere)
        const headBase = new THREE.Mesh(new THREE.SphereGeometry(0.40, 28, 28), skinMat);
        headBase.scale.set(1.0, 1.04, 1.0);
        headBase.castShadow = true;
        this.headGroup.add(headBase);

        // Chubby Cheeks (smooth spheres)
        [-0.23, 0.23].forEach(cx => {
            const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), skinMat);
            cheek.position.set(cx, -0.07, 0.28);
            this.headGroup.add(cheek);
        });

        // Cute Button Nose (smooth sphere)
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), skinMat);
        nose.position.set(0, -0.01, 0.40);
        this.headGroup.add(nose);

        // Cute Rounded Ears (smooth flattened spheres)
        [-0.39, 0.39].forEach(ex => {
            const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 14), skinMat);
            ear.position.set(ex, 0.02, -0.02);
            ear.scale.set(0.5, 1.1, 0.8);
            this.headGroup.add(ear);
        });

        // Smooth Neck (cylinder)
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.26, 18), skinMat);
        neck.position.y = -0.36;
        this.headGroup.add(neck);

        // Voluminous Brown Hair Cap (smooth hemisphere)
        const hairCap = new THREE.Mesh(new THREE.SphereGeometry(0.43, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65), hairMat);
        hairCap.rotation.x = -0.15;
        hairCap.position.set(0, 0.06, -0.03);
        this.headGroup.add(hairCap);

        // Side-Swept Layered Bangs & Fringe Locks (exact style of runner_man — NO BOXES)
        this.ponytail = new THREE.Group(); // dynamic hair lock group
        this.ponytail.position.set(0, 0.08, 0.15);

        // Sweeping front fringe locks across forehead (smooth curved cylinders + spheres)
        const fringe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.18, 0.44, 14), hairMat);
        fringe1.rotation.set(0.3, 0.2, 1.0);
        fringe1.position.set(-0.12, 0.20, 0.25);
        const f1Tip = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), hairMat);
        f1Tip.position.set(-0.25, 0.14, 0.28);

        const fringe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.15, 0.38, 14), hairMat);
        fringe2.rotation.set(0.2, 0.1, 0.85);
        fringe2.position.set(0.08, 0.22, 0.24);
        const f2Tip = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), hairMat);
        f2Tip.position.set(-0.04, 0.16, 0.27);

        const fringe3 = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.13, 0.32, 14), hairMat);
        fringe3.rotation.set(0.1, -0.2, 0.65);
        fringe3.position.set(0.22, 0.18, 0.21);

        // Sideburn locks in front of ears
        const sideburnL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.28, 12), hairMat);
        sideburnL.position.set(-0.35, 0.02, 0.12);
        sideburnL.rotation.z = 0.2;
        const sideburnR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 0.28, 12), hairMat);
        sideburnR.position.set(0.35, 0.02, 0.12);
        sideburnR.rotation.z = -0.2;

        this.ponytail.add(fringe1, f1Tip, fringe2, f2Tip, fringe3, sideburnL, sideburnR);
        this.headGroup.add(this.ponytail);

        // Expressive Big Chibi Eyes (smooth spherical eyes — NO BOXES)
        [-0.14, 0.14].forEach(ex => {
            const eyeGroup = new THREE.Group();
            eyeGroup.position.set(ex, 0.06, 0.33);

            // Sclera (Smooth White Oval)
            const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.082, 14, 14),
                new THREE.MeshBasicMaterial({ color: 0xffffff }));
            sclera.scale.set(1, 1.25, 0.35);

            // Large Hazel/Dark Iris (smooth sphere)
            const iris = new THREE.Mesh(new THREE.SphereGeometry(0.062, 14, 14),
                new THREE.MeshBasicMaterial({ color: 0x2b2420 }));
            iris.position.set(0, 0, 0.03);
            iris.scale.set(1, 1.15, 0.25);

            // Black Pupil (smooth sphere)
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12),
                new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
            pupil.position.set(0, 0, 0.045);
            pupil.scale.set(1, 1, 0.3);

            // Dual Glossy Specular Highlights (Sparkle)
            const dot1 = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff }));
            dot1.position.set(0.018, 0.024, 0.055);

            const dot2 = new THREE.Mesh(new THREE.SphereGeometry(0.011, 8, 8),
                new THREE.MeshBasicMaterial({ color: 0xffffff }));
            dot2.position.set(-0.014, -0.016, 0.055);

            eyeGroup.add(sclera, iris, pupil, dot1, dot2);
            this.headGroup.add(eyeGroup);

            // Arched Brown Eyebrow (curved smooth torus segment — NO BOXES)
            const brow = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.018, 8, 18, Math.PI * 0.45),
                new THREE.MeshBasicMaterial({ color: 0x3a1e12 }));
            brow.rotation.z = (ex > 0 ? -0.85 : 0.85);
            brow.rotation.x = 0.2;
            brow.position.set(ex, 0.17, 0.34);
            this.headGroup.add(brow);
        });

        this.playerGroup.add(this.headGroup);

        // ── Arms (Smooth Cylinders, Spheres & Toruses — NO BOXES) ──
        const buildArm = (isLeft) => {
            const grp = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            grp.position.set(sign * 0.50, 1.74, 0);

            // Shoulder Ball Joint
            const shoulderBall = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), jacketMat);
            grp.add(shoulderBall);

            // Upper Arm Sleeve (smooth tapered cylinder)
            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.115, 0.44, 16), jacketMat);
            upper.position.y = -0.19;
            upper.castShadow = true;
            grp.add(upper);

            // Elbow Ball Joint
            const elbowBall = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 12), jacketMat);
            elbowBall.position.y = -0.40;
            grp.add(elbowBall);

            const forearmGrp = new THREE.Group();
            forearmGrp.position.set(0, -0.40, 0);

            // Forearm Sleeve (smooth tapered cylinder)
            const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.10, 0.38, 16), jacketMat);
            lower.position.y = -0.16;

            // Ribbed Wrist Cuff (smooth torus)
            const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.10, 0.035, 8, 18), jacketTrimMat);
            cuff.rotation.x = Math.PI / 2;
            cuff.position.y = -0.32;

            // Sculpted Rounded Hand (smooth ellipsoid with thumb)
            const hand = new THREE.Mesh(new THREE.SphereGeometry(0.10, 14, 14), skinMat);
            hand.scale.set(0.9, 1.1, 0.7);
            hand.position.y = -0.42;

            const thumb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 10), skinMat);
            thumb.position.set(sign * 0.06, -0.40, 0.04);

            forearmGrp.add(lower, cuff, hand, thumb);
            grp.add(forearmGrp);

            return { shoulder: grp, forearm: forearmGrp };
        };

        this.leftArm  = buildArm(true);
        this.rightArm = buildArm(false);
        this.playerGroup.add(this.leftArm.shoulder, this.rightArm.shoulder);

        // ── Legs (Dark Joggers with Cylindrical Orange Side Stripes — NO BOXES) ──
        const buildLeg = (isLeft) => {
            const hip  = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            hip.position.set(sign * 0.23, 0.94, 0);

            // Hip Joint Ball (smooth sphere)
            const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.165, 14, 14), jeansMat);
            hip.add(hipBall);

            // Thigh Jogger Fabric (smooth tapered cylinder)
            const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.14, 0.50, 18), jeansMat);
            thigh.position.y = -0.23;
            thigh.castShadow = true;
            hip.add(thigh);

            // Thigh Orange Side Stripe (smooth vertical cylinder — NO BOXES)
            const thighStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.020, 0.50, 12), stripeMat);
            thighStripe.position.set(sign * 0.16, -0.23, 0.02);
            hip.add(thighStripe);

            // Knee Ball Joint (smooth sphere)
            const kneeBall = new THREE.Mesh(new THREE.SphereGeometry(0.135, 14, 14), jeansMat);
            kneeBall.position.y = -0.48;
            hip.add(kneeBall);

            const kneeGrp = new THREE.Group();
            kneeGrp.position.set(0, -0.48, 0);

            // Shin Jogger Fabric (smooth tapered cylinder)
            const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.115, 0.50, 18), jeansMat);
            shin.position.y = -0.23;
            shin.castShadow = true;
            kneeGrp.add(shin);

            // Shin Orange Side Stripe (smooth vertical cylinder — NO BOXES)
            const shinStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.020, 0.018, 0.48, 12), stripeMat);
            shinStripe.position.set(sign * 0.135, -0.23, 0.02);
            kneeGrp.add(shinStripe);

            // Ankle Jogger Ribbed Cuff (smooth torus)
            const ankleCuff = new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.032, 8, 18), jeansMat);
            ankleCuff.rotation.x = Math.PI / 2;
            ankleCuff.position.y = -0.46;
            kneeGrp.add(ankleCuff);

            // ── Sneakers (High-Tops with Gum Sole — Smooth Spheres & Cylinders — NO BOXES) ──
            const shoeGrp = new THREE.Group();
            shoeGrp.position.set(0, -0.50, 0.08);

            // Sneaker Ankle High-Top Collar (smooth cylinder)
            const ankleCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.125, 0.135, 0.24, 18), shoeMat);
            ankleCollar.position.set(0, 0.04, -0.04);
            shoeGrp.add(ankleCollar);

            // Main Foot Arch Body (smooth rounded ellipsoid)
            const shoeBody = new THREE.Mesh(new THREE.SphereGeometry(0.155, 18, 18), shoeMat);
            shoeBody.scale.set(0.88, 0.85, 1.45);
            shoeBody.position.set(0, -0.02, 0.06);
            shoeBody.castShadow = true;

            // Rounded Front Toe Cap (smooth sphere)
            const shoeToe = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 16), shoeMat);
            shoeToe.scale.set(0.98, 0.72, 1.15);
            shoeToe.position.set(0, -0.03, 0.22);

            // Gum Rubber Sole Outsole (smooth rounded cylinder & torus bumper)
            const shoeSole = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.17, 0.09, 20), soleMat);
            shoeSole.scale.set(0.95, 1.0, 1.55);
            shoeSole.position.set(0, -0.12, 0.08);

            const soleBumper = new THREE.Mesh(new THREE.TorusGeometry(0.165, 0.032, 8, 22), soleMat);
            soleBumper.rotation.x = Math.PI / 2;
            soleBumper.scale.set(0.95, 1.55, 1.0);
            soleBumper.position.set(0, -0.12, 0.08);

            // Cream / Gold Laces (smooth curved lace bars across the instep)
            [-0.03, 0.03, 0.09].forEach(lz => {
                const laceBar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.14, 8), laceMat);
                laceBar.rotation.z = Math.PI / 2;
                laceBar.position.set(0, 0.09, lz);
                shoeGrp.add(laceBar);
            });

            shoeGrp.add(shoeBody, shoeToe, shoeSole, soleBumper);
            kneeGrp.add(shoeGrp);
            hip.add(kneeGrp);

            return { hip, kneeGroup: kneeGrp };
        };

        this.leftLeg  = buildLeg(true);
        this.rightLeg = buildLeg(false);
        this.playerGroup.add(this.leftLeg.hip, this.rightLeg.hip);

        // ── Shield Aura (smooth sphere wireframe) ──
        this.shieldMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.7, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.45 })
        );
        this.shieldMesh.position.y = 1.25;
        this.shieldMesh.visible = false;
        this.playerGroup.add(this.shieldMesh);

        // ── Jetpack (Aerodynamic Twin Cylinders & Domes — NO BOXES) ──
        this.jetpackGroup = new THREE.Group();
        this.jetpackGroup.position.set(0, 1.5, -0.45);

        // Twin Rocket Fuel Tanks (smooth cylinders with spherical dome caps)
        [-0.22, 0.22].forEach(tx => {
            const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.72, 16),
                new THREE.MeshStandardMaterial({ color: 0x24272e, roughness: 0.3, metalness: 0.75 }));
            const tankDomeTop = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14),
                new THREE.MeshStandardMaterial({ color: 0xff4400, roughness: 0.25 }));
            tankDomeTop.position.y = 0.36;
            const tankDomeBot = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14),
                new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.8 }));
            tankDomeBot.position.y = -0.36;
            tank.add(tankDomeTop, tankDomeBot);
            tank.position.x = tx;
            this.jetpackGroup.add(tank);
        });

        // Center Thruster Harness (smooth horizontal cylinder)
        const jpHarness = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.44, 14),
            new THREE.MeshStandardMaterial({ color: 0x111115, metalness: 0.8, roughness: 0.2 }));
        jpHarness.rotation.z = Math.PI / 2;
        this.jetpackGroup.add(jpHarness);

        // Thruster Nozzles (smooth cones/cylinders)
        [-0.22, 0.22].forEach(nx => {
            const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.14, 0.30, 12),
                new THREE.MeshStandardMaterial({ color: 0x444455, metalness: 0.9, roughness: 0.2 }));
            nozzle.position.set(nx, -0.52, 0);
            this.jetpackGroup.add(nozzle);
        });

        // Rocket exhaust flame cones
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xff4400, transparent: true, opacity: 0.9 });
        const flameCoreMat = new THREE.MeshBasicMaterial({ color: 0xffff33 });
        this.jetpackFlames = [];
        [-0.22, 0.22].forEach(fx => {
            const flame = new THREE.Group();
            const outer = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 10), flameMat);
            outer.rotation.x = Math.PI;
            outer.position.y = -0.3;
            const core = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.35, 8), flameCoreMat);
            core.rotation.x = Math.PI;
            core.position.y = -0.2;
            flame.add(outer, core);
            flame.position.set(fx, -0.85, 0);
            this.jetpackGroup.add(flame);
            this.jetpackFlames.push(flame);
        });

        this.jetpackGroup.visible = false;
        this.playerGroup.add(this.jetpackGroup);

        // ── 3D Magnet Flux Aura Rings (smooth toruses) ──
        this.magnetAura = new THREE.Group();
        const magMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75, wireframe: true });
        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.05, 8, 24), magMat);
        ring1.rotation.x = Math.PI / 2;
        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.04, 8, 24), magMat);
        ring2.rotation.y = Math.PI / 2;
        const ring3 = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.04, 8, 24), magMat);
        ring3.rotation.z = Math.PI / 4;
        this.magnetAura.add(ring1, ring2, ring3);
        this.magnetAura.position.y = 1.3;
        this.magnetAura.visible = false;
        this.playerGroup.add(this.magnetAura);

        this.playerGroup.position.set(0, 0, 0);
    }

    updatePlayerSkin(skinId) {
        this.selectedSkin = skinId;
        localStorage.setItem('ss_selected_skin', skinId);
        if (this.playerGroup) {
            this.scene.remove(this.playerGroup);
            this.buildCharacter();
        }
    }

    // ─── 3D Cinematic Intro Props & Decals ─────────────────────────────────
    buildCinematicProps() {
        // 1. Tool Bag / Duffel on ground
        this.toolBag = new THREE.Group();
        const bagMat = new THREE.MeshStandardMaterial({ color: 0x1a237e, roughness: 0.7 });
        const bagBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.65, 12), bagMat);
        bagBody.rotation.z = Math.PI / 2;
        const bagPocket = new THREE.Mesh(
            new THREE.BoxGeometry(0.35, 0.18, 0.35),
            new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.8 })
        );
        bagPocket.position.set(0, 0.05, 0.12);
        // Extra spray cans protruding from tool bag
        const extraCan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.22, 8), new THREE.MeshStandardMaterial({ color: 0x00e676, metalness: 0.7 }));
        extraCan1.position.set(0.18, 0.18, 0.02); extraCan1.rotation.z = 0.35;
        const extraCan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.22, 8), new THREE.MeshStandardMaterial({ color: 0xffea00, metalness: 0.7 }));
        extraCan2.position.set(-0.16, 0.18, 0.05); extraCan2.rotation.z = -0.3;
        this.toolBag.add(bagBody, bagPocket, extraCan1, extraCan2);
        this.toolBag.position.set(-0.95, 0.24, 0.35);
        this.scene.add(this.toolBag);

        // 2. Spray Can in Runner's Right Hand
        this.sprayCan = new THREE.Group();
        const canBody = new THREE.Mesh(
            new THREE.CylinderGeometry(0.065, 0.065, 0.22, 10),
            new THREE.MeshStandardMaterial({ color: 0xff1744, metalness: 0.8, roughness: 0.2 })
        );
        const canCap = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.045, 0.05, 8),
            new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.5 })
        );
        canCap.position.y = 0.125;
        const canNozzle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.035), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        canNozzle.position.set(0, 0.13, 0.035);
        this.sprayCan.add(canBody, canCap, canNozzle);
        this.sprayCan.position.set(0, -0.42, 0.08);
        this.sprayCan.rotation.x = Math.PI / 4;
        if (this.rightArm && this.rightArm.forearm) {
            this.rightArm.forearm.add(this.sprayCan);
        }

        // 3. Spray Mist Particle Jet
        this.sprayMistGroup = new THREE.Group();
        for (let i = 0; i < 20; i++) {
            const p = new THREE.Mesh(
                new THREE.SphereGeometry(0.04 + Math.random() * 0.05, 6, 6),
                new THREE.MeshBasicMaterial({ color: 0xff0077, transparent: true, opacity: 0.7 })
            );
            p.userData = {
                dist: Math.random() * 1.2,
                speed: 1.6 + Math.random() * 2.2,
                spreadX: (Math.random() - 0.5) * 0.35,
                spreadY: (Math.random() - 0.5) * 0.3,
                col: [0xff0077, 0x00f0ff, 0xffea00][Math.floor(Math.random() * 3)]
            };
            p.material.color.setHex(p.userData.col);
            this.sprayMistGroup.add(p);
        }
        this.sprayMistGroup.position.set(0.25, 1.85, 0.3);
        this.scene.add(this.sprayMistGroup);
        this.sprayMistGroup.visible = false;

        // 4. Fresh Street Graffiti Decal on Train
        const grafCanvas = document.createElement('canvas');
        grafCanvas.width = 512; grafCanvas.height = 256;
        const gctx = grafCanvas.getContext('2d');
        gctx.clearRect(0, 0, 512, 256);
        const cols = ['#ff0055', '#00e5ff', '#ffea00', '#76ff03'];
        cols.forEach((col, idx) => {
            gctx.fillStyle = col;
            gctx.beginPath();
            gctx.arc(80 + idx * 105, 120 + Math.sin(idx) * 25, 55, 0, Math.PI * 2);
            gctx.fill();
        });
        gctx.font = '900 75px "Orbitron", sans-serif';
        gctx.fillStyle = '#ffffff';
        gctx.strokeStyle = '#06112c';
        gctx.lineWidth = 12;
        gctx.strokeText('TURBO', 75, 140);
        gctx.fillText('TURBO', 75, 140);
        gctx.font = '800 30px "Orbitron", sans-serif';
        gctx.fillStyle = '#ffe600';
        gctx.fillText('★ RUNNERS CREW ★', 85, 195);
        const grafTex = new THREE.CanvasTexture(grafCanvas);
        this.trainGraffitiDecal = new THREE.Mesh(
            new THREE.PlaneGeometry(3.6, 1.8),
            new THREE.MeshBasicMaterial({ map: grafTex, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
        );
        this.trainGraffitiDecal.position.set(1.48, 2.2, 0.6);
        this.trainGraffitiDecal.rotation.y = -Math.PI / 2;
        this.scene.add(this.trainGraffitiDecal);

        // 5. Parked Intro Train on track 1
        this.introTrain = this.createTrainMesh(0x0055dd);
        this.introTrain.position.set(2.8, 0, 0);
        this.scene.add(this.introTrain);
    }

    // ─── Security Guard / Inspector 3D Model ───────────────────────────────
    buildSecurityGuard() {
        this.guardGroup = new THREE.Group();
        this.scene.add(this.guardGroup);

        const uniformBlue = new THREE.MeshStandardMaterial({ color: 0x1b2d5a, roughness: 0.5, metalness: 0.2 });
        const darkNavy    = new THREE.MeshStandardMaterial({ color: 0x111c38, roughness: 0.7 });
        const skinMat     = new THREE.MeshStandardMaterial({ color: 0xf3b893, roughness: 0.6 });
        const goldMat     = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.85, roughness: 0.2 });
        const bootMat     = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.3 });

        // Torso
        this.guardTorso = new THREE.Group();
        this.guardTorso.position.y = 1.4;
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.42, 0.72, 14), uniformBlue);
        chest.castShadow = true;
        for (let y = -0.15; y <= 0.25; y += 0.15) {
            const btn = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldMat);
            btn.position.set(0, y, 0.44);
            this.guardTorso.add(btn);
        }
        const badge = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.04), goldMat);
        badge.position.set(-0.20, 0.18, 0.42);
        this.guardTorso.add(chest, badge);
        this.guardGroup.add(this.guardTorso);

        // Head & Police Cap
        this.guardHead = new THREE.Group();
        this.guardHead.position.set(0, 2.30, 0);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), skinMat);
        head.castShadow = true;
        const stache = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.1), new THREE.MeshStandardMaterial({ color: 0x3e2723 }));
        stache.position.set(0, -0.08, 0.34);
        const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.22, 16), uniformBlue);
        capCrown.position.y = 0.26;
        const capVisor = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.04, 16, 1, false, -Math.PI * 0.4, Math.PI * 0.8), bootMat);
        capVisor.rotation.x = 0.2;
        capVisor.position.set(0, 0.19, 0.15);
        const capBadge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 0.03), goldMat);
        capBadge.position.set(0, 0.30, 0.38);
        this.guardHead.add(head, stache, capCrown, capVisor, capBadge);
        this.guardGroup.add(this.guardHead);

        // Arms
        const buildGuardArm = (isLeft) => {
            const grp = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            grp.position.set(sign * 0.52, 1.80, 0);
            const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.46, 10), uniformBlue);
            upper.position.y = -0.19;
            grp.add(upper);
            const forearm = new THREE.Group();
            forearm.position.set(0, -0.42, 0);
            const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.10, 0.42, 10), uniformBlue);
            lower.position.y = -0.17;
            const hand = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), skinMat);
            hand.position.y = -0.38;
            forearm.add(lower, hand);
            if (!isLeft) {
                const baton = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.04, 0.045, 0.75, 8),
                    new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.4 })
                );
                baton.position.set(0, -0.38, 0.2);
                baton.rotation.x = Math.PI / 3;
                forearm.add(baton);
            }
            grp.add(forearm);
            return { shoulder: grp, forearm };
        };
        this.guardArmLeft  = buildGuardArm(true);
        this.guardArmRight = buildGuardArm(false);
        this.guardGroup.add(this.guardArmLeft.shoulder, this.guardArmRight.shoulder);

        // Legs
        const buildGuardLeg = (isLeft) => {
            const hip = new THREE.Group();
            const sign = isLeft ? -1 : 1;
            hip.position.set(sign * 0.26, 1.0, 0);
            const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.52, 10), darkNavy);
            thigh.position.y = -0.24;
            const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.12, 0.50, 10), darkNavy);
            shin.position.y = -0.68;
            const boot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.46), bootMat);
            boot.position.set(0, -0.92, 0.1);
            hip.add(thigh, shin, boot);
            return hip;
        };
        this.guardLegLeft  = buildGuardLeg(true);
        this.guardLegRight = buildGuardLeg(false);
        this.guardGroup.add(this.guardLegLeft, this.guardLegRight);

        this.guardGroup.position.set(0.6, 0, -20);
        this.guardGroup.visible = false;
    }

    // ─── Aggressive Guard Dog 3D Model ────────────────────────────────────
    buildGuardDog() {
        this.dogGroup = new THREE.Group();
        this.scene.add(this.dogGroup);

        const dogMat   = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.8 });
        const darkMat  = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
        const collarMat= new THREE.MeshStandardMaterial({ color: 0xd50000, roughness: 0.4 });
        const studMat  = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.9 });

        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.55, 0.95), dogMat);
        body.position.y = 0.65;
        body.castShadow = true;
        this.dogGroup.add(body);

        // Collar & Studs
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.06, 8, 16), collarMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.set(0, 0.85, 0.45);
        for (let i = 0; i < 6; i++) {
            const ang = (i / 6) * Math.PI * 2;
            const stud = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 6), studMat);
            stud.position.set(Math.cos(ang) * 0.28, 0.85, 0.45 + Math.sin(ang) * 0.28);
            this.dogGroup.add(stud);
        }
        this.dogGroup.add(collar);

        // Head
        this.dogHead = new THREE.Group();
        this.dogHead.position.set(0, 0.98, 0.62);
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.38, 0.45), dogMat);
        const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.34), darkMat);
        muzzle.position.set(0, -0.07, 0.28);
        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
        nose.position.set(0, 0.03, 0.44);
        const earL = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 4), darkMat);
        earL.position.set(-0.20, 0.24, 0); earL.rotation.z = -0.3;
        const earR = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 4), darkMat);
        earR.position.set(0.20, 0.24, 0); earR.rotation.z = 0.3;
        const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.22), new THREE.MeshStandardMaterial({ color: 0xff4081 }));
        tongue.position.set(0, -0.16, 0.32); tongue.rotation.x = 0.2;
        this.dogHead.add(head, muzzle, nose, earL, earR, tongue);
        this.dogGroup.add(this.dogHead);

        // 4 Running Legs
        const buildDogLeg = (x, z) => {
            const hip = new THREE.Group();
            hip.position.set(x, 0.55, z);
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.55, 8), dogMat);
            leg.position.y = -0.24;
            const paw = new THREE.Mesh(new THREE.SphereGeometry(0.085, 8, 8), darkMat);
            paw.position.set(0, -0.50, 0.04);
            hip.add(leg, paw);
            return hip;
        };
        this.dogLegFL = buildDogLeg(-0.22,  0.32);
        this.dogLegFR = buildDogLeg( 0.22,  0.32);
        this.dogLegBL = buildDogLeg(-0.22, -0.32);
        this.dogLegBR = buildDogLeg( 0.22, -0.32);
        this.dogGroup.add(this.dogLegFL, this.dogLegFR, this.dogLegBL, this.dogLegBR);

        // Tail
        this.dogTail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.40, 6), dogMat);
        this.dogTail.position.set(0, 0.78, -0.52);
        this.dogTail.rotation.x = -Math.PI / 4;
        this.dogGroup.add(this.dogTail);

        this.dogGroup.position.set(-0.5, 0, -20);
        this.dogGroup.visible = false;
    }

    animateGuardRunning(dt) {
        if (!this.guardArmLeft || !this.guardArmRight) return;
        const grc = performance.now() * 0.016;
        this.guardArmLeft.shoulder.rotation.x  =  Math.sin(grc) * 0.9;
        this.guardArmRight.shoulder.rotation.x = -Math.sin(grc) * 0.9;
        if (this.guardLegLeft)  this.guardLegLeft.rotation.x  = -Math.sin(grc) * 0.9;
        if (this.guardLegRight) this.guardLegRight.rotation.x =  Math.sin(grc) * 0.9;
    }

    animateDogRunning(dt) {
        if (!this.dogLegFL) return;
        const drc = performance.now() * 0.024;
        this.dogLegFL.rotation.x =  Math.sin(drc) * 0.8;
        this.dogLegFR.rotation.x = -Math.sin(drc) * 0.8;
        this.dogLegBL.rotation.x = -Math.sin(drc) * 0.8;
        this.dogLegBR.rotation.x =  Math.sin(drc) * 0.8;
        if (this.dogTail) this.dogTail.rotation.y = Math.sin(drc * 1.5) * 0.6;
    }

    // ─── Age Gate Dialog Setup ─────────────────────────────────────────────
    setupAgeGate() {
        const modal      = document.getElementById('age-gate-modal');
        const numDisp    = document.getElementById('age-number-display');
        const slider     = document.getElementById('age-slider');
        const btnMinus   = document.getElementById('btn-age-minus');
        const btnPlus    = document.getElementById('btn-age-plus');
        const btnConfirm = document.getElementById('btn-age-confirm');

        let age = parseInt(localStorage.getItem('ss_user_age') || '16', 10);
        const updateAge = (val) => {
            age = Math.max(6, Math.min(99, val));
            if (numDisp) numDisp.textContent = age;
            if (slider)  slider.value = age;
        };
        updateAge(age);

        btnMinus?.addEventListener('click', () => updateAge(age - 1));
        btnPlus?.addEventListener('click',  () => updateAge(age + 1));
        slider?.addEventListener('input',   e => updateAge(parseInt(e.target.value, 10)));

        btnConfirm?.addEventListener('click', () => {
            localStorage.setItem('ss_user_age', age);
            modal?.classList.remove('active');
            setTimeout(() => { if (modal) modal.style.display = 'none'; }, 450);
            audio.init();
            audio.playTone(520, 'triangle', 0.12, 0.2);
            // Launch 5 to 8-second 3D Cinematic Chase Intro!
            this.startCinematicIntro();
        });

        document.getElementById('btn-skip-intro')?.addEventListener('click', () => {
            this.endCinematicIntro(true);
        });
    }

    showAgeGate() {
        const modal = document.getElementById('age-gate-modal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 40);
        } else {
            this.startCinematicIntro();
        }
    }

    // ─── 5 to 8-Second 3D Cinematic Chase Intro ───────────────────────────
    startCinematicIntro() {
        this.gameState     = 'CINEMATIC';
        this.cinematicTime = 0;
        this.chaseTimer    = 0;

        // Activate cinematic overlay & letterbox
        const overlay = document.getElementById('cinematic-overlay');
        overlay?.classList.add('active');
        const callout = document.getElementById('cinematic-callout');
        if (callout) {
            callout.classList.remove('show');
            document.getElementById('callout-text').textContent    = 'HEY! STOP RIGHT THERE!';
            document.getElementById('callout-speaker').textContent = '👮‍♂️ INSPECTOR';
        }

        // Hide HUD & menus
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

        // Position runner spray-painting the train
        this.playerGroup.position.set(0, 0, 0);
        this.playerGroup.rotation.set(0, 1.25, 0);
        this.rightArm.shoulder.rotation.x = -1.25;
        this.rightArm.forearm.rotation.x  = -0.4;
        if (this.sprayCan) this.sprayCan.visible = true;
        if (this.sprayMistGroup) this.sprayMistGroup.visible = true;
        if (this.toolBag) this.toolBag.visible = true;
        if (this.trainGraffitiDecal) this.trainGraffitiDecal.visible = true;
        if (this.introTrain) this.introTrain.visible = true;

        this.guardGroup.visible = true;
        this.guardGroup.position.set(0.6, 0, -18);
        this.dogGroup.visible   = true;
        this.dogGroup.position.set(-0.6, 0, -18);

        // Spray hiss audio
        audio.playSprayHiss(2.2);
    }

    updateCinematic(dt) {
        this.cinematicTime += dt;
        const t  = this.cinematicTime;
        const rc = performance.now() * 0.016;

        // ── SHOT 1: Spray Tagging (0s – 2.2s) ──
        if (t < 2.2) {
            this.rightArm.shoulder.rotation.x = -1.25 + Math.sin(t * 8) * 0.12;
            this.rightArm.forearm.rotation.y  = Math.cos(t * 6) * 0.1;
            if (this.sprayMistGroup) {
                this.sprayMistGroup.visible = true;
                this.sprayMistGroup.children.forEach(p => {
                    p.position.x = 0.2 + (p.userData.dist % 1.2) * 1.1;
                    p.position.y = 1.8 + Math.sin(t * 5 + p.userData.spreadY * 10) * 0.2;
                    p.position.z = 0.3 + p.userData.spreadX * 0.4;
                    p.userData.dist += dt * p.userData.speed;
                });
            }
            // Dynamic side orbit camera
            this.camera.position.set(-2.8 + t * 0.2, 1.6 + Math.sin(t * 0.6) * 0.15, 2.2 - t * 0.2);
            this.camera.lookAt(0.2, 1.6, 0.4);

        // ── SHOT 2: Guard & Dog Ambush Entry (2.2s – 4.6s) ──
        } else if (t < 4.6) {
            if (this.sprayMistGroup) this.sprayMistGroup.visible = false;
            // Trigger alert whistle & dog bark
            if (t - dt < 2.2) {
                audio.playWhistle();
                audio.playBark();
                document.getElementById('cinematic-callout')?.classList.add('show');
            }
            // Guard & Dog sprint down tracks
            const charge = Math.min(1, (t - 2.2) / 2.4);
            const curZ   = -18 + charge * 13.5; // reaches z = -4.5
            this.guardGroup.position.z = curZ;
            this.dogGroup.position.z   = curZ - 0.5;

            // Guard run animation
            const grc = t * 14;
            this.guardArmLeft.shoulder.rotation.x  =  Math.sin(grc) * 0.9;
            this.guardArmRight.shoulder.rotation.x = -Math.sin(grc) * 0.9;
            this.guardLegLeft.rotation.x  = -Math.sin(grc) * 0.9;
            this.guardLegRight.rotation.x =  Math.sin(grc) * 0.9;

            // Dog run animation
            const drc = t * 20;
            this.dogLegFL.rotation.x =  Math.sin(drc) * 0.8;
            this.dogLegFR.rotation.x = -Math.sin(drc) * 0.8;
            this.dogLegBL.rotation.x = -Math.sin(drc) * 0.8;
            this.dogLegBR.rotation.x =  Math.sin(drc) * 0.8;
            this.dogTail.rotation.y  =  Math.sin(drc * 1.5) * 0.6;

            // Runner turns around in shock
            const turn = Math.min(1, (t - 2.8) / 1.0);
            if (turn > 0) {
                this.playerGroup.rotation.y = 1.25 - turn * 1.25;
                this.rightArm.shoulder.rotation.x += (-0.2 - this.rightArm.shoulder.rotation.x) * 8 * dt;
            }

            // Dramatic rear 3/4 camera
            this.camera.position.set(2.8, 2.3, -8.0);
            this.camera.lookAt(0, 1.6, 0);

        // ── SHOT 3: The Chase Begins (4.6s – 6.5s) ──
        } else if (t < 6.5) {
            if (t - dt < 4.6) {
                audio.playBark();
                document.getElementById('callout-text').textContent    = '🐕 GRRR... WOOF WOOF!';
                document.getElementById('callout-speaker').textContent = '🐕 GUARD DOG';
            }
            this.playerGroup.rotation.y = 0;
            if (this.sprayCan) this.sprayCan.visible = false;

            // Runner sprint animation
            this.leftArm.shoulder.rotation.x  =  Math.sin(rc) * 0.8;
            this.rightArm.shoulder.rotation.x = -Math.sin(rc) * 0.8;
            this.leftLeg.hip.rotation.x       = -Math.sin(rc) * 0.9;
            this.rightLeg.hip.rotation.x      =  Math.sin(rc) * 0.9;
            this.torsoGroup.rotation.x        = -0.15;

            // Guard & Dog follow closely behind
            const chaseZ = -4.5;
            this.guardGroup.position.z = chaseZ;
            this.dogGroup.position.z   = chaseZ - 0.6;
            const grc = t * 14;
            this.guardArmLeft.shoulder.rotation.x  =  Math.sin(grc) * 0.9;
            this.guardArmRight.shoulder.rotation.x = -Math.sin(grc) * 0.9;
            this.guardLegLeft.rotation.x  = -Math.sin(grc) * 0.9;
            this.guardLegRight.rotation.x =  Math.sin(grc) * 0.9;

            const drc = t * 20;
            this.dogLegFL.rotation.x =  Math.sin(drc) * 0.8;
            this.dogLegFR.rotation.x = -Math.sin(drc) * 0.8;
            this.dogLegBL.rotation.x = -Math.sin(drc) * 0.8;
            this.dogLegBR.rotation.x =  Math.sin(drc) * 0.8;

            // Front tracking camera
            this.camera.position.set(0, 1.8, 5.4);
            this.camera.lookAt(0, 1.5, -2);

        // ── SHOT 4: Camera Swoops Over Shoulder (6.5s – 7.2s) ──
        } else if (t < 7.2) {
            document.getElementById('cinematic-callout')?.classList.remove('show');
            const swoop = (t - 6.5) / 0.7; // 0 to 1
            this.camera.position.x = 0;
            this.camera.position.y = 1.8 + swoop * (4.5 - 1.8);
            this.camera.position.z = 5.4 - swoop * (5.4 - (-7.5));
            this.camera.lookAt(0, 1.8, 16);

        // ── TRANSITION TO ACTIVE ENDLESS RUNNER (7.2s+) ──
        } else {
            this.endCinematicIntro();
        }
    }

    endCinematicIntro(immediate = false) {
        if (this.gameState !== 'CINEMATIC') return;

        // Hide overlay & bars
        const overlay = document.getElementById('cinematic-overlay');
        overlay?.classList.remove('active');
        document.getElementById('cinematic-callout')?.classList.remove('show');

        // Cleanup intro props
        if (this.sprayCan) this.sprayCan.visible = false;
        if (this.sprayMistGroup) this.sprayMistGroup.visible = false;
        if (this.toolBag) this.toolBag.visible = false;
        if (this.trainGraffitiDecal) this.trainGraffitiDecal.visible = false;
        if (this.introTrain) this.introTrain.visible = false;

        // Reset camera & runner
        this.camera.position.set(0, 4.5, -7.5);
        this.camera.lookAt(0, 1.8, 16);
        this.playerGroup.rotation.set(0, 0, 0);

        // Keep guard and dog chasing behind for the opening 5 seconds of active gameplay!
        this.chaseTimer = 5.0;
        this.guardGroup.visible = true;
        this.dogGroup.visible   = true;

        // Start active endless runner gameplay!
        this.startGame();
    }

    // ─── Atmosphere — Snow + Background Stars ─────────────────────────────
    initAtmosphere() {
        // Snow particles
        const snowCount = 350;
        const pos = new Float32Array(snowCount * 3);
        for (let i = 0; i < snowCount * 3; i += 3) {
            pos[i]   = (Math.random() - 0.5) * 50;
            pos[i+1] = Math.random() * 28;
            pos[i+2] = Math.random() * 130 - 10;
        }
        const snowGeo = new THREE.BufferGeometry();
        snowGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const snowMat = new THREE.PointsMaterial({
            color: 0xeef8ff, size: 0.22,
            transparent: true, opacity: 0.85,
            sizeAttenuation: true
        });
        this.snowSystem = new THREE.Points(snowGeo, snowMat);
        this.scene.add(this.snowSystem);

        // Distant star field
        const starCount = 300;
        const starPos = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i += 3) {
            starPos[i]   = (Math.random() - 0.5) * 200;
            starPos[i+1] = 20 + Math.random() * 60;
            starPos[i+2] = Math.random() * 200 - 30;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff, size: 0.12,
            transparent: true, opacity: 0.6,
            sizeAttenuation: true
        });
        const stars = new THREE.Points(starGeo, starMat);
        this.scene.add(stars);
    }

    // ─── World Environment ────────────────────────────────────────────────
    initEnvironment() {
        this.segmentLength = 55;
        this.numSegments   = 6;
        for (let i = 0; i < this.numSegments; i++) {
            this.spawnTrackSegment(i * this.segmentLength - 10);
        }
    }

    spawnTrackSegment(zPos) {
        const seg = new THREE.Group();

        // ── Ground — dark urban asphalt ──
        const groundMat = new THREE.MeshStandardMaterial({
            color: 0x1a1a2a, roughness: 0.85, metalness: 0.1
        });
        const ground = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.5, this.segmentLength), groundMat);
        ground.position.set(0, -0.25, 0);
        ground.receiveShadow = true;
        seg.add(ground);

        // Ground glow strip (neon between lanes)
        [0].forEach(gx => {
            const strip = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 0.02, this.segmentLength),
                new THREE.MeshBasicMaterial({ color: 0x00aaff })
            );
            strip.position.set(gx, 0.01, 0);
            seg.add(strip);
        });

        // Side barriers — slightly raised
        const barrierMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.6 });
        [-7.2, 7.2].forEach(bx => {
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, this.segmentLength), barrierMat);
            b.position.set(bx, 0.2, 0);
            b.receiveShadow = true;
            seg.add(b);
        });

        // ── Railway sleepers & rails ──
        const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.85 });
        const railMat    = new THREE.MeshStandardMaterial({
            color: 0x8899aa, metalness: 0.92, roughness: 0.12
        });

        this.lanes.forEach(laneX => {
            for (let z = -this.segmentLength / 2; z < this.segmentLength / 2; z += 1.9) {
                const tie = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.16, 0.45), sleeperMat);
                tie.position.set(laneX, 0.05, z);
                tie.receiveShadow = true;
                seg.add(tie);
            }
            [-0.98, 0.98].forEach(rx => {
                const rail = new THREE.Mesh(
                    new THREE.BoxGeometry(0.12, 0.26, this.segmentLength), railMat
                );
                rail.position.set(laneX + rx, 0.20, 0);
                seg.add(rail);

                // Rail flange (wider base)
                const flange = new THREE.Mesh(
                    new THREE.BoxGeometry(0.20, 0.10, this.segmentLength), railMat
                );
                flange.position.set(laneX + rx, 0.07, 0);
                seg.add(flange);
            });
        });

        // ── Overhead gantry pylons ──
        const mastMat = new THREE.MeshStandardMaterial({
            color: 0x445566, roughness: 0.4, metalness: 0.6
        });
        const insulator = new THREE.MeshStandardMaterial({ color: 0x884422, roughness: 0.6 });

        for (let z = -this.segmentLength / 2 + 4; z < this.segmentLength / 2; z += 22) {
            const mastL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.18, 7.8, 8), mastMat);
            mastL.position.set(-6.8, 3.9, z); mastL.castShadow = true;
            const mastR = mastL.clone(); mastR.position.x = 6.8;
            seg.add(mastL, mastR);

            // Cross beam
            const beam = new THREE.Mesh(new THREE.BoxGeometry(14.5, 0.28, 0.28), mastMat);
            beam.position.set(0, 7.6, z);
            seg.add(beam);

            // Diagonal supports
            [-5, 5].forEach(dx => {
                const supp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4.5, 6), mastMat);
                supp.position.set(dx, 5.8, z);
                supp.rotation.z = dx > 0 ? -0.55 : 0.55;
                seg.add(supp);
            });

            // Insulators on wire
            this.lanes.forEach(lx => {
                const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8), insulator);
                ins.position.set(lx, 7.35, z);
                seg.add(ins);
            });
        }

        // Overhead wires
        this.lanes.forEach(wx => {
            const wire = new THREE.Mesh(
                new THREE.CylinderGeometry(0.02, 0.02, this.segmentLength, 4),
                new THREE.MeshBasicMaterial({ color: 0x334455 })
            );
            wire.rotation.x = Math.PI / 2;
            wire.position.set(wx, 7.15, 0);
            seg.add(wire);
        });

        // ── Buildings — Neon City Skyscrapers ──
        const buildingPalette = [
            0x112244, 0x221133, 0x0d1f36, 0x1a0e2e, 0x0e2020, 0x241010
        ];
        const accentColors = [
            0xff2a7a, 0x00f0ff, 0x9933ff, 0xffcc00, 0x00ff66, 0xff6600
        ];

        for (let side of [-1, 1]) {
            let bz = -this.segmentLength / 2;
            while (bz < this.segmentLength / 2) {
                const bHeight  = 14 + Math.random() * 22;
                const bWidth   = 7 + Math.random() * 5;
                const bDepth   = 12 + Math.random() * 6;
                const colIdx   = Math.floor(Math.random() * buildingPalette.length);
                const accentCol = accentColors[Math.floor(Math.random() * accentColors.length)];

                // Building body
                const bldMat = new THREE.MeshStandardMaterial({
                    color: buildingPalette[colIdx], roughness: 0.55, metalness: 0.2
                });
                const building = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bDepth), bldMat);
                const bx = side * (11.5 + bWidth / 2);
                building.position.set(bx, bHeight / 2 - 0.25, bz + bDepth / 2);
                building.castShadow = true;
                building.receiveShadow = true;
                seg.add(building);

                // Window grid — emissive glowing windows
                const winRows = Math.floor(bHeight / 2.2);
                const winCols = Math.floor(bWidth / 2.0);
                const winMat  = new THREE.MeshBasicMaterial({
                    color: Math.random() > 0.25 ? 0xffee88 : 0x88ccff,
                    transparent: true, opacity: 0.85 + Math.random() * 0.15
                });
                for (let wr = 0; wr < winRows; wr++) {
                    for (let wc = 0; wc < winCols; wc++) {
                        if (Math.random() > 0.28) { // ~72% windows lit
                            const win = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.8), winMat);
                            win.position.set(
                                bx + (side * (bWidth / 2 - 0.12)) * (-1),
                                (bHeight / 2 - 0.25) - bHeight + 1.2 + wr * 2.1,
                                bz + bDepth / 2 - bDepth / 2 + 0.9 + wc * 1.9
                            );
                            // Face outward
                            win.rotation.y = side > 0 ? 0 : Math.PI;
                            seg.add(win);
                        }
                    }
                }

                // Neon accent strip on building edge
                const neonStrip = new THREE.Mesh(
                    new THREE.BoxGeometry(0.08, bHeight * 0.6, 0.08),
                    new THREE.MeshBasicMaterial({ color: accentCol })
                );
                neonStrip.position.set(
                    bx + side * (bWidth / 2 + 0.04) * (-1),
                    bHeight * 0.2,
                    bz + bDepth / 2
                );
                seg.add(neonStrip);

                // Rooftop water tower (random)
                if (Math.random() > 0.55) {
                    const tank = new THREE.Mesh(
                        new THREE.CylinderGeometry(0.8, 0.8, 1.8, 10),
                        new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.8 })
                    );
                    tank.position.set(bx, bHeight + 0.9 - 0.25, bz + bDepth / 2);
                    seg.add(tank);
                    // Tank legs
                    for (let tl = 0; tl < 3; tl++) {
                        const leg = new THREE.Mesh(
                            new THREE.CylinderGeometry(0.05, 0.05, 1.2, 6),
                            new THREE.MeshStandardMaterial({ color: 0x2a2a2a })
                        );
                        const ang = (tl / 3) * Math.PI * 2;
                        leg.position.set(
                            bx + Math.cos(ang) * 0.65,
                            bHeight - 0.6 - 0.25,
                            bz + bDepth / 2 + Math.sin(ang) * 0.65
                        );
                        seg.add(leg);
                    }
                }

                // Billboard sign (random)
                if (Math.random() > 0.62) {
                    const billboard = new THREE.Mesh(
                        new THREE.BoxGeometry(bWidth * 0.7, 2.2, 0.3),
                        new THREE.MeshBasicMaterial({ color: accentCol })
                    );
                    billboard.position.set(bx, bHeight + 1.1 - 0.25, bz + bDepth / 2);
                    seg.add(billboard);
                }

                bz += bDepth + 1 + Math.random() * 3;
            }
        }

        // ── Street lamps with point lights ──
        for (let z = -this.segmentLength / 2 + 5; z < this.segmentLength / 2; z += 18) {
            [-7.0, 7.0].forEach(lx => {
                const post = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.08, 0.12, 5.5, 8),
                    new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.7, roughness: 0.3 })
                );
                post.position.set(lx, 2.75, z);
                post.castShadow = true;
                seg.add(post);

                const arm = new THREE.Mesh(
                    new THREE.BoxGeometry(1.4, 0.1, 0.1),
                    new THREE.MeshStandardMaterial({ color: 0x334455, metalness: 0.7 })
                );
                arm.position.set(lx + (lx > 0 ? -0.7 : 0.7), 5.4, z);
                seg.add(arm);

                const bulb = new THREE.Mesh(
                    new THREE.SphereGeometry(0.22, 10, 10),
                    new THREE.MeshBasicMaterial({ color: 0xffeedd })
                );
                bulb.position.set(lx + (lx > 0 ? -1.4 : 1.4), 5.3, z);
                seg.add(bulb);
            });
        }

        seg.position.z = zPos;
        this.scene.add(seg);
        this.trackSegments.push(seg);
    }

    // ─── Game Pattern Spawner ─────────────────────────────────────────────
    spawnGamePattern(zPos) {
        const laneChoice = [...this.lanes];
        const patternType = Math.floor(Math.random() * 8);

        if (patternType === 0) {
            // Pattern 0: Classic Coin Arc
            const lane = laneChoice[Math.floor(Math.random() * 3)];
            for (let i = 0; i < 14; i++) {
                const p = i / 13;
                const arcY = 1.1 + Math.sin(p * Math.PI) * 4.2;
                this.createCoin(lane, arcY, zPos + i * 2.6);
            }
        } else if (patternType === 1) {
            // Pattern 1: Moving Oncoming Train (Adrenaline Dodge) + Low Hurdle
            const trainLane = laneChoice[Math.floor(Math.random() * 3)];
            this.createTrain(trainLane, zPos + 18, true, 11); // Oncoming moving train!
            const free = laneChoice.filter(l => l !== trainLane);
            this.createHurdle(free[0], zPos);
            for (let i = -2; i <= 2; i++) this.createCoin(free[1], 1.1, zPos + i * 2.5);
        } else if (patternType === 2) {
            // Pattern 2: Stationary Train + High Barrier (Slide) + Hurdle (Jump)
            const trainLane = laneChoice[Math.floor(Math.random() * 3)];
            this.createTrain(trainLane, zPos);
            const free = laneChoice.filter(l => l !== trainLane);
            this.createHighBarrier(free[0], zPos + 8); // Requires Slide!
            for (let i = -1; i <= 1; i++) this.createCoin(free[0], 0.7, zPos + 8 + i * 2.2); // Slide under coins
            this.createHurdle(free[1], zPos);
        } else if (patternType === 3) {
            // Pattern 3: Rare Golden Key (چابی) + Coin Runway
            const keyLane = laneChoice[Math.floor(Math.random() * 3)];
            this.createKeyItem(keyLane, 1.3, zPos);
            for (let i = -3; i <= 3; i++) {
                if (i !== 0) this.createCoin(keyLane, 1.1, zPos + i * 2.2);
            }
            const otherLanes = laneChoice.filter(l => l !== keyLane);
            this.createHurdle(otherLanes[0], zPos);
            this.createTrain(otherLanes[1], zPos + 10);
        } else if (patternType === 4) {
            // Pattern 4: Mystery Gift Loot Box
            const giftLane = laneChoice[Math.floor(Math.random() * 3)];
            this.createMysteryGift(giftLane, 1.2, zPos);
            const free = laneChoice.filter(l => l !== giftLane);
            this.createTrain(free[0], zPos + 12);
            for (let i = -2; i <= 2; i++) this.createCoin(free[1], 1.1, zPos + i * 2.5);
        } else if (patternType === 5) {
            // Pattern 5: Powerup Item (Coin Magnet or Jetpack or Shield or 2x)
            const pLane = laneChoice[Math.floor(Math.random() * 3)];
            this.createPowerup(pLane, 1.5, zPos);
            const free = laneChoice.filter(l => l !== pLane);
            this.createTrain(free[0], zPos + 10);
            for (let i = -2; i <= 2; i++) this.createCoin(free[1], 1.1, zPos + i * 2.5);
        } else if (patternType === 6) {
            // Pattern 6: Double Train Sandwich (Moving train on left, stationary on right, center coin trail)
            const leftTrain = this.lanes[0];
            const rightTrain = this.lanes[2];
            this.createTrain(leftTrain, zPos, true, 8); // moving oncoming train
            this.createTrain(rightTrain, zPos, false);  // stationary train
            for (let i = -3; i <= 3; i++) this.createCoin(this.lanes[1], 1.1, zPos + i * 2.4);
        } else {
            // Pattern 7: High Overhead Sign + Portal + Low Hurdle
            const lane = laneChoice[Math.floor(Math.random() * 3)];
            this.createHighBarrier(lane, zPos);
            const free = laneChoice.filter(l => l !== lane);
            this.createHurdle(free[0], zPos);
            for (let i = 0; i < 8; i++) this.createCoin(free[1], 1.1, zPos + i * 2.5);
        }
    }

    // ─── Realistic Multi-Colored Subway Surfers Train ───────────────────
    createTrainMesh(livery = null, isMoving = false) {
        if (!livery) {
            if (isMoving) {
                // High-speed oncoming trains use vibrant alert liveries
                livery = (Math.random() > 0.5) ? TRAIN_LIVERIES[4] : TRAIN_LIVERIES[0];
            } else {
                livery = TRAIN_LIVERIES[Math.floor(Math.random() * TRAIN_LIVERIES.length)];
            }
        }

        const train = new THREE.Group();
        train.userData = { type: 'train', boundingBox: new THREE.Box3() };

        // 1. Main Coach Body
        const bodyMat = new THREE.MeshStandardMaterial({
            color: livery.body, roughness: 0.22, metalness: 0.65
        });
        const body = new THREE.Mesh(new THREE.BoxGeometry(2.7, 3.8, 15.0), bodyMat);
        body.position.y = 2.1;
        body.castShadow = true;
        train.add(body);

        // 2. Aerodynamic Beveled Roof
        const roofMat = new THREE.MeshStandardMaterial({
            color: livery.roof, roughness: 0.35, metalness: 0.4
        });
        const roof = new THREE.Mesh(new THREE.CylinderGeometry(1.36, 1.36, 15.02, 16, 1, false, 0, Math.PI), roofMat);
        roof.rotation.z = -Math.PI / 2;
        roof.position.set(0, 4.0, 0);
        train.add(roof);

        // 3. Rooftop AC & Ventilation Chiller Pods
        const acMat = new THREE.MeshStandardMaterial({ color: 0x33333e, metalness: 0.8, roughness: 0.3 });
        [-3.5, 3.5].forEach(az => {
            const acPod = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 2.6, 12), acMat);
            acPod.rotation.x = Math.PI / 2;
            acPod.position.set(0, 4.15, az);
            train.add(acPod);
        });

        // 4. Metallic Side Racing Stripes & Ribs
        const stripeMat = new THREE.MeshBasicMaterial({ color: livery.stripe });
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(2.74, 0.45, 15.02), stripeMat);
        stripe.position.y = 1.6;
        train.add(stripe);

        const ribMat = new THREE.MeshStandardMaterial({ color: livery.rib, metalness: 0.85, roughness: 0.15 });
        [0.75, 2.3, 3.4].forEach(ry => {
            const rib = new THREE.Mesh(new THREE.BoxGeometry(2.73, 0.08, 15.02), ribMat);
            rib.position.y = ry;
            train.add(rib);
        });

        // 5. Glowing Passenger Windows (Both Flanks)
        const winMat = new THREE.MeshBasicMaterial({ color: livery.win, transparent: true, opacity: 0.95 });
        const winFrameMat = new THREE.MeshBasicMaterial({ color: 0x111118 });
        for (let wi = 0; wi < 5; wi++) {
            const wz = -5.2 + wi * 2.6;
            [-1.37, 1.37].forEach(wx => {
                const win = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 1.15), winMat);
                win.rotation.y = wx > 0 ? Math.PI / 2 : -Math.PI / 2;
                win.position.set(wx, 2.65, wz);

                const frame = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.25), winFrameMat);
                frame.rotation.y = win.rotation.y;
                frame.position.set(wx * 0.998, 2.65, wz);

                train.add(frame, win);
            });
        }

        // 6. Aerodynamic Front Nose Cone
        const noseMat = new THREE.MeshStandardMaterial({ color: livery.nose, roughness: 0.25, metalness: 0.7 });
        const nose = new THREE.Mesh(new THREE.CylinderGeometry(0, 1.36, 2.2, 14, 1, false), noseMat);
        nose.rotation.x = Math.PI / 2;
        nose.position.set(0, 2.2, -8.6);
        train.add(nose);

        // 7. Tinted Panoramic Front Windshield
        const wsMat = new THREE.MeshBasicMaterial({ color: livery.ws, transparent: true, opacity: 0.96 });
        const ws = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.3, 0.15), wsMat);
        ws.position.set(0, 2.8, -7.58);
        train.add(ws);

        // 8. Heavy-Duty Front Crash Bumper & Central Coupler
        const bumperMat = new THREE.MeshStandardMaterial({ color: 0x242426, metalness: 0.85, roughness: 0.25 });
        const bumper = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 0.4), bumperMat);
        bumper.position.set(0, 0.5, -7.8);
        const coupler = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.6, 10), bumperMat);
        coupler.rotation.x = Math.PI / 2;
        coupler.position.set(0, 0.48, -8.1);
        train.add(bumper, coupler);

        // 9. Dynamic Headlights & Volumetric Beam System
        const hlGroup = new THREE.Group();
        const hlLensMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
        const hlBeamMat = new THREE.MeshBasicMaterial({
            color: 0xfff3cc,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        [-0.88, 0.88].forEach(hx => {
            // Headlight lens sphere
            const hl = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 10), hlLensMat);
            hl.position.set(hx, 1.25, -7.62);
            hlGroup.add(hl);

            // 3D Volumetric Headlight Light Beam Cone (projects 22m forward)
            const beam = new THREE.Mesh(new THREE.ConeGeometry(2.0, 22, 12, 1, true), hlBeamMat);
            beam.rotation.x = -Math.PI / 2;
            beam.position.set(hx, 1.25, -18.6);
            hlGroup.add(beam);
        });

        // Single focused point light per train (efficient & bright)
        const hlLight = new THREE.PointLight(0xfffaed, 2.8, 30, 2);
        hlLight.position.set(0, 1.3, -8.0);
        hlGroup.add(hlLight);

        // Headlight begins inactive/hidden until approaching range
        hlGroup.visible = false;
        train.add(hlGroup);
        train.userData.headlightGroup  = hlGroup;
        train.userData.headlightActive = false;

        // 10. Steel Bogie Trucks & Flanged Wheels
        const bogMat = new THREE.MeshStandardMaterial({ color: 0x1f1f24, metalness: 0.85, roughness: 0.3 });
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x363942, metalness: 0.9, roughness: 0.2 });
        [-5.0, 0, 5.0].forEach(bz => {
            [-1.35, 1.35].forEach(bx => {
                const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), bogMat);
                axle.rotation.z = Math.PI / 2;
                axle.position.set(0, -0.05, bz);

                const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.22, 12), wheelMat);
                wheel.rotation.z = Math.PI / 2;
                wheel.position.set(bx, -0.05, bz);
                train.add(axle, wheel);
            });
        });

        return train;
    }

    createTrain(x, z, isMoving = false, moveSpeed = 10) {
        const train = this.createTrainMesh(null, isMoving);
        train.userData.isMoving = isMoving;
        train.userData.speed    = moveSpeed;
        train.position.set(x, 0, z);
        this.scene.add(train);
        this.obstacles.push(train);
        return train;
    }

    // ─── Neon Striped Hurdle (Low Barrier - Jump) ─────────────────────────
    createHurdle(x, z) {
        const hurdle = new THREE.Group();
        hurdle.userData = { type: 'low', boundingBox: new THREE.Box3() };

        const postMat = new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.4, metalness: 0.5 });
        [-1.22, 1.22].forEach(px => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 1.35, 10), postMat);
            post.position.set(px, 0.67, 0);
            hurdle.add(post);
        });

        // Warning bar — glowing orange/black stripes (pure emissive, no point light needed!)
        const barMat = new THREE.MeshStandardMaterial({ color: 0xff6600, roughness: 0.3, emissive: 0xff3300, emissiveIntensity: 0.6 });
        const bar = new THREE.Mesh(new THREE.BoxGeometry(2.68, 0.32, 0.16), barMat);
        bar.position.set(0, 1.0, 0);
        hurdle.add(bar);

        // Stripe segments
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
        for (let si = -2; si <= 2; si += 2) {
            const strp = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.34, 0.18), stripeMat);
            strp.position.set(si * 0.55, 1.0, 0);
            hurdle.add(strp);
        }

        hurdle.position.set(x, 0, z);
        this.scene.add(hurdle);
        this.obstacles.push(hurdle);
    }

    // ─── High Overhead Clearance Barrier (Requires Slide) ────────────────
    createHighBarrier(x, z) {
        const barrier = new THREE.Group();
        barrier.userData = { type: 'high', boundingBox: new THREE.Box3() };

        const steelMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.4, metalness: 0.7 });
        const signMat  = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0x991100, emissiveIntensity: 0.4 });

        // Tall side posts
        [-1.25, 1.25].forEach(px => {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 3.8, 8), steelMat);
            post.position.set(px, 1.9, 0);
            barrier.add(post);
        });

        // Overhead horizontal signboard (requires slide under)
        const signBoard = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.2, 0.22), signMat);
        signBoard.position.set(0, 2.4, 0);
        barrier.add(signBoard);

        // Caution chevron stripes
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        for (let i = -1; i <= 1; i++) {
            const s = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.24, 0.24), stripeMat);
            s.position.set(i * 0.7, 2.4, 0);
            barrier.add(s);
        }

        // Top warning blinking red light
        const bl = new THREE.PointLight(0xff2200, 2.0, 7, 2);
        bl.position.set(0, 3.2, 0);
        barrier.add(bl);

        barrier.position.set(x, 0, z);
        this.scene.add(barrier);
        this.obstacles.push(barrier);
    }

    // ─── 3D Golden Key Collectible ────────────────────────────────────────
    createKeyItem(x, y, z) {
        const keyGroup = new THREE.Group();
        keyGroup.userData = { type: 'key' };

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.45,
            metalness: 0.85, roughness: 0.2
        });

        // Bow / Ring
        const bow = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.06, 8, 20), goldMat);
        bow.position.y = 0.38;
        keyGroup.add(bow);

        // Shaft
        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55, 10), goldMat);
        shaft.position.y = 0.05;
        keyGroup.add(shaft);

        // Bit teeth
        const bit1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.06), goldMat);
        bit1.position.set(0.08, -0.12, 0);
        const bit2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.06), goldMat);
        bit2.position.set(0.05, -0.22, 0);
        keyGroup.add(bit1, bit2);

        // Glowing point light
        const keyLight = new THREE.PointLight(0xffd700, 2.0, 6, 2);
        keyLight.position.y = 0.1;
        keyGroup.add(keyLight);

        keyGroup.position.set(x, y, z);
        this.scene.add(keyGroup);
        this.keyItems.push(keyGroup);
    }

    // ─── 3D Mystery Gift Box ──────────────────────────────────────────────
    createMysteryGift(x, y, z) {
        const giftGroup = new THREE.Group();
        giftGroup.userData = { type: 'gift' };

        const boxMat = new THREE.MeshStandardMaterial({
            color: 0xff0055, emissive: 0xaa0033, emissiveIntensity: 0.35,
            roughness: 0.3, metalness: 0.2
        });
        const ribbonMat = new THREE.MeshStandardMaterial({
            color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.4,
            metalness: 0.7, roughness: 0.2
        });

        // Box body
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.85, 0.85), boxMat);
        box.castShadow = true;
        giftGroup.add(box);

        // Ribbon wraps
        const ribV = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.88, 0.22), ribbonMat);
        const ribH = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.88, 0.88), ribbonMat);
        giftGroup.add(ribV, ribH);

        // Ribbon bow on top
        const bowMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
        const bow1 = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 16), bowMat);
        bow1.rotation.y = Math.PI / 4;
        bow1.position.y = 0.48;
        const bow2 = bow1.clone();
        bow2.rotation.y = -Math.PI / 4;
        giftGroup.add(bow1, bow2);

        // Glowing point light
        const gLight = new THREE.PointLight(0xff0066, 2.5, 8, 2);
        gLight.position.y = 0.5;
        giftGroup.add(gLight);

        giftGroup.position.set(x, y, z);
        this.scene.add(giftGroup);
        this.giftItems.push(giftGroup);
    }

    // ─── Mystery Portal ───────────────────────────────────────────────────
    createPortal(x, z) {
        const portal = new THREE.Group();
        portal.userData = { type: 'mystery', boundingBox: new THREE.Box3() };

        // Outer ring
        const ringMat = new THREE.MeshStandardMaterial({
            color: 0x9933ff, roughness: 0.2, metalness: 0.7,
            emissive: 0x6600cc, emissiveIntensity: 0.5
        });
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.22, 16, 60), ringMat);
        ring.position.y = 2.5;
        ring.rotation.y = Math.PI / 2;
        portal.add(ring);

        // Inner glow plane
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xaa44ff, side: THREE.DoubleSide, transparent: true, opacity: 0.55
        });
        const glow = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), glowMat);
        glow.rotation.y = Math.PI / 2;
        glow.position.y = 2.5;
        portal.add(glow);

        // Portal light
        const pLight = new THREE.PointLight(0xaa44ff, 3.0, 10, 2);
        pLight.position.y = 2.5;
        portal.add(pLight);

        portal.position.set(x, 0, z);
        this.scene.add(portal);
        this.obstacles.push(portal);
    }

    // ─── Gold Coin ────────────────────────────────────────────────────────
    createCoin(x, y, z) {
        const coinGroup = new THREE.Group();

        const discMat = new THREE.MeshStandardMaterial({
            color: 0xFFD700, emissive: 0xffaa00, emissiveIntensity: 0.35,
            metalness: 0.75, roughness: 0.28
        });
        const edgeMat = new THREE.MeshStandardMaterial({
            color: 0xcc8800, emissive: 0xaa6600, emissiveIntensity: 0.2,
            metalness: 0.85, roughness: 0.22
        });
        const starMat = new THREE.MeshStandardMaterial({
            color: 0xFFFFCC, emissive: 0xFFDD44, emissiveIntensity: 0.28,
            metalness: 0.55, roughness: 0.35
        });

        const rimGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.17, 22);
        rimGeo.rotateX(Math.PI / 2);
        const rim = new THREE.Mesh(rimGeo, discMat);
        rim.castShadow = true;
        coinGroup.add(rim);

        const crownGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 5);
        crownGeo.rotateX(Math.PI / 2);
        coinGroup.add(new THREE.Mesh(crownGeo, starMat));

        coinGroup.position.set(x, y, z);
        this.scene.add(coinGroup);
        this.coins.push(coinGroup);
    }

    // ─── Powerup ──────────────────────────────────────────────────────────
    createPowerup(x, y, z) {
        const types = ['magnet', 'multiplier', 'shield', 'jetpack'];
        const icons  = { magnet: '🧲', multiplier: '2x', shield: '🛡️', jetpack: '🚀' };
        const colorMap = { magnet: 0x00e5ff, multiplier: 0xffd700, shield: 0x00ff66, jetpack: 0xff0066 };
        const type = types[Math.floor(Math.random() * types.length)];

        const pGroup = new THREE.Group();
        pGroup.userData = { powerupType: type };

        // Glowing sphere body
        const sphereMat = new THREE.MeshStandardMaterial({
            color: colorMap[type],
            emissive: colorMap[type],
            emissiveIntensity: 0.6,
            roughness: 0.2, metalness: 0.3,
            transparent: true, opacity: 0.88
        });
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 18), sphereMat);
        pGroup.add(sphere);

        // Orbit ring
        const orbitMat = new THREE.MeshBasicMaterial({ color: colorMap[type], transparent: true, opacity: 0.7 });
        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.06, 8, 30), orbitMat);
        orbitRing.rotation.x = Math.PI / 2;
        pGroup.add(orbitRing);

        // Point light
        const pLight = new THREE.PointLight(colorMap[type], 2.5, 8, 2);
        pGroup.add(pLight);

        pGroup.position.set(x, y, z);
        this.scene.add(pGroup);
        this.powerupItems.push(pGroup);
    }

    // ─── Events & Native Touch/Keyboard Controls ─────────────────────────
    bindEvents() {
        // Desktop Keyboard Controls: Arrows, WASD, Space, Escape, P
        window.addEventListener('keydown', (e) => {
            if (this.gameState === 'MENU' && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                this.startGame();
                return;
            }
            if (this.gameState !== 'PLAYING') return;

            const key = e.key.toLowerCase();
            if (key === 'arrowleft' || key === 'a') {
                e.preventDefault();
                this.moveLane(-1);
            } else if (key === 'arrowright' || key === 'd') {
                e.preventDefault();
                this.moveLane(1);
            } else if (key === 'arrowup' || key === 'w' || e.key === ' ') {
                e.preventDefault();
                this.jump();
            } else if (key === 'arrowdown' || key === 's') {
                e.preventDefault();
                this.slide();
            } else if (key === 'escape' || key === 'p') {
                e.preventDefault();
                this.togglePause();
            }
        });

        // Mobile Native Touch Swipe Controller (Swipe Left / Right / Up / Down)
        let touchStartX = 0;
        let touchStartY = 0;
        let swipeTriggered = false;

        const handleTouchStart = (e) => {
            if (!e.touches || e.touches.length === 0) return;
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            swipeTriggered = false;
        };

        const handleTouchMove = (e) => {
            if (this.gameState !== 'PLAYING') return;
            if (!e.touches || e.touches.length === 0) return;

            // Prevent mobile browser pull-to-refresh, page scrolling, and bouncing
            if (e.cancelable) e.preventDefault();

            if (swipeTriggered) return;

            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const dx = currentX - touchStartX;
            const dy = currentY - touchStartY;
            const absDx = Math.abs(dx);
            const absDy = Math.abs(dy);
            const swipeThreshold = 18; // Ultra-responsive 18px threshold for 0ms perceptible delay

            if (absDx >= swipeThreshold || absDy >= swipeThreshold) {
                swipeTriggered = true;
                if (absDx > absDy) {
                    if (dx > 0) {
                        this.moveLane(1);  // Swipe Right -> Switch Track Right
                    } else {
                        this.moveLane(-1); // Swipe Left  -> Switch Track Left
                    }
                } else {
                    if (dy < 0) {
                        this.jump();       // Swipe Up    -> Jump
                    } else {
                        this.slide();      // Swipe Down  -> Slide
                    }
                }
                // Reset touch origin for fluid consecutive swipes in a single stroke
                touchStartX = currentX;
                touchStartY = currentY;
            }
        };

        const handleTouchEnd = (e) => {
            if (this.gameState !== 'PLAYING') return;
            if (!swipeTriggered && e.changedTouches && e.changedTouches.length > 0) {
                const dx = e.changedTouches[0].clientX - touchStartX;
                const dy = e.changedTouches[0].clientY - touchStartY;
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);
                const quickThreshold = 14;

                if (absDx >= quickThreshold || absDy >= quickThreshold) {
                    swipeTriggered = true;
                    if (absDx > absDy) {
                        if (dx > 0) this.moveLane(1);
                        else        this.moveLane(-1);
                    } else {
                        if (dy < 0) this.jump();
                        else        this.slide();
                    }
                }
            }
            swipeTriggered = false;
        };

        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });

        // Play button (click + pointerdown both)
        const playBtn = document.getElementById('btn-play');
        if (playBtn) {
            playBtn.addEventListener('click',       e => { e.preventDefault(); this.startGame(); });
            playBtn.addEventListener('pointerdown', e => { e.preventDefault(); this.startGame(); });
        }

        document.getElementById('btn-pause').onclick           = () => this.togglePause();
        document.getElementById('btn-resume').onclick          = () => this.togglePause();
        document.getElementById('btn-restart').onclick         = () => this.startGame();
        document.getElementById('btn-restart-pause').onclick   = () => this.startGame();
        document.getElementById('btn-menu-pause').onclick      = () => this.showMenu();
        document.getElementById('btn-menu-gameover').onclick   = () => this.showMenu();
        document.getElementById('btn-revive').onclick          = () => this.revive();
        document.getElementById('btn-shop').onclick            = () => this.showShop();
        document.getElementById('btn-close-shop').onclick      = () => this.showMenu();
        document.getElementById('btn-spin').onclick            = () => this.showSpin();
        document.getElementById('btn-close-spin').onclick      = () => this.showMenu();
        document.getElementById('btn-settings').onclick        = () => this.showSettings();
        document.getElementById('btn-close-settings').onclick  = () => this.showMenu();

        // Game Over Results Screen Interactive Actions
        document.getElementById('btn-go-play')?.addEventListener('click',     () => this.startGame());
        document.getElementById('btn-go-home')?.addEventListener('click',     () => this.showMenu());
        document.getElementById('btn-go-shop')?.addEventListener('click',     () => this.showShop());
        document.getElementById('btn-go-settings')?.addEventListener('click', () => this.showSettings());

        // +500 Coins Ad Bonus
        document.getElementById('btn-ad-coins')?.addEventListener('click', () => {
            if (this.claimedCoinAd) return;
            this.claimedCoinAd = true;
            this.sessionCoins += 500;
            this.totalCoins += 500;
            localStorage.setItem('ss_total_coins', this.totalCoins);

            audio.playPowerUp();
            audio.playCoin();

            document.getElementById('go-coins').textContent = '+' + this.sessionCoins.toLocaleString();
            const totalCoinsEl = document.getElementById('go-total-coins-val');
            if (totalCoinsEl) totalCoinsEl.textContent = this.totalCoins.toLocaleString();

            const btn = document.getElementById('btn-ad-coins');
            if (btn) {
                btn.disabled = true;
                btn.classList.add('claimed');
                btn.innerHTML = '<span>✓ CLAIMED</span>';
            }
            this.showToast('💰 +500 Coins added to wallet!');
            this.updateUI();
        });

        // Watch Bonus Video Banner Action
        document.getElementById('btn-watch-bonus-video')?.addEventListener('click', () => {
            if (this.claimedVideoBonus) return;
            this.claimedVideoBonus = true;
            this.keys += 2;
            this.hoverboards += 1;
            localStorage.setItem('ss_keys', this.keys);
            localStorage.setItem('ss_hoverboards', this.hoverboards);

            audio.playPowerUp();
            const keysEl = document.getElementById('go-keys-val');
            if (keysEl) keysEl.textContent = this.keys;
            const boardsEl = document.getElementById('go-boards-val');
            if (boardsEl) boardsEl.textContent = this.hoverboards;

            const btn = document.getElementById('btn-watch-bonus-video');
            if (btn) {
                btn.disabled = true;
                btn.classList.add('claimed');
                btn.innerHTML = '<span>✓ CLAIMED</span>';
            }
            this.showToast('🎁 Rewarded: +2 Keys & +1 Hoverboard!');
        });

        // Add Friends Social Action
        document.getElementById('btn-add-friends')?.addEventListener('click', () => {
            audio.playTone(520, 'triangle', 0.1, 0.15);
            const shareText = `Can you beat my high score of ${this.highScore.toLocaleString()} in Subway Runners 3D? Play now: ${window.location.href}`;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).catch(() => {});
            }
            this.showToast('🏆 Invite link copied! Share with friends!');
        });

        const toggleSound = () => {
            audio.soundEnabled = !audio.soundEnabled;
            document.getElementById('sound-icon').textContent = audio.soundEnabled ? '🔊' : '🔇';
            document.getElementById('setting-sound').checked  = audio.soundEnabled;
            if (!audio.soundEnabled) audio.stopBGM();
            else if (this.gameState === 'PLAYING') audio.startBGM();
        };
        document.getElementById('btn-sound-toggle').onclick = toggleSound;
        document.getElementById('setting-sound').onchange   = toggleSound;

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            if (this.speedLinesCanvas) {
                this.speedLinesCanvas.width  = window.innerWidth;
                this.speedLinesCanvas.height = window.innerHeight;
            }
        });

        this.initSpinWheel();
    }

    moveLane(dir) {
        const prevLane = this.currentLaneIdx;
        this.currentLaneIdx = Math.max(0, Math.min(2, this.currentLaneIdx + dir));
        if (this.currentLaneIdx !== prevLane) {
            this.targetX = this.lanes[this.currentLaneIdx];
            // 0ms immediate responsive kick: leap 38% toward the target lane on the exact frame of the event
            this.playerGroup.position.x += (this.targetX - this.playerGroup.position.x) * 0.38;
            this.playerGroup.rotation.z = -dir * 0.22;
            audio.playTone(340, 'triangle', 0.06, 0.12);
        }
    }

    jump() {
        if ((this.isGrounded || this.playerY < 0.25) && !this.isSliding && !this.isFlying) {
            this.playerVy = this.jumpForce;
            this.isGrounded = false;
            // 0ms immediate visual snap: start leaping on the trigger frame
            this.playerY += 0.25;
            this.playerGroup.position.y = this.playerY;
            audio.playJump();
        }
    }

    slide() {
        if (!this.isSliding && !this.isFlying) {
            this.isSliding  = true;
            this.slideTimer = 0.65;
            // 0ms instant crouch response
            this.playerGroup.scale.set(1.05, 0.48, 1.05);
            if (!this.isGrounded) {
                this.playerVy = -26; // Instant fast-drop if swiping down during mid-air jump
            }
            audio.playSlide();
        }
    }

    // ─── Start / Pause / Game Over / Revive ─────────────────────────────
    startGame() {
        this.gameState    = 'PLAYING';
        this.score        = 0;
        this.sessionCoins = 0;
        this.currentSpeed = this.baseSpeed;
        this.hasRevived   = false;
        this.currentLaneIdx = 1;
        this.targetX      = 0;
        this.playerY      = 0;
        this.playerVy     = 0;
        this.isGrounded   = true;
        this.isSliding    = false;
        this.isFlying     = false;
        this.skyCoinCooldown = 0;
        this.powerups     = { magnet: 0, multiplier: 0, shield: 0, jetpack: 0 };

        if (this.powerupPillEls) {
            Object.values(this.powerupPillEls).forEach(p => {
                if (p.pill) p.pill.classList.remove('active', 'expiring');
            });
        }

        this.playerGroup.position.set(0, 0, 0);
        this.playerGroup.scale.set(1, 1, 1);

        this.obstacles.forEach(o    => this.scene.remove(o));
        this.coins.forEach(c        => this.scene.remove(c));
        this.powerupItems.forEach(p => this.scene.remove(p));
        this.keyItems.forEach(k     => this.scene.remove(k));
        this.giftItems.forEach(g    => this.scene.remove(g));
        this.obstacles = []; this.coins = []; this.powerupItems = [];
        this.keyItems = []; this.giftItems = [];

        for (let z = 35; z < 240; z += 28) this.spawnGamePattern(z);

        this.setScreen('hud-screen');
        audio.startBGM();
        this.updateUI();
    }

    togglePause() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            this.setScreen('pause-screen');
            audio.stopBGM();
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            this.setScreen('hud-screen');
            audio.startBGM();
        }
    }

    triggerGameOver() {
        this.gameState = 'GAMEOVER';
        audio.stopBGM();
        audio.playCrash();

        // Camera shake on crash
        this.triggerShake(0.6);

        const isNew = this.score > this.highScore;
        if (isNew) {
            this.highScore = Math.floor(this.score);
            localStorage.setItem('ss_high_score', this.highScore);
        }
        this.totalCoins += this.sessionCoins;
        localStorage.setItem('ss_total_coins', this.totalCoins);

        // Update score & currency displays
        const newRecordTag = document.getElementById('new-record-tag');
        if (newRecordTag) newRecordTag.style.display = isNew ? 'block' : 'none';
        
        document.getElementById('go-score').textContent      = Math.floor(this.score).toLocaleString();
        document.getElementById('go-high-score').textContent = this.highScore.toLocaleString();
        document.getElementById('go-coins').textContent      = '+' + this.sessionCoins.toLocaleString();
        
        const keysEl = document.getElementById('go-keys-val');
        if (keysEl) keysEl.textContent = this.keys;
        const totalCoinsEl = document.getElementById('go-total-coins-val');
        if (totalCoinsEl) totalCoinsEl.textContent = this.totalCoins.toLocaleString();
        const boardsEl = document.getElementById('go-boards-val');
        if (boardsEl) boardsEl.textContent = this.hoverboards;
        const multEl = document.getElementById('go-multiplier-val');
        if (multEl) multEl.textContent = 'x' + this.multiplier;

        // Multiplier progress (target x4 unlock at 5000 score)
        const multProg = document.getElementById('go-mult-progress');
        if (multProg) {
            const pct = Math.min(100, Math.floor((this.highScore / 5000) * 100));
            multProg.style.width = Math.max(15, pct) + '%';
        }
        const multTxt = document.getElementById('go-mult-unlock-text');
        if (multTxt) {
            multTxt.innerHTML = `Unlocks at: <strong>x4</strong> (${Math.min(5000, this.highScore).toLocaleString()}/5,000)`;
        }

        // Reset claim states and bonus buttons
        this.claimedCoinAd = false;
        const adBtn = document.getElementById('btn-ad-coins');
        if (adBtn) {
            adBtn.disabled = false;
            adBtn.classList.remove('claimed');
            adBtn.innerHTML = '<span class="ad-tag">AD</span><span class="btn-inner-text">🎬 +500 COINS</span>';
        }

        this.claimedVideoBonus = false;
        const vidBtn = document.getElementById('btn-watch-bonus-video');
        if (vidBtn) {
            vidBtn.disabled = false;
            vidBtn.classList.remove('claimed');
            vidBtn.innerHTML = '<span>🎬 WATCH VIDEO</span>';
        }

        const reviveBtn = document.getElementById('btn-revive');
        if (reviveBtn) reviveBtn.style.display = this.hasRevived ? 'none' : '';

        this.setScreen('game-over-screen');
    }

    showToast(msg) {
        const toast = document.getElementById('go-toast');
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    triggerShake(intensity = 0.5) {
        this.cameraShake.intensity = intensity;
        const body = document.body;
        body.classList.remove('shake');
        void body.offsetWidth; // force reflow
        body.classList.add('shake');
        setTimeout(() => body.classList.remove('shake'), 450);
    }

    revive() {
        if (this.hasRevived) return;
        if (this.keys < 1) {
            this.showToast('❌ Not enough Keys! Watch video to get keys.');
            audio.playTone(180, 'sawtooth', 0.2, 0.2);
            return;
        }
        this.keys--;
        localStorage.setItem('ss_keys', this.keys);
        this.hasRevived = true;
        this.gameState  = 'PLAYING';
        this.obstacles = this.obstacles.filter(o => {
            if (o.position.z < 35 && o.position.z > -10) { this.scene.remove(o); return false; }
            return true;
        });
        this.powerups.shield = 4;
        this.setScreen('hud-screen');
        audio.startBGM();
        audio.playPowerUp();
        this.showToast('✨ Revived! 4s Shield active!');
        this.updateUI();
    }

    showMenu() {
        this.gameState = 'MENU';
        this.setScreen('main-menu-screen');
        audio.stopBGM();
        this.updateUI();
    }

    showShop()     { this.populateShop(); this.setScreen('shop-screen'); }
    showSpin()     { this.setScreen('spin-screen'); }
    showSettings() { this.setScreen('settings-screen'); }

    setScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id)?.classList.add('active');
    }

    updateUI() {
        document.getElementById('menu-high-score').textContent  = this.highScore.toLocaleString();
        document.getElementById('menu-total-coins').textContent = this.totalCoins.toLocaleString();
        document.getElementById('hud-score').textContent        = Math.floor(this.score).toLocaleString();
        document.getElementById('hud-coins').textContent        = this.sessionCoins.toLocaleString();
        const hudKeys = document.getElementById('hud-keys');
        if (hudKeys) hudKeys.textContent = this.keys;
        document.getElementById('shop-coins').textContent       = this.totalCoins.toLocaleString();
        const goCoins = document.getElementById('go-total-coins-val');
        if (goCoins) goCoins.textContent = this.totalCoins.toLocaleString();
        const goKeys = document.getElementById('go-keys-val');
        if (goKeys) goKeys.textContent = this.keys;
        const goBoards = document.getElementById('go-boards-val');
        if (goBoards) goBoards.textContent = this.hoverboards;
    }

    populateShop() {
        const container = document.getElementById('skin-list');
        container.innerHTML = '';
        // Helper to convert hex color number to rgba string
        const hexToRgba = (hex, a) => {
            const h = hex.toString(16).padStart(6, '0');
            const r = parseInt(h.substring(0,2), 16);
            const g = parseInt(h.substring(2,4), 16);
            const b = parseInt(h.substring(4,6), 16);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        };
        const hexStr = (hex) => '#' + hex.toString(16).padStart(6, '0');

        SKINS.forEach(skin => {
            const isUnlocked = this.unlockedSkins.includes(skin.id);
            const isSelected = this.selectedSkin === skin.id;

            const div = document.createElement('div');
            div.className = 'skin-item' + (isSelected ? ' selected' : '');
            const bgColor = hexToRgba(skin.jacket, 0.25);
            const bdColor = hexStr(skin.jacket);
            const priceColor = isUnlocked ? '#00e064' : '#ff9900';
            const priceText = isUnlocked ? (isSelected ? '&#10003; ON' : 'WEAR') : ('<span class="coin-icon" style="width:16px;height:16px;font-size:8px;vertical-align:middle;display:inline-flex;margin-right:2px;">&#9733;</span>' + skin.price);
            div.innerHTML =
                '<div class="skin-avatar" style="background:' + bgColor + ';border:2px solid ' + bdColor + ';">' +
                    skin.icon +
                '</div>' +
                '<div class="skin-name">' + skin.name + '<br><small style="font-weight:700;color:rgba(255,255,255,0.5);font-size:0.68rem;">' + skin.label + '</small></div>' +
                '<div class="skin-price" style="color:' + priceColor + ';">' + priceText + '</div>';

            div.onclick = () => {
                if (isUnlocked) {
                    this.updatePlayerSkin(skin.id);
                    this.populateShop();
                } else if (this.totalCoins >= skin.price) {
                    this.totalCoins -= skin.price;
                    this.unlockedSkins.push(skin.id);
                    localStorage.setItem('ss_total_coins', this.totalCoins);
                    localStorage.setItem('ss_skins', JSON.stringify(this.unlockedSkins));
                    this.updatePlayerSkin(skin.id);
                    this.populateShop();
                    this.updateUI();
                    audio.playPowerUp();
                } else {
                    audio.playTone(150, 'sawtooth', 0.2, 0.2);
                }
            };
            container.appendChild(div);
        });
    }

    // ─── Spin Wheel ───────────────────────────────────────────────────────
    initSpinWheel() {
        const canvas = document.getElementById('spin-wheel-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = 240, H = 240, R = 112;
        const rewards = ['🪙 100', '⚡ 2x', '🪙 250', '🛡️ Shield', '🪙 500', '🔑 JACKPOT'];
        const colors  = ['#0066cc', '#ff6600', '#cc9900', '#cc0055', '#00aa33', '#660099'];
        let angle = 0, spinning = false;

        const draw = (a) => {
            const arc = (Math.PI * 2) / rewards.length;
            ctx.clearRect(0, 0, W, H);

            // Outer glow
            ctx.save();
            ctx.shadowColor = '#ff9900';
            ctx.shadowBlur  = 18;

            ctx.save();
            ctx.translate(W/2, H/2);
            ctx.rotate(a);
            for (let i = 0; i < rewards.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = colors[i];
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, R, i * arc, (i + 1) * arc);
                ctx.fill();
                // Segment text
                ctx.save();
                ctx.rotate(i * arc + arc / 2);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 13px Orbitron, sans-serif';
                ctx.textAlign = 'right';
                ctx.fillText(rewards[i], R - 6, 5);
                ctx.restore();
            }
            // Center circle
            ctx.beginPath();
            ctx.fillStyle = '#111';
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffcc00';
            ctx.beginPath();
            ctx.arc(0, 0, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.restore();
        };

        draw(0);

        document.getElementById('btn-spin-wheel').onclick = () => {
            if (spinning) return;
            spinning = true;
            document.getElementById('spin-reward-msg').textContent = '🎰 Spinning...';

            const rounds      = 5 + Math.random() * 3;
            const targetAngle = angle + rounds * Math.PI * 2;
            const start = performance.now();
            const dur   = 4000;

            const anim = (now) => {
                const p    = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 4);
                angle = targetAngle * ease;
                draw(angle);
                if (p < 1) {
                    requestAnimationFrame(anim);
                } else {
                    spinning = false;
                    const idx    = Math.floor(Math.random() * rewards.length);
                    const reward = rewards[idx];
                    document.getElementById('spin-reward-msg').textContent = `🎉 Won: ${reward}!`;
                    this.totalCoins += 150;
                    localStorage.setItem('ss_total_coins', this.totalCoins);
                    this.updateUI();
                    audio.playPowerUp();
                }
            };
            requestAnimationFrame(anim);
        };
    }

    // ─── Main Animation Loop ─────────────────────────────────────────────
    animate() {
        requestAnimationFrame(this.animate);
        const dt = Math.min(this.clock.getDelta(), 0.1);

        if (this.gameState === 'PLAYING') {
            this.updatePhysics(dt);
            this.updateTrack(dt);
            this.updateCollectibles(dt);
            this.checkCollisions();
            this.updateSpeedLines(dt);
        } else if (this.gameState === 'CINEMATIC') {
            this.updateCinematic(dt);
        }

        // Snow drift
        if (this.snowSystem) {
            const pos = this.snowSystem.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
                pos[i] -= dt * 5.5;
                if (pos[i] < 0) pos[i] = 27;
                pos[i-1] += Math.sin(performance.now() * 0.001 + i) * dt * 0.3;
            }
            this.snowSystem.geometry.attributes.position.needsUpdate = true;
        }

        // Rotate portals
        this.obstacles.forEach(o => {
            if (o.userData.type === 'mystery') o.rotation.y += dt * 1.2;
        });

        // Animate track point lights
        const t = performance.now() * 0.001;
        this.trackLights.forEach((pl, i) => {
            pl.intensity = 2.0 + Math.sin(t * 1.5 + i * 1.2) * 0.8;
        });

        // Player light follows character
        this.playerLight.position.set(
            this.playerGroup.position.x,
            2.8,
            this.playerGroup.position.z + 2
        );

        if (this.gameState === 'PLAYING') {
            // Character animation
            this.animateCharacter(dt);

            // Camera slight lean + shake
            const targetCamX = this.playerGroup.position.x * 0.62;
            this.camera.position.x += (targetCamX - this.camera.position.x) * 0.12;

            // Jetpack smooth camera elevation and transition
            const targetCamY = this.isFlying ? 10.4 : 4.5;
            const targetCamZ = this.isFlying ? -9.5 : -7.5;
            this.camera.position.y += (targetCamY - this.camera.position.y) * 4.2 * dt;
            this.camera.position.z += (targetCamZ - this.camera.position.z) * 4.2 * dt;

            // Dynamic lookAt elevation
            const targetLookY = this.isFlying ? (this.playerY * 0.72 + 1.2) : 1.8;
            this.camera.lookAt(this.playerGroup.position.x * 0.45, targetLookY, 16);

            // Speed FOV
            const targetFOV = 62 + (this.currentSpeed - this.baseSpeed) / (this.maxSpeed - this.baseSpeed) * 10;
            this.camera.fov += (targetFOV - this.camera.fov) * 0.04;
            this.camera.updateProjectionMatrix();
        }

        // Camera shake decay
        if (this.cameraShake.intensity > 0.01) {
            this.camera.position.x += (Math.random() - 0.5) * this.cameraShake.intensity;
            this.camera.position.y += (Math.random() - 0.5) * this.cameraShake.intensity * 0.5;
            this.cameraShake.intensity *= 0.88;
        }

        this.renderer.render(this.scene, this.camera);
    }

    animateCharacter(dt) {
        const rc = performance.now() * 0.015; // run cycle
        const { isGrounded, isSliding, isFlying } = this;

        if (this.gameState === 'PLAYING') {
            if (isFlying) {
                // ── Jetpack High Sky Flight (Superman / Aerodynamic flight pose) ──
                // Torso tilted forward horizontally
                this.torsoGroup.rotation.x += (-0.68 - this.torsoGroup.rotation.x) * 8 * dt;
                this.torsoGroup.position.y += (1.35 - this.torsoGroup.position.y) * 8 * dt;
                this.headGroup.position.y  += (2.15 - this.headGroup.position.y)  * 8 * dt;
                this.headGroup.rotation.x  += (0.45 - this.headGroup.rotation.x)  * 8 * dt;

                // Arms trailing backward aerodynamically
                this.leftArm.shoulder.rotation.x  += (0.50 - this.leftArm.shoulder.rotation.x)  * 10 * dt;
                this.rightArm.shoulder.rotation.x += (0.50 - this.rightArm.shoulder.rotation.x) * 10 * dt;
                this.leftArm.forearm.rotation.x   += (0.25 - this.leftArm.forearm.rotation.x)   * 10 * dt;
                this.rightArm.forearm.rotation.x  += (0.25 - this.rightArm.forearm.rotation.x)  * 10 * dt;

                // Legs trailing straight back with subtle flight wave
                const legWave = Math.sin(rc * 1.5) * 0.08;
                this.leftLeg.hip.rotation.x       += (0.40 + legWave - this.leftLeg.hip.rotation.x)       * 10 * dt;
                this.rightLeg.hip.rotation.x      += (0.40 - legWave - this.rightLeg.hip.rotation.x)      * 10 * dt;
                this.leftLeg.kneeGroup.rotation.x += (0.12 - this.leftLeg.kneeGroup.rotation.x) * 10 * dt;
                this.rightLeg.kneeGroup.rotation.x+= (0.12 - this.rightLeg.kneeGroup.rotation.x) * 10 * dt;

                this.ponytail.rotation.x = 0.60;
            } else if (isGrounded && !isSliding) {
                this.headGroup.rotation.x += (0 - this.headGroup.rotation.x) * 8 * dt;
                // ── Running animation ──
                const lArmTarget  =  Math.sin(rc) * 0.78;
                const rArmTarget  = -Math.sin(rc) * 0.78;
                const lLegTarget  = -Math.sin(rc) * 0.85;
                const rLegTarget  =  Math.sin(rc) * 0.85;

                this.leftArm.shoulder.rotation.x  += (lArmTarget  - this.leftArm.shoulder.rotation.x)  * 14 * dt;
                this.rightArm.shoulder.rotation.x += (rArmTarget  - this.rightArm.shoulder.rotation.x) * 14 * dt;
                this.leftArm.forearm.rotation.x   += (-0.45 - Math.abs(Math.sin(rc)) * 0.3 - this.leftArm.forearm.rotation.x) * 14 * dt;
                this.rightArm.forearm.rotation.x  += (-0.45 - Math.abs(Math.cos(rc)) * 0.3 - this.rightArm.forearm.rotation.x) * 14 * dt;

                this.leftLeg.hip.rotation.x       += (lLegTarget  - this.leftLeg.hip.rotation.x)      * 14 * dt;
                this.rightLeg.hip.rotation.x      += (rLegTarget  - this.rightLeg.hip.rotation.x)     * 14 * dt;
                this.leftLeg.kneeGroup.rotation.x += (Math.max(0, Math.sin(rc)) * 1.0 - this.leftLeg.kneeGroup.rotation.x) * 14 * dt;
                this.rightLeg.kneeGroup.rotation.x+= (Math.max(0,-Math.sin(rc)) * 1.0 - this.rightLeg.kneeGroup.rotation.x)* 14 * dt;

                // Body bob
                const bob = Math.abs(Math.sin(rc)) * 0.10;
                this.torsoGroup.position.y += (1.32 + bob - this.torsoGroup.position.y) * 12 * dt;
                this.headGroup.position.y  += (2.18 + bob - this.headGroup.position.y)  * 12 * dt;

                // Forward lean while running
                this.torsoGroup.rotation.x += (-0.15 - this.torsoGroup.rotation.x) * 8 * dt;

                // Ponytail bounce
                this.ponytail.rotation.x = -0.25 + Math.sin(rc * 1.8) * 0.28;

            } else if (isSliding) {
                this.headGroup.rotation.x += (0 - this.headGroup.rotation.x) * 8 * dt;
                // ── Slide animation ──
                this.leftArm.shoulder.rotation.x  += (1.3  - this.leftArm.shoulder.rotation.x)  * 12 * dt;
                this.rightArm.shoulder.rotation.x += (1.3  - this.rightArm.shoulder.rotation.x) * 12 * dt;
                this.leftLeg.hip.rotation.x       += (-1.4 - this.leftLeg.hip.rotation.x)      * 12 * dt;
                this.rightLeg.hip.rotation.x      += (-1.4 - this.rightLeg.hip.rotation.x)     * 12 * dt;
                this.leftLeg.kneeGroup.rotation.x += (1.3  - this.leftLeg.kneeGroup.rotation.x) * 12 * dt;
                this.rightLeg.kneeGroup.rotation.x+= (1.3  - this.rightLeg.kneeGroup.rotation.x)* 12 * dt;
                this.torsoGroup.rotation.x        += (-0.8 - this.torsoGroup.rotation.x) * 10 * dt;
                this.ponytail.rotation.x           = 0.55;

            } else {
                this.headGroup.rotation.x += (0 - this.headGroup.rotation.x) * 8 * dt;
                // ── Jump animation ──
                this.leftArm.shoulder.rotation.x  += (-1.5 - this.leftArm.shoulder.rotation.x)  * 10 * dt;
                this.rightArm.shoulder.rotation.x += (-1.5 - this.rightArm.shoulder.rotation.x) * 10 * dt;
                this.leftLeg.hip.rotation.x       += (0.65 - this.leftLeg.hip.rotation.x)      * 10 * dt;
                this.rightLeg.hip.rotation.x      += (-0.65- this.rightLeg.hip.rotation.x)     * 10 * dt;
                this.leftLeg.kneeGroup.rotation.x += (0.9  - this.leftLeg.kneeGroup.rotation.x) * 10 * dt;
                this.rightLeg.kneeGroup.rotation.x+= (0.5  - this.rightLeg.kneeGroup.rotation.x)* 10 * dt;
                this.torsoGroup.rotation.x        += (0    - this.torsoGroup.rotation.x) * 10 * dt;
                this.ponytail.rotation.x           = -0.65;
            }
        }

        // Jetpack visibility
        if (this.jetpackGroup) this.jetpackGroup.visible = (this.powerups.jetpack > 0 || this.isFlying);
    }

    // ─── Speed Lines Effect ───────────────────────────────────────────────
    updateSpeedLines(dt) {
        if (!this.speedLinesCtx || !this.speedLinesCanvas) return;
        const speedRatio = (this.currentSpeed - this.baseSpeed) / (this.maxSpeed - this.baseSpeed);

        // Show overlay at higher speeds
        if (this.speedLinesCanvas.style.opacity !== undefined) {
            const targetOpacity = speedRatio > 0.35 ? speedRatio * 0.45 : 0;
            const curOpacity    = parseFloat(this.speedLinesCanvas.style.opacity) || 0;
            const newOpacity    = curOpacity + (targetOpacity - curOpacity) * 5 * dt;
            this.speedLinesCanvas.style.opacity = newOpacity;
        }

        if (speedRatio < 0.35) return;

        const ctx = this.speedLinesCtx;
        const W   = this.speedLinesCanvas.width;
        const H   = this.speedLinesCanvas.height;
        const cx  = W / 2, cy  = H / 2;

        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = `rgba(200,230,255,${speedRatio * 0.35})`;
        ctx.lineWidth   = 1.2;

        const lineCount = Math.floor(speedRatio * 40);
        for (let i = 0; i < lineCount; i++) {
            const ang   = Math.random() * Math.PI * 2;
            const inner = 120 + Math.random() * 60;
            const outer = inner + 40 + Math.random() * 100;
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner);
            ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer);
            ctx.stroke();
        }
    }

    // ─── Physics Update ───────────────────────────────────────────────────
    updatePhysics(dt) {
        // Accelerate
        this.currentSpeed = Math.min(this.maxSpeed, this.currentSpeed + dt * 0.30);

        // Score
        const mult = this.powerups.multiplier > 0 ? 2 : 1;
        this.score += this.currentSpeed * dt * mult * 0.7;

        // Update score display with pop
        const scoreEl = document.getElementById('hud-score');
        const newTxt  = Math.floor(this.score).toLocaleString();
        if (scoreEl.textContent !== newTxt) {
            scoreEl.textContent = newTxt;
        }

        // Speed bar
        const speedRatio = (this.currentSpeed - this.baseSpeed) / (this.maxSpeed - this.baseSpeed);
        const speedBarEl = document.getElementById('hud-speed-bar');
        const speedValEl = document.getElementById('hud-speed-val');
        if (speedBarEl) speedBarEl.style.width = (20 + speedRatio * 80) + '%';
        if (speedValEl) speedValEl.textContent = (1 + speedRatio * 2.3).toFixed(1) + 'x';

        // Smooth lane movement (ultra responsive exponential lerp)
        const laneAlpha = 1 - Math.exp(-26 * dt);
        this.playerGroup.position.x += (this.targetX - this.playerGroup.position.x) * laneAlpha;

        // Lean on dodge
        const tilt = (this.targetX - this.playerGroup.position.x) * 0.085;
        this.playerGroup.rotation.z += (tilt - this.playerGroup.rotation.z) * (1 - Math.exp(-18 * dt));

        // Jetpack flight physics & smooth altitude control
        if (this.powerups.jetpack > 0) {
            this.isFlying = true;
            this.isGrounded = false;
            // Smooth ascent to 8.2m (well above all oncoming trains and hurdles)
            this.playerY += (8.2 - this.playerY) * 4.2 * dt;
            this.playerVy = 0;
        } else if (this.isFlying) {
            // Smooth graceful descent back to track level
            this.playerY += (0 - this.playerY) * 3.6 * dt;
            this.playerVy = 0;
            if (this.playerY <= 0.08) {
                this.playerY = 0;
                this.isFlying = false;
                this.isGrounded = true;
            }
        } else {
            // Normal Gravity / jump
            if (!this.isGrounded) {
                this.playerVy += this.gravity * dt;
                this.playerY  += this.playerVy * dt;
                if (this.playerY <= 0) {
                    this.playerY  = 0;
                    this.playerVy = 0;
                    this.isGrounded = true;
                }
            }
        }

        // Slide
        if (this.isSliding) {
            this.slideTimer -= dt;
            this.playerGroup.scale.set(1, 0.50, 1);
            if (this.slideTimer <= 0) {
                this.isSliding = false;
                this.playerGroup.scale.set(1, 1, 1);
            }
        }

        this.playerGroup.position.y = this.playerY;
        this.shieldMesh.visible     = this.powerups.shield > 0;

        // Animate 3D Magnet Aura
        if (this.magnetAura) {
            this.magnetAura.visible = this.powerups.magnet > 0;
            if (this.magnetAura.visible) {
                this.magnetAura.rotation.y += dt * 3.5;
                this.magnetAura.rotation.x += dt * 2.0;
            }
        }

        // Animate Jetpack Thruster Flames & Trail Smoke
        const hasFlames = (this.powerups.jetpack > 0 || this.isFlying);
        if (this.jetpackFlames && this.jetpackFlames.length > 0) {
            this.jetpackFlames.forEach(f => {
                f.visible = hasFlames;
                if (hasFlames) {
                    const flick = 0.85 + Math.random() * 0.45;
                    f.scale.set(flick, flick * 1.5, flick);
                }
            });
        }
        if (hasFlames && this.jetpackParticlePool) {
            this.thrusterCooldown = (this.thrusterCooldown || 0) - dt;
            if (this.thrusterCooldown <= 0) {
                this.thrusterCooldown = 0.045; // ~22 particles/sec
                [-0.22, 0.22].forEach(fx => {
                    this.spawnJetpackSmoke(
                        this.playerGroup.position.x + fx,
                        this.playerY + 0.68,
                        this.playerGroup.position.z - 0.48
                    );
                });
            }
        }
        this.updateJetpackParticles(dt);

        // Multiplier chip in HUD
        const multChip = document.getElementById('hud-mult-chip');
        if (multChip) multChip.textContent = (this.powerups.multiplier > 0 ? '2x' : '1x');

        // High performance direct DOM updates for power-up pills (Zero layout thrashing)
        if (this.powerupPillEls) {
            for (const key in this.powerups) {
                const p = this.powerupPillEls[key];
                if (!p) continue;
                if (this.powerups[key] > 0) {
                    this.powerups[key] = Math.max(0, this.powerups[key] - dt);
                    const rem = this.powerups[key];
                    const pct = (rem / p.total) * 100;
                    if (p.pill) {
                        p.pill.classList.add('active');
                        if (rem <= 3.5) {
                            p.pill.classList.add('expiring');
                        } else {
                            p.pill.classList.remove('expiring');
                        }
                    }
                    if (p.time) p.time.textContent = Math.ceil(rem) + 's';
                    if (p.bar)  p.bar.style.width = pct.toFixed(1) + '%';
                } else {
                    if (p.pill && p.pill.classList.contains('active')) {
                        p.pill.classList.remove('active', 'expiring');
                    }
                }
            }
        }

        // Active Chase Sequence (Guard & Dog chase closely behind for first 5 seconds)
        if (this.chaseTimer > 0) {
            this.chaseTimer -= dt;
            const chaseProgress = 1 - (this.chaseTimer / 5.0); // 0 at start -> 1 when finishing
            const lagZ = -3.8 - (chaseProgress * 15.0); // starts 3.8m behind runner, gradually drops back to -18.8m

            if (this.guardGroup) {
                this.guardGroup.visible = true;
                this.guardGroup.position.x += (this.playerGroup.position.x - 0.4 - this.guardGroup.position.x) * 6 * dt;
                this.guardGroup.position.z = this.playerGroup.position.z + lagZ;
                this.guardGroup.position.y = 0;
                this.guardGroup.rotation.set(0, 0, 0);
                this.animateGuardRunning(dt);
            }

            if (this.dogGroup) {
                this.dogGroup.visible = true;
                this.dogGroup.position.x += (this.playerGroup.position.x + 0.6 - this.dogGroup.position.x) * 7 * dt;
                this.dogGroup.position.z = this.playerGroup.position.z + lagZ + 0.8;
                this.dogGroup.position.y = 0;
                this.dogGroup.rotation.set(0, 0, 0);
                this.animateDogRunning(dt);
            }

            if (this.chaseTimer <= 0) {
                if (this.guardGroup) this.guardGroup.visible = false;
                if (this.dogGroup)   this.dogGroup.visible = false;
            }
        }
    }

    // ─── Track Scroll ─────────────────────────────────────────────────────
    updateTrack(dt) {
        const dist = this.currentSpeed * dt;

        this.trackSegments.forEach(s => s.position.z -= dist);

        const first = this.trackSegments[0];
        if (first.position.z < -this.segmentLength) {
            this.trackSegments.shift();
            const last = this.trackSegments[this.trackSegments.length - 1];
            first.position.z = last.position.z + this.segmentLength;
            this.trackSegments.push(first);
            this.spawnGamePattern(first.position.z);
        }

        // Advance obstacles and moving oncoming trains
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const o = this.obstacles[i];
            const extraMove = (o.userData.isMoving ? o.userData.speed : 0) * dt;
            o.position.z -= (dist + extraMove);

            // Dynamic headlights: auto toggle ON when approaching player, OFF when passed
            if (o.userData.headlightGroup) {
                const relZ = o.position.z - this.playerGroup.position.z;
                o.userData.headlightGroup.visible = (relZ > -7 && relZ < 72);
            }

            if (o.position.z < -22) { this.scene.remove(o); this.obstacles.splice(i, 1); }
        }

        // Continuous Sky Coin stream during high-altitude Jetpack flight
        if (this.powerups.jetpack > 0) {
            this.skyCoinCooldown -= dt;
            if (this.skyCoinCooldown <= 0) {
                this.skyCoinCooldown = 0.16;
                const lane = this.lanes[Math.floor(Math.random() * 3)];
                const waveY = 7.3 + Math.sin(performance.now() * 0.005) * 0.6;
                this.createCoin(lane, waveY, 120);
            }
        }
    }

    // ─── Collectibles (Coins, Keys, Gifts, Powerups) ──────────────────────
    updateCollectibles(dt) {
        const dist     = this.currentSpeed * dt;
        const playerPos = this.playerGroup.position;

        // 1. Coins
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.position.z -= dist;
            coin.rotation.z += dt * 5;
            coin.rotation.y += dt * 2;

            // Coin Magnet Suction (22s duration, 35m suction across all 3 lanes)
            if (this.powerups.magnet > 0) {
                const d = coin.position.distanceTo(playerPos);
                if (d < 35) {
                    coin.position.lerp(new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z), 18 * dt);
                }
            }

            // Coin Collect Collision
            if (coin.position.distanceTo(new THREE.Vector3(playerPos.x, playerPos.y + 1.1, playerPos.z)) < 1.7) {
                this.sessionCoins++;
                const coinEl = document.getElementById('hud-coins');
                if (coinEl) {
                    coinEl.textContent = this.sessionCoins.toLocaleString();
                    coinEl.parentElement.classList.remove('pop');
                    void coinEl.parentElement.offsetWidth;
                    coinEl.parentElement.classList.add('pop');
                }

                audio.playCoin();
                this.scene.remove(coin);
                this.coins.splice(i, 1);
                continue;
            }

            if (coin.position.z < -12) { this.scene.remove(coin); this.coins.splice(i, 1); }
        }

        // 2. Rare Golden Keys (چابی)
        for (let i = this.keyItems.length - 1; i >= 0; i--) {
            const k = this.keyItems[i];
            k.position.z -= dist;
            k.rotation.y += dt * 3.5;
            k.rotation.z = Math.sin(performance.now() * 0.004) * 0.25;

            // Magnet suction on keys
            if (this.powerups.magnet > 0) {
                const d = k.position.distanceTo(playerPos);
                if (d < 30) k.position.lerp(new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z), 14 * dt);
            }

            if (k.position.distanceTo(new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z)) < 1.85) {
                this.keys++;
                localStorage.setItem('ss_keys', this.keys);
                audio.playKeyPickup();

                const keyHud = document.getElementById('hud-keys');
                if (keyHud) {
                    keyHud.textContent = this.keys;
                    keyHud.parentElement.classList.remove('pop');
                    void keyHud.parentElement.offsetWidth;
                    keyHud.parentElement.classList.add('pop');
                }
                this.showToast('🔑 Key Collected! (چابی)');
                this.scene.remove(k);
                this.keyItems.splice(i, 1);
                continue;
            }

            if (k.position.z < -12) { this.scene.remove(k); this.keyItems.splice(i, 1); }
        }

        // 3. Mystery Gift Loot Boxes
        for (let i = this.giftItems.length - 1; i >= 0; i--) {
            const g = this.giftItems[i];
            g.position.z -= dist;
            g.rotation.y += dt * 2.8;
            g.rotation.x = Math.sin(performance.now() * 0.003) * 0.2;

            if (g.position.distanceTo(new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z)) < 1.9) {
                audio.playGiftOpen();
                const lootRoll = Math.random();
                if (lootRoll < 0.35) {
                    const bonus = 250;
                    this.sessionCoins += bonus;
                    this.showToast(`🎁 Gift: +${bonus} Bonus Coins!`);
                } else if (lootRoll < 0.60) {
                    this.keys += 1;
                    localStorage.setItem('ss_keys', this.keys);
                    const keyHud = document.getElementById('hud-keys');
                    if (keyHud) keyHud.textContent = this.keys;
                    this.showToast('🎁 Gift: +1 Rare Key (چابی)!');
                } else if (lootRoll < 0.80) {
                    this.powerups.magnet = this.powerupDurations.magnet;
                    this.showToast('🎁 Gift: 22s Super Coin Magnet! 🧲');
                } else {
                    this.powerups.shield = this.powerupDurations.shield;
                    this.showToast('🎁 Gift: Energy Shield Activated! 🛡️');
                }

                this.scene.remove(g);
                this.giftItems.splice(i, 1);
                continue;
            }

            if (g.position.z < -12) { this.scene.remove(g); this.giftItems.splice(i, 1); }
        }

        // 4. Powerup Items (Magnet, Jetpack, Shield, Multiplier)
        for (let i = this.powerupItems.length - 1; i >= 0; i--) {
            const p = this.powerupItems[i];
            p.position.z -= dist;
            p.rotation.x += dt * 2.2;
            p.rotation.y += dt * 3.2;

            if (p.position.distanceTo(new THREE.Vector3(playerPos.x, playerPos.y + 1.2, playerPos.z)) < 1.8) {
                const type = p.userData.powerupType;
                this.powerups[type] = this.powerupDurations[type] || 15.0;
                audio.playPowerUp();

                if (type === 'magnet')  this.showToast('🧲 Super Magnet Active! (22s)');
                if (type === 'jetpack') this.showToast('🚀 Jetpack High Flight! (50s)');
                if (type === 'shield')  this.showToast('🛡️ Energy Shield Online!');
                if (type === 'multiplier') this.showToast('⚡ 2x Score Multiplier Active!');

                this.scene.remove(p);
                this.powerupItems.splice(i, 1);
                continue;
            }

            if (p.position.z < -12) { this.scene.remove(p); this.powerupItems.splice(i, 1); }
        }
    }

    // ─── Collision Detection ──────────────────────────────────────────────
    checkCollisions() {
        const px = this.playerGroup.position.x;
        const py = this.playerGroup.position.y;

        for (let i = 0; i < this.obstacles.length; i++) {
            const obs  = this.obstacles[i];
            const ox   = obs.position.x;
            const oz   = obs.position.z;
            const type = obs.userData.type;

            const zThresh = type === 'train' ? 7.5 : 1.4;
            if (Math.abs(oz) < zThresh && Math.abs(px - ox) < 1.4) {
                // Shield absorbs
                if (this.powerups.shield > 0) {
                    this.powerups.shield = 0;
                    this.scene.remove(obs);
                    this.obstacles.splice(i, 1);
                    audio.playPowerUp();
                    this.triggerShake(0.2);
                    return;
                }

                if (type === 'low'     && py > 1.1) continue;
                if (type === 'high'    && this.isSliding) continue;
                if (this.powerups.jetpack > 0 || this.isFlying || py > 2.8) continue;

                if (type === 'mystery') {
                    this.sessionCoins += 25;
                    this.scene.remove(obs);
                    this.obstacles.splice(i, 1);
                    audio.playPowerUp();
                    return;
                }

                this.triggerGameOver();
                break;
            }
        }
    }
}

// ─── Launch ─────────────────────────────────────────────────────────────────
function initSubwayGame() {
    if (!window.game) window.game = new SubwayProGame();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubwayGame);
} else {
    initSubwayGame();
}
