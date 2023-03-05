/// <reference lib="webworker" />

const mark = Math.floor(Date.now() / 1000) % 1000;

console.log(`[@yrobot/se-proxy] [${mark}] service-worker running`);

const worker: ServiceWorkerGlobalScope = self as any;

worker.addEventListener("install", () => {
  console.log(`[@yrobot/se-proxy] [${mark}] service worker installed`);
  worker.skipWaiting();
});

worker.addEventListener("activate", (event) => {
  event.waitUntil(
    worker.clients.claim().then(() => {
      console.log(`[@yrobot/se-proxy] [${mark}] service worker activated`);
    })
  );
});
