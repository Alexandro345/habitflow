self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  // básico, sin cache por ahora
});

