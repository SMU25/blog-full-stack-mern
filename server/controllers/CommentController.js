import CommentModel from "../models/Comment.js";
import PostModel from "../models/Post.js";
import { getInitialSortOrder } from "../utils/index.js";

export const getAll = async (req, res) => {
  try {
    const { limit, order } = req.query;
    const sortOrder = getInitialSortOrder(order);

    const comments = await CommentModel.find()
      .populate("user", "-passwordHash")
      .sort(sortOrder)
      .limit(limit)
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

    const comments = await CommentModel.find({ post: postId }).exec();

    await PostModel.findByIdAndUpdate(postId, {
      commentsCount: comments?.length,
    });

    await CommentModel.findById({ _id: comment._id })
      .populate("user", "-passwordHash")
      .then((doc) => {
        if (!doc) {
          return res.json({ message: "Не вдалося повернути доданий коментар" });
        }

        res.json(doc);
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({
          message: "Не вдалося повернути доданий коментар",
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не вдалося додати коментар",
    });
  }
};
