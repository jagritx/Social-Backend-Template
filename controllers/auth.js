import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const isCorrect = bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) {
      return next(createError(404, "Wrong Password"));
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    res
      .cookie("Access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const isCorrect = bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(404, "Wrong Password"));
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    res
      .cookie("Access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        _id: others._id,
        access_token: token,
      });
  } catch (err) {
    next(err);
  }
};
