const User = require("../models/user");

const getUser = async (req, res) => {
  try {
    const { role } = req.userInfo;

    if (role === "admin") {
      const users = await User.find({
        role: {
          $ne: "admin",
        },
      });
      res.status(200).json({
        success: true,
        message: "users fetched successfully",
        data: users,
      });
    } else {
      res.status(403).json({
        success: false,
        message: "Unauthorized. You are not allowed to access this resource.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
module.exports = {
  getUser,
};
