const Employee = require("../models/EmployeeModel");

const getAllEmployees = () =>
  Employee.find().populate("department").populate("shifts");
const addEmployee = (obj) => new Employee(obj).save();
const getEmployeeById = (id) =>
  Employee.findById(id).populate("department").populate("shifts");

const findByUsername = (username) =>
  Employee.findOne({ "user.username": username })
    .populate("department")
    .populate("shifts");

const findByFirstAndLastName = (firstName, lastName) =>
  Employee.findOne({ firstName, lastName })
    .populate("department")
    .populate("shifts");

const updateEmployee = (id, obj) =>
  Employee.findByIdAndUpdate(id, obj, { new: true });
const addShiftToEmployee = (employeeId, shiftId) =>
  Employee.findByIdAndUpdate(
    employeeId,
    { $addToSet: { shifts: shiftId } },
    { new: true }
  );
const removeShiftFromEmployee = (employeeId, shiftId) =>
  Employee.findByIdAndUpdate(
    employeeId,
    { $pull: { shifts: shiftId } },
    { new: true }
  );

const assignDepartmentToEmployee = (employeeId, departmentId) =>
  Employee.findByIdAndUpdate(
    employeeId,
    { department: departmentId },
    { new: true }
  );

const unsetDepartmentForEmployees = async (departmentId) => {
  await Employee.updateMany(
    { department: departmentId },
    { $unset: { department: "" } }
  );
};

const deleteEmployee = (id) => Employee.findByIdAndDelete(id);

module.exports = {
  getAllEmployees,
  addEmployee,
  getEmployeeById,
  findByFirstAndLastName,
  findByUsername,
  updateEmployee,
  addShiftToEmployee,
  removeShiftFromEmployee,
  assignDepartmentToEmployee,
  deleteEmployee,
  unsetDepartmentForEmployees,
};
