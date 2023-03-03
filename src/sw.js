self.addEventListener("install", () => {
  console.log("[@yrobot/se-proxy] service worker installed");
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  console.log("[@yrobot/se-proxy] service worker activated");
  return self.clients.claim();
});
