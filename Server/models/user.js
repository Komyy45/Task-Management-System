const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  password: String,
  // male => true || female => false
  maleOrFemale: Boolean,
});

module.exports = User;
