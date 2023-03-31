const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expensesSchema = new Schema(
  {
    deductionType: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    processBy: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      required: true,
    },
  },
  { collection: "expenses" }
);

const Expenses = mongoose.model("Expenses", expensesSchema);
module.exports = Expenses;
