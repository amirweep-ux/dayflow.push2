// Day Flow service worker: offline app shell. Works at the site root or in a sub-folder (GitHub Pages). Bump V on every release.
const V='dayflow-1.0.0',B=self.registration.scope,ROOT=new URL(B).pathname,SHELL=[B,B+'manifest.webmanifest',B+'icon-192.png',B+'icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/api/'))return;          // never cache the API
  if(r.mode==='navigate'){if(u.pathname!==ROOT)return;                                           // app page: network first, cache fallback
    e.respondWith(fetch(r).then(res=>{const cp=res.clone();caches.open(V).then(c=>c.put(B,cp));return res}).catch(()=>caches.match(B)));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})))});
