const fs = require("fs");

const contents = fs.readFileSync("temp/sw-demo.js", { encoding: "base64" });

console.log(contents);
