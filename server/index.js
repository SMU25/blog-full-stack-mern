import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import chalk from "chalk";
import { dotenvConfig } from "./dotenv.js";
import { storage } from "./storage.js";
import {
  loginValidation,
  registerValidation,
  postCreateValidation,
  commentCreateValidation,
} from "./validations/index.js";
import {
  UserController,
  PostController,
  CommentController,
  FilesController,
} from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

const PORT_LOCALHOST = process.env.PORT_LOCALHOST || 7777;

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log(chalk.green("Database Connected")))
  .catch((error) => console.log(chalk.red("Database Error\n", error)));

const app = express();

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Server started!");
});

// Authorization and User
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.get("/auth/me", checkAuth, UserController.getMe);

// Posts
app.get("/posts", PostController.getAll);

app.get("/posts/tags", PostController.getTags);

app.get("/posts/:id", PostController.getById);

app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);

app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.delete("/posts/:id", checkAuth, PostController.remove);

// Comments
app.get("/comments", CommentController.getAll);

app.get("/posts/:id/comments", CommentController.getByPostId);

app.post(
  "/posts/:id/comments",
  checkAuth,
  commentCreateValidation,
  handleValidationErrors,
  CommentController.create
);

// Upload files
app.post(
  "/upload",
  checkAuth,
  upload.single("image"),
  FilesController.uploadImage
);

// для старту сервера
app.listen(PORT_LOCALHOST, (error) => {
  if (error) {
    console.log("Server Error", chalk.red(error));
  } else {
    console.log(chalk.green("\nServer started on localhost port:"));
    console.log(chalk.cyanBright(`http://localhost:${PORT_LOCALHOST}/`));
  }
});
