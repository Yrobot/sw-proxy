/// <reference lib="webworker" />
import {
  MessageType,
  TYPE,
  FetchHandlerParams,
  ResponseConstructor,
  urlPurify,
  ProxyItem,
} from "./variables";
const worker: ServiceWorkerGlobalScope = self as any;

let urls: Pick<ProxyItem, "url" | "method">[] = [];

worker.addEventListener("message", (event: MessageEvent<MessageType<any>>) => {
  const type = event.data?.type;
  const data = event.data?.data;
  // const client = event.source;
  switch (type) {
    case TYPE.UPDATE_PROXY_URLS:
      urls = data?.map(({ url, method = "GET" }) => ({
        url: urlPurify(url),
        method,
      }));
      break;
  }
});

worker.addEventListener("install", (event) => {
  worker.skipWaiting();
});

worker.addEventListener("activate", (event) => {
  event.waitUntil(worker.clients.claim());
});

worker.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  const context = { request, url };

  console.log(
    `[sw-proxy] fetch`,
    urls,
    urls.findIndex(
      ({ url, method }) =>
        url === urlPurify(request.url) && method === request.method
    ) > -1
  );

  if (
    urls.findIndex(
      ({ url, method }) =>
        url === urlPurify(request.url) && method === request.method
    ) > -1
  ) {
    const clientId = event.clientId;
    event.respondWith(
      new Promise<Response>(async (resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          console.log(event.data);
          const { body, options } = event.data as ResponseConstructor;
          resolve(new Response(body, { status: 200, ...options }));
        };
        const client = await worker.clients.get(clientId);
        const message: MessageType<FetchHandlerParams> = {
          type: TYPE.FETCH_HANDLER,
          data: {
            pathname: url.pathname,
          },
        };
        client.postMessage(message, [channel.port2]);
      })
    );
  }
});
