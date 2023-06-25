import { body } from "express-validator";

export const commentCreateValidation = [
  body("user", "Введіть ID користувача").isString(),
  body("text", "Введіть текст посту").isLength({ min: 3 }).isString(),
];
