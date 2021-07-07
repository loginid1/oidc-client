const path = require("path");

module.exports = {
  mode: "development",
  entry: "./public_src/public.js",
  output: {
    path: path.resolve(__dirname, "assets", "js"),
    filename: "public.js",
  },
};
