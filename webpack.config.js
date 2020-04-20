const path = require("path");
module.exports = {
  mode: "development",
  entry: "./src/index.js",
  target: "node",
  node: {
    fs: "empty",
  },
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
