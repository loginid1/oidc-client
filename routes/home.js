const express = require("express");
const { privateClientHandler } = require("./private");

const router = express.Router();

router.get("/", (_, res) => {
  return res.render("home");
});

router.get("/public", (_, res) => {
  return res.render("public");
});

router.get("/private", privateClientHandler);

module.exports = router;
