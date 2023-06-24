import { body } from "express-validator";

const COMMON_FIELDS = [
  body("email", "Невірно введений email").isEmail(),
  body("password", "Невірно введений пароль").isLength({ min: 6 }),
];

export const loginValidation = COMMON_FIELDS;

export const registerValidation = [
  ...COMMON_FIELDS,
  body("fullName", "Невірно введене повне ім'я користувача").isLength({
    min: 3,
  }),
  body("avatarUrl", "Невірне посилання на аватар користувача")
    .optional()
    .isURL(),
];
