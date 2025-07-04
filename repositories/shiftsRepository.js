const Shift = require("../models/ShiftModel");

const getAllShifts = () => Shift.find().populate("employees");
const addShift = (obj) => new Shift(obj).save();
const getShiftById = (id) => Shift.findById(id).populate("employees");
const findByDetails = (date, startingHour, endingHour) =>
  Shift.findOne({
    date,
    startingHour,
    endingHour,
  }).populate("employees");
const updateShift = (id, obj) =>
  Shift.findByIdAndUpdate(id, obj, { new: true });
const addEmployeeToShift = (shiftId, employeeId) =>
  Shift.findByIdAndUpdate(
    shiftId,
    { $addToSet: { employees: employeeId } },
    { new: true }
  );
const removeEmployeeFromShift = (shiftId, employeeId) =>
  Shift.findByIdAndUpdate(
    shiftId,
    { $pull: { employees: employeeId } },
    { new: true }
  );
const deleteShift = (id) => Shift.findByIdAndDelete(id);

module.exports = {
  getAllShifts,
  addShift,
  getShiftById,
  findByDetails,
  updateShift,
  addEmployeeToShift,
  removeEmployeeFromShift,
  deleteShift,
};
