const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"], // only allow "admin" or "user"
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.role === "admin") {
    const adminCount = await mongoose
      .model("User")
      .countDocuments({ role: "admin" });
    if (adminCount > 0) {
      const error = new Error(
        "An admin user already exists. Only one admin is allowed."
      );
      return next(error);
    }
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
