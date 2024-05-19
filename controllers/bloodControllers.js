const BloodRequestModel = require("../models/bloodRequestModel");
const BloodDonation = require("../models/bloodDonationModel");
const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const admin = require("firebase-admin");
const serviceAccount = require("./asi-chambyal-project-firebase-adminsdk-7sr1h-fa76e7c50b.json");
const BloodNotification = require("../models/bloodNotificationModel");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

//sendPushNotification
const sendPushNotification = async (
  deviceToken,
  notificationData,
  senderId,
  bloodRequestData
) => {
  try {
    // Construct the message payload
    const message = {
      token: deviceToken, // The device token of the recipient
      data: {
        NotificationType: "Notification",
        title: notificationData.title,
        msg: notificationData.body,
        id: senderId,
        type: "Blood",
        model: JSON.stringify(bloodRequestData),
      },
    };

    // Send the message
    const response = await admin.messaging().send(message);
    console.log("Push notification sent successfully");
    return { success: true, response };
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw new Error("Failed to send push notification");
  }
};

//Blood Request
const bloodRequestHandler = expressAsyncHandler(async (req, res) => {
  const {
    blood_group,
    created_by,
    created_date,
    district,
    hospital,
    ic_blood,
    is_see,
    key,
    message1,
    message2,
    message3,
    mobile_no,
    name,
    pin_code,
    state,
    tehsil,
    time,
    type,
    updated_date,
    village,
    title,
    body,
  } = req.body;

  // Validate that all required fields are provided
  const requiredFields = [
    "blood_group",
    "created_by",
    "district",
    "hospital",
    "ic_blood",
    "is_see",
    "key",
    "message1",
    "mobile_no",
    "name",
    "pin_code",
    "state",
    "tehsil",
    "time",
    "type",
    "updated_date",
    "village",
    "title",
    "body",
  ];
  const missingFields = requiredFields.filter(
    (field) => !req.body.hasOwnProperty(field)
  );
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(
      `Please provide all required fields: ${missingFields.join(", ")}`
    );
  }

  try {
    // Check if blood request already exists
    const bloodRequestExists = await BloodRequestModel.findOne({
      key,
    });
    if (bloodRequestExists) {
      res.status(400);
      throw new Error("Blood request already exists");
    }

    // Create the blood request
    const bloodRequest = await BloodRequestModel.create({
      blood_group,
      created_by,
      created_date,
      district,
      hospital,
      ic_blood,
      is_see,
      key,
      message1,
      message2,
      message3,
      mobile_no,
      name,
      pin_code,
      state,
      tehsil,
      time,
      type,
      updated_date,
      village,
    });

    // Format the created_date to "dd-mmm-yyyy"
    const formattedDate = bloodRequest.created_date.toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    // Construct the response data
    const responseData = {
      success: true,
      message: "Blood request created successfully",
      status_code: 201,
      data: {
        bloodRequestId: bloodRequest._id,
        blood_group: bloodRequest.blood_group,
        created_by: bloodRequest.created_by,
        created_date: formattedDate,
        district: bloodRequest.district,
        hospital: bloodRequest.hospital,
        ic_blood: bloodRequest.ic_blood,
        is_see: bloodRequest.is_see,
        key: bloodRequest.key,
        message1: bloodRequest.message1,
        message2: bloodRequest.message2,
        message3: bloodRequest.message3,
        mobile_no: bloodRequest.mobile_no,
        name: bloodRequest.name,
        pin_code: bloodRequest.pin_code,
        state: bloodRequest.state,
        tehsil: bloodRequest.tehsil,
        time: bloodRequest.time,
        type: bloodRequest.type,
        updated_date: bloodRequest.updated_date,
        village: bloodRequest.village,
      },
    };

    //Send the push notification
    // Find blood donors (users) with matching blood group
    const bloodDonors = await BloodDonation.find({ blood_group });

    // Iterate over blood donors
    for (const donor of bloodDonors) {
      const { created_by } = donor;
      // Find user by ID from UserModel
      const user = await User.findById(created_by);

      // If user found and has FCM token, send push notification
      if (user && user.fcmToken) {
        const notificationData = {
          title: title,
          body: body,
        };
        await sendPushNotification(
          user.fcmToken,
          notificationData,
          created_by,
          bloodRequest
        );
      }
    }
    await BloodNotification.create({
      bloodRequest: bloodRequest._id,
      receiver: donor.created_by,
    });

    // Send the response
    res.status(201).json(responseData);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create blood request", error: error.message });
  }
});

// Blood Donation API
const bloodDonationHandler = expressAsyncHandler(async (req, res) => {
  const {
    blood_group,
    created_by,
    created_date,
    district,
    ic_blood,
    isphonehide,
    key,
    mobile_no,
    name,
    pin_code,
    state,
    system_id,
    tehsil,
    time,
    updated_date,
    village,
  } = req.body;

  // Validate that all required fields are provided
  const requiredFields = [
    "blood_group",
    "created_by",
    "district",
    "ic_blood",
    "isphonehide",
    "key",
    "mobile_no",
    "name",
    "pin_code",
    "state",
    "tehsil",
    "time",
    "updated_date",
    "village",
  ];
  const missingFields = requiredFields.filter(
    (field) => !req.body.hasOwnProperty(field)
  );
  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(
      `Please provide all required fields: ${missingFields.join(", ")}`
    );
  }

  try {
    // Check if blood donation already exists
    // Example: const bloodDonationExists = await BloodDonation.findOne({ blood_group, created_by });
    // if (bloodDonationExists) {
    //   res.status(400);
    //   throw new Error("Blood donation already exists");
    // }

    // Create the blood donation
    const bloodDonation = await BloodDonation.create({
      blood_group,
      created_by,
      created_date,
      district,
      ic_blood,
      isphonehide,
      key,
      mobile_no,
      name,
      pin_code,
      state,
      system_id,
      tehsil,
      time,
      updated_date,
      village,
    });

    // Construct the response data including all fields
    const responseData = {
      success: true,
      message: "Blood donation created successfully",
      status_code: 201,
      data: {
        bloodDonationId: bloodDonation._id,
        blood_group: bloodDonation.blood_group,
        created_by: bloodDonation.created_by,
        created_date: bloodDonation.created_date,
        district: bloodDonation.district,
        ic_blood: bloodDonation.ic_blood,
        isphonehide: bloodDonation.isphonehide,
        key: bloodDonation.key,
        mobile_no: bloodDonation.mobile_no,
        name: bloodDonation.name,
        pin_code: bloodDonation.pin_code,
        state: bloodDonation.state,
        system_id: bloodDonation.system_id,
        tehsil: bloodDonation.tehsil,
        time: bloodDonation.time,
        updated_date: bloodDonation.updated_date,
        village: bloodDonation.village,
      },
    };

    // Send the response
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Failed to create blood donation" });
  }
});

//Blood Request Delete API
const deleteBloodRequest = expressAsyncHandler(async (req, res) => {
  const { key } = req.params; // Assuming the key is sent in the request body

  try {
    // Find the service request document by the key and delete it
    const deletedRequest = await BloodRequestModel.findOneAndDelete({ key });

    if (!deletedRequest) {
      // If no document found with the provided key, send a 404 response
      res
        .status(404)
        .json({ success: false, message: "Blood request not found" });
    } else {
      // If document successfully deleted, send a success response
      res.status(200).json({
        success: true,
        message: "Blood request deleted successfully",
      });
    }
  } catch (error) {
    // Handle errors and send a 500 response
    res
      .status(500)
      .json({ success: false, error: "Failed to delete Blood request" });
  }
});

//Blood Donation Delete API
const deleteBloodDonation = expressAsyncHandler(async (req, res) => {
  const { key } = req.params; // Assuming the key is sent in the request body

  try {
    // Find the service request document by the key and delete it
    const deletedDonation = await BloodDonation.findOneAndDelete({ key });

    if (!deletedDonation) {
      // If no document found with the provided key, send a 404 response
      res
        .status(404)
        .json({ success: false, message: "Blood Donation Request not found" });
    } else {
      // If document successfully deleted, send a success response
      res.status(200).json({
        success: true,
        message: "Blood Donation deleted successfully",
      });
    }
  } catch (error) {
    // Handle errors and send a 500 response
    res.status(500).json({
      success: false,
      error: "Failed to delete Blood request",
      error: error.message,
    });
  }
});

// Update Blood Request
const updateBloodRequest = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const updatedFields = req.body;

  try {
    // Find the blood request by ID
    let bloodRequest = await BloodRequestModel.findById(user_id);

    if (!bloodRequest) {
      res.status(404);
      throw new Error("Blood request not found");
    }

    // Update each field provided in the request body
    for (const [key, value] of Object.entries(updatedFields)) {
      bloodRequest[key] = value;
    }

    // Save the updated blood request
    bloodRequest = await bloodRequest.save();

    res.status(200).json({
      success: true,
      message: "Blood request updated successfully",
      data: bloodRequest,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blood request" });
  }
});

const updateBloodDonationRequest = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const updatedFields = req.body;

  try {
    // Find the blood request by ID
    let bloodDonation = await BloodDonation.findById(user_id);

    if (!bloodDonation) {
      res.status(404);
      throw new Error("Blood request not found");
    }

    // Update each field provided in the request body
    for (const [key, value] of Object.entries(updatedFields)) {
      bloodDonation[key] = value;
    }

    // Save the updated blood request
    bloodDonation = await bloodDonation.save();

    res.status(200).json({
      success: true,
      message: "Blood Donation request updated successfully",
      data: bloodDonation,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update blood Donation request" });
  }
});
//Get All users with same Blood Group from Blood Donation model
const getUserByBloodGroup = expressAsyncHandler(async (req, res) => {
  const { blood_group } = req.params;
  try {
    // Fetch blood donation data from the database
    const bloodDonationData = await BloodDonation.find({ blood_group });

    // Initialize an empty array to store the JSON objects
    const dataArray = [];

    // Iterate over the fetched data and push each JSON object into the array
    bloodDonationData.forEach((item) => {
      const dataObject = {
        id: item._id,
        blood_group: item.blood_group,
        created_by: item.created_by,
        created_date: item.created_date,
        district: item.district,
        ic_blood: item.ic_blood,
        isphonehide: item.isphonehide,
        key: item.key,
        mobile_no: item.mobile_no,
        name: item.name,
        pin_code: item.pin_code,
        state: item.state,
        system_id: item.system_id,
        tehsil: item.tehsil,
        time: item.time,
        updated_date: item.updated_date,
        village: item.village,
        // Add other fields as needed
      };

      // Push the object into the array
      dataArray.push(dataObject);
    });

    // Return the array containing all JSON objects
    res.status(200).json(dataArray);
  } catch (error) {
    console.error("Error fetching blood donation data:", error.message);
    res.status(500).json({
      message: "Failed to fetch blood donation data",
      error: error.message,
    });
  }
});

//fetch blood notification
const getBloodNotification = expressAsyncHandler(async (req, res) => {
  try {
    const receiverId = req.params.receiverId;

    const bloodNotifications = await BloodNotification.find(receiverId);

    res.json({ success: true, data: bloodNotifications });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      error: "Blood Notification Not found",
      error: error.message,
    });
  }
});

const countUnseenNotifications = expressAsyncHandler(async (req, res) => {
  try {
    console.log("Received request to count unseen notifications");

    const unseenCount = await BloodNotification.countDocuments({
      is_see: false,
    });

    console.log(`Unseen notifications count: ${unseenCount}`);

    res.json({ success: true, unseenCount });
  } catch (error) {
    console.error("Error occurred while counting unseen notifications:", error);
    res
      .status(500)
      .json({ success: false, error: "Server error", message: error.message });
  }
});

const markNotificationsAsSeen = expressAsyncHandler(async (req, res) => {
  const { receiverId } = req.params;

  try {
    const result = await BloodNotification.updateMany(
      { receiver: receiverId },
      { $set: { "bloodRequest.is_see": true } }
    );

    res
      .status(200)
      .send({ message: "Notifications updated successfully", result });
  } catch (error) {
    res.status(500).send({ message: "Error updating notifications", error });
  }
});

const deleteAllNotification = expressAsyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  try {
    const deleteNotification = await BloodNotification.deleteMany({
      receiver: receiverId,
    });

    if (!deleteNotification) {
      res
        .status(404)
        .json({ success: false, message: "Notification Not Found" });
    } else {
      res
        .status(201)
        .json({ success: true, message: "Notification Deleted Successfully" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Notification is not deleted",
      error: error.message,
    });
    console.log(error);
  }
});

//exports
module.exports = {
  bloodRequestHandler,
  bloodDonationHandler,
  deleteBloodRequest,
  updateBloodRequest,
  getUserByBloodGroup,
  deleteBloodDonation,
  updateBloodDonationRequest,
  getBloodNotification,
  countUnseenNotifications,
  markNotificationsAsSeen,
  deleteAllNotification,
};
