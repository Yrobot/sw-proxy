import { name } from "sw-proxy";
import { waitUntil } from "utilities";

console.log(name);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`/sw-proxy.js`);
  // check if service worker is active
  waitUntil(() => !!navigator.serviceWorker.controller, { max: 9000 }).then(
    () => {
      console.log("sw-proxy is active");
    }
  );
} else {
  alert("serviceWorker not support");
}
