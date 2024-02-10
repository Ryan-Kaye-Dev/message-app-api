var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("Connected to the database successfully!");
  });
}

main().catch((err) => console.error(err));

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

var indexRouter = require("./routes/index.js");
const apiRouter = require("./routes/api.js");

app.use("/api", apiRouter);
app.use("/", indexRouter);

module.exports = app;
