const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    startingHour: { type: Number, required: true }, // e.g. 9 for 9AM
    endingHour: { type: Number, required: true },
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Shift", shiftSchema);
