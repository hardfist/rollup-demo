// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
const commonjs = require("@rollup/plugin-commonjs");
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    config.external = () => false;

    config.plugins.push(commonjs());
    return config;
  },
};
