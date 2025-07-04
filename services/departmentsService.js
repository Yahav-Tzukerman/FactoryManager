const departmentsRepo = require("../repositories/departmentsRepository");
const empRepo = require("../repositories/employeesRepository");
const departmentValidator = require("../validators/departmentValidator");

const getAllDepartments = (filters) =>
  departmentsRepo.getAllDepartments(filters);

const addDepartment = async (department) => {
  departmentValidator.isDepartmentValid(department);
  return departmentsRepo.addDepartment(department);
};

const getDepartmentById = (id) => departmentsRepo.getDepartmentById(id);

const findByName = (name) => departmentsRepo.findByName(name);

const updateDepartment = async (id, updatedDepartment) => {
  departmentValidator.isDepartmentValid(updatedDepartment);
  return departmentsRepo.updateDepartment(id, updatedDepartment);
};

const deleteDepartment = async (id) => {
  await empRepo.unsetDepartmentForEmployees(id);

  return departmentsRepo.deleteDepartment(id);
};

module.exports = {
  getAllDepartments,
  addDepartment,
  getDepartmentById,
  findByName,
  updateDepartment,
  deleteDepartment,
};
