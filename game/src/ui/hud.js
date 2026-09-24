// In-round heads-up display: hole card, wind, lie/club info, shot controls,
// swing meter, minimap, toasts, banners and scorecards.
import { S } from '../core/holeGen.js';
import { SHOT_TYPES } from '../game/shots.js';
import { MPH } from '../core/physics.js';
import { audio } from '../audio/audio.js';

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const fmtToPar = (v) => v === 0 ? 'E' : v > 0 ? `+${v}` : `${v}`;

export class Hud {
  constructor(root, app) {
    this.app = app;
    this.root = root;
    root.innerHTML = `
      <div class="hud-top-left glass" id="hole-card">
        <div class="hc-num" id="hc-num">1</div>
        <div class="hc-body">
          <div class="hc-course" id="hc-course"></div>
          <div class="hc-title" id="hc-title">PAR 4</div>
          <div class="hc-sub" id="hc-sub">445 YDS</div>
        </div>
        <div class="hc-score">
          <div class="hc-stroke" id="hc-stroke">SHOT 1</div>
          <div class="hc-topar" id="hc-topar">E</div>
        </div>
      </div>
      <div class="hud-top-right">
        <div class="glass wind" id="wind">
          <div class="wind-label">WIND</div>
          <div class="wind-dial"><div class="wind-arrow" id="wind-arrow">➤</div></div>
          <div class="wind-mph" id="wind-mph">0 MPH</div>
        </div>
        <div class="glass minimap"><canvas id="minimap" width="200" height="320"></canvas></div>
      </div>
      <div class="hud-bottom-left glass" id="info">
        <div class="info-row"><span>LIE</span><b id="i-lie">TEE</b><em id="i-liepct"></em></div>
        <div class="info-row"><span>TO PIN</span><b id="i-pin">0</b></div>
        <div class="info-row"><span>PLAYS LIKE</span><b id="i-plays">0</b></div>
        <div class="info-row"><span>ELEVATION</span><b id="i-elev">0 ft</b></div>
        <div class="info-row"><span>AIM</span><div class="aimbar" id="i-aimbar"><i></i><em>⚑</em></div><em id="i-aim"></em></div>
        <div class="club-card">
          <div class="club-name" id="i-club">DRIVER</div>
          <div class="club-brand" id="i-brand">TaylorMade Qi10</div>
          <div class="club-carry"><span id="i-carry">255</span><small id="i-carry-unit">YDS</small></div>
        </div>
      </div>
      <div class="hud-bottom-center" id="shotbar">
        <div class="shot-controls glass">
          <div class="club-picker">
            <button class="icon-btn" id="club-prev" title="Previous club (↑)">‹</button>
            <div class="club-strip" id="club-strip"></div>
            <button class="icon-btn" id="club-next" title="Next club (↓)">›</button>
          </div>
          <div class="ctrl-row">
            <div class="seg" id="type-seg"></div>
            <div class="seg" id="shape-seg">
              <button data-v="-1" title="Draw (Q)">DRAW</button><button data-v="0">STRAIGHT</button><button data-v="1" title="Fade (E)">FADE</button>
            </div>
            <div class="seg" id="traj-seg">
              <button data-v="-1" title="Trajectory (T)">LOW</button><button data-v="0">MID</button><button data-v="1">HIGH</button>
            </div>
            <div class="spin-ball" id="spin-ball" title="Click to set strike point / spin (I J K L)"><div class="spin-dot" id="spin-dot"></div></div>
          </div>
        </div>
        <div class="meter-wrap" id="meter-wrap">
          <div class="meter" id="meter">
            <div class="meter-zone" id="meter-zone"></div>
            <div class="meter-fill" id="meter-fill"></div>
            <div class="meter-over"></div>
            <div class="meter-target" id="meter-target"><span>⚑</span></div>
            <div class="meter-marker" id="meter-marker"></div>
            <div class="meter-ticks" id="meter-ticks"></div>
          </div>
          <button class="swing-btn" id="swing-btn">HOLD <b>SPACE</b> TO SWING</button>
        </div>
      </div>
      <div class="aim-pad">
        <button class="icon-btn big" id="aim-left">⟲</button>
        <button class="icon-btn big" id="aim-right">⟳</button>
      </div>
      <div class="help glass" id="help">
        <div><kbd>←</kbd><kbd>→</kbd> Aim <kbd>↑</kbd><kbd>↓</kbd> Club <kbd>X</kbd> Shot</div>
        <div><kbd>Q</kbd>/<kbd>E</kbd> Draw/Fade <kbd>T</kbd> Height <kbd>R</kbd> Aim at pin</div>
        <div><kbd>C</kbd> Camera <kbd>M</kbd> Map <kbd>G</kbd> Putt guide <kbd>Tab</kbd> Card</div>
        <div>Drag to look · Wheel to scout ahead</div>
      </div>
      <div class="toast" id="toast"><div class="toast-main"></div><div class="toast-sub"></div></div>
      <div class="banner" id="banner"><div class="banner-main"></div><div class="banner-sub"></div></div>
      <div class="hole-intro" id="hole-intro"></div>
      <div class="practice-panel glass" id="practice-panel"></div>
      <div class="modal" id="hud-modal"></div>
      <div class="loading" id="loading"></div>
    `;
    this.bind();
  }

  bind() {
    const play = () => this.app.play;
    // never leave HUD buttons focused: Space must always mean "swing"
    this.root.addEventListener('click', () => { const a = document.activeElement; if (a && a !== document.body && a.blur) a.blur(); });
    $('#club-prev', this.root).onclick = () => play().cycleClub(-1);
    $('#club-next', this.root).onclick = () => play().cycleClub(1);
    $('#shape-seg', this.root).onclick = (e) => { const v = e.target.dataset.v; if (v != null) play().setShape(+v); };
    $('#traj-seg', this.root).onclick = (e) => { const v = e.target.dataset.v; if (v != null) play().setTraj(+v); };
    $('#type-seg', this.root).onclick = (e) => { const v = e.target.dataset.t; if (v) play().setType(v); };
    const sb = $('#spin-ball', this.root);
    sb.onclick = (e) => {
      const r = sb.getBoundingClientRect();
      let x = ((e.clientX - r.left) / r.width) * 2 - 1, y = -(((e.clientY - r.top) / r.height) * 2 - 1);
      const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; }
      play().setSpin(Math.round(x * 4) / 4, Math.round(y * 4) / 4);
    };
    const swing = $('#swing-btn', this.root);
    const down = (e) => { e.preventDefault(); play().swingPress(); };
    const up = (e) => { e.preventDefault(); if (play().state === 'swing') play().swingRelease(); };
    swing.addEventListener('pointerdown', down);
    swing.addEventListener('pointerup', up);
    swing.addEventListener('pointerleave', up);
    const aimHold = (id, key) => {
      const b = $(id, this.root);
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); play().keys.add(key); });
      const off = () => play().keys.delete(key);
      b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off);
    };
    aimHold('#aim-left', 'left'); aimHold('#aim-right', 'right');
    const mm = $('#minimap', this.root);
    mm.addEventListener('click', (e) => {
      if (!this.map) return;
      const r = mm.getBoundingClientRect();
      const mx = (e.clientX - r.left) * (mm.width / r.width), my = (e.clientY - r.top) * (mm.height / r.height);
      const [x, y] = this.mapToPlan(mx, my);
      play().aimAt(x, y);
    });
    // meter ticks
    const ticks = $('#meter-ticks', this.root);
    for (const v of [0, 0.25, 0.5, 0.75, 1]) {
      const t = el('div', 'tick'); t.style.left = this.mpos(v) + '%'; t.dataset.v = v;
      t.innerHTML = `<span>${v === 0 ? '' : Math.round(v * 100)}</span>`;
      ticks.appendChild(t);
    }
  }

  show(v) { this.root.classList.toggle('visible', v); if (!v) { this.closeModal(); this.practiceResult(null); } }

  // meter domain [-0.35, 1.15]
  mpos(v) { return ((v + 0.35) / 1.5) * 100; }

  loading(show, info) {
    const l = $('#loading', this.root);
    if (!show) { l.classList.remove('show'); return; }
    l.innerHTML = `
      <div class="load-card">
        <div class="load-course">${info.course.name}</div>
        <div class="load-hole">HOLE ${info.number}</div>
        <div class="load-meta">PAR ${info.par} · ${info.yards} YARDS${info.name ? ' · ' + info.name.toUpperCase() : ''}</div>
        ${info.sig ? '<div class="sig-badge">SIGNATURE HOLE</div>' : ''}
        <div class="load-tip">${info.tip || ''}</div>
        <div class="spinner"></div>
      </div>`;
    l.classList.add('show');
  }

  holeIntro(show, h, tip) {
    const e = $('#hole-intro', this.root);
    if (!show) { e.classList.remove('show'); return; }
    e.innerHTML = `<div class="hi-num">${h.number}</div><div class="hi-body"><div class="hi-title">HOLE ${h.number} <span>PAR ${h.par}</span></div>
      <div class="hi-yds">${h.yards} YARDS${h.name ? ' · ' + h.name : ''}</div><div class="hi-tip">${tip || ''}</div><div class="hi-skip">Press SPACE to skip</div></div>`;
    e.classList.add('show');
  }

  setHoleInfo(h) {
    $('#hc-num', this.root).textContent = h.number;
    $('#hc-course', this.root).textContent = h.course + (h.mode === 'range' ? ' · DRIVING RANGE' : h.mode === 'practice' ? ' · PRACTICE' : h.mode === 'coursePractice' ? ' · COURSE PRACTICE' : ` · ${h.holeIdx + 1}/${h.holeCount}`);
    $('#hc-title', this.root).textContent = h.mode === 'range' ? 'DRIVING RANGE' : `PAR ${h.par}`;
    $('#hc-sub', this.root).textContent = `${h.yards} YDS${h.name ? ' · ' + h.name : ''}`;
    $('#hc-stroke', this.root).textContent = `SHOT ${h.stroke}`;
    const tp = $('#hc-topar', this.root);
    tp.textContent = h.mode === 'round' || h.mode === 'round9' || h.mode === 'round18' ? fmtToPar(h.toPar) : '—';
    tp.className = 'hc-topar ' + (h.toPar < 0 ? 'under' : h.toPar > 0 ? 'over' : '');
  }

  setWind(relAngle, mph) {
    const a = $('#wind-arrow', this.root);
    // arrow glyph points right (east) by default; relAngle 0 = blowing away from camera (up)
    a.style.transform = `rotate(${(relAngle * 180 / Math.PI) - 90}deg)`;
    const m = Math.round(mph);
    $('#wind-mph', this.root).textContent = `${m} MPH`;
    $('#wind', this.root).classList.toggle('strong', m >= 15);
  }

  setInfo(i) {
    $('#i-lie', this.root).textContent = i.lie;
    $('#i-lie', this.root).style.color = i.lieColor;
    $('#i-liepct', this.root).textContent = i.liePct;
    const pinTxt = i.putt || i.toPin < 30 ? `${Math.round(i.toPin * 3)} FT` : `${Math.round(i.toPin)} YDS`;
    $('#i-pin', this.root).textContent = pinTxt;
    $('#i-plays', this.root).textContent = i.putt ? '—' : `${Math.round(i.playsLike)} YDS`;
    const ef = Math.round(i.elevFt);
    $('#i-elev', this.root).textContent = `${ef > 0 ? '▲ +' : ef < 0 ? '▼ ' : ''}${ef} FT`;
    // aim relative to the flag
    const off = i.aimOff * 180 / Math.PI;
    const ao = Math.abs(off);
    $('#i-aim', this.root).textContent = ao < 0.4 ? 'AT FLAG' : `${ao.toFixed(1)}° ${off < 0 ? 'L' : 'R'}`;
    $('#i-aimbar i', this.root).style.left = `${50 + Math.max(-48, Math.min(48, off * 3))}%`;
    $('#i-club', this.root).textContent = i.club.name.toUpperCase();
    $('#i-brand', this.root).textContent = `${i.club.brand} ${i.club.model}`;
    if (i.putt) {
      $('#i-carry', this.root).textContent = i.puttScale;
      $('#i-carry-unit', this.root).textContent = 'FT MAX';
    } else {
      $('#i-carry', this.root).textContent = Math.round(i.carry);
      $('#i-carry-unit', this.root).textContent = 'YDS CARRY';
    }
    // club strip
    const strip = $('#club-strip', this.root);
    strip.innerHTML = '';
    const n = i.bag.length;
    for (let k = -2; k <= 2; k++) {
      const idx = i.clubIdx + k;
      if (idx < 0 || idx >= n) { strip.appendChild(el('div', 'club-chip empty')); continue; }
      const c = i.bag[idx];
      const chip = el('div', 'club-chip' + (k === 0 ? ' active' : ''), `<b>${c.short}</b>`);
      chip.onclick = () => this.app.play.selectClub(c);
      strip.appendChild(chip);
    }
    // shot types
    const ts = $('#type-seg', this.root);
    ts.innerHTML = i.types.map(t => `<button data-t="${t}" class="${t === i.typeId ? 'on' : ''}" title="${SHOT_TYPES[t].desc}">${SHOT_TYPES[t].name.toUpperCase()}</button>`).join('');
    const setSeg = (id, v) => $(id, this.root).querySelectorAll('button').forEach(b => b.classList.toggle('on', +b.dataset.v === v));
    setSeg('#shape-seg', i.shape);
    setSeg('#traj-seg', i.traj);
    $('#shape-seg', this.root).style.display = i.putt ? 'none' : '';
    $('#traj-seg', this.root).style.display = i.putt ? 'none' : '';
    $('#spin-ball', this.root).style.display = i.putt ? 'none' : '';
    const d = $('#spin-dot', this.root);
    d.style.left = `${50 + i.spin.x * 38}%`;
    d.style.top = `${50 - i.spin.y * 38}%`;
    // meter labels for putting show feet
    this.root.querySelectorAll('#meter-ticks .tick').forEach(t => {
      const v = +t.dataset.v;
      t.querySelector('span').textContent = v === 0 ? '' : i.putt ? `${Math.round(v * i.puttScale)}'` : Math.round(v * 100);
    });
  }

  meterShow(v, putt) {
    const w = $('#meter-wrap', this.root);
    w.classList.toggle('hidden', !v);
    w.classList.toggle('putt', !!putt);
    $('#shotbar .shot-controls', this.root).classList.toggle('hidden', !v);
    if (v) this.meterReset();
  }
  meterReset() {
    $('#meter-fill', this.root).style.width = '0%';
    $('#meter-fill', this.root).style.left = this.mpos(0) + '%';
    $('#meter-marker', this.root).style.left = this.mpos(0) + '%';
    $('#meter', this.root).classList.remove('hit-good', 'hit-bad');
  }
  meterWindow(w) {
    const z = $('#meter-zone', this.root);
    if (!w) { z.style.display = 'none'; return; }
    z.style.display = '';
    z.style.left = this.mpos(-w) + '%';
    z.style.width = (this.mpos(w) - this.mpos(-w)) + '%';
  }
  meterTarget(v, puttScale) {
    const t = $('#meter-target', this.root);
    if (v == null || v > 1.12) { t.style.display = 'none'; return; }
    t.style.display = '';
    t.style.left = this.mpos(Math.max(0, v)) + '%';
  }
  meterUpdate(power, marker, phase, rating) {
    const f = $('#meter-fill', this.root);
    f.style.left = this.mpos(0) + '%';
    f.style.width = (this.mpos(Math.min(power, 1.15)) - this.mpos(0)) + '%';
    f.classList.toggle('over', power > 1.0);
    $('#meter-marker', this.root).style.left = this.mpos(Math.max(-0.35, marker)) + '%';
    if (phase === 'hit') {
      const m = $('#meter', this.root);
      m.classList.add(rating === 'PERFECT' || rating === 'GREAT' || rating === 'PURE' || rating === 'GOOD' ? 'hit-good' : 'hit-bad');
    }
  }

  toast(main, sub = '', kind = 'info', ms = 1500) {
    const t = $('#toast', this.root);
    $('.toast-main', t).textContent = main;
    $('.toast-sub', t).textContent = sub;
    t.className = `toast show ${kind}`;
    clearTimeout(this.toastT);
    this.toastT = setTimeout(() => t.classList.remove('show'), ms);
  }

  banner(main, sub, kind) {
    const b = $('#banner', this.root);
    $('.banner-main', b).textContent = main;
    $('.banner-sub', b).textContent = sub || '';
    b.className = `banner show ${kind}`;
    clearTimeout(this.bannerT);
    this.bannerT = setTimeout(() => b.classList.remove('show'), 2500);
  }

  // ---------------- minimap ----------------
  buildMap(play) {
    const hole = play.hole;
    const c = $('#minimap', this.root);
    const W = c.width, H = c.height;
    const tee = hole.at(hole.teeS), g = hole.G;
    const dx = g[0] - tee.x, dy = g[1] - tee.y;
    const len = Math.hypot(dx, dy);
    const ang = Math.atan2(dx, dy); // rotate so this points up
    const scale = Math.min((H - 40) / (len + 40), (W - 20) / 140);
    const cx = (tee.x + g[0]) / 2, cy = (tee.y + g[1]) / 2;
    const cos = Math.cos(ang), sin = Math.sin(ang);
    this.map = { hole, scale, cx, cy, cos, sin, W, H, holeRef: hole };
    // background image
    const bg = document.createElement('canvas'); bg.width = W; bg.height = H;
    const ctx = bg.getContext('2d');
    ctx.fillStyle = '#1f3a1c'; ctx.fillRect(0, 0, W, H);
    const src = this.app.world.terrainCanvas;
    if (src) {
      ctx.save();
      ctx.translate(W / 2, H / 2);
      ctx.rotate(-ang);
      ctx.scale(scale, -scale);
      // plan (x,y) -> image px ((x - gx0)*2, (y - gy0)*2)
      ctx.translate(-cx, -cy);
      ctx.translate(hole.gx0, hole.gy0);
      ctx.scale(0.5, 0.5);
      ctx.drawImage(src, 0, 0);
      ctx.restore();
    }
    // trees as dots
    ctx.fillStyle = 'rgba(20,45,18,0.75)';
    for (let i = 0; i < hole.trees.length; i += 1) {
      const t = hole.trees[i];
      const [mx, my] = this.planToMap(t.x, t.y);
      if (mx < -5 || my < -5 || mx > W + 5 || my > H + 5) continue;
      ctx.beginPath(); ctx.arc(mx, my, Math.max(1.2, t.cr * scale * 0.8), 0, Math.PI * 2); ctx.fill();
    }
    this.mapBg = bg;
  }
  planToMap(x, y) {
    const m = this.map;
    const px = x - m.cx, py = y - m.cy;
    const rx = px * m.cos - py * m.sin, ry = px * m.sin + py * m.cos;
    return [m.W / 2 + rx * m.scale, m.H / 2 - ry * m.scale];
  }
  mapToPlan(mx, my) {
    const m = this.map;
    const rx = (mx - m.W / 2) / m.scale, ry = -(my - m.H / 2) / m.scale;
    const px = rx * m.cos + ry * m.sin, py = -rx * m.sin + ry * m.cos;
    return [px + m.cx, py + m.cy];
  }
  drawMap(play) {
    if (!this.map || this.map.holeRef !== play.hole) this.buildMap(play);
    this.drawMapBall(play, [play.ball.x, play.ball.y, play.ball.h]);
  }
  drawMapBall(play, ball) {
    if (!this.map || this.map.holeRef !== play.hole) this.buildMap(play);
    const c = $('#minimap', this.root);
    const ctx = c.getContext('2d');
    ctx.drawImage(this.mapBg, 0, 0);
    const hole = play.hole;
    const [px, py] = this.planToMap(hole.pin[0], hole.pin[1]);
    const [bx, by] = this.planToMap(ball[0], ball[1]);
    // aim line
    if (play.state === 'aim' || play.state === 'swing') {
      const L = play.previewLanding;
      const d = L ? Math.hypot(L[0] - play.ball.x, L[1] - play.ball.y) : play.distPin;
      const ex = play.ball.x + Math.sin(play.heading) * d, ey = play.ball.y + Math.cos(play.heading) * d;
      const [ax, ay] = this.planToMap(ex, ey);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
      if (L) {
        const [lx, ly] = this.planToMap(L[0], L[1]);
        ctx.strokeStyle = '#7dffb0'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(lx, ly, 5, 0, Math.PI * 2); ctx.stroke();
      }
    }
    // pin
    ctx.fillStyle = '#fff'; ctx.fillRect(px - 0.5, py - 12, 1.5, 12);
    ctx.fillStyle = '#ff3b3b'; ctx.beginPath(); ctx.moveTo(px + 1, py - 12); ctx.lineTo(px + 8, py - 9); ctx.lineTo(px + 1, py - 6); ctx.fill();
    // ball
    ctx.fillStyle = '#fff'; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // yardage to pin
    const d = Math.hypot(hole.pin[0] - ball[0], hole.pin[1] - ball[1]);
    ctx.font = '600 11px Inter, sans-serif'; ctx.fillStyle = '#fff';
    ctx.fillText(d < 30 ? `${Math.round(d * 3)} ft` : `${Math.round(d)} y`, 6, c.height - 8);
  }

  // ---------------- practice / range panel ----------------
  practiceResult(play, r, sh) {
    const p = $('#practice-panel', this.root);
    if (!play) { p.classList.remove('show'); return; }
    const L = sh.launch;
    const hole = play.hole;
    const toPin = hole.distToPin(play.ball.x, play.ball.y);
    const side = (() => {
      const hx = Math.sin(play.heading), hy = Math.cos(play.heading);
      const vx = r.end.x - sh.startBall.x, vy = r.end.y - sh.startBall.y;
      return vx * hy - vy * hx;
    })();
    const rows = play.isPutt()
      ? [['Result', r.holed ? 'HOLED' : `${Math.round(toPin * 3)} ft left`], ['Distance', `${(r.total * 3).toFixed(1)} ft`], ['Stroke', L.rating]]
      : [['Ball speed', `${Math.round(L.ballMph)} mph`], ['Launch', `${L.launchDeg.toFixed(1)}°`], ['Spin', `${Math.round(L.back)} rpm`],
        ['Carry', `${Math.round(r.carry)} yds`], ['Total', `${Math.round(r.total)} yds`], ['Apex', `${Math.round(r.apex * 3)} ft`],
        ['Offline', `${Math.abs(side).toFixed(0)} yds ${side > 0.5 ? 'R' : side < -0.5 ? 'L' : ''}`], ['Strike', L.rating],
        [play.cfg.mode === 'range' ? 'Club' : 'To pin', play.cfg.mode === 'range' ? play.club.name : (toPin < 30 ? `${Math.round(toPin * 3)} ft` : `${Math.round(toPin)} yds`)]];
    p.innerHTML = `<div class="pp-title">${play.cfg.mode === 'range' ? 'LAUNCH MONITOR' : 'SHOT DATA'}</div>
      <div class="pp-grid">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>
      <div class="pp-btns"><button class="btn primary" id="pp-next">${play.cfg.mode === 'range' ? 'NEXT BALL' : 'RETRY SPOT'} <kbd>Enter</kbd></button>
      ${play.cfg.mode === 'practice' ? '<button class="btn" id="pp-new">NEW SPOT <kbd>N</kbd></button>' : ''}
      ${play.cfg.mode === 'practice' && !play.lastResult?.r?.holed ? '<button class="btn" id="pp-continue">PLAY IT OUT</button>' : ''}</div>`;
    p.classList.add('show');
    $('#pp-next', p).onclick = () => { play.playingOut = false; play.continueAfterResult(); };
    const n = $('#pp-new', p); if (n) n.onclick = () => play.newPracticeSpot();
    const c = $('#pp-continue', p); if (c) c.onclick = () => { p.classList.remove('show'); play.playingOut = true; play.continueAfterResult(); };
  }

  // ---------------- scorecard ----------------
  scorecardHtml(play) {
    const course = play.course;
    const cards = play.round.cards;
    const byHole = new Map(cards.map(c => [c.hole, c]));
    const sections = [];
    const front = [...Array(9).keys()], back = [...Array(9).keys()].map(i => i + 9);
    for (const [label, idxs] of [['OUT', front], ['IN', back]]) {
      if (!idxs.some(i => byHole.has(i))) continue;
      const rowHole = idxs.map(i => `<th>${i + 1}</th>`).join('');
      const rowYds = idxs.map(i => `<td>${byHole.get(i)?.yards || Math.round(course.holes[i].y * play.tee.factor)}</td>`).join('');
      const rowPar = idxs.map(i => `<td>${course.holes[i].p}</td>`).join('');
      const rowScore = idxs.map(i => {
        const c = byHole.get(i);
        if (!c || c.strokes == null) return '<td class="empty">·</td>';
        const d = c.strokes - c.par;
        const cls = d <= -2 ? 'eagle' : d === -1 ? 'birdie' : d === 0 ? 'par' : d === 1 ? 'bogey' : 'dbl';
        return `<td><span class="sc ${cls}">${c.strokes}</span></td>`;
      }).join('');
      const rowPutts = idxs.map(i => { const c = byHole.get(i); return `<td class="dim">${c && c.strokes != null ? c.putts : ''}</td>`; }).join('');
      const par = idxs.reduce((a, i) => a + course.holes[i].p, 0);
      const yds = idxs.reduce((a, i) => a + Math.round(course.holes[i].y * play.tee.factor), 0);
      const played = idxs.map(i => byHole.get(i)).filter(c => c && c.strokes != null);
      const sc = played.reduce((a, c) => a + c.strokes, 0);
      const putts = played.reduce((a, c) => a + c.putts, 0);
      sections.push(`<table class="scorecard">
        <tr class="hdr"><th>HOLE</th>${rowHole}<th>${label}</th></tr>
        <tr><th>YARDS</th>${rowYds}<td>${yds}</td></tr>
        <tr><th>PAR</th>${rowPar}<td>${par}</td></tr>
        <tr class="score"><th>SCORE</th>${rowScore}<td><b>${played.length ? sc : ''}</b></td></tr>
        <tr><th>PUTTS</th>${rowPutts}<td class="dim">${played.length ? putts : ''}</td></tr>
      </table>`);
    }
    const played = cards.filter(c => c.strokes != null);
    const tot = played.reduce((a, c) => a + c.strokes, 0);
    const par = played.reduce((a, c) => a + c.par, 0);
    return `${sections.join('')}
      <div class="sc-total"><div><span>TOTAL</span><b>${tot || '-'}</b></div><div><span>PAR</span><b>${par || '-'}</b></div><div><span>TO PAR</span><b class="${tot - par < 0 ? 'under' : tot - par > 0 ? 'over' : ''}">${played.length ? fmtToPar(tot - par) : '-'}</b></div></div>
      <div class="sc-legend"><span class="sc eagle">3</span> Eagle+ <span class="sc birdie">3</span> Birdie <span class="sc par">4</span> Par <span class="sc bogey">5</span> Bogey <span class="sc dbl">6</span> Double+</div>`;
  }

  showScorecard(play, extraButtons = '') {
    const m = $('#hud-modal', this.root);
    m.innerHTML = `<div class="modal-card wide">
      <div class="modal-title">${play.course.name.toUpperCase()} <small>${play.tee.name} tees · ${play.diff.name}</small></div>
      ${this.scorecardHtml(play)}
      <div class="modal-btns">${extraButtons || '<button class="btn primary" id="sc-close">CLOSE <kbd>Tab</kbd></button>'}</div></div>`;
    m.classList.add('show');
    const c = $('#sc-close', m); if (c) c.onclick = () => this.closeModal();
    return m;
  }
  closeModal() { $('#hud-modal', this.root).classList.remove('show'); }
  modalOpen() { return $('#hud-modal', this.root).classList.contains('show'); }

  holeComplete(play, { last, practice }) {
    const btns = practice
      ? `<button class="btn" id="hc-replay">REPLAY HOLE</button><button class="btn primary" id="hc-next">NEXT HOLE ▸</button><button class="btn" id="hc-menu">MAIN MENU</button>`
      : `<button class="btn primary" id="hc-next">${last ? 'FINISH ROUND ▸' : 'NEXT HOLE ▸'} <kbd>Enter</kbd></button>`;
    const m = this.showScorecard(play, btns);
    const next = $('#hc-next', m);
    const go = () => {
      this.closeModal();
      if (practice) {
        const nextIdx = (play.round.holes[play.round.idx] + 1) % 18;
        play.round.holes[play.round.idx] = nextIdx;
        play.round.cards[play.round.idx] = { hole: nextIdx, par: play.course.holes[nextIdx].p, yards: 0, strokes: null, putts: 0, fairway: null, gir: false, penalties: 0 };
        play.loadHole(play.round.idx);
      } else play.nextHole();
    };
    next.onclick = go;
    this.pendingNext = go;
    const r = $('#hc-replay', m); if (r) r.onclick = () => { this.closeModal(); play.replayHole(); };
    const mm = $('#hc-menu', m); if (mm) mm.onclick = () => { this.closeModal(); this.app.quitToMenu(); };
    audio.click();
  }
}
