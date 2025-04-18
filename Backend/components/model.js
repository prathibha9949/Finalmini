const mongoose = require("mongoose");

const RegisteruserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['laborer', 'admin', 'seller', 'buyer'], // Define the possible roles
    required: true // Ensure that a role is provided
  }
});
module.exports = mongoose.model("Farmers", RegisteruserSchema);
