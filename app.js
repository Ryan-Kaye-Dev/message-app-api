var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
require("dotenv").config();

var indexRouter = require("./routes/index");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("Connected to the database successfully!");
  });
}

main().catch((err) => console.error(err));

module.exports = app;
