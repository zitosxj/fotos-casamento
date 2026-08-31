const CACHE = "event-photos-v7";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./images/wedding-family.png",
  "./images/wedding-family-header.png"
];


// ================================
// INSTALAÇÃO
// ================================

self.addEventListener("install", event => {

  self.skipWaiting();

  event.waitUntil(

    caches.open(CACHE)
      .then(cache => cache.addAll(ASSETS))

  );

});


// ================================
// ATIVAÇÃO
// ================================

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


// ================================
// PEDIDOS
// ================================

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;


  // Para ficheiros da aplicação:
  // tenta sempre primeiro obter a versão nova
  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copy = response.clone();

        caches.open(CACHE)
          .then(cache => {

            cache.put(event.request, copy);

          });

        return response;

      })

      // Se estiver offline, usa a cache
      .catch(() => caches.match(event.request))

  );

});
