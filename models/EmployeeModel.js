const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    startWorkYear: { type: Number, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    shifts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Shift" }],
  },
  { versionKey: false }
);

module.exports = mongoose.model("Employee", employeeSchema);
