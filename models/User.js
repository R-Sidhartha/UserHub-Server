const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  first_name: {
    type: String,
    require: true,
  },
  last_name: {
    type: String,
    require: true,
  },
  domain: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  gender: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

userSchema.index({ first_name: 'text', last_name: 'text' });

const User = mongoose.model("User", userSchema);

module.exports = User;
