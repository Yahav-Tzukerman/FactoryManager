const AppError = require("../exceptions/AppError");

const isNameValid = (name) => /^[a-zA-Z\s]{2,50}$/.test(name);

const isStartWorkYearValid = (year) => {
  const currentYear = new Date().getFullYear();
  return typeof year === "number" && year >= 1950 && year <= currentYear;
};

const isDepartmentIdValid = (id) => /^[a-fA-F0-9]{24}$/.test(id); // MongoDB ObjectId

const isEmployeeValid = (employee) => {
  if (!isNameValid(employee.firstName))
    throw new AppError("Invalid first name", 400);
  if (!isNameValid(employee.lastName))
    throw new AppError("Invalid last name", 400);
  if (!isStartWorkYearValid(employee.startWorkYear))
    throw new AppError("Invalid start work year", 400);
  if (!isDepartmentIdValid(employee.department))
    throw new AppError("Invalid department ID", 400);
};

module.exports = {
  isEmployeeValid,
  isNameValid,
  isStartWorkYearValid,
  isDepartmentIdValid,
};
