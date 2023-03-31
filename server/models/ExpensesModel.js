const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const expensesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    due: {
      type: Date,
      required: true,
    },
    invoice_date: {
      type: Date,
      default: Date.now,
    },
    isArchive: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "expenses" }
);

const Expenses = mongoose.model("Expenses", expensesSchema);
module.exports = Expenses;
