// Course database. Every course is an original design (no real course is reproduced), described
// hole by hole in a compact layout language that the hole generator (core/holeGen.js) turns into terrain.
//
// Hole fields:
//   p    par            y   championship yardage
//   dl   dogleg degrees (+ right, - left) applied at `at` yards
//   dl2/at2  optional second bend (par 5s)
//   ang  initial heading offset in degrees (mostly for par 3s)
//   el   green elevation relative to tee, in feet
//   fw   fairway width in yards        gw  green size multiplier
//   gs   green slope strength (1 = normal)  dome  turtle-back green
//   hz   hazards (see holeGen.js for vocabulary)
//   sig  signature hole         tip  caddie note
//
// Hazard vocabulary:
//   ['fb', s, off, rx?, ry?]      fairway bunker at s yds, off yds right(+)/left(-)
//   ['gb', ang, size?]            greenside bunker, ang: 0 front, 90 right, -90 left, 180 back
//   ['pot', s, off]               pot bunker          ['waste', s, off, rx, ry]  waste area
//   ['xb', s, depth]              cross bunker across the fairway
//   ['pond', s, off, rx, ry]      water               ['gpond', ang, size]  water hugging green
//   ['lat', side, s1, s2, off]    water along a side  ['cross', s1, s2]      water across the hole
//   ['ocean', side, off, s1?, s2?] ocean & cliffs     ['canyon', side, off, s1?, s2?] brush penalty area
//   ['xcanyon', s1, s2]           barranca across     ['island']             island green
//   ['tree', s, off, r?]          specific tree       ['stands', ang]        grandstand
//   ['pews', s1, s2, side]        striped bunker      ['road']               road behind the green
//   ['valley']                    hollow before green ['gcb']                bunker inside the green
//   ['bridge', s]                 stone footbridge    ['flowers', s, off]    flower beds

export const COURSES = [
  {
    id: 'cedarvale', cardHole: 15, code: 'CRS-01',
    name: 'Cedar Vale Municipal',
    short: 'CEDAR VALE',
    location: 'Public city course · Parkland',
    designer: 'Original GOLF AI design',
    blurb: 'Broad fairways lined with old oaks, a lazy creek and friendly greens. The perfect place to start.',
    theme: 'cedarvale',
    wind: [2, 9], stimp: 10.5, firmness: 0.5, unlock: 1, difficulty: 'Easy',
    accent: '#3f9a4f',
    holes: [
      { p: 4, y: 395, name: 'First Oak', dl: 6, at: 250, el: 6, fw: 44, hz: [['fb', 262, -20], ['gb', -45]], tip: 'A gentle opener. Wide fairway, one bunker short-left of the green.' },
      { p: 5, y: 540, name: 'Mill Pond', dl: -10, at: 280, el: -8, fw: 46, hz: [['pond', 300, 36, 16, 26], ['gb', 60], ['gb', -60]], tip: 'Keep the drive left of the mill pond and the green is reachable in two.' },
      { p: 3, y: 165, name: 'Acorn', el: -6, hz: [['gb', -40], ['gb', 40]], tip: 'Short iron to a wide green framed by two bunkers.' },
      { p: 4, y: 420, name: 'Elm Row', fw: 42, el: 10, hz: [['fb', 255, 18], ['gb', 0, 0.8]], tip: 'Straight away between the elms. A small bunker fronts the green.' },
      { p: 4, y: 380, name: 'Creekside', dl: 8, at: 240, fw: 40, hz: [['lat', 1, 120, 360, 22], ['gb', -50]], tip: 'The creek runs all down the right. Favor the left half.' },
      { p: 3, y: 185, name: 'Willow Dip', el: -15, hz: [['gpond', -60, 1.1], ['gb', 90]], tip: 'Downhill to a green with a pond off the left edge.' },
      { p: 5, y: 560, name: 'Long Meadow', dl: 12, at: 300, dl2: -10, at2: 450, fw: 48, hz: [['fb', 290, -20], ['fb', 455, 16], ['gb', -40]], tip: 'Three-shotter through the meadow. Bunkers guard each landing area.' },
      { p: 4, y: 410, name: 'Old Bridge', fw: 42, el: -4, hz: [['cross', 352, 362], ['bridge', 357], ['gb', 40]], tip: 'The creek crosses short of the green. Take enough club on the approach.' },
      { p: 4, y: 430, name: 'Clubhouse Turn', dl: -6, at: 260, el: 10, fw: 40, hz: [['gb', -30], ['gb', 30], ['stands', 120]], tip: 'Uphill to the clubhouse. Two bunkers pinch the green.' },
      { p: 4, y: 400, name: 'Ridge View', el: 18, fw: 42, hz: [['fb', 245, -18], ['gb', 0]], tip: 'Climbs to a ridge-top green. Play one more club.' },
      { p: 5, y: 520, name: 'Twin Ponds', dl: -8, at: 270, fw: 44, hz: [['pond', 230, -34, 14, 22], ['gpond', 70, 1.0]], tip: 'A pond waits left off the tee and another right of the green.' },
      { p: 3, y: 150, name: 'Short Stack', gs: 1.2, hz: [['gb', -30, 0.9], ['gb', 30, 0.9], ['gb', 180, 0.7]], tip: 'The shortest hole, ringed by sand. Trust the yardage.' },
      { p: 4, y: 445, name: 'Long Oak', dl: 10, at: 270, fw: 40, hz: [['fb', 270, 20], ['gb', 60]], tip: 'The longest par 4. A big oak guards the corner of the dogleg.' },
      { p: 4, y: 360, name: 'Little Creek', dl: -12, at: 230, fw: 38, hz: [['lat', -1, 150, 340, 20], ['gb', 40]], tip: 'Short dogleg left along the creek. Driver is not required.' },
      { p: 5, y: 555, name: 'Prairie Run', fw: 50, hz: [['fb', 300, -22], ['fb', 450, 18], ['gb', -40]], tip: 'Wide open. Let the driver go.' },
      { p: 3, y: 195, name: 'Lake Carry', sig: true, el: -8, und: 0.4, hz: [['pond', 100, 0, 22, 45], ['gb', 60], ['gb', -140, 0.7]], tip: "Cedar Vale's signature: a full carry over the lake to a generous green." },
      { p: 4, y: 415, name: 'Shady Lane', dl: 8, at: 260, fw: 40, hz: [['fb', 260, -18], ['gb', -40], ['gb', 40]], tip: 'A tree-lined walk. Find the fairway and it plays easy.' },
      { p: 4, y: 440, name: 'Home Hole', sig: true, dl: -10, at: 270, el: 12, fw: 40, hz: [['gpond', -70, 1.2], ['fb', 280, 20], ['stands', -90], ['stands', 90]], tip: 'Finish in front of the clubhouse with a pond left of the green.' },
    ],
  },
  {
    id: 'harborpoint', cardHole: 3, code: 'CRS-02',
    name: 'Harbor Point Links',
    short: 'HARBOR POINT',
    location: 'Coastal links · Seaside dunes',
    designer: 'Original GOLF AI design',
    blurb: 'Windswept dunes, fescue and sea views. Keep it low, keep it out of the pot bunkers.',
    theme: 'harborpoint',
    wind: [8, 20], stimp: 10.5, firmness: 0.85, unlock: 1, difficulty: 'Medium',
    accent: '#2f78a0',
    holes: [
      { p: 4, y: 400, name: 'Harbor Gate', fw: 55, hz: [['pot', 250, -10], ['pot', 270, 12], ['gb', -30, 0.6]], tip: 'A wide welcome. Pot bunkers sit just where a good drive finishes.' },
      { p: 4, y: 435, name: 'Seawall', dl: 6, at: 260, fw: 50, hz: [['ocean', 1, 52], ['pot', 280, -8], ['gb', 40, 0.7]], tip: 'The sea runs down the right. Aim at the left edge in a crosswind.' },
      { p: 5, y: 545, name: 'Long Dunes', dl: -8, at: 290, fw: 55, hz: [['waste', 300, -42, 18, 60], ['pot', 330, 6], ['pot', 470, -10], ['gb', -40, 0.6]], tip: 'Sandy waste down the left. Two good shots set up a short pitch.' },
      { p: 3, y: 175, name: 'Lighthouse', sig: true, ang: 6, hz: [['ocean', 1, 30], ['gb', -60, 0.8], ['gb', 150, 0.6]], tip: 'Clifftop par 3 with the sea short and right. The wind decides the club.' },
      { p: 4, y: 380, name: 'Fescue Rise', el: 15, fw: 45, hz: [['pot', 240, 0], ['gb', 0, 0.6], ['gb', 90, 0.6]], tip: 'Uphill through the fescue. A pot bunker splits the fairway.' },
      { p: 4, y: 455, name: "Gull's Point", dl: 10, at: 270, fw: 50, hz: [['ocean', 1, 44, 150, 600], ['pot', 290, -12]], tip: 'Bend it around the point. The bold line over the beach shortens it.' },
      { p: 3, y: 145, name: 'Tidepool', gs: 1.2, hz: [['gb', -30, 0.7], ['gb', 30, 0.7], ['gcb']], tip: 'A tiny bunker sits inside the green. Pick your side.' },
      { p: 5, y: 575, name: 'Long Wind', fw: 60, hz: [['pot', 280, 10], ['pot', 300, -8], ['pot', 430, 0], ['gb', 40, 0.6]], tip: 'Usually into the wind. Three solid shots.' },
      { p: 4, y: 410, name: 'Boathouse', dl: -6, at: 250, fw: 50, hz: [['ocean', -1, 46, 200, 600], ['gb', 30, 0.7]], tip: 'The harbor is left of the green. Bail out right.' },
      { p: 4, y: 420, name: 'Marram', fw: 50, hz: [['waste', 250, 36, 15, 45], ['pot', 270, -10], ['gb', -40, 0.6]], tip: 'Marram grass and sand right. The green runs away from you.' },
      { p: 4, y: 470, name: 'Breakwater', dl: 12, at: 280, fw: 48, hz: [['ocean', 1, 42], ['pot', 300, -14], ['gb', -30, 0.7]], tip: 'A long par 4 hugging the breakwater. Bogey is no disgrace.' },
      { p: 3, y: 200, name: 'Crosswind', hz: [['pot', 160, -8], ['gb', -40, 0.8], ['gb', 40, 0.8]], tip: 'Exposed to the wind from every side. Land it short and run it on.' },
      { p: 5, y: 530, name: 'Shipwreck', sig: true, dl: -14, at: 280, fw: 50, hz: [['ocean', -1, 42], ['pot', 300, 10], ['pot', 480, 6], ['gb', 60, 0.6]], tip: 'Cut off as much of the bay as you dare. Reachable for the brave.' },
      { p: 4, y: 360, name: 'Sandpiper', fw: 45, gs: 1.2, hz: [['pot', 220, 0], ['pot', 240, -14], ['gb', 0, 0.6]], tip: 'Short, but pot bunkers crowd the landing area.' },
      { p: 4, y: 445, name: 'Old Pier', fw: 50, hz: [['ocean', 1, 50, 250, 600], ['pot', 270, -10], ['gb', -60, 0.7]], tip: 'The pier frames the green. Anything right is wet.' },
      { p: 3, y: 165, name: 'Clifftop', sig: true, hz: [['ocean', -1, 28], ['gb', 90, 0.8], ['gb', 160, 0.6]], tip: 'Over the cliff edge to a green perched above the sea.' },
      { p: 5, y: 560, name: 'Dune Valley', dl: 8, at: 300, fw: 55, hz: [['waste', 320, -46, 20, 70], ['pot', 340, 8], ['gb', -40, 0.6]], tip: 'Through a valley between the big dunes.' },
      { p: 4, y: 450, name: 'Harbor Home', sig: true, dl: -8, at: 270, fw: 52, hz: [['ocean', -1, 52], ['pot', 290, 12], ['gb', 40, 0.7], ['stands', 120], ['stands', -120]], tip: 'Home along the harbor wall with the gallery watching.' },
    ],
  },
  {
    id: 'blackstone', cardHole: 5, code: 'CRS-08',
    name: 'Blackstone Ridge',
    short: 'BLACKSTONE RIDGE',
    location: 'Championship course · Old granite quarry',
    designer: 'Original GOLF AI design',
    blurb: 'Carved from an old quarry: demanding bunkers, rock ravines and lightning-fast greens. Home of the Granite Crown.',
    theme: 'blackstone',
    wind: [3, 14], stimp: 13.5, firmness: 0.7, unlock: 1, difficulty: 'Expert',
    accent: '#7a808c',
    holes: [
      { p: 4, y: 450, name: 'Granite Gate', dl: 8, at: 280, el: 10, fw: 32, hz: [['fb', 270, -14], ['fb', 290, 15], ['gb', -40], ['gb', 40]], tip: 'No warm-up here. Bunkers both sides of the landing area.' },
      { p: 5, y: 600, name: 'Quarry Road', dl: -10, at: 300, dl2: 8, at2: 470, fw: 34, hz: [['canyon', -1, 34, 100, 560], ['fb', 320, 14], ['gb', 0, 0.9], ['gb', 60]], tip: 'The quarry edge runs down the left the whole way. Three careful shots.' },
      { p: 3, y: 220, name: 'Flint', el: -10, hz: [['gb', -30, 1.1], ['gb', 30, 1.1], ['gb', 170]], tip: 'A long iron to a green squeezed between deep bunkers.' },
      { p: 4, y: 480, name: 'Iron Hill', dl: 6, at: 290, el: 30, fw: 30, gs: 1.5, hz: [['fb', 300, -12, 7, 10], ['fb', 315, 16, 6, 10], ['gb', -30], ['gb', 30]], tip: 'Steeply uphill to a sloping green. Stay below the hole.' },
      { p: 4, y: 420, name: 'Shale Creek', dl: -12, at: 270, fw: 30, hz: [['lat', -1, 150, 430, 18], ['fb', 280, 14], ['gb', 40]], tip: 'A creek down the left and a bunker right. Precision off the tee.' },
      { p: 3, y: 175, name: 'The Pit', sig: true, el: -6, hz: [['xcanyon', 40, 150], ['gb', -50], ['gb', 50], ['gb', 180]], tip: 'Carry the old quarry pit. Anything short is gone.' },
      { p: 4, y: 465, name: 'Blackthorn', dl: 10, at: 280, fw: 30, hz: [['fb', 285, -14], ['fb', 300, 16], ['gb', -40], ['gb', 60]], tip: 'Narrow and long. The green slopes hard from back to front.' },
      { p: 5, y: 580, name: 'Cutstone', dl: -6, at: 300, fw: 34, hz: [['fb', 290, 15], ['fb', 450, -12], ['gpond', -60, 1.2], ['gb', 60]], tip: 'Water left of the green punishes a hooked second shot.' },
      { p: 4, y: 470, name: 'Ridge Turn', dl: -8, at: 280, el: 20, fw: 32, gs: 1.5, hz: [['fb', 280, -16], ['gb', -40], ['gb', 40], ['gb', 170]], tip: 'Turns along the ridge to a three-bunker green.' },
      { p: 4, y: 490, name: 'Overlook', dl: 10, at: 300, el: -50, fw: 36, hz: [['fb', 330, 15], ['gb', -40], ['gb', 60]], tip: 'A huge drop from the tee. The ball flies and runs forever.' },
      { p: 4, y: 435, name: 'Basalt', dl: -8, at: 260, fw: 30, hz: [['pond', 300, 24, 14, 30], ['fb', 270, -14], ['gb', -40]], tip: 'A dark pond right of the fairway. Bunker left. Thread it.' },
      { p: 3, y: 195, name: 'Hollow', gs: 1.5, hz: [['gpond', -90, 1.0], ['gb', 30, 1.1], ['gb', 160]], tip: 'Water left, sand right, and a green full of slopes.' },
      { p: 5, y: 560, name: 'Spillway', sig: true, dl: 14, at: 290, fw: 34, hz: [['lat', 1, 200, 455, 20], ['cross', 470, 485], ['fb', 300, -15], ['gb', -40], ['gb', 150]], tip: 'The spillway runs right and then across. Go for it only from the fairway.' },
      { p: 4, y: 380, name: 'Short Fuse', el: 15, fw: 28, gs: 1.6, hz: [['fb', 225, 0, 6, 8], ['fb', 250, -12], ['fb', 255, 12], ['gb', -40], ['gb', 40], ['gb', 0, 0.7]], tip: 'Short but nasty. Bunkers everywhere and a wild green.' },
      { p: 4, y: 500, name: 'Long Haul', dl: -6, at: 300, fw: 32, hz: [['fb', 300, -14], ['fb', 320, 16], ['gb', -40], ['gb', 40]], tip: 'The longest par 4. Par is a great score.' },
      { p: 3, y: 240, name: 'Ledge', el: -20, hz: [['canyon', 1, 26, 0, 240], ['gb', -40, 1.2], ['gb', 150]], tip: 'Downhill along the quarry ledge. Miss left, never right.' },
      { p: 5, y: 575, name: 'The Gauntlet', dl: -10, at: 290, dl2: 10, at2: 460, fw: 32, hz: [['fb', 280, 15], ['fb', 300, -15], ['fb', 440, 12], ['fb', 460, -12], ['gb', -40], ['gb', 40], ['gb', 170]], tip: 'Bunkers on both sides of every landing area.' },
      { p: 4, y: 490, name: 'Amphitheater', sig: true, dl: 8, at: 290, el: 25, fw: 32, hz: [['pond', 260, -28, 16, 40], ['fb', 300, 16], ['gb', -40], ['gb', 40], ['stands', -100], ['stands', 100], ['stands', 180]], tip: 'The championship finish: uphill into a natural amphitheater of grandstands.' },
    ],
  },
];

export const TEE_SETS = [
  { id: 'champ', name: 'Championship', color: '#111111', factor: 1.0 },
  { id: 'tour', name: 'Tournament', color: '#1e56b8', factor: 0.93 },
  { id: 'member', name: 'Member', color: '#f2f2f2', factor: 0.86 },
  { id: 'forward', name: 'Forward', color: '#c62828', factor: 0.75 },
];

export function coursePar(course, holes = course.holes) {
  return holes.reduce((a, h) => a + h.p, 0);
}

export function courseYards(course, teeFactor = 1) {
  return course.holes.reduce((a, h) => a + Math.round(h.y * teeFactor), 0);
}

export function getCourse(id) {
  return COURSES.find(c => c.id === id) || COURSES[0];
}
