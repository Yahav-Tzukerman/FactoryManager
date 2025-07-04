const AppError = require("../exceptions/AppError");

const isDepartmentNameValid = (name) => /^[a-zA-Z\s]{2,50}$/.test(name);

const isManagerIdValid = (id) => /^[a-fA-F0-9]{24}$/.test(id); // MongoDB ObjectId

const isDepartmentValid = (department) => {
  if (!isDepartmentNameValid(department.name))
    throw new AppError("Invalid department name", 400);
  if (department.manager && !isManagerIdValid(department.manager))
    throw new AppError("Invalid manager ID", 400);
};

module.exports = {
  isDepartmentValid,
  isDepartmentNameValid,
  isManagerIdValid,
};
