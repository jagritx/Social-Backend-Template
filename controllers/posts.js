import { createError } from "../error.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

export const addPost = async (req, res, next) => {
  const newPost = new Post({ user: req.user.id, ...req.body });
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    next(err);
  }
};
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return next(createError(404, "Post not found."));
    if (req.user.id === post.user) {
      await Post.findByIdAndDelete(req.params.id);
      res.status(200).json("Deleted Successfully");
    } else {
      return next(createError(403, "You can delete only your Post"));
    }
  } catch (err) {
    next(err);
  }
};

export const like = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: req.user.id },
    });
    res.status(200).json("Liked!");
  } catch (err) {
    next(err);
  }
};

export const unlike = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { likes: req.user.id },
    });

    res.status(200).json("Unliked!");
  } catch (err) {
    next(err);
  }
};

export const comment = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(createError(404, "Post not found."));
  let uuid = Math.floor(Math.random() * 1000);
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $push: {
        comments: {
          text: req.params.text,
          user: req.user.id,
          commentid: uuid,
        },
      },
    });
    res.status(200).json({ id: uuid });
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};
