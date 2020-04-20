// import "core-js";
const util = require("util");
const fs = require("fs-extra");
const { list, targets } = require("core-js-compat")({
  targets: "ios 10",
  filter: /^(es)\./,
});
const result = list.map((x) => `require("core-js/modules/${x}")`).join(";\n");
console.log("targets:", list.length);

fs.writeFileSync("src/index.js", result);
