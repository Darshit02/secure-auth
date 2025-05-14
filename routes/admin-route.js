const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { getUser } = require("../controllers/users-controller");
const isAdminUser = require("../middleware/admin-middleware");

const router = express.Router();

router.get("/welcome-admin", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to the admin route",
  });
});

router.get("/users", authMiddleware, isAdminUser, getUser);

module.exports = router;
