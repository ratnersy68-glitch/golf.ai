import { frames, launch } from './util.js';
export default async function (page, SP, logs) {
  await launch(page, { mode: 'practice', setup: { courseId: 'augusta', hole: 0, practiceKind: 'putting' } });
  const r = await page.evaluate(() => {
    const p = window.__app.play, g = p.golfer;
    const THREE = null;
    const head = g.clubHead.getWorldPosition(g.root.position.clone());
    return { heading: p.heading, ball: [p.ball.x, p.ball.y], rootThree: g.root.position.toArray(), rotY: g.root.rotation.y, addr: g.addrOffset.toArray(), headWorld: head.toArray(), ballThree: window.__app.world.ball.position.toArray() };
  });
  logs.push(JSON.stringify(r, null, 1));
}
