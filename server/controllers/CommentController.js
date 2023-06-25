import CommentModel from "../models/Comment.js";

export const getAll = async (req, res) => {
  try {
    const comments = await CommentModel.find()
      .limit(req.query.limit)
      .populate("user", "-passwordHash")
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати коментарі",
    });
  }
};

export const getByPostId = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await CommentModel.find({ post: postId })
      .populate("user", "-passwordHash")
      .exec();

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося отримати коментарі",
    });
  }
};

export const create = async (req, res) => {
  try {
    const postId = req.params.id;
    const { body, userId } = req;

    const doc = new CommentModel({
      post: postId,
      user: userId,
      ...body,
    });

    const comment = await doc.save();

    const newComment = await CommentModel.find({ _id: comment._id })
      .populate("user", "-passwordHash")
      .exec();

    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося додати коментар",
    });
  }
};
