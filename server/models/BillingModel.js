const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const billingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  contact: {
    type: Number,
    required: true,
  },
  productCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'billing' });

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
