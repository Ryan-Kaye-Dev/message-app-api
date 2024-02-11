var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const multer = require("multer");

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URI).then(() => {
    console.log("Connected to the database successfully!");
  });
}

main().catch((err) => console.error(err));

var app = express();

// Multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory based on user ID
    const userId = req.user.id; // Assuming you have a user object with an ID
    const userUploadsDir = `public/images/${userId}`;
    fs.mkdirSync(userUploadsDir, { recursive: true }); // Create directory if not exists
    cb(null, userUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Keep the original filename
  },
});

const upload = multer({ storage: storage });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Multer middleware for file upload
app.use(upload.single("avatar"));

// Routes
var indexRouter = require("./routes/index.js");
const apiRouter = require("./routes/api.js");

app.use("/api", apiRouter);
app.use("/", indexRouter);

// Error handling for Multer
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: "File upload error", error: err });
  }
  next(err);
});

module.exports = app;
