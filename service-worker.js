self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("habitflow").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js"
      ]);
    })
  );
});
