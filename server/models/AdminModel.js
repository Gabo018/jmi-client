const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const adminSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true
  }
}, {
  collection: 'admin'
});

adminSchema.pre('save', function (next) {
  const encryptPass = bcrypt.hashSync(this.password, 10)
  this.password = encryptPass;
  next();
})

const Admin = mongoose.model('Admin', adminSchema)
module.exports = Admin;