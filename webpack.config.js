const {addHTMLModules} = require("./webpack.core");
const { initEntry } = require("./webpack.core");

const DIST = "public";

module.exports = function (_env, argv) {
  return [
    addHTMLModules(
        initEntry(DIST, "web","./src/index.tsx", "index.js"),
        "static/index.html",
        "index.css"
    ),
    initEntry(DIST, "node","./src/app.ts", "app.js"),
  ];
};
