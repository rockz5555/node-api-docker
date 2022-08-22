import { Post } from '../models/postModel.js';

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().select(['-__v']);

    res.json({
      status: true,
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (e) {
    res.json({
      status: false,
    });
  }
};

export const getOnePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({
        status: false,
        message: 'Unable to find a post with give id',
      });
    }
    res.json({
      status: true,
      data: post,
    });
  } catch (e) {
    res.json({
      status: false,
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(201).json({
      status: true,
      data: post,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      error: e.message,
    });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      status: true,
      data: post,
    });
  } catch (e) {
    res.json({
      status: false,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(400).json({
        status: false,
        message: 'Unable to find a post with give id',
      });
    }
    res.json({
      status: true,
    });
  } catch (e) {
    res.json({
      status: false,
    });
  }
};
