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

let client: Client | null = null;

worker.addEventListener("message", (event: MessageEvent<MessageType<any>>) => {
  const type = event.data?.type;
  const data = event.data?.data;
  switch (type) {
    case TYPE.UPDATE_PROXY_URLS:
      client = event.source as any;
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

  if (
    !!client &&
    urls.findIndex(
      ({ url, method }) =>
        url === urlPurify(request.url) && method === request.method
    ) > -1
  ) {
    let search: Record<string, string> = {};
    for (const [key, value] of url.searchParams.entries()) {
      search[key] = value;
    }

    event.respondWith(
      new Promise<Response>(async (resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (event) => {
          const { body, options } = event.data as ResponseConstructor;
          resolve(new Response(body, { status: 200, ...options }));
        };
        const message: MessageType<FetchHandlerParams> = {
          type: TYPE.FETCH_HANDLER,
          data: {
            pathname: url.pathname,
            url: request.url,
            search,
          },
        };
        client.postMessage(message, [channel.port2]);
      })
    );
  }
});
