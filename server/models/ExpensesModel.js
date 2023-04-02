const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expensesSchema = new Schema(
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
      required: false,
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
  { collection: "expenses" }
);

const Expenses = mongoose.model("Expenses", expensesSchema);
module.exports = Expenses;
