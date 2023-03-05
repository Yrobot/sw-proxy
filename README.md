<p align="center">
  <a href="https://github.com/Yrobot/sw-proxy" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://images.yrobot.top/2023-02-15/sw-proxy-12-24-42.svg" alt="logo">
  </a>
</p>
<br/>
<h2 align="center">
  <a href="https://github.com/Yrobot/sw-proxy">@yrobot/sw-proxy</a>
</h2>
<p align="center">
  A client proxy for all url requests in the website, based on service worker.
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@yrobot/sw-proxy"><img src="https://img.shields.io/npm/v/@yrobot/sw-proxy.svg" alt="npm package"></a>
</p>
<br/>

## Demo

## Design

Thanks to the Service Worker, we can intercept all requests in the website, and then we can return the response we want.

But, as for the secure reason, we can't register the Service Worker from a inline data url, so you have to serve the Service Worker by yourself, But i can handle the logic inside the Service Worker.

So i will split the repo into two parts, one is the `client` part, which handle the logic inside html, and the other is the `sw` part, which handle the logic inside the Service Worker.

## Usage

### 1. Install `@yrobot/sw-proxy`

```bash
yarn add @yrobot/sw-proxy
```

### 2. Import `@yrobot/sw-proxy/sw`

`service-worker.ts`

```ts
import "@yrobot/sw-proxy/sw";
```

### 3. Import `@yrobot/sw-proxy/client` and use it

```ts
import SWProxy from "@yrobot/sw-proxy/client";

(async () => {
  // init the swProxy
  await swProxy.register();

  // set the proxy list
  await swProxy.set([
    {
      url: "/style.css",
      response: new Response(...)
    },
    {
      url: "/index.js",
      response: new Response(...)
    },
  ] as ProxyItem[]);

  // add proxy item
  await swProxy.add([
    {
      url: "/image.png",
      response: new Response(...)
    }
  ] as ProxyItem[])

  // remove proxy item
  await swProxy.remove([
    '/style.css'
  ] as ProxyURL[])

  // clear all proxy
  await swProxy.clear()

  // unregister the seProxy
  await swProxy.unregister()

})();
```

## Structure

### Common

```ts
type ProxyURL = string; // support RegExp later maybe
```

### ProxyItem

```ts
interface ProxyItem {
  url: ProxyURL;
  method?: string;
  response: Response;
}
```
