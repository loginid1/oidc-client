const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: "./assets/js/src/public.js",
  plugins: [new Dotenv()],
  output: {
    path: path.resolve(__dirname, "assets", "js"),
    filename: "public.js",
  },
};
