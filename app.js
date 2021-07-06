require("dotenv").config();
const express = require("express");
const homeRoute = require("./routes/home");

const app = express();
const port = process.env.PORT || 3000;

app.locals.env = process.env;

app.set("view engine", "pug");
app.set("views", "./views");
app.use(express.static("assets"));

app.use("/", homeRoute);

app.listen(port, () => console.log(`Listening at ${port}`));
