const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const inventorySchema = new Schema({
  code: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { collection: 'inventory' })

const Inventory = mongoose.model('Inventory', inventorySchema)
module.exports = Inventory;