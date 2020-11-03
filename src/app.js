const express = require("express");
const nunjucks = require("nunjucks");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const app = express();

nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
});

app.set("view engine", "njk");

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/", routes);

module.exports = app;
