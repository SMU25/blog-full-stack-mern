import PostModel from "../models/Post.js";

// додати отримання постів за ід юзера та поточного юзера + додавання та отримання коментарів
// додати отримання коментарів поточного користувача , видалення поста ,якщо він є його автором
// різні папки створювати для різних типів файлів
// не вертати пароль нікуди

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

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
      ...body,
      user: userId,
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
    const posts = await PostModel.find().exec();

    const tags = posts
      .map(({ tags }) => tags)
      .flat()

      // потім змінити
      .slice(0, req.query.limit || 5);

    res.json(tags);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати теги",
    });
  }
};

// export const createCommentPost = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: "Не вдалося створити пост",
//     });
//   }
// };