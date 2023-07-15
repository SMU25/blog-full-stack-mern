import jwt from "jsonwebtoken";

export const createToken = (
  _id,
  secretKey = process.env.SECRET_KEY,
  expiresIn = process.env.TOKEN_EXPIRATION_DATE
) =>
  jwt.sign(
    {
      _id,
    },
    secretKey,
    {
      expiresIn,
    }
  );
