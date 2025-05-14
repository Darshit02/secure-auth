require("dotenv").config();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Register Route
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        {
          username: username,
        },
        {
          email: email,
        },
      ],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this username or email",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new User and save it to the database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    // console.log("New User", newUser);
    if (newUser) {
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User registration failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//Login Route
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check user
    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      res.status(400).json({
        message: "User not found",
      });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({
          message: "Invalid credentials",
        });
      }
      // user token
      const accessToken = jwt.sign(
        {
          userId: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
          userId: user._id,
          username: user.username,
          role: user.role,
          accessToken: accessToken,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { old_password, new_password } = req.body;

    //check user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    //check password
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Old password is incorrect",
      });
    } else {
      const salt = await bcrypt.genSalt(10);
      const newhashedPassword = await bcrypt.hash(new_password, salt);
      user.password = newhashedPassword;
      await user.save();
      return res.status(200).json({
        status: true,
        message: "Password changed successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
};
