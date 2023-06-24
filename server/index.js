import express, { json } from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import {
  loginValidation,
  registerValidation,
  postCreateValidation,
} from "./validations/index.js";
import {
  UserController,
  PostController,
  FilesController,
} from "./controllers/index.js";
import { storage } from "./storage.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

const LOCALHOST_SERVER_PORT = process.env.LOCALHOST_SERVER_PORT || 7777;

const MONGODB_URI =
  "mongodb+srv://mern-blog:TM7MyDmjGxpJUA9y@mern-blog.rsnlfsk.mongodb.net/blog?retryWrites=true&w=majority";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log("Database Error", error));

const app = express();

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Сервер запущений");
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

// app.get("/posts/:id/comments", PostController.getCommentsByIdPost);

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

// Upload files
app.post(
  "/upload",
  checkAuth,
  upload.single("image"),
  FilesController.uploadImage
);

// для старту сервера
app.listen(LOCALHOST_SERVER_PORT, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(
      `Server started! 
URL Adress: http://localhost:${LOCALHOST_SERVER_PORT}/`
    );
  }
});
