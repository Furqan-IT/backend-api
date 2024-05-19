const expressAsyncHandler = require("express-async-handler");
const ServiceRequestModel = require("../models/serviceRequestModel");
const ServiceDonateModel = require("../models/serviceDonateModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/profile_pics", // You can change this to any directory where you want to store uploaded files
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profile_pic"); // Single file upload under the key 'profile_pic'

// Check file type
function checkFileType(file, cb) {
  // Allowed file types
  const filetypes = /jpeg|jpg|png/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

//Service Request Handling
const serviceRequestHandler = expressAsyncHandler(async (req, res) => {
  const {
    body,
    category_icon,
    category_name,
    created_date,
    district,
    done_by,
    done_by_name,
    is_see,
    key,
    message1,
    message2,
    message3,
    mobile_no,
    name,
    pin_code,
    remarks,
    service_of_by_done,
    skill1,
    skill2,
    skill3,
    specific_service,
    state,
    status,
    sub_category_icon,
    sub_category_name,
    tehsil,
    time,
    title,
    type,
    uid,
    update_date,
    village,
  } = req.body;

  // Validate that all required fields are provided
  const requiredFields = [
    "body",
    "category_icon",
    "category_name",
    "district",
    "done_by",
    "done_by_name",
    "is_see",
    "key",
    "message1",
    "message2",
    "message3",
    "mobile_no",
    "name",
    "pin_code",
    "remarks",
    "service_of_by_done",
    "skill1",
    "skill2",
    "skill3",
    "specific_service",
    "state",
    "status",
    "sub_category_icon",
    "sub_category_name",
    "tehsil",
    "time",
    "title",
    "type",
    "uid",
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
    // Check if service request already exists
    const serviceRequestExists = await ServiceRequestModel.findOne({
      key /* Your query here */,
    });
    if (serviceRequestExists) {
      res.status(400);
      throw new Error("Service request already exists");
    }

    // Create the service request
    const serviceRequest = await ServiceRequestModel.create({
      body,
      category_icon,
      category_name,
      created_date,
      district,
      done_by,
      done_by_name,
      is_see,
      key,
      message1,
      message2,
      message3,
      mobile_no,
      name,
      pin_code,
      remarks,
      service_of_by_done,
      skill1,
      skill2,
      skill3,
      specific_service,
      state,
      status,
      sub_category_icon,
      sub_category_name,
      tehsil,
      time,
      title,
      type,
      uid,
      update_date,
      village,
    });

    // Construct the response data including all fields
    const responseData = {
      success: true,
      message: "Service request created successfully",
      status_code: 201,
      data: {
        serviceRequestId: serviceRequest._id,
        // Include other fields as needed
        body,
        category_icon,
        category_name,
        created_date,
        district,
        done_by,
        done_by_name,
        is_see,
        key,
        message1,
        message2,
        message3,
        mobile_no,
        name,
        pin_code,
        remarks,
        service_of_by_done,
        skill1,
        skill2,
        skill3,
        specific_service,
        state,
        status,
        sub_category_icon,
        sub_category_name,
        tehsil,
        time,
        title,
        type,
        uid,
        update_date,
        village,
      },
    };

    // Send the response
    res.status(201).json(responseData);
  } catch (error) {
    res.status(500).json({ error: "Failed to create service request" });
  }
});

//Service Donate API

const serviceDonateHandler = expressAsyncHandler(async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.status(400).json({ error: err });
      return;
    }

    const {
      business_card_pic,
      category_icon,
      category_name,
      created_date,
      district,
      isphonehide,
      key,
      mobile_no,
      name,
      pin_code,
      skill1,
      skill2,
      skill3,
      specific_service,
      state,
      sub_category_icon,
      sub_category_name,
      system_id,
      tehsil,
      time,
      uid,
      update_date,
      village,
    } = req.body;

    // Validate that all required fields are provided
    const requiredFields = [
      "business_card_pic",
      "category_icon",
      "category_name",
      "created_date",
      "district",
      "isphonehide",
      "key",
      "mobile_no",
      "name",
      "pin_code",
      "skill1",
      "skill2",
      "skill3",
      "specific_service",
      "state",
      "sub_category_icon",
      "sub_category_name",
      "system_id",
      "tehsil",
      "time",
      "uid",
      "update_date",
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
      // Check if service donation already exists
      const serviceDonateExists = await ServiceDonateModel.findOne({
        key,
        mobile_no,
      });
      if (serviceDonateExists) {
        res.status(400);
        throw new Error("Service donation already exists");
      }

      // Create the service donation
      const serviceDonate = await ServiceDonateModel.create({
        business_card_pic,
        category_icon,
        category_name,
        created_date,
        district,
        isphonehide,
        key,
        mobile_no,
        name,
        pin_code,
        profile_pic: req.file ? req.file.path : null, // Save the file path
        skill1,
        skill2,
        skill3,
        specific_service,
        state,
        sub_category_icon,
        sub_category_name,
        system_id,
        tehsil,
        time,
        uid,
        update_date,
        village,
      });

      // Construct the response data including all fields
      const responseData = {
        success: true,
        message: "Service donation created successfully",
        status_code: 201,
        data: {
          serviceDonateId: serviceDonate._id,
          business_card_pic,
          category_icon,
          category_name,
          created_date,
          district,
          isphonehide,
          key,
          mobile_no,
          name,
          pin_code,
          profile_pic: req.file ? req.file.path : null, // Include the file path
          skill1,
          skill2,
          skill3,
          specific_service,
          state,
          sub_category_icon,
          sub_category_name,
          system_id,
          tehsil,
          time,
          uid,
          update_date,
          village,
        },
      };

      // Send the response
      res.status(201).json(responseData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service donation" });
    }
  });
});

// Service Request Delete API

const deleteServiceRequest = expressAsyncHandler(async (req, res) => {
  const { key } = req.body; // Assuming the key is sent in the request body

  try {
    // Find the service request document by the key and delete it
    const deletedRequest = await ServiceRequestModel.findOneAndDelete({ key });

    if (!deletedRequest) {
      // If no document found with the provided key, send a 404 response
      res
        .status(404)
        .json({ success: false, message: "Service request not found" });
    } else {
      // If document successfully deleted, send a success response
      res.status(200).json({
        success: true,
        message: "Service request deleted successfully",
      });
    }
  } catch (error) {
    // Handle errors and send a 500 response
    res
      .status(500)
      .json({ success: false, error: "Failed to delete service request" });
  }
});

//Update Service Request Credentials

module.exports = {
  serviceRequestHandler,
  serviceDonateHandler,
  deleteServiceRequest,
};
