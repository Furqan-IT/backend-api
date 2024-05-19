const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");
const generateToken = require("../config/generateToken.js");
const BloodDonation = require("../models/bloodDonationModel.js");
const bcrypt = require("bcryptjs");

const registerUser = expressAsyncHandler(async (req, res) => {
  const {
    system_id,
    name,
    location,
    email,
    password,
    mobile_Number,
    gender,
    profileImage,
    userType,
    balance,
    created_Date,
    fcmToken,
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
    system_id,
    name,
    email,
    password,
    location,
    gender,
    mobile_Number,
    profileImage,
    userType,
    balance,
    created_Date,
    fcmToken,
  });
  // Format the created_Date to "dd-mmm-yyyy"
  const formattedDate = user.created_Date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  if (user) {
    const responseData = {
      success: true,
      message: "User Registered Successfully",
      status_code: 201,
      data: {
        system_id: user.system_id,
        userId: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        gender: user.gender,
        mobile_Number: user.mobile_Number,
        profileImage: user.profileImage,
        userType: user.userType,
        balance: user.balance,
        created_Date: formattedDate,
        fcmToken: user.fcmToken,
        token: generateToken(user.userId),
      },
    };
    res.status(201).json(responseData);
  } else {
    res.status(400);
    throw new Error("Failed to create the User");
  }
});

//Update Profile
const updateProfileHandler = expressAsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const {
    name,
    location,
    email,
    mobile_Number,
    gender,
    profileImage,
    userType,
  } = req.body;

  // Validate that all required fields are provided
  const requiredFields = [
    "name",
    "location",
    "email",
    "mobile_Number",
    "gender",
    "profileImage",
    "userType",
  ];
  const missingFields = requiredFields.filter(
    (field) => !req.body.hasOwnProperty(field)
  );
  if (missingFields.length > 0) {
    res.status(400).json({
      success: false,
      message: `Please provide all required fields: ${missingFields.join(
        ", "
      )}`,
    });
    return;
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // Update user profile information
    user.name = name;
    user.location = location;
    user.email = email;
    user.mobile_Number = mobile_Number;
    user.gender = gender;
    user.profileImage = profileImage;
    user.userType = userType;

    // Save the updated user profile
    await user.save();

    // Return success response
    res.json({ success: true, message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user profile" });
  }
});

//Update fcm token
const fcmToken = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const { fcmToken } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the FCM token
    user.fcmToken = fcmToken;
    await user.save();

    res.status(200).json({ message: "FCM token updated successfully", user });
  } catch (error) {
    console.error("Error updating FCM token:", error);
    res.status(500).json({ message: "Failed to to to to to update FCM token" });
  }
});

const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    console.log("User Logged in Successfully");
    const responseData = {
      success: true, //New
      message: "User Logged In Successfully", //New
      status_code: 201,
      data: {
        userId: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        gender: user.gender,
        mobile_Number: user.mobile_Number,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      },
    };
    res.status(201).json(responseData);
  } else {
    // Changed
    res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }
});

//get user data api
const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find user by user_id in the database
    const user = await User.findById(user_id).select("-password");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    //blood donation data
    const bloodDonations = await BloodDonation.find({ created_by: user._id });

    // Format blood donation data for frontend mapping
    const bloodDonationsData = bloodDonations.map((donation) => ({
      bloodDonationId: donation._id,
      blood_group: donation.blood_group,
      created_by: donation.created_by,
      created_date: donation.created_date,
      district: donation.district,
      ic_blood: donation.ic_blood,
      isphonehide: donation.isphonehide,
      key: donation.key,
      mobile_no: donation.mobile_no,
      name: donation.name,
      pin_code: donation.pin_code,
      state: donation.state,
      system_id: donation.system_id,
      tehsil: donation.tehsil,
      time: donation.time,
      updated_date: donation.updated_date,
      village: donation.village,
      // Include other blood donation fields as needed
    }));

    // Format user data for frontend mapping
    const userData = {
      system_id: user.system_id,
      id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      mobile_Number: user.mobile_Number,
      gender: user.gender,
      balance: user.balance,
      created_Date: user.created_Date,

      // Add more fields as needed
    };

    // Return the formatted user data
    res.json({ user: userData, bloodDonations: bloodDonationsData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

//chnage password
const changePassword = expressAsyncHandler(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//export APIs
module.exports = {
  registerUser,
  authUser,
  getUserById,
  fcmToken,
  updateProfileHandler,
  changePassword,
};
