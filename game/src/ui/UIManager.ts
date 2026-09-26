import type { Game } from '../core/Game';
import { overall } from '../data/golfers';
import type { Appearance, CourseData, GolferData, HoleLayout } from '../data/types';
import { CourseDatabase } from '../systems/CourseDatabase';
import { applyOption, BALLS, CUSTOM_OPTIONS } from '../systems/CustomizationSystem';
import { GolferDatabase } from '../systems/GolferDatabase';
import type { HoleEvents } from '../systems/HoleManager';
import { COURSE_UNLOCK_COINS, TIER_LABEL, TIER_XP } from '../systems/ProgressionSystem';
import { formatToPar, scoreTone } from '../systems/ScoringSystem';
import { RoundSession, TournamentSystem } from '../systems/TournamentSystem';
import { holeThumbnail } from './thumbnails';

type ScreenId = 'menu' | 'courses' | 'course' | 'holes' | 'golfers' | 'customize' | 'tournaments' | 'profile' | 'settings' | 'hud';

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, html?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function stars(n: number): string {
  return Array.from({ length: 5 }, (_, i) => (i < n ? '★' : '<span class="off">★</span>')).join('');
}

/** Builds every screen as lightweight DOM over the WebGL canvas. */
export class UIManager {
  private root: HTMLElement;
  private game: Game;
  private screen: HTMLElement | null = null;
  private overlay: HTMLElement | null = null;
  private loader: HTMLElement;
  current: ScreenId = 'menu';
  private unsub: (() => void)[] = [];

  constructor(root: HTMLElement, game: Game) {
    this.root = root;
    this.game = game;
    this.loader = el('div', 'loading', `<div class="logo">Mini<span>Majors</span></div><div class="spinner"></div><div class="eyebrow">Shrinking the course…</div>`);
    document.body.appendChild(this.loader);
    const rot = el('div', 'rotate', `<div class="phone"></div><div class="display" style="font-size:34px">Rotate your device</div><div class="muted">Mini Majors is played in landscape.</div>`);
    document.body.appendChild(rot);
    this.root.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.btn, .course-card, .hole-tile, .roster-card, .tab, .swatch, .choice, .toggle')) this.game.audio.ui();
    });
  }

  loading(on: boolean): void {
    this.loader.style.opacity = on ? '1' : '0';
    this.loader.style.pointerEvents = on ? 'auto' : 'none';
  }

  private mount(id: ScreenId, node: HTMLElement): void {
    this.unsub.forEach((u) => u());
    this.unsub = [];
    this.screen?.remove();
    this.closeOverlay();
    this.current = id;
    this.screen = node;
    this.root.appendChild(node);
  }

  private closeOverlay(): void {
    this.overlay?.remove();
    this.overlay = null;
  }

  private topbar(): HTMLElement {
    const g = this.game;
    const bar = el('div', 'topbar');
    bar.innerHTML = `<div class="chip"><span class="coin"></span>${g.save.data.coins.toLocaleString()}</div>
      <div class="chip">LVL ${g.progression.level} · ${TIER_LABEL[g.progression.tier]}</div>`;
    return bar;
  }

  private back(to: () => void): HTMLElement {
    const b = el('button', 'btn icon back', '‹');
    b.style.fontSize = '34px';
    b.onclick = to;
    return b;
  }

  go(id: ScreenId): void {
    switch (id) {
      case 'menu':
        return this.menu();
      case 'courses':
        return this.courses();
      case 'golfers':
        return this.golfers();
      case 'customize':
        return this.customize();
      case 'tournaments':
        return this.tournaments();
      case 'profile':
        return this.profile();
      case 'settings':
        return this.settings();
      default:
        return this.menu();
    }
  }

  /* ================================================================ MAIN MENU */

  menu(): void {
    const g = this.game;
    if (g.engine.activeStage !== g.world || g.session) g.showMenuWorld();
    const s = el('div', 'screen');
    const golfer = g.currentGolfer();
    const last = CourseDatabase.layout(g.save.data.lastHole ?? 'augusta-12');
    const course = CourseDatabase.course(last.courseId);
    s.innerHTML = `
      <div class="menu-left">
        <div class="logo">Mini<span>Majors</span></div>
        <div class="tagline">Real championship holes, shrunk down to mini-golf. Play them as the legends.</div>
        <div class="menu-list">
          <button class="btn primary" data-a="play">▶ Play</button>
          <div class="row">
            <button class="btn" data-a="courses">⛳ Courses</button>
            <button class="btn" data-a="golfers">🏌️ Golfers</button>
          </div>
          <div class="row">
            <button class="btn" data-a="customize">🎨 Customize</button>
            <button class="btn" data-a="tournaments">🏆 Tournaments</button>
          </div>
          <div class="row">
            <button class="btn" data-a="profile">👤 Profile</button>
            <button class="btn" data-a="settings">⚙️ Settings</button>
          </div>
        </div>
      </div>
      <div class="now-playing">
        <div class="eyebrow">${golfer.flag} Your golfer</div>
        <div class="display name">${esc(golfer.name)}</div>
        <div class="muted" style="font-size:13px;margin-top:4px">Up next: ${course.shortName} · Hole ${last.number} “${last.name}” · Par ${last.par}</div>
      </div>`;
    s.appendChild(this.topbar());
    s.querySelectorAll<HTMLButtonElement>('[data-a]').forEach((b) => {
      b.onclick = () => {
        const a = b.dataset.a!;
        if (a === 'play') g.quickPlay();
        else this.go(a as ScreenId);
      };
    });
    this.mount('menu', s);
  }

  /* ================================================================ COURSES */

  courses(): void {
    const g = this.game;
    if (g.engine.activeStage !== g.world) g.showMenuWorld();
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    s.appendChild(el('div', 'title-block', `<div class="eyebrow">Real courses · miniature scale</div><h1 class="display">Courses</h1>`));
    s.appendChild(this.topbar());
    const row = el('div', 'hscroll');
    CourseDatabase.all().forEach((c, i) => {
      const unlocked = g.progression.isCourseUnlocked(c);
      const built = CourseDatabase.builtHoles(c.id).length;
      const card = el('div', 'course-card');
      card.style.background = `linear-gradient(180deg, ${c.palette.primary}, ${c.palette.ink})`;
      card.style.animationDelay = `${i * 0.05}s`;
      const art = el('div', 'art');
      const sig = CourseDatabase.signatureLayout(c.id);
      if (sig) art.appendChild(holeThumbnail(sig, 400, 230));
      else art.innerHTML = `<div style="height:100%;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0 12px, transparent 12px 24px)"><div class="survey">Survey in progress</div></div>`;
      art.appendChild(el('div', 'tier', TIER_LABEL[c.tier]));
      if (!unlocked) art.appendChild(el('div', 'lock', sig ? '' : '🔒'));
      card.appendChild(art);
      const best = this.bestForCourse(c);
      card.appendChild(
        el(
          'div',
          'body',
          `<h2 class="display">${c.shortName}</h2>
          <div class="muted" style="font-size:13px">${c.location}${c.country !== 'USA' ? ', ' + c.country : ''}</div>
          <div class="stars">${stars(c.difficulty)}</div>
          <div class="kv"><span>Holes</span><b>${c.holes.length} · Par ${c.par}</b></div>
          <div class="kv"><span>Recreated</span><b>${built} / ${c.holes.length}</b></div>
          <div class="kv"><span>Best score</span><b>${best}</b></div>
          <div class="kv"><span>Access</span><b>${unlocked ? 'Full course' : sig ? 'Signature hole' : 'Locked'}</b></div>`,
        ),
      );
      card.onclick = () => this.course(c);
      row.appendChild(card);
    });
    s.appendChild(row);
    this.mount('courses', s);
  }

  private bestForCourse(c: CourseData): string {
    let total = 0;
    let any = false;
    for (const h of c.holes) {
      if (!h.layoutId) continue;
      const r = this.game.save.data.holes[h.layoutId];
      if (r?.best != null) {
        total += r.best - h.par;
        any = true;
      }
    }
    return any ? formatToPar(total) : '—';
  }

  /* ================================================================ COURSE DETAIL (3D diorama) */

  course(c: CourseData): void {
    const g = this.game;
    g.showPreview(c);
    const unlocked = g.progression.isCourseUnlocked(c);
    const built = CourseDatabase.builtHoles(c.id);
    const sig = CourseDatabase.signatureLayout(c.id);
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.courses()));
    s.appendChild(this.topbar());
    const p = el('div', 'panel side-panel');
    p.innerHTML = `
      <div class="eyebrow">${TIER_LABEL[c.tier]} · est. ${c.established}</div>
      <h1 class="display">${c.shortName}</h1>
      <div class="muted">${c.location}, ${c.country}</div>
      <div class="stars" style="font-size:20px">${stars(c.difficulty)}</div>
      <div style="font-size:14px;line-height:1.5">${c.blurb}</div>
      <div class="kv"><span>Architect</span><b>${c.designers}</b></div>
      <div class="kv"><span>Holes · Par</span><b>${c.holes.length} · ${c.par}</b></div>
      <div class="kv"><span>Recreated so far</span><b>${built.length ? built.map((h) => '#' + h.number).join(', ') : 'none yet'}</b></div>
      <div class="kv"><span>Best score</span><b>${this.bestForCourse(c)}</b></div>
      ${sig ? `<div class="muted" style="font-size:12px">Diorama: Hole ${sig.number} “${sig.name}”, 1:${sig.scale} scale. Drag to rotate.</div>` : `<div class="muted" style="font-size:12px">This course is being surveyed. Hole data and yardages are listed; the miniatures are on the way.</div>`}
      <div class="btn-row" style="justify-content:flex-start">
        <button class="btn primary" data-a="holes">Holes</button>
        ${built.length > 1 && unlocked ? `<button class="btn green" data-a="round">Play round</button>` : ''}
        ${!unlocked ? `<button class="btn" data-a="unlock"><span class="coin"></span>${COURSE_UNLOCK_COINS[c.tier]} unlock</button>` : ''}
      </div>
      ${!unlocked ? `<div class="fine">Unlocks free at ${TIER_LABEL[c.tier]} tier (${TIER_XP[c.tier]} XP). The signature hole is always open.</div>` : ''}
      <div class="fine">${c.yardageNote}</div>`;
    p.querySelector<HTMLButtonElement>('[data-a="holes"]')!.onclick = () => this.holes(c);
    const rb = p.querySelector<HTMLButtonElement>('[data-a="round"]');
    if (rb) rb.onclick = () => g.startSession(TournamentSystem.courseRound(c.id));
    const ub = p.querySelector<HTMLButtonElement>('[data-a="unlock"]');
    if (ub)
      ub.onclick = () => {
        if (g.progression.buyCourse(c)) this.course(c);
        else this.toast('Not enough coins', 'Play holes to earn more', 'bad');
      };
    s.appendChild(p);
    this.mount('course', s);
  }

  /* ================================================================ HOLE SELECT */

  holes(c: CourseData): void {
    const g = this.game;
    const s = el('div', 'screen');
    s.style.background = `linear-gradient(180deg, ${c.palette.ink}ee, #081a10f5)`;
    s.appendChild(this.back(() => this.course(c)));
    s.appendChild(el('div', 'title-block', `<div class="eyebrow">${c.shortName}</div><h1 class="display">Select a hole</h1>`));
    s.appendChild(this.topbar());
    const grid = el('div', 'hole-grid');
    c.holes.forEach((h, i) => {
      const layout = h.layoutId ? CourseDatabase.layout(h.layoutId) : undefined;
      const tile = el('div', `hole-tile${layout ? '' : ' unbuilt'}`);
      tile.style.animationDelay = `${i * 0.025}s`;
      const thumb = el('div', 'thumb');
      if (layout) thumb.appendChild(holeThumbnail(layout, 300, 170));
      else thumb.appendChild(el('div', 'survey', 'In survey'));
      thumb.appendChild(el('div', 'num', String(h.number)));
      const rec = layout ? g.save.data.holes[layout.id] : undefined;
      if (rec?.completed) thumb.appendChild(el('div', 'done', '✓'));
      tile.appendChild(thumb);
      const playable = layout ? g.progression.canPlayHole(c.id, layout.id) : false;
      tile.appendChild(
        el(
          'div',
          'info',
          `<div class="hn">${h.name ? esc(h.name) : 'Hole ' + h.number}</div>
          <div><b>PAR ${h.par}</b> · ${h.yards} yds real</div>
          <div>${layout ? `${CourseDatabase.miniFeet(layout)} ft mini · 1:${layout.scale}` : 'Miniature coming soon'}</div>
          <div class="muted">${rec?.best != null ? `Best: ${rec.best} (${formatToPar(rec.best - h.par)})` : layout ? (playable ? 'Not played' : '🔒 Unlock course') : ''}</div>`,
        ),
      );
      if (layout && playable) tile.onclick = () => g.startSession(TournamentSystem.single(layout.id));
      else if (layout) tile.onclick = () => this.toast('Course locked', `Reach ${TIER_LABEL[c.tier]} tier or unlock with coins`, 'bad');
      grid.appendChild(tile);
    });
    s.appendChild(grid);
    this.mount('holes', s);
  }

  /* ================================================================ HUD */

  showHud(layout: HoleLayout, course: CourseData, session: RoundSession): void {
    const g = this.game;
    const s = el('div', 'screen passthrough');
    const mini = CourseDatabase.miniFeet(layout);
    const roundInfo = session.holes.length > 1 ? `Hole ${session.index + 1} of ${session.holes.length}` : course.shortName;
    s.innerHTML = `
      <div class="panel hud-card">
        <div class="hud-num">${layout.number}</div>
        <div>
          <div class="l1">${course.shortName}</div>
          <div class="l2">${esc(layout.name)}</div>
          <div class="l3">Par ${layout.par} · ${layout.realYards} yds real · ${mini} ft mini</div>
        </div>
      </div>
      <div class="hud-strokes">
        <div class="chip" data-h="strokes">Stroke 0</div>
        <div class="chip" data-h="round">${roundInfo}${session.card.length ? ' · ' + formatToPar(session.toPar) : ''}</div>
      </div>
      <div class="hud-buttons">
        <button class="btn icon" data-a="overview" title="Overview">🗺️</button>
        <button class="btn icon" data-a="restart" title="Restart hole">↺</button>
        <button class="btn icon" data-a="pause" title="Pause">❚❚</button>
      </div>
      <div class="hud-bottom">
        <div class="chip" data-h="surface">Tee</div>
        <div class="chip" data-h="dist">— ft</div>
      </div>
      <div class="power"><i></i></div>
      <div class="power-label">0%</div>
      <div class="hint" data-h="hint">Touch the ball · drag back to aim & power · release</div>`;
    const q = (k: string) => s.querySelector<HTMLElement>(`[data-h="${k}"]`)!;
    s.querySelector<HTMLButtonElement>('[data-a="overview"]')!.onclick = () => g.holes.toggleOverview();
    s.querySelector<HTMLButtonElement>('[data-a="restart"]')!.onclick = () => g.restartHole();
    s.querySelector<HTMLButtonElement>('[data-a="pause"]')!.onclick = () => this.pause();
    const power = s.querySelector<HTMLElement>('.power')!;
    const powerFill = power.querySelector<HTMLElement>('i')!;
    const powerLabel = s.querySelector<HTMLElement>('.power-label')!;
    let hinted = false;
    this.mount('hud', s);

    const onHud = (h: HoleEvents['hud']) => {
      q('strokes').textContent = `Stroke ${h.strokes + (h.state === 'aim' ? 1 : 0)} · Par ${h.par}`;
      q('surface').textContent = h.surface;
      q('dist').textContent = `${h.toCup < 3 ? h.toCup.toFixed(1) : Math.round(h.toCup)} ft to cup`;
      q('hint').style.opacity = h.state === 'aim' && !hinted ? '1' : '0';
    };
    this.unsub.push(g.holes.events.on('hud', onHud));
    this.unsub.push(
      g.holes.events.on('power', (p) => {
        power.classList.toggle('on', p.dragging);
        powerLabel.classList.toggle('on', p.dragging);
        powerFill.style.height = `${Math.round(p.power * 100)}%`;
        powerLabel.textContent = `${Math.round(p.power * 100)}%`;
        if (p.dragging) {
          hinted = true;
          q('hint').style.opacity = '0';
        }
      }),
    );
    this.unsub.push(g.holes.events.on('message', (m) => this.toast(m.text, m.sub, m.tone, m.ms)));
    this.unsub.push(g.holes.events.on('intro', ({ layout: l, course: c }) => this.intro(l, c, s)));
    this.unsub.push(
      g.holes.events.on('introDone', () => {
        s.classList.remove('letterbox');
        s.querySelector('.intro')?.remove();
        s.querySelector('.skip')?.remove();
        s.querySelectorAll<HTMLElement>('.hud-card, .hud-strokes, .hud-buttons, .hud-bottom').forEach((e) => (e.style.visibility = 'visible'));
      }),
    );
    // the intro may already have fired while loading
    if (g.holes.state === 'intro') this.intro(layout, course, s);
    onHud({ strokes: g.holes.strokes, par: layout.par, surface: 'Tee', toCup: mini, state: g.holes.state });
  }

  private intro(layout: HoleLayout, course: CourseData, s: HTMLElement): void {
    s.classList.add('letterbox');
    s.querySelectorAll<HTMLElement>('.hud-card, .hud-strokes, .hud-buttons, .hud-bottom').forEach((e) => (e.style.visibility = 'hidden'));
    s.querySelector('.intro')?.remove();
    const card = el(
      'div',
      'intro',
      `<div class="course">${course.shortName}</div>
       <div class="hole">Hole ${layout.number}</div>
       <div class="name">“${esc(layout.name)}”</div>
       <div class="meta"><span>Par ${layout.par}</span><span>${layout.realYards} yards</span><span>${CourseDatabase.miniFeet(layout)} ft mini</span></div>`,
    );
    s.appendChild(card);
    if (!s.querySelector('.skip')) {
      const skip = el('button', 'btn skip', 'Skip ›');
      skip.onclick = () => this.game.holes.skipIntro();
      s.appendChild(skip);
    }
  }

  toast(text: string, sub?: string, tone: 'info' | 'bad' | 'good' = 'info', ms = 1600): void {
    const t = el('div', `toast ${tone}`, `<div class="t">${esc(text)}</div>${sub ? `<div class="s">${esc(sub)}</div>` : ''}`);
    this.root.appendChild(t);
    setTimeout(() => {
      t.style.transition = 'opacity 0.35s';
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 400);
    }, ms);
  }

  private pause(): void {
    const g = this.game;
    this.closeOverlay();
    const o = el('div', 'modal-wrap');
    o.innerHTML = `<div class="panel modal">
      <div class="display" style="font-size:44px;text-align:center">Paused</div>
      <div class="btn-row" style="flex-direction:column;align-items:stretch">
        <button class="btn primary" data-a="resume">Resume</button>
        <button class="btn" data-a="restart">Restart hole</button>
        <button class="btn" data-a="settings">Sound & settings</button>
        <button class="btn" data-a="quit">Quit to menu</button>
      </div></div>`;
    o.querySelector<HTMLButtonElement>('[data-a="resume"]')!.onclick = () => this.closeOverlay();
    o.querySelector<HTMLButtonElement>('[data-a="restart"]')!.onclick = () => {
      this.closeOverlay();
      g.restartHole();
    };
    o.querySelector<HTMLButtonElement>('[data-a="settings"]')!.onclick = () => {
      this.closeOverlay();
      this.settingsModal();
    };
    o.querySelector<HTMLButtonElement>('[data-a="quit"]')!.onclick = () => g.quitToMenu();
    this.overlay = o;
    this.root.appendChild(o);
  }

  /* ================================================================ RESULTS */

  showHoleResult(r: { layoutId: string; strokes: number; par: number; name: string; tone: string; coins: number; xp: number; newBest: boolean; tierUp: string | null; session: RoundSession }): void {
    const g = this.game;
    const layout = CourseDatabase.layout(r.layoutId);
    const course = CourseDatabase.course(layout.courseId);
    const s = r.session;
    const more = s.index < s.holes.length - 1;
    this.closeOverlay();
    const o = el('div', 'modal-wrap');
    o.style.background = 'transparent';
    o.style.alignItems = 'flex-end';
    o.style.justifyContent = 'flex-end';
    const best = g.save.data.holes[r.layoutId]?.best;
    o.innerHTML = `<div class="panel modal" style="width:min(430px,90vw);margin:0 8px 8px 0">
      <div class="eyebrow" style="text-align:center">${course.shortName} · Hole ${layout.number} · Par ${r.par}</div>
      <div class="result-title ${r.tone === 'bogey' || r.tone === 'worse' ? 'worse' : ''}">${esc(r.name)}</div>
      <div class="result-stats">
        <div class="chip">${r.strokes} stroke${r.strokes === 1 ? '' : 's'} · ${formatToPar(r.strokes - r.par)}</div>
        <div class="chip"><span class="coin"></span>+${r.coins}</div>
        <div class="chip">+${r.xp} XP</div>
      </div>
      <div class="result-stats" style="margin-top:0">
        <div class="chip">${r.newBest ? '★ New best!' : `Best: ${best ?? '—'}`}</div>
        ${s.holes.length > 1 ? `<div class="chip">Round ${formatToPar(s.toPar)} thru ${s.card.length}</div>` : ''}
      </div>
      ${r.tierUp ? `<div class="ability" style="text-align:center"><b>Promoted to ${TIER_LABEL[r.tierUp as keyof typeof TIER_LABEL]}!</b>New courses unlocked.</div>` : ''}
      <div class="btn-row">
        ${more ? `<button class="btn primary" data-a="next">Next hole ›</button>` : s.holes.length > 1 ? `<button class="btn primary" data-a="finish">Round summary</button>` : ''}
        <button class="btn ${more || s.holes.length > 1 ? '' : 'primary'}" data-a="replay">↺ Replay</button>
        <button class="btn" data-a="menu">Menu</button>
      </div></div>`;
    const bind = (a: string, fn: () => void) => {
      const b = o.querySelector<HTMLButtonElement>(`[data-a="${a}"]`);
      if (b) b.onclick = fn;
    };
    bind('next', () => {
      this.closeOverlay();
      g.nextHole();
    });
    bind('finish', () => {
      this.closeOverlay();
      g.finishRound();
    });
    bind('replay', () => {
      this.closeOverlay();
      if (s.holes.length > 1) {
        s.card.pop();
      }
      g.restartHole();
    });
    bind('menu', () => g.quitToMenu());
    this.overlay = o;
    this.root.appendChild(o);
  }

  showRoundSummary(s: RoundSession, bonus: number, newBest: boolean): void {
    const g = this.game;
    const sum = s.summary();
    this.closeOverlay();
    const o = el('div', 'modal-wrap');
    const cells = s.card
      .map((c) => {
        const l = CourseDatabase.layout(c.layoutId);
        return { head: `${CourseDatabase.course(l.courseId).shortName.split(' ')[0]} ${c.number}`, par: c.par, strokes: c.strokes, tone: scoreTone(c.strokes, c.par) };
      });
    const bestLayout = CourseDatabase.layout(sum.best.layoutId);
    const worstLayout = CourseDatabase.layout(sum.worst.layoutId);
    const prior = s.tournament ? g.save.data.tournaments[s.tournament.id]?.best : null;
    o.innerHTML = `<div class="panel modal wide">
      <div class="eyebrow" style="text-align:center">${s.tournament ? 'Tournament complete' : 'Round complete'}</div>
      <div class="result-title">${esc(s.title)}</div>
      <table class="scorecard">
        <tr><th>HOLE</th>${cells.map((c) => `<th>${c.head}</th>`).join('')}<th>TOT</th></tr>
        <tr><th>PAR</th>${cells.map((c) => `<td>${c.par}</td>`).join('')}<td>${sum.par}</td></tr>
        <tr><th>SCORE</th>${cells.map((c) => `<td><span class="sc ${c.tone}">${c.strokes}</span></td>`).join('')}<td>${sum.strokes}</td></tr>
      </table>
      <div class="result-stats">
        <div class="chip">Total ${sum.strokes}</div>
        <div class="chip">To par ${formatToPar(sum.toPar)}</div>
        <div class="chip">Best hole: ${CourseDatabase.course(bestLayout.courseId).shortName} ${bestLayout.number} (${sum.best.strokes})</div>
        <div class="chip">Worst hole: ${CourseDatabase.course(worstLayout.courseId).shortName} ${worstLayout.number} (${sum.worst.strokes})</div>
        ${s.tournament ? `<div class="chip">${newBest ? '★ New best round!' : `Best round: ${prior != null ? formatToPar(prior) : '—'}`}</div>` : ''}
        ${bonus ? `<div class="chip"><span class="coin"></span>+${bonus} prize</div>` : ''}
      </div>
      <div class="btn-row">
        <button class="btn primary" data-a="again">Play again</button>
        <button class="btn" data-a="menu">Menu</button>
      </div></div>`;
    o.querySelector<HTMLButtonElement>('[data-a="again"]')!.onclick = () => {
      this.closeOverlay();
      g.startSession(new RoundSession(s.kind, s.title, s.holes, s.tournament));
    };
    o.querySelector<HTMLButtonElement>('[data-a="menu"]')!.onclick = () => g.quitToMenu();
    this.overlay = o;
    this.root.appendChild(o);
  }

  /* ================================================================ GOLFERS */

  golfers(selectedId?: string): void {
    const g = this.game;
    const id = selectedId ?? g.save.data.currentGolfer;
    const golfer = g.golferById(id);
    g.showShowcase(golfer);
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    s.appendChild(this.topbar());
    const p = el('div', 'panel side-panel');
    s.appendChild(p);
    const renderPanel = (gd: GolferData) => {
      const unlocked = g.progression.isGolferUnlocked(gd.id);
      const current = g.save.data.currentGolfer === gd.id;
      const st = gd.stats;
      p.innerHTML = `
        <div style="display:flex;gap:14px;align-items:center">
          <div class="ovr">${overall(gd)}<small>OVR</small></div>
          <div>
            <div class="eyebrow">${gd.flag} ${esc(gd.nationality)}</div>
            <h1 class="display">${esc(gd.name)}</h1>
          </div>
        </div>
        <div style="font-size:14px" class="muted">${esc(gd.bio)}</div>
        ${(['power', 'accuracy', 'control', 'spin', 'putting'] as const).map((k) => `<div class="stat-row"><span>${k}</span><div class="bar"><i style="width:${(st[k] - 60) * 2.5}%"></i></div><span>${st[k]}</span></div>`).join('')}
        ${gd.ability ? `<div class="ability"><b>★ ${gd.ability.name}</b>${gd.ability.description}</div>` : ''}
        <div class="btn-row" style="justify-content:flex-start">
          ${current ? `<button class="btn" disabled>✓ Selected</button>` : unlocked ? `<button class="btn primary" data-a="select">Select</button>` : `<button class="btn primary" data-a="buy"><span class="coin"></span>${gd.unlockCost.toLocaleString()} Sign</button>`}
          <button class="btn" data-a="cheer">Celebrate</button>
          ${gd.isCustom ? `<button class="btn" data-a="edit">Edit</button>` : ''}
        </div>
        <div class="fine">Ratings are game ratings. Stats nudge aim wobble, power consistency, cup capture and rail bounces by a few percent — skill still decides the hole.</div>`;
      const sel = p.querySelector<HTMLButtonElement>('[data-a="select"]');
      if (sel)
        sel.onclick = () => {
          g.selectGolfer(gd.id);
          g.showcase.celebrate();
          this.golfers(gd.id);
        };
      const buy = p.querySelector<HTMLButtonElement>('[data-a="buy"]');
      if (buy)
        buy.onclick = () => {
          if (g.progression.buyGolfer(gd.id, gd.unlockCost)) {
            g.selectGolfer(gd.id);
            g.showcase.celebrate();
            this.golfers(gd.id);
          } else this.toast('Not enough coins', `${gd.unlockCost} needed`, 'bad');
        };
      p.querySelector<HTMLButtonElement>('[data-a="cheer"]')!.onclick = () => g.showcase.celebrate();
      const edit = p.querySelector<HTMLButtonElement>('[data-a="edit"]');
      if (edit) edit.onclick = () => this.customize();
    };
    renderPanel(golfer);
    const roster = el('div', 'roster');
    const all = [...GolferDatabase.roster(), g.golferById('custom')];
    for (const gd of all) {
      const c = el('div', `roster-card${gd.id === id ? ' active' : ''}`);
      c.innerHTML = `<div class="flag">${gd.flag}</div><div class="nm">${esc(gd.shortName)}</div><div class="o">${overall(gd)}</div>${g.progression.isGolferUnlocked(gd.id) ? '' : '<div class="lk">🔒</div>'}`;
      c.onclick = () => {
        roster.querySelectorAll('.roster-card').forEach((x) => x.classList.remove('active'));
        c.classList.add('active');
        g.showcase.show(gd);
        renderPanel(gd);
      };
      roster.appendChild(c);
    }
    s.appendChild(roster);
    this.mount('golfers', s);
  }

  /* ================================================================ CUSTOMIZE */

  customize(): void {
    const g = this.game;
    const draft: { name: string; appearance: Appearance } = JSON.parse(JSON.stringify(g.save.data.customGolfer));
    g.showShowcase(g.golferById('custom'));
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    s.appendChild(this.topbar());
    const p = el('div', 'panel side-panel');
    s.appendChild(p);
    const groups: Record<string, string[]> = {
      Face: ['skin', 'eyes', 'hairStyle', 'hair', 'facialHair'],
      Headwear: ['hat', 'hatColor', 'accessory'],
      Outfit: ['shirtStyle', 'shirt', 'shirtAccent', 'pants', 'shoes', 'glove', 'build'],
      Equipment: ['putter', 'bag', 'ball'],
    };
    let tab = 'Face';
    const refresh3d = () => g.showcase.show({ ...g.golferById('custom'), name: draft.name, appearance: draft.appearance });
    const render = () => {
      p.innerHTML = `
        <div class="eyebrow">Create your golfer</div>
        <input type="text" maxlength="16" value="${esc(draft.name)}" />
        <div class="tabs">${Object.keys(groups).map((t) => `<div class="tab${t === tab ? ' active' : ''}" data-tab="${t}">${t}</div>`).join('')}</div>
        <div data-opts style="display:flex;flex-direction:column;gap:12px"></div>
        <div class="btn-row" style="justify-content:flex-start">
          <button class="btn primary" data-a="save">Save golfer</button>
          <button class="btn" data-a="play">Save & select</button>
        </div>`;
      const input = p.querySelector('input')!;
      input.oninput = () => (draft.name = input.value.trim() || 'You');
      input.onkeydown = (e) => e.stopPropagation();
      p.querySelectorAll<HTMLElement>('[data-tab]').forEach((t) => (t.onclick = () => ((tab = t.dataset.tab!), render())));
      const box = p.querySelector<HTMLElement>('[data-opts]')!;
      for (const key of groups[tab]) {
        if (key === 'ball') {
          box.appendChild(this.ballPicker());
          continue;
        }
        const opt = CUSTOM_OPTIONS.find((o) => o.key === key)!;
        const wrap = el('div', '', `<div class="eyebrow" style="margin-bottom:6px">${opt.label}</div>`);
        const row = el('div', 'swatches');
        for (const v of opt.values) {
          const active = draft.appearance[opt.key] === v.value;
          const b = opt.kind === 'color' ? el('div', `swatch${active ? ' active' : ''}`) : el('div', `choice${active ? ' active' : ''}`, v.label);
          if (opt.kind === 'color') {
            b.style.background = String(v.value);
            b.title = v.label;
          }
          b.onclick = () => {
            draft.appearance = applyOption(draft.appearance, opt.key, v.value);
            row.querySelectorAll('.active').forEach((x) => x.classList.remove('active'));
            b.classList.add('active');
            refresh3d();
          };
          row.appendChild(b);
        }
        wrap.appendChild(row);
        box.appendChild(wrap);
      }
      p.querySelector<HTMLButtonElement>('[data-a="save"]')!.onclick = () => {
        g.save.data.customGolfer = draft;
        g.save.save();
        g.showcase.celebrate();
        this.toast('Saved', undefined, 'good', 900);
      };
      p.querySelector<HTMLButtonElement>('[data-a="play"]')!.onclick = () => {
        g.save.data.customGolfer = draft;
        g.selectGolfer('custom');
        this.golfers('custom');
      };
    };
    render();
    this.mount('customize', s);
  }

  private ballPicker(): HTMLElement {
    const g = this.game;
    const wrap = el('div', '', `<div class="eyebrow" style="margin-bottom:6px">Golf ball</div>`);
    const row = el('div', 'swatches');
    for (const b of BALLS) {
      const owned = g.save.data.cosmetics.owned.includes(b.id);
      const active = g.save.data.cosmetics.equipped.ball === b.id;
      const item = el('div', `choice${active ? ' active' : ''}`, `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${b.color};vertical-align:-2px;margin-right:6px;box-shadow:inset 0 -2px 0 rgba(0,0,0,.2)"></span>${b.name}${owned ? '' : ` · <span class="coin" style="display:inline-block;width:12px;height:12px;vertical-align:-1px"></span>${b.cost}`}`);
      item.onclick = () => {
        if (!owned) {
          if (g.save.data.coins < b.cost) return this.toast('Not enough coins', undefined, 'bad');
          g.save.data.coins -= b.cost;
          g.save.data.cosmetics.owned.push(b.id);
        }
        g.save.data.cosmetics.equipped.ball = b.id;
        g.save.save();
        g.applyBall();
        row.replaceWith(this.ballPicker().querySelector('.swatches')!);
      };
      row.appendChild(item);
    }
    wrap.appendChild(row);
    return wrap;
  }

  /* ================================================================ TOURNAMENTS */

  tournaments(): void {
    const g = this.game;
    if (g.engine.activeStage !== g.world) g.showMenuWorld();
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    s.appendChild(el('div', 'title-block', `<div class="eyebrow">Real holes, back to back</div><h1 class="display">Tournaments</h1>`));
    s.appendChild(this.topbar());
    const row = el('div', 'hscroll');
    TournamentSystem.all().forEach((t, i) => {
      const rec = g.save.data.tournaments[t.id];
      const unlocked = g.progression.tierReached(t.entryTier);
      const card = el('div', 't-card');
      card.style.background = `linear-gradient(160deg, ${t.palette.primary}, #06140c)`;
      card.style.animationDelay = `${i * 0.06}s`;
      const unique = new Set(t.holes);
      card.innerHTML = `
        <div class="eyebrow" style="color:${t.palette.accent}">${t.courseIds.map((c) => CourseDatabase.course(c).shortName).join(' · ')}</div>
        <h2 class="display">${t.name}</h2>
        <div class="muted" style="font-size:13px">${t.subtitle}</div>
        <div class="progress-dots">${Array.from({ length: t.plannedHoles }, (_, k) => `<i class="${k < t.holes.length ? 'on' : ''}"></i>`).join('')}</div>
        <div class="kv"><span>Holes</span><b>${t.holes.length}${t.plannedHoles > t.holes.length ? ` of ${t.plannedHoles} recreated` : ''}</b></div>
        <div class="kv"><span>Par</span><b>${t.holes.reduce((a, h) => a + CourseDatabase.layout(h).par, 0)}</b></div>
        <div class="kv"><span>Best</span><b>${rec?.best != null ? formatToPar(rec.best) : '—'}</b></div>
        <div class="kv"><span>Prize</span><b><span class="coin" style="display:inline-block;vertical-align:-3px"></span> ${t.reward}</b></div>
        <div style="flex:1"></div>
        <button class="btn ${unlocked ? 'primary' : ''}" ${unlocked ? '' : 'disabled'}>${unlocked ? 'Tee off' : `🔒 ${TIER_LABEL[t.entryTier]} tier`}</button>
        <div class="fine">${[...unique].map((h) => { const l = CourseDatabase.layout(h); return `${CourseDatabase.course(l.courseId).shortName} #${l.number}`; }).join(' · ')}</div>`;
      card.querySelector<HTMLButtonElement>('button')!.onclick = () => g.startSession(TournamentSystem.start(t));
      row.appendChild(card);
    });
    s.appendChild(row);
    this.mount('tournaments', s);
  }

  /* ================================================================ PROFILE */

  profile(): void {
    const g = this.game;
    if (g.engine.activeStage !== g.world) g.showMenuWorld();
    const d = g.save.data;
    const next = g.progression.nextTier();
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    s.appendChild(this.topbar());
    const p = el('div', 'panel side-panel');
    const played = Object.entries(d.holes).filter(([, r]) => r.best != null);
    p.innerHTML = `
      <div class="eyebrow">Profile</div>
      <h1 class="display">${esc(d.customGolfer.name)} · LVL ${g.progression.level}</h1>
      <div class="stat-row"><span>Level</span><div class="bar"><i style="width:${g.progression.levelProgress * 100}%"></i></div><span>${g.progression.level}</span></div>
      <div class="kv"><span>Tour tier</span><b>${TIER_LABEL[g.progression.tier]}</b></div>
      <div class="kv"><span>XP</span><b>${d.profile.xp}${next ? ` / ${next.xp} for ${TIER_LABEL[next.tier]}` : ' · max tier'}</b></div>
      <div class="kv"><span>Coins</span><b>${d.coins.toLocaleString()}</b></div>
      <div class="kv"><span>Holes played</span><b>${d.stats.holesPlayed}</b></div>
      <div class="kv"><span>Holes in one</span><b>${d.stats.aces}</b></div>
      <div class="kv"><span>Water balls</span><b>${d.stats.waterBalls}</b></div>
      <div class="kv"><span>Golfers signed</span><b>${d.unlockedGolfers.length - 1} / ${GolferDatabase.roster().length}</b></div>
      <div class="eyebrow" style="margin-top:8px">Best scores</div>
      ${played.length ? played.map(([id, r]) => { const l = CourseDatabase.layout(id); return `<div class="kv"><span>${CourseDatabase.course(l.courseId).shortName} #${l.number} ${esc(l.name)}</span><b>${r.best} (${formatToPar(r.best! - l.par)})${r.aces ? ' · ACE' : ''}</b></div>`; }).join('') : '<div class="muted">No holes completed yet.</div>'}
      <div class="eyebrow" style="margin-top:8px">Tournaments</div>
      ${TournamentSystem.all().map((t) => `<div class="kv"><span>${t.name}</span><b>${d.tournaments[t.id]?.best != null ? formatToPar(d.tournaments[t.id].best!) : '—'}</b></div>`).join('')}`;
    s.appendChild(p);
    this.mount('profile', s);
  }

  /* ================================================================ SETTINGS */

  settings(): void {
    const g = this.game;
    if (g.engine.activeStage !== g.world) g.showMenuWorld();
    const s = el('div', 'screen');
    s.appendChild(this.back(() => this.menu()));
    const p = el('div', 'panel side-panel');
    p.appendChild(el('h1', 'display', 'Settings'));
    p.appendChild(this.settingsBody());
    s.appendChild(p);
    this.mount('settings', s);
  }

  private settingsModal(): void {
    const o = el('div', 'modal-wrap');
    const m = el('div', 'panel modal');
    m.appendChild(el('div', 'display', '<span style="font-size:40px">Settings</span>'));
    m.appendChild(this.settingsBody());
    const close = el('button', 'btn primary', 'Done');
    close.onclick = () => this.closeOverlay();
    const row = el('div', 'btn-row');
    row.appendChild(close);
    m.appendChild(row);
    o.appendChild(m);
    this.overlay = o;
    this.root.appendChild(o);
  }

  private settingsBody(): HTMLElement {
    const g = this.game;
    const st = g.save.data.settings;
    const box = el('div');
    const slider = (label: string, key: 'sfx' | 'ambience') => {
      const r = el('div', 'setting', `<span>${label}</span>`);
      const input = el('input');
      input.type = 'range';
      input.min = '0';
      input.max = '1';
      input.step = '0.05';
      input.value = String(st[key]);
      input.oninput = () => {
        st[key] = parseFloat(input.value);
        g.audio.setLevels(st.sfx, st.ambience);
        g.save.save();
      };
      r.appendChild(input);
      box.appendChild(r);
    };
    const toggle = (label: string, get: () => boolean, set: (v: boolean) => void) => {
      const r = el('div', 'setting', `<span>${label}</span>`);
      const t = el('div', `toggle${get() ? ' on' : ''}`);
      t.onclick = () => {
        set(!get());
        t.classList.toggle('on', get());
        g.save.save();
      };
      r.appendChild(t);
      box.appendChild(r);
    };
    slider('Sound effects', 'sfx');
    slider('Course ambience', 'ambience');
    toggle('High quality graphics', () => st.quality === 'high', (v) => g.setQuality(v ? 'high' : 'low'));
    toggle('Putt preview line', () => st.trajectory, (v) => {
      st.trajectory = v;
      g.holes.setTrajectory(v);
    });
    toggle('Haptics', () => st.haptics, (v) => {
      st.haptics = v;
      g.audio.hapticsEnabled = v;
    });
    const reset = el('div', 'setting', '<span>Progress</span>');
    const rb = el('button', 'btn', 'Reset');
    rb.onclick = () => {
      if (confirm('Reset all progress, coins and unlocks?')) {
        g.save.reset();
        location.reload();
      }
    };
    reset.appendChild(rb);
    box.appendChild(reset);
    box.appendChild(
      el(
        'p',
        'fine',
        'Mini Majors is an independent prototype. Course names, hole names and player names refer to real places and people for identification; it is not affiliated with or endorsed by any club, tour or player. Layouts are hand-authored miniature recreations from public references. Quality changes apply to newly loaded holes.',
      ),
    );
    return box;
  }
}
