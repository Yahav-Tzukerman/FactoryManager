const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Department", departmentSchema);
