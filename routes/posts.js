import express from "express";
import {
  addPost,
  deletePost,
  like,
  unlike,
  comment,
  getPost,
  getAllPosts,
} from "../controllers/posts.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.post("/posts/", verifyToken, addPost);
router.delete("/posts/:id", verifyToken, deletePost);
router.post("/like/:id", verifyToken, like);
router.post("/unlike/:id", verifyToken, unlike);
router.post("/comment/:id", verifyToken, comment);
router.get("/all_posts", verifyToken, getAllPosts);
router.get("/posts/:id", verifyToken, getPost);
export default router;
