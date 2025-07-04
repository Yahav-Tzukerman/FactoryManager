const Department = require("../models/DepartmentModel");

const getAllDepartments = () => Department.find().populate("manager");
const addDepartment = (obj) => new Department(obj).save();
const getDepartmentById = (id) => Department.findById(id).populate("manager");
const findByName = (name) => Department.findOne({ name }).populate("manager");
const updateDepartment = (id, obj) =>
  Department.findByIdAndUpdate(id, obj, { new: true });
const deleteDepartment = (id) => Department.findByIdAndDelete(id);

const unsetManagerForEmployee = async (employeeId) => {
  await Department.updateMany(
    { manager: employeeId },
    { $unset: { manager: "" } }
  );
};

module.exports = {
  getAllDepartments,
  addDepartment,
  getDepartmentById,
  findByName,
  updateDepartment,
  deleteDepartment,
  unsetManagerForEmployee,
};
