import express from "express";
import { getUser, follow, unfollow } from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.get("/user/:id", getUser);
router.post("/follow/:id", verifyToken, follow);
router.post("/user/:id", verifyToken, unfollow);

export default router;
