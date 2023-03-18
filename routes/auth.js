import express from "express";
import { signin, signup } from "../controllers/auth.js";

const router = express.Router();

//Sign Up
router.post("/signup", signup);
//Sign In
router.post("/authenticate", signin);

export default router;
