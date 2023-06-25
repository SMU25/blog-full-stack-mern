import { body } from "express-validator";

export const postCreateValidation = [
  body("title", "Введіть заголовок посту").isLength({ min: 3 }).isString(),
  body("text", "Введіть текст посту").isLength({ min: 3 }).isString(),
  body("tags", "Невірний формат тегів (вкажіть масив тегів типу String)")
    .optional()
    .isArray(),
  body("imageUrl", "Невірне посилання на зображення").optional().isString(),
];
