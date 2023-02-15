const swFileBase64 = `c2VsZi5hZGRFdmVudExpc3RlbmVyKCJpbnN0YWxsIiwgKCkgPT4gewogIGNvbnNvbGUubG9nKCJbQHlyb2JvdC9zZS1wcm94eV0gc2VydmljZSB3b3JrZXIgaW5zdGFsbGVkIik7CiAgc2VsZi5za2lwV2FpdGluZygpOwp9KTsKCnNlbGYuYWRkRXZlbnRMaXN0ZW5lcigiYWN0aXZhdGUiLCAoKSA9PiB7CiAgY29uc29sZS5sb2coIltAeXJvYm90L3NlLXByb3h5XSBzZXJ2aWNlIHdvcmtlciBhY3RpdmF0ZWQiKTsKICByZXR1cm4gc2VsZi5jbGllbnRzLmNsYWltKCk7Cn0pOwo=`;

const swDataUrl = `data:application/javascript;base64,${swFileBase64}`;

class SWProxy {
  registration: ServiceWorkerRegistration;
  async register() {
    this.registration = await navigator.serviceWorker.register(swDataUrl);
  }
}
