const express = require("express");
const empService = require("../services/employeesService");
const shiftService = require("../services/shiftsService");
const catchAsync = require("../utils/catchAsync");

const empRouter = express.Router();

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Retrieve a list of all employees
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: A list of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the employee
 *                     example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                   firstName:
 *                     type: string
 *                     description: The first name of the employee
 *                     example: John
 *                   lastName:
 *                     type: string
 *                     description: The last name of the employee
 *                     example: Doe
 *                   startWorkYear:
 *                     type: number
 *                     description: The year the employee started working
 *                     example: 2020
 *                   department:
 *                     type: string
 *                     description: The ID of the department the employee belongs to
 *                     example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                   shifts:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: An array of shift IDs assigned to the employee
 *                     example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 */
empRouter.get(
  "/",
  catchAsync(async (req, res) => {
    const employees = await empService.getAllEmployees();
    res.status(200).json(employees);
  })
);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Employees
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the employee
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The last name of the employee
 *                 example: Doe
 *               startWorkYear:
 *                 type: number
 *                 description: The year the employee started working
 *                 example: 2020
 *               department:
 *                 type: string
 *                 description: The ID of the department the employee belongs to
 *                 example: 64b7f3e2c9d1a2b3c4d5e6f7
 *               shifts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of shift IDs assigned to the employee
 *                 example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the created employee
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 startWorkYear:
 *                   type: number
 *                   example: 2020
 *                 department:
 *                   type: string
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                 shifts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *       400:
 *         description: Bad request, invalid input
 */
empRouter.post(
  "/",
  catchAsync(async (req, res) => {
    const employee = await empService.addEmployee(req.body);
    res.status(201).json(employee);
  })
);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Retrieve an employee by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to retrieve
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the employee
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                 firstName:
 *                   type: string
 *                   description: The first name of the employee
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   description: The last name of the employee
 *                   example: Doe
 *                 startWorkYear:
 *                   type: number
 *                   description: The year the employee started working
 *                   example: 2020
 *                 department:
 *                   type: string
 *                   description: The ID of the department the employee belongs to
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                 shifts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: An array of shift IDs assigned to the employee
 *                   example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *       404:
 *         description: Employee not found
 */
empRouter.get(
  "/:id",
  catchAsync(async (req, res) => {
    const employee = await empService.getEmployeeById(req.params.id);
    res.status(200).json(employee);
  })
);

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update an employee by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to update
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The first name of the employee
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The last name of the employee
 *                 example: Doe
 *               startWorkYear:
 *                 type: number
 *                 description: The year the employee started working
 *                 example: 2020
 *               department:
 *                 type: string
 *                 description: The ID of the department the employee belongs to
 *                 example: 64b7f3e2c9d1a2b3c4d5e6f7
 *               shifts:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: An array of shift IDs assigned to the employee
 *                 example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the employee
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 startWorkYear:
 *                   type: number
 *                   example: 2020
 *                 department:
 *                   type: string
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                 shifts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Employee not found
 */
empRouter.patch(
  "/:id",
  catchAsync(async (req, res) => {
    const updated = await empService.updateEmployee(req.params.id, req.body);
    res.status(200).json(updated);
  })
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to delete
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     responses:
 *       204:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
empRouter.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await empService.deleteEmployee(req.params.id);
    res.status(204).send();
  })
);

/**
 * @swagger
 * /employees/{id}/assign-shift:
 *   patch:
 *     summary: Assign a shift to an employee
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to assign the shift to
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shiftId:
 *                 type: string
 *                 description: The ID of the shift to assign to the employee
 *                 example: 64b7f3e2c9d1a2b3c4d5e6f7
 *     responses:
 *       200:
 *         description: Shift assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the employee
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 startWorkYear:
 *                   type: number
 *                   example: 2020
 *                 department:
 *                   type: string
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                 shifts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *       404:
 *         description: Employee not found
 */
empRouter.patch(
  "/:id/assign-shift",
  catchAsync(async (req, res) => {
    const updated = await empService.assignShiftToEmployee(
      req.params.id,
      req.body.shiftId
    );
    res.status(200).json(updated);
  })
);

/**
 * @swagger
 * /employees/{id}/remove-shift:
 *   patch:
 *     summary: Remove a shift from an employee
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to assign the shift to
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shiftId:
 *                 type: string
 *                 description: The ID of the shift to assign to the employee
 *                 example: 64b7f3e2c9d1a2b3c4d5e6f7
 *     responses:
 *       200:
 *         description: Shift assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the employee
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f9
 *                 firstName:
 *                   type: string
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   example: Doe
 *                 startWorkYear:
 *                   type: number
 *                   example: 2020
 *                 department:
 *                   type: string
 *                   example: 64b7f3e2c9d1a2b3c4d5e6f7
 *                 shifts:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["64b7f3e2c9d1a2b3c4d5e6f7", "64b7f3e2c9d1a2b3c4d5e6f8"]
 *       404:
 *         description: Employee not found
 */
empRouter.patch(
  "/:id/remove-shift",
  catchAsync(async (req, res) => {
    const updated = await empService.removeShiftFromEmployee(
      req.params.id,
      req.body.shiftId
    );
    res.status(200).json(updated);
  })
);

/**
 * @swagger
 * /employees/{id}/assignDepartment:
 *   patch:
 *     summary: Assign a department to an employee
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Employees
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the employee to assign the department to
 *         schema:
 *           type: string
 *           example: 64b7f3e2c9d1a2b3c4d5e6f9
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *                 description: The ID of the department to assign to the employee
 *                 example: 64b7f3e2c9d1a2b3c4d5e6f7
 *     responses:
 *       200:
 *         description: Department assigned successfully
 */
empRouter.patch(
  "/:id/assignDepartment",
  catchAsync(async (req, res) => {
    const updated = await empService.assignDepartmentToEmployee(
      req.params.id,
      req.body.department
    );
    res.status(200).json(updated);
  })
);

module.exports = empRouter;
