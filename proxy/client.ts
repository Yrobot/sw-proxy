import { waitUntil } from "utilities";

class constructorOptions {
  key?: string;
}

interface ProxyItem {
  url: string;
  response: Response;
}

export default class SWProxy {
  private key = "/sw-proxy.js"; // the service worker file path
  private sw: ServiceWorker | null = null; // the sw-proxy service worker instance
  private proxyList: ProxyItem[] = new Proxy<ProxyItem[]>([], {
    set: (target, key, value: ProxyItem[]) => {
      target = value;
      console.log(`proxyList updated:`, value);
      return true;
    },
  }); // the proxy list

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
        navigator.serviceWorker.register(this.key, registerOptions);

        // check if service worker is active
        waitUntil(() => !!navigator.serviceWorker.controller, {
          max: 9000,
        })
          .then(() => {
            console.log("sw-proxy is active");
            this.sw = navigator.serviceWorker.controller;
            resolve(navigator.serviceWorker.controller);
          })
          .catch((err) => {
            reject(`serviceWorker register ${this.key} fail: ${err.message}`);
          });
      } else {
        reject("serviceWorker not support in this browser");
      }
    });

  set = async (proxyList: ProxyItem[]): Promise<void> => {
    this.readyCheck();
    this.proxyList = proxyList;
  };

  add = async (proxyList: ProxyItem[]): Promise<void> => {
    this.readyCheck();
    this.proxyList = [...this.proxyList, ...proxyList];
  };

  remove = async (urls: string[]): Promise<void> => {
    this.readyCheck();
    this.proxyList = this.proxyList.filter((item) => !urls.includes(item.url));
  };

  clear = async (): Promise<void> => {
    this.readyCheck();
    this.proxyList = [];
  };

  unregister = async (): Promise<void> => {
    this.readyCheck();

    await navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        if (registration.active === this.sw) console.log(registration);
      }
    });
  };
}
