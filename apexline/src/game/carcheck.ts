import * as THREE from 'three';
import { CarModel } from './car';
import { VEHICLES } from '../data/vehicles';
import { COSMETICS } from '../data/cosmetics';
import { defaultSetup } from './progress';
import { applyCosmetic } from './setup';

/** QA helper (used by tools/e2e.cjs): builds every vehicle and applies every cosmetic, reporting geometry sanity. */
export function checkCars() {
  const rows: any[] = []; const errors: string[] = [];
  for (const v of VEHICLES) {
    try {
      const car = new CarModel(defaultSetup(v.id)); car.group.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(car.group); const size = box.getSize(new THREE.Vector3());
      const wbox = new THREE.Box3(); for (const w of car.wheels) wbox.expandByObject(w.pivot);
      const fz = car.wheels.filter(w => w.front).map(w => w.pivot.position.z), rz = car.wheels.filter(w => !w.front).map(w => w.pivot.position.z);
      let meshes = 0; car.group.traverse(o => { if ((o as THREE.Mesh).isMesh) meshes++; });
      rows.push({ id: v.id, len: +size.z.toFixed(2), wid: +size.x.toFixed(2), hgt: +size.y.toFixed(2), wheelBottom: +wbox.min.y.toFixed(3), facesNegZ: Math.max(...fz) < Math.min(...rz), meshes, wheels: car.wheels.length });
      car.dispose();
    } catch (e: any) { errors.push(`${v.id}: ${e?.message ?? e}`); }
  }
  let applied = 0;
  for (const c of COSMETICS) { try { const car = new CarModel(applyCosmetic(defaultSetup('apex'), c)); car.dispose(); applied++; } catch (e: any) { errors.push(`cosmetic ${c.id}: ${e?.message ?? e}`); } }
  return { rows, errors, applied, total: COSMETICS.length };
}
