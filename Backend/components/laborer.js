const mongoose = require("mongoose");

const laborerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    wage: { type: Number, required: true },
    mobile: { type: String, required: true }
});

const Laborer = mongoose.model("Laborer", laborerSchema);
module.exports = Laborer;
