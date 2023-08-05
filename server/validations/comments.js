import { body } from "express-validator";

export const commentCreateValidation = [
  body("text", "Введіть текст посту").isLength({ min: 3 }).isString(),
];
