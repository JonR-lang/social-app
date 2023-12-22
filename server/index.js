const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { register } = require("./controllers/authController");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes.js");
const { verifyToken } = require("./middleware/auth.js");
const { createPost } = require("./controllers/postController");

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

//FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

//ROUTES WITH FILES: The below was not put into the authRoute folder because of the middleware for file upload that was passed into it.
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", upload.single("picture"), verifyToken, createPost);

//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

//MONGOOSE SETUP

const PORT = process.env.PORT || 6000;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The server is now running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
