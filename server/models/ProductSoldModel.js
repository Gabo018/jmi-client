const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    user_bought: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Billing",
    },

    product_name: {
      type: String,
      required: true,
    },
    account_type: {
      type: String,
      required: true,
    },
    discount: {
      type: String,
      required: false,
    },
    quantity_items_bought: {
      type: String,
      required: true,
    },
    mode_of_payment: {
      type: String,
      required: true,
    },
    tax: {
      type: Boolean,
      required: true,
    },
    product_id: {
      type: "String",
      required: false,
    },
    price_of_product: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { collection: "productsold" }
);

const Inventory = mongoose.model("Product_Sold", productSchema);
module.exports = Inventory;
