const mongoose = require("mongoose");

const bloodNotificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: Object,
      ref: "User",
      required: true,
    },
    bloodRequest: {
      type: Object,
      ref: "BloodRequest",
      required: true,
    },
  },
  { timestamps: true }
);

const BloodNotification = mongoose.model(
  "BloodNotification",
  bloodNotificationSchema
);

module.exports = BloodNotification;
