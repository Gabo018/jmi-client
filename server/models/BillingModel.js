const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const billingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    due_date: {
      type: Date,
      required: true,
    },
    payment_date: {
      type: Date,
      required: true,
    },

    total_payment: {
      type: String,
      required: true,
    },
    archive: {
      type: Boolean,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: "billing" }
);

const Billing = mongoose.model("Billing", billingSchema);
module.exports = Billing;
