import PostModel from "../models/Post.js";
import { getInitialSortOrder } from "../utils/index.js";

// видалення поста ,якщо він є його автором
// різні папки створювати для різних типів файлів

export const getAll = async (req, res) => {
  try {
    const { limit, order } = req.query;
    const sortOrder = getInitialSortOrder(order);

    const posts = await PostModel.find()
      .populate("user", "-passwordHash")
      .sort(sortOrder)
      .limit(limit)
      .exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати пости",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findByIdAndUpdate(
      postId,
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    )
      .populate("user", "-passwordHash")
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Пост не знайдено",
          });
        }

        res.json(doc);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          message: "Не вдалося отримати пост",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати пост",
    });
  }
};

export const create = async (req, res) => {
  try {
    const { body, userId } = req;
    const doc = new PostModel({
      user: userId,
      ...body,
    });

    const post = await doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося створити пост",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findByIdAndUpdate(postId, req.body, {
      returnDocument: "after",
    }).then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Не вдалося оновити пост. Пост не знайдено",
        });
      }

      res.json(doc);
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося оновити пост",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findByIdAndDelete(postId)
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({
            message: "Не вдалося видалити пост. Пост не знайдено",
          });
        }

        res.json({
          message: "Пост видалено",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          message: "Не вдалося видалити пост",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося видалити пост",
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const { limit, order } = req.query;
    const sortOrder = getInitialSortOrder(order);

    const posts = await PostModel.find().sort(sortOrder).exec();

    const tags = posts
      .map(({ tags }) => tags)
      .flat()
      .slice(0, limit);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати теги",
    });
  }
};
