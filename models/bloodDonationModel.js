const mongoose = require("mongoose");

const bloodDonationSchema = new mongoose.Schema({
  blood_group: { type: String, required: true },
  created_by: { type: String, required: true },
  created_date: { type: Date, default: Date.now },
  district: { type: String, required: true },
  ic_blood: { type: Number, required: true },
  isphonehide: { type: Boolean, default: false },
  key: { type: String, required: true },
  mobile_no: { type: String, required: true },
  name: { type: String, required: true },
  pin_code: { type: String, required: true },
  state: { type: String, required: true },
  system_id: { type: String },
  tehsil: { type: String },
  time: { type: String },
  updated_date: { type: Date },
  village: { type: String },
});

const BloodDonation = mongoose.model("BloodDonation", bloodDonationSchema);

module.exports = BloodDonation;
