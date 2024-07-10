import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Comment from "../models/commentModel.js";

const IGNORED_USER_INFO = "-password -updatedAt -__v";

const getUserProfile = async (req, res) => {
  // query is either username or userId
  const { query } = req.params;
  try {
    let user = null;

    if (mongoose.Types.ObjectId.isValid(query)) {
      // find by userId
      user = await User.findById(query).select(IGNORED_USER_INFO);
    } else {
      // find by username
      user = await User.findOne({ username: query }).select(IGNORED_USER_INFO);
    }

    if (!user) return res.status(400).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in getUserProfile " + error.message);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    if (newUser) {
      // because id is generated randomly by mongodb then it can be accessed by newUser._id (underscore is used)
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in signup user " + error.message);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isCorrectPassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !isCorrectPassword) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in login user " + error.message);
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in logout user " + error.message);
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params; // id of the user to follow/unfollow
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === currentUser._id.toString()) return res.status(400).json({ error: "You can't follow/unfollow yourself" });

    if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      // unfollow
      await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id } }); // pull is used to remove an element from an array
      await User.findByIdAndUpdate(userToModify._id, { $pull: { followers: currentUser._id } });
      res.status(200).json({ message: "User unfollowed" });
    } else {
      // follow
      await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });
      await User.findByIdAndUpdate(userToModify._id, { $push: { followers: currentUser._id } });
      res.status(200).json({ message: "User followed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in followUnFollow user " + error.message);
  }
};

const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "User not found" });

    if (req.params.id !== userId.toString()) return res.status(400).json({ error: "You can't update other users" });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    // Kiểm tra nếu profilePic là một base64 string hoặc một URL hợp lệ
    const isBase64 = (str) => {
      try {
        return btoa(atob(str)) === str;
      } catch (err) {
        return false;
      }
    };

    const isValidUrl = (str) => {
      try {
        new URL(str);
        return true;
      } catch (_) {
        return false;
      }
    };

    if (profilePic) {
      if (isBase64(profilePic)) {
        if (user.profilePic) {
          await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
        }

        const uploadedResponse = await cloudinary.uploader.upload(profilePic);
        profilePic = uploadedResponse.secure_url;
      } else if (!isValidUrl(profilePic)) {
        return res.status(400).json({ error: "Invalid profile picture format" });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio !== undefined ? bio : user.bio;

    user = await user.save();

    await Comment.updateMany(
      { postedBy: userId },
      {
        $set: {
          username: user.username,
          userProfilePic: user.profilePic,
        },
      },
    );

    // password should be null in response
    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("error in updateUser " + error.message);
  }
};

const searchUser = async (req, res, next) => {
  try {
    if (!req.query.filter) return res.status(400).json({ error: "Bad request" });

    const searchQuery = req.query.filter;
    const userQuery = {
      $or: [{ name: { $regex: new RegExp(searchQuery, "i") } }, { username: { $regex: new RegExp(searchQuery, "i") } }],
    };

    const users = await User.find(userQuery, null, { lean: true, limit: 5 });

    if (!users) return res.status(404).json({ error: "Found nothing" });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export { getUserProfile, signupUser, loginUser, logoutUser, followUnFollowUser, updateUser, searchUser };
