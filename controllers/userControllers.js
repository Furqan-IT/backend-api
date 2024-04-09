const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const registerUser = expressAsyncHandler(async (req, res) => {
  const {
    name,
    location,
    email,
    password,
    mobile_Number,
    gender,
    profileImage,
    userType,
  } = req.body;

  if (!name || !email || !location || !password || !mobile_Number || !gender) {
    res.status(400);
    throw new Error("Please Enter All the Fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    location,
    gender,
    mobile_Number,
    profileImage,
    userType,
  });

  if (user) {
    res.status(201).json({
      userId: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      gender: user.gender,
      mobile_Number: user.mobile_Number,
      profileImage: user.profileImage,
      userType: user.userType,
      token: generateToken(user.userId),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      userId: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      gender: user.gender,
      mobile_Number: user.mobile_Number,
      profileImage: user.profileImage,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
module.exports = { registerUser, authUser };
