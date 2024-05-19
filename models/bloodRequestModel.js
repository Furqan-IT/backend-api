const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  blood_group: { type: String },
  created_by: { type: String },
  created_date: { type: Date, default: Date.now },
  district: { type: String },
  hospital: { type: String },
  ic_blood: { type: Number },
  is_see: { type: Boolean },
  key: { type: String },
  message1: { type: String },
  message2: { type: String },
  message3: { type: String },
  mobile_no: { type: String },
  name: { type: String },
  pin_code: { type: String },
  state: { type: String },
  tehsil: { type: String },
  time: { type: String },
  type: { type: String },
  updated_date: { type: Date },
  village: { type: String },
});

const bloodRequestModel = mongoose.model("bloodRequest", bloodRequestSchema);
module.exports = bloodRequestModel;
