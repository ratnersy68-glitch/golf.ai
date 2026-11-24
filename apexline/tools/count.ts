import { COSMETICS, BUNDLES, COSMETIC_MAP } from '../src/data/cosmetics';
import { VEHICLES } from '../src/data/vehicles';
const by: Record<string,number> = {}; for (const c of COSMETICS) by[c.cat]=(by[c.cat]??0)+1;
console.log('cosmetics', COSMETICS.length, by);
console.log('shop', COSMETICS.reduce((a:any,c)=>{a[c.shop]=(a[c.shop]??0)+1;return a},{}));
console.log('vehicles', VEHICLES.length, 'bundles', BUNDLES.map(b=>b.items.length).join(','));
const ids=new Set(); for(const c of COSMETICS){ if(ids.has(c.id)) console.log('DUP',c.id); ids.add(c.id);}
for (const v of VEHICLES) console.log(v.name.padEnd(12), JSON.stringify(v.stats));
