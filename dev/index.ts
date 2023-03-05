import SWProxy from "@yrobot/sw-proxy/client";

const swProxy = new SWProxy({
  key: "/sw-proxy.js",
});

(async () => {
  await swProxy.resister({
    scope: "/proxy",
  });

  await swProxy.unregister();
})();
