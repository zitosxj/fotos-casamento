const CACHE = "event-photos-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./images/wedding-family.png",
  "./images/wedding-family-header.png"
];


// Instalar nova versão

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))

  );

  self.skipWaiting();

});


// Ativar nova versão e apagar caches antigas

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(keys =>

        Promise.all(

          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))

        )

      )

  );

  self.clients.claim();

});


// Pedidos

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;


  event.respondWith(

    caches.match(event.request)
      .then(cached => {

        return cached || fetch(event.request);

      })

  );

});
