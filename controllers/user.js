import User from "../models/User.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    let data = {
      name: user.name,
      followers: user.followers.length,
      following: user.following.length,
    };
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

export const follow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { following: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.id },
    });
    res.status(200).json("Followed");
  } catch (err) {
    next(err);
  }
};

export const unfollow = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });
    res.status(200).json("Unfollowed");
  } catch (err) {
    next(err);
  }
};
