import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import { createToken } from "../utils/index.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Невірний логін або пароль",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    const isValidPass = await bcrypt.compare(password, passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Невірний логін або пароль",
      });
    }

    const token = createToken(user._id);

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося авторизуватися",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { password, ...body } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      ...body,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = createToken(user._id);

    const { passwordHash, ...userData } = user._doc;

    res.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося зареєструватися",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Користувача не знайдено",
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати користувача",
    });
  }
};
