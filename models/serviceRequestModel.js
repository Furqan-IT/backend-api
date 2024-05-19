const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema({
  body: { type: String },
  category_icon: { type: Number },
  category_name: { type: String },
  created_date: { type: Date, default: Date.now },
  district: { type: String },
  done_by: { type: String },
  done_by_name: { type: String },
  is_see: { type: Boolean },
  key: { type: String },
  message1: { type: String },
  message2: { type: String },
  message3: { type: String },
  mobile_no: { type: String },
  name: { type: String },
  pin_code: { type: String },
  remarks: { type: String },
  service_of_by_done: { type: String },
  skill1: { type: String },
  skill2: { type: String },
  skill3: { type: String },
  specific_service: { type: String },
  state: { type: String },
  status: { type: String },
  sub_category_icon: { type: Number },
  sub_category_name: { type: String },
  tehsil: { type: String },
  time: { type: String },
  title: { type: String },
  type: { type: String },
  uid: { type: String },
  update_date: { type: Date },
  village: { type: String },
});

const ServiceRequestModel = mongoose.model(
  "serviceRequest",
  serviceRequestSchema
);

module.exports = ServiceRequestModel;
