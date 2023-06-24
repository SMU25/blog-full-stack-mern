import jwt from "jsonwebtoken";

export const SECRET_KEY = "SECRET_KEY";

export const createToken = (_id, secretKey = SECRET_KEY, expiresIn = "30d") =>
  jwt.sign(
    {
      _id,
    },
    secretKey,
    {
      expiresIn,
    }
  );
