const mongoose = require("mongoose");

const EquipmentSchema = new mongoose.Schema({
  equipmentName: { type: String, required: true },
  rent: { type: Number, required: true },
  mobile: { type: String, required: true },
  place: { type: String, required: true },
  photo: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ this is important
});

module.exports = mongoose.model("Equipment", EquipmentSchema);
