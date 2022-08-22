import express from "express";

import {
  getAllPosts,
  createPost,
  getOnePost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

const postRoutes = express.Router();

postRoutes.route("/").get(getAllPosts).post(createPost);
postRoutes.route("/:id").get(getOnePost).patch(updatePost).delete(deletePost);

export default postRoutes;
