// Service worker di Ripostiglio.
// Tiene in cache SOLO i file dell'app (pagina, icone, libreria), così si apre come un'app.
// I dati dell'archivio e le foto arrivano da Supabase (un altro dominio) e non vengono mai salvati qui.
const CACHE = "ripostiglio-app-v1";
const SHELL = [
  "./", "./index.html", "./config.js", "./supabase.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  // Solo i file dell'app sul nostro dominio; tutto il resto (dati, foto, font) passa diretto in rete.
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  // Prima la rete (così gli aggiornamenti arrivano subito), la copia in cache solo se sei offline.
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
