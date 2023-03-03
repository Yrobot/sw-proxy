const fs = require("fs");

const contents = fs.readFileSync("temp/sw.js", { encoding: "base64" });

console.log(contents);
