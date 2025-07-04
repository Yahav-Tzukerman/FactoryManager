const shiftsRepo = require("../repositories/shiftsRepository");
const empRepo = require("../repositories/employeesRepository");
const shiftValidator = require("../validators/shiftValidator");

const getAllShifts = (filters) => shiftsRepo.getAllShifts(filters);

const addShift = async (shift) => {
  shiftValidator.isShiftValid(shift);
  return shiftsRepo.addShift(shift);
};

const getShiftById = (id) => shiftsRepo.getShiftById(id);

const findByDetails = (date, startingHour, endingHour, department) =>
  shiftsRepo.findByDetails(date, startingHour, endingHour);

const updateShift = async (id, updatedShift) => {
  shiftValidator.isShiftValid(updatedShift);
  return shiftsRepo.updateShift(id, updatedShift);
};

const assignEmployeeToShift = async (shiftId, empId) => {
  const shift = await shiftsRepo.addEmployeeToShift(shiftId, empId);
  await empRepo.addShiftToEmployee(empId, shiftId);
  return shift;
};

const removeEmployeeFromShift = async (shiftId, empId) => {
  const shift = await shiftsRepo.removeEmployeeFromShift(shiftId, empId);
  await empRepo.removeShiftFromEmployee(empId, shiftId);
  return shift;
};

const deleteShift = (id) => shiftsRepo.deleteShift(id);

module.exports = {
  getAllShifts,
  addShift,
  getShiftById,
  findByDetails,
  updateShift,
  assignEmployeeToShift,
  removeEmployeeFromShift,
  deleteShift,
};
