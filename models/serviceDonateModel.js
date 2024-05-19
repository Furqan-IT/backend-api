const mongoose = require("mongoose");

const serviceDonateSchema = new mongoose.Schema({
  business_card_pic: { type: String, default: "" },
  category_icon: { type: Number },
  category_name: { type: String },
  created_date: { type: Date, default: Date.now },
  district: { type: String },
  isphonehide: { type: Boolean, default: false },
  key: { type: String },
  mobile_no: { type: String },
  name: { type: String },
  pin_code: { type: String },
  profile_pic: { type: String, default: "" },
  skill1: { type: String },
  skill2: { type: String },
  skill3: { type: String },
  specific_service: { type: String },
  state: { type: String },
  sub_category_icon: { type: Number },
  sub_category_name: { type: String },
  system_id: { type: String },
  tehsil: { type: String },
  time: { type: String },
  uid: { type: String },
  update_date: { type: Date },
  village: { type: String },
});

const ServiceDonateModel = mongoose.model("serviceDonate", serviceDonateSchema);

module.exports = ServiceDonateModel;
