const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    archive: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "inventory" }
);

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;
