const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the user schema
const userSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile_Number: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  userType: {
    type: String,
    default: "user",
  },
  created_Date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified()) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
// Create a Mongoose model from the schema and export it
const User = mongoose.model("User", userSchema);
module.exports = User;
