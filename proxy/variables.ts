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
}

export interface ResponseConstructor {
  body: string;
  options?: ResponseInit;
}

export const urlPurify = (url: string): string => {
  const { origin, pathname } = new URL(url, location.origin);
  return `${origin}${pathname}`;
};

export interface ProxyItem {
  url: string;
  method?: string;
  response:
    | ResponseConstructor
    | ((params: FetchHandlerParams) => Promise<ResponseConstructor>);
}
