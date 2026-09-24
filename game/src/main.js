// Golf.ai Championship — application bootstrap.
import * as THREE from 'three';
import { World, P } from './render/world.js';
import { CameraRig } from './render/camera.js';
import { Golfer } from './render/golfer.js';
import { Hud } from './ui/hud.js';
import { Menus } from './ui/menus.js';
import { Play } from './game/play.js';
import { Hole } from './core/holeGen.js';
import { COURSES } from './data/courses.js';
import { THEMES } from './data/themes.js';
import { loadProfile, saveProfile, awardXp, recordRound } from './core/profile.js';
import { audio } from './audio/audio.js';

const THUMB_KEY = 'golfai.thumbs.v4';

class App {
  constructor() {
    this.profile = loadProfile();
    audio.setVolumes({ master: this.profile.settings.master, sfx: this.profile.settings.sfx, amb: this.profile.settings.amb });
    this.canvas = document.getElementById('scene');
    this.world = new World(this.canvas);
    this.world.setQuality(this.profile.settings.quality || 'high');
    this.rig = new CameraRig(this.world.camera);
    this.hud = new Hud(document.getElementById('hud'), this);
    this.menus = new Menus(document.getElementById('menu'), this);
    this.play = new Play(this);
    this.thumbs = {};
    try { Object.assign(this.thumbs, JSON.parse(localStorage.getItem(THUMB_KEY) || '{}')); } catch (e) { /* noop */ }
    this.loadPhotoOverrides();
    this.mode = 'menu';
    this.menuT = 0;
    this.bindInput();
    this.menus.show(true);
    this.menus.main();
    this.last = performance.now();
    requestAnimationFrame(this.loop.bind(this));
    window.__app = this;
  }

  save() { saveProfile(this.profile); }

  // Real course photos can be dropped in assets/courses/<id>.jpg to replace the rendered cards.
  // List the files in assets/courses/photos.json, e.g. ["augusta.jpg", "pebble.jpg"].
  loadPhotoOverrides() {
    fetch('assets/courses/photos.json').then(r => (r.ok ? r.json() : [])).then(list => {
      for (const file of list || []) {
        const id = file.replace(/\.[a-z]+$/i, '');
        if (!COURSES.find(c => c.id === id)) continue;
        const img = new Image();
        img.onload = () => { this.thumbs[id] = img.src; this.photo = this.photo || {}; this.photo[id] = true; this.menus.refreshThumbs?.(); };
        img.src = `assets/courses/${file}`;
      }
    }).catch(() => { /* file:// or missing manifest */ });
  }

  // ---------------- menu background ----------------
  menuScene() {
    this.mode = 'menu';
    if (this.previewGolfer) this.previewGolfer.root.visible = false;
    if (this.menuHole && this.world.hole === this.menuHole) { this.rig.set('menu', { t: this.menuT }); return; }
    const unlocked = COURSES.filter(c => c.unlock <= this.profile.level);
    const course = unlocked[Math.floor(Math.random() * unlocked.length)] || COURSES[0];
    const sigs = course.holes.map((h, i) => (h.sig ? i : -1)).filter(i => i >= 0);
    const idx = sigs[Math.floor(Math.random() * sigs.length)] ?? 0;
    this.world.setCourseEnv(course, THEMES[course.theme]);
    this.menuHole = new Hole(course, idx, { pinSeed: 3 });
    this.world.loadHole(this.menuHole);
    this.world.setBall(this.menuHole.tee[0], this.menuHole.tee[1], this.menuHole.heightAt(...this.menuHole.tee), true);
    this.rig.set('menu', { t: 0, snap: true });
  }

  golferPreview(look) {
    if (this.world.hole !== this.menuHole || !this.menuHole) this.menuScene();
    this.mode = 'golfer';
    const hole = this.menuHole;
    if (!this.previewGolfer) { this.previewGolfer = new Golfer(look); this.world.scene.add(this.previewGolfer.root); }
    else this.previewGolfer.build(look);
    const g = this.previewGolfer;
    g.root.visible = true;
    g.setClub('wood', 1.15);
    const [tx, ty] = hole.tee;
    const th = hole.heightAt(tx, ty);
    g.address();
    g.placeAtBall(P(tx, ty, th), Math.atan2(hole.teeDir[0], hole.teeDir[1]));
    const gp = g.root.position;
    const wasOrbit = this.rig.mode === 'orbitGolfer';
    this.rig.set('orbitGolfer', { t: this.menuT, center: [gp.x, -gp.z, th], rate: 3, snap: !wasOrbit });
  }

  // ---------------- thumbnails ----------------
  ensureThumbs(onEach) {
    if (this.thumbBusy) { this.thumbCb = onEach; return; }
    const todo = COURSES.filter(c => !this.thumbs[c.id]);
    if (!todo.length) return;
    this.thumbBusy = true; this.thumbCb = onEach;
    const cv = document.createElement('canvas');
    cv.width = 640; cv.height = 360;
    const tw = new World(cv);
    tw.renderer.setPixelRatio(1);
    tw.renderer.setSize(640, 360, false);
    tw.camera.aspect = 640 / 360; tw.camera.updateProjectionMatrix();
    tw.renderer.preserveDrawingBuffer = true;
    const next = () => {
      const c = todo.shift();
      if (!c) {
        this.thumbBusy = false;
        tw.clearHole(); tw.renderer.dispose(); tw.renderer.forceContextLoss?.();
        try { localStorage.setItem(THUMB_KEY, JSON.stringify(Object.fromEntries(Object.entries(this.thumbs).filter(([k]) => !this.photo?.[k])))); } catch (e) { /* quota */ }
        return;
      }
      try {
        const sigs = c.holes.map((h, i) => (h.sig ? i : -1)).filter(i => i >= 0);
        const idx = c.cardHole ?? sigs[0] ?? 0;
        const hole = new Hole(c, idx, { pinSeed: 5 });
        tw.setCourseEnv(c, THEMES[c.theme]);
        tw.loadHole(hole);
        tw.setBall(-9999, -9999, -9999);
        const s = Math.max(0, hole.L - (hole.par === 3 ? hole.L * 0.75 : 150));
        const a = hole.at(s);
        const cam = P(a.x + a.ty * 22, a.y - a.tx * 22, hole.heightAt(a.x, a.y) + (hole.par === 3 ? 18 : 30));
        const look = P(hole.G[0], hole.G[1], hole.heightAt(hole.G[0], hole.G[1]));
        tw.camera.position.copy(cam); tw.camera.lookAt(look);
        tw.update(0.016, look);
        tw.render();
        if (!this.thumbs[c.id]) this.thumbs[c.id] = cv.toDataURL('image/jpeg', 0.82);
      } catch (e) { console.warn('thumb failed', c.id, e); }
      this.thumbCb?.();
      setTimeout(next, 30);
    };
    setTimeout(next, 50);
  }

  // ---------------- rounds ----------------
  startRound(cfg) {
    audio.init();
    this.menus.show(false);
    if (this.previewGolfer) this.previewGolfer.root.visible = false;
    this.menuHole = null;
    this.mode = 'play';
    this.play.start(cfg);
  }

  onRoundComplete(round, st, cfg) {
    let award = null;
    if (cfg.custom && (cfg.mode === 'round18' || cfg.mode === 'round9')) {
      award = awardXp(this.profile, st, cfg.difficulty, st.holes);
      recordRound(this.profile, round);
    } else if (cfg.mode === 'round18' || cfg.mode === 'round9') {
      recordRound(this.profile, round);
    }
    this.save();
    const sc = this.hud.scorecardHtml(this.play);
    this.play.stop();
    this.mode = 'menu';
    this.menus.show(true);
    this.menus.results(round, st, award, cfg, sc);
    this.menuScene();
  }

  quitToMenu() {
    this.play.stop();
    this.hud.closeModal();
    this.menus.show(true);
    this.menus.main();
  }

  pauseMenu() {
    const play = this.play;
    const m = this.hud.showScorecard(play, `
      <button class="btn primary" id="pm-resume">RESUME</button>
      ${play.cfg.mode === 'coursePractice' || play.cfg.mode === 'practice' ? '<button class="btn" id="pm-restart">RESTART HOLE</button>' : ''}
      <button class="btn" id="pm-guide">PUTT GUIDE: ${this.profile.settings.puttGuide ? 'ON' : 'OFF'}</button>
      <button class="btn" id="pm-cam">BROADCAST CAM: ${this.profile.settings.autoCamera ? 'ON' : 'OFF'}</button>
      <button class="btn danger" id="pm-quit">QUIT TO MENU</button>`);
    m.querySelector('.modal-title').insertAdjacentHTML('afterbegin', '<div class="paused">PAUSED</div>');
    m.querySelector('#pm-resume').onclick = () => this.hud.closeModal();
    const r = m.querySelector('#pm-restart'); if (r) r.onclick = () => { this.hud.closeModal(); play.replayHole(); };
    m.querySelector('#pm-guide').onclick = () => { this.profile.settings.puttGuide = !this.profile.settings.puttGuide; this.save(); if (play.state === 'aim') play.updateAim(); this.pauseMenu(); };
    m.querySelector('#pm-cam').onclick = () => { this.profile.settings.autoCamera = !this.profile.settings.autoCamera; this.save(); this.pauseMenu(); };
    m.querySelector('#pm-quit').onclick = () => { if (confirm('Quit this round? Progress on this round will be lost.')) this.quitToMenu(); };
  }

  // ---------------- input ----------------
  bindInput() {
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      audio.init();
      if (this.mode !== 'play') return;
      const play = this.play;
      if (e.key === 'Tab') {
        e.preventDefault();
        if (play.state === 'holed' || play.state === 'final') return;
        if (this.hud.modalOpen()) this.hud.closeModal(); else this.hud.showScorecard(play);
        return;
      }
      if (this.hud.modalOpen()) {
        if (e.key === 'Escape') { if (play.state !== 'holed') this.hud.closeModal(); }
        if (e.key === 'Enter' && play.state === 'holed' && this.hud.pendingNext) { const f = this.hud.pendingNext; this.hud.pendingNext = null; f(); }
        return;
      }
      if (e.key === 'Escape' && play.state !== 'flyover') { e.preventDefault(); this.pauseMenu(); return; }
      if ((e.key === 'n' || e.key === 'N') && play.cfg?.mode === 'practice' && (play.state === 'result' || play.state === 'aim')) { play.newPracticeSpot(); return; }
      if (play.onKeyDown(e)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => { if (this.mode === 'play') this.play.onKeyUp(e); });
    let drag = null;
    this.canvas.addEventListener('pointerdown', (e) => {
      audio.init();
      drag = { x: e.clientX, y: e.clientY, moved: false };
      if (this.mode === 'play' && this.play.state === 'flyover') this.play.endFlyover();
      if (this.mode === 'play' && this.play.state === 'result') this.play.continueAfterResult();
    });
    window.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      if (Math.abs(dx) + Math.abs(dy) > 0) drag.moved = true;
      if (this.mode === 'play') this.play.onDrag(dx, dy);
    });
    window.addEventListener('pointerup', () => { drag = null; });
    this.canvas.addEventListener('wheel', (e) => { if (this.mode === 'play') { e.preventDefault(); this.play.onWheel(e.deltaY); } }, { passive: false });
  }

  loop(now) {
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;
    this.menuT += dt;
    this.frames = (this.frames || 0) + 1;
    let focus = null;
    if (this.mode === 'play' && this.play.hole) {
      this.play.update(dt);
      const b = this.play.state === 'flight' ? this.play.ballNow : (this.play.ball ? [this.play.ball.x, this.play.ball.y, this.play.ball.h] : null);
      if (b) focus = P(b[0], b[1], b[2]);
    } else if (this.world.hole) {
      if (this.rig.opts) this.rig.opts.t = this.menuT;
      this.rig.update(dt, { hole: this.world.hole, ball: [this.world.hole.tee[0], this.world.hole.tee[1], 0], heading: 0 });
      if (this.mode === 'golfer' && this.previewGolfer) { this.previewGolfer.idle(this.menuT); focus = this.previewGolfer.root.position.clone(); }
      else focus = this.rig.look.clone();
    }
    if (this.world.hole) {
      this.world.update(dt, focus);
      this.world.render();
    }
    requestAnimationFrame(this.loop.bind(this));
  }
}

window.addEventListener('DOMContentLoaded', () => {
  try { new App(); }
  catch (e) {
    console.error(e);
    document.body.insertAdjacentHTML('beforeend', `<div style="position:fixed;inset:0;display:grid;place-items:center;color:#fff;font:16px sans-serif;background:#111">Failed to start: ${e.message}. A WebGL-capable browser is required.</div>`);
  }
});
