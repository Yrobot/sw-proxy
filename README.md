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
      url: "/get",
      response: {
        body: "hello world",
      },
    },
    {
      url: "/post",
      method: "POST",
      response: async () => ({
        body: JSON.stringify({
          time: new Date().toLocaleString(),
          name: "sw-proxy",
        }),
        options: {
          headers: {
            "content-type": "application/json",
          },
        },
      }),
    },
    {
      url: "/image.png",
      response: {
        body: new Blob(), // image blob
      },
    },
  ] as ProxyItem[]);

  // add proxy item
  await swProxy.add([
    {
      url: "/image2.png",
      response: {
        body: new Blob(), // image blob
      },
    },
  ] as ProxyItem[]);

  // remove proxy item
  await swProxy.remove(["/image.png"] as ProxyURL[]);

  // get current active proxy list
  swProxy.list();

  // clear all proxy
  await swProxy.clear();

  // unregister the seProxy
  await swProxy.unregister();
})();
```

## Structure

### Common

```ts
type ProxyURL = string; // support RegExp later maybe
```

### ProxyItem

```ts
interface FetchHandlerParams {
  pathname: string;
  url: string;
  search: Record<string, string>;
}

interface ResponseConstructor {
  body:
    | string
    | null
    | Blob
    | ArrayBuffer
    | DataView
    | FormData
    | ReadableStream
    | URLSearchParams;
  options?: ResponseInit;
}

interface ProxyItem {
  url: ProxyURL;
  method?: string;
  response:
    | ResponseConstructor
    | ((params: FetchHandlerParams) => Promise<ResponseConstructor>);
}
```
