import { TYPE, MessageType, FetchHandlerParams, ProxyItem } from "./variables";

export {
  ProxyURL,
  ProxyItem,
  FetchHandlerParams,
  ResponseConstructor,
} from "./variables";

class constructorOptions {
  key?: string;
}

interface Proxy {
  list: ProxyItem[];
}

export default class SWProxy {
  private key = "/sw-proxy.js"; // the service worker file path
  private sw: ServiceWorker | null = null; // the sw-proxy service worker instance
  private proxy: Proxy = new Proxy<Proxy>(
    { list: [] },
    {
      set: (target, key, value: ProxyItem[]) => {
        if (key === "list") {
          target.list = value;
          this.postMessage({
            type: TYPE.UPDATE_PROXY_URLS,
            data: value.map(({ url, method }) => ({ url, method })),
          });
        }
        return true;
      },
    }
  ); // the proxy list

  constructor(options?: constructorOptions) {
    if (options) {
      Object.keys(constructorOptions).forEach((key) => {
        if (key) this[key] = options[key];
      });
    }
  }

  /**
   * @description check the service worker is ready, if not, throw an error
   * @author Yrobot
   * @date 05/03/2023
   * @memberof SWProxy
   */
  private readyCheck = (): void => {
    if (!this.sw)
      throw new Error(
        "sw-proxy is not ready, please wait resister() finished first"
      );
  };

  private onMessage = (event: MessageEvent<MessageType<any>>): void => {
    const type = event.data?.type;
    const data = event.data?.data;
    const port = event.ports?.[0];
    switch (type) {
      case TYPE.FETCH_HANDLER:
        this.fetchHandler(data, port);
        break;
    }
  };

  private listenMessage = (): void => {
    navigator.serviceWorker.addEventListener("message", this.onMessage);
  };

  private unListenMessage = (): void => {
    navigator.serviceWorker.removeEventListener("message", this.onMessage);
  };

  postMessage = (data: MessageType<any>): void => {
    this.readyCheck();
    this.sw.postMessage(data);
  };

  private fetchHandler = async (
    params: FetchHandlerParams,
    port: MessagePort
  ) => {
    for (let index = 0; index < this.proxy.list.length; index++) {
      const { url, response } = this.proxy.list[index];
      if (url === params.pathname) {
        const res =
          typeof response === "function" ? await response(params) : response;
        port.postMessage(res);
        return;
      }
    }
  };

  /**
   * @description register the service worker, and wait until it is active
   * @author Yrobot
   * @date 05/03/2023
   * @param {RegistrationOptions} [registerOptions]
   * @memberof SWProxy
   */
  resister = async (
    registerOptions?: RegistrationOptions
  ): Promise<ServiceWorker> =>
    new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator) {
        this.listenMessage();

        navigator.serviceWorker
          .register(this.key, registerOptions)
          .then(
            (registration) =>
              new Promise<ServiceWorker>((resolve) => {
                if (registration.active) resolve(registration.active);
                const sw =
                  registration.installing ||
                  registration.waiting ||
                  registration.active;
                sw.onstatechange = () => {
                  if (sw.state === "activated") resolve(sw);
                };
              })
          )
          .then((sw: ServiceWorker) => {
            this.sw = sw;
            resolve(sw);
          });
      } else {
        reject("serviceWorker not support in this browser");
      }
    });

  set = async (proxyList: ProxyItem[]): Promise<void> => {
    this.readyCheck();
    this.proxy.list = proxyList;
  };

  add = async (proxyList: ProxyItem[]): Promise<void> => {
    this.readyCheck();
    this.proxy.list = [...this.proxy.list, ...proxyList];
  };

  remove = async (urls: string[]): Promise<void> => {
    this.readyCheck();

    this.proxy.list = this.proxy.list.filter(
      (item) => !urls.includes(item.url)
    );
  };

  clear = async (): Promise<void> => {
    this.readyCheck();
    this.proxy.list = [];
  };

  unregister = async (): Promise<void> => {
    this.readyCheck();

    this.unListenMessage();
  };
}
