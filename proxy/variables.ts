export enum TYPE {
  setProxyList = "setProxyList",
  UPDATE_PROXY_URLS = "UPDATE_PROXY_URLS",
  FETCH_HANDLER = "FETCH_HANDLER",
}

export interface MessageType<T> {
  type: TYPE;
  data: T;
}

export interface FetchHandlerParams {
  pathname: string;
  url: string;
  search: Record<string, string>;
}

export interface ResponseConstructor {
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

export const urlPurify = (url: string): string => {
  const { origin, pathname } = new URL(url, location.origin);
  return `${origin}${pathname}`;
};

export type ProxyURL = string;

export interface ProxyItem {
  url: ProxyURL;
  method?: string;
  response:
    | ResponseConstructor
    | ((params: FetchHandlerParams) => Promise<ResponseConstructor>);
}
