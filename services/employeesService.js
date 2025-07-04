const employeesRepo = require("../repositories/employeesRepository");
const shiftRepo = require("../repositories/shiftsRepository");
const deptRepo = require("../repositories/departmentsRepository");
const employeeValidator = require("../validators/employeeValidator");

const getAllEmployees = (filters) => employeesRepo.getAllEmployees(filters);

const addEmployee = async (employee) => {
  employeeValidator.isEmployeeValid(employee);
  return employeesRepo.addEmployee(employee);
};

const getEmployeeById = (id) => employeesRepo.getEmployeeById(id);

const findByFirstAndLastName = (firstName, lastName) =>
  employeesRepo.findByFirstAndLastName(firstName, lastName);

const findByUsername = (username) => employeesRepo.findByUsername(username);

const updateEmployee = async (id, updatedEmployee) => {
  employeeValidator.isEmployeeValid(updatedEmployee);
  return employeesRepo.updateEmployee(id, updatedEmployee);
};

const assignShiftToEmployee = async (employeeId, shiftId) => {
  // Add shift to employee
  const updatedEmployee = await employeesRepo.addShiftToEmployee(
    employeeId,
    shiftId
  );
  // Add employee to shift
  await shiftRepo.addEmployeeToShift(shiftId, employeeId);
  return updatedEmployee;
};

const removeShiftFromEmployee = async (employeeId, shiftId) => {
  // Remove shift from employee
  const updatedEmployee = await employeesRepo.removeShiftFromEmployee(
    employeeId,
    shiftId
  );
  // Remove employee from shift
  await shiftRepo.removeEmployeeFromShift(shiftId, employeeId);
  return updatedEmployee;
};

const assignDepartmentToEmployee = async (employeeId, departmentId) => {
  const updatedEmployee = await employeesRepo.assignDepartmentToEmployee(
    employeeId,
    departmentId
  );
  return updatedEmployee;
};

const deleteEmployee = async (id) => {
  const employee = await employeesRepo.getEmployeeById(id);
  if (employee && employee.shifts && employee.shifts.length) {
    for (const shift of employee.shifts) {
      await shiftRepo.removeEmployeeFromShift(shift._id, id);
    }
  }

  await deptRepo.unsetManagerForEmployee(id);

  return employeesRepo.deleteEmployee(id);
};

module.exports = {
  getAllEmployees,
  addEmployee,
  getEmployeeById,
  findByFirstAndLastName,
  findByUsername,
  updateEmployee,
  assignShiftToEmployee,
  removeShiftFromEmployee,
  assignDepartmentToEmployee,
  deleteEmployee,
};
