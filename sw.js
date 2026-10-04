// Service worker di Ripostiglio.
// Tiene in cache SOLO i file dell'app (pagina, icone, libreria), così si apre come un'app.
// I dati dell'archivio e le foto arrivano da Supabase (un altro dominio) e non vengono mai salvati qui.
const CACHE = "ripostiglio-app-v3";
const SHELL = [
  "./", "./index.html", "./config.js", "./supabase.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  // "reload": scarica sempre i file freschi dal sito, senza usare la memoria del browser.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" }))))
      .then(() => self.skipWaiting())
  );
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
  // Prima la rete, chiedendo sempre al sito se c'è una versione nuova ("no-cache"):
  // così un aggiornamento caricato su GitHub si vede alla prima apertura.
  // La copia in cache serve solo quando sei offline.
  e.respondWith(
    fetch(req, { cache: "no-cache" }).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
