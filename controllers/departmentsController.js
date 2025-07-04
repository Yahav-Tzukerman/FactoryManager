const express = require("express");
const deptService = require("../services/departmentsService");
const catchAsync = require("../utils/catchAsync");

const deptRouter = express.Router();

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Retrieve a list of all departments
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Departments
 *     responses:
 *       200:
 *         description: A list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The ID of the department
 *                     example: 64b7f3e2c2a5f1a2b3c4d5e7
 *                   name:
 *                     type: string
 *                     description: The name of the department
 *                     example: Human Resources
 *                   manager:
 *                     type: string
 *                     description: The ID of the manager (Employee)
 *                     example: 64b7f3e2c2a5f1a2b3c4d5e6
 *       500:
 *         description: Internal server error
 */
deptRouter.get(
  "/",
  catchAsync(async (req, res) => {
    const departments = await deptService.getAllDepartments();
    res.status(200).json(departments);
  })
);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Departments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the department
 *                 example: Human Resources
 *               manager:
 *                 type: string
 *                 description: The ID of the manager (Employee)
 *                 example: 64b7f3e2c2a5f1a2b3c4d5e6
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the created department
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e7
 *                 name:
 *                   type: string
 *                   description: The name of the department
 *                   example: Human Resources
 *                 manager:
 *                   type: string
 *                   description: The ID of the manager (Employee)
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e6
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
deptRouter.post(
  "/",
  catchAsync(async (req, res) => {
    const department = await deptService.addDepartment(req.body);
    res.status(201).json(department);
  })
);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Retrieve a department by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the department to retrieve
 *         schema:
 *           type: string
 *           example: 64b7f3e2c2a5f1a2b3c4d5e7
 *     responses:
 *       200:
 *         description: A single department
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the department
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e7
 *                 name:
 *                   type: string
 *                   description: The name of the department
 *                   example: Human Resources
 *                 manager:
 *                   type: string
 *                   description: The ID of the manager (Employee)
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e6
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
deptRouter.get(
  "/:id",
  catchAsync(async (req, res) => {
    const department = await deptService.getDepartmentById(req.params.id);
    res.status(200).json(department);
  })
);

/**
 * @swagger
 * /departments/{id}:
 *   patch:
 *     summary: Update a department by ID
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the department to update
 *         schema:
 *           type: string
 *           example: 64b7f3e2c2a5f1a2b3c4d5e7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the department
 *                 example: Finance
 *               manager:
 *                 type: string
 *                 description: The updated ID of the manager (Employee)
 *                 example: 64b7f3e2c2a5f1a2b3c4d5e6
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The ID of the department
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e7
 *                 name:
 *                   type: string
 *                   description: The updated name of the department
 *                   example: Finance
 *                 manager:
 *                   type: string
 *                   description: The updated ID of the manager (Employee)
 *                   example: 64b7f3e2c2a5f1a2b3c4d5e6
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
deptRouter.patch(
  "/:id",
  catchAsync(async (req, res) => {
    const updated = await deptService.updateDepartment(req.params.id, req.body);
    res.status(200).json(updated);
  })
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     security:
 *      - bearerAuth: []
 *     tags:
 *       - Departments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the department to delete
 *         schema:
 *           type: string
 *           example: 64b7f3e2c2a5f1a2b3c4d5e7
 *     responses:
 *       204:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
deptRouter.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await deptService.deleteDepartment(req.params.id);
    res.status(204).send();
  })
);

module.exports = deptRouter;
