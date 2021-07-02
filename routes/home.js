const express = require("express");

const router = express.Router();

router.get("/", (_, res) => {
  return res.render("home");
});

router.get("/public", (_, res) => {
  return res.render("public");
});

module.exports = router;
