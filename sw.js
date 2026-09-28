const C='excel-viewer-v3';
const ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// File aplikasi: utamakan jaringan (selalu versi terbaru), cache hanya saat offline. Library CDN: cache dulu.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const same=new URL(e.request.url).origin===location.origin;
  const save=res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res};
  e.respondWith(same
    ?fetch(e.request,{cache:'no-cache'}).then(save).catch(()=>caches.match(e.request))
    :caches.match(e.request).then(r=>r||fetch(e.request).then(save)));
});
