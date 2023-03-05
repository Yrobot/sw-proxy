import SWProxy from "@yrobot/sw-proxy/client";

const swProxy = new SWProxy({
  key: "/sw-proxy.js",
});

(async () => {
  await swProxy.resister();
  await swProxy.set([
    {
      url: "/hi",
      response: async () => ({
        body: "hello world" + (parseInt(`${Date.now() / 1000}`, 10) % 1000),
      }),
    },
  ]);
})();

const buttons = [
  {
    children: "GET",
    onClick: () => {
      fetch("/hi");
    },
  },
  {
    children: "POST",
    onClick: () => {
      fetch("/post", { method: "POST" });
    },
  },
  {
    children: "IMAGE",
    onClick: () => {
      fetch("/images/yrobot");
    },
  },
  {
    children: "HTML",
    onClick: () => {
      fetch("/iframe/index.html");
    },
  },
  {
    children: "JS",
    onClick: () => {
      fetch("/iframe/index.js");
    },
  },
  {
    children: "CSS",
    onClick: () => {
      fetch("/iframe/style.css");
    },
  },
];

const buttonsContainer = document.getElementById("buttons-container");

buttons.forEach(({ children, onClick }) => {
  const button = document.createElement("button");
  button.className = "btn";
  button.innerHTML = children;
  button.onclick = onClick;
  buttonsContainer.appendChild(button);
});
