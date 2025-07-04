const express = require("express");
const shiftService = require("../services/shiftsService");
const catchAsync = require("../utils/catchAsync");

const shiftRouter = express.Router();

/**
 * @swagger
 * /shifts:
 *   get:
 *     summary: Get all shifts
 *     description: This endpoint retrieves all shifts from the system.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     responses:
 *       200:
 *         description: A list of shifts
 *       400:
 *         description: Bad Request
 */
shiftRouter.get(
  "/",
  catchAsync(async (req, res) => {
    const shifts = await shiftService.getAllShifts();
    res.status(200).json(shifts);
  })
);

/**
 * @swagger
 * /shifts:
 *   post:
 *     summary: Add a new shift
 *     description: This endpoint allows you to create a new shift in the system.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startingHour:
 *                 type: integer
 *                 description: The starting hour of the shift (e.g., 9 for 9AM)
 *               endingHour:
 *                 type: integer
 *                 description: The ending hour of the shift
 *               employees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Employee IDs
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
shiftRouter.post(
  "/",
  catchAsync(async (req, res) => {
    const shift = await shiftService.addShift(req.body);
    res.status(201).json(shift);
  })
);

/**
 * @swagger
 * /shifts/{id}:
 *   get:
 *     summary: Get a shift by ID
 *     description: This endpoint retrieves a specific shift by its ID.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift
 *     responses:
 *       200:
 *         description: A shift object
 *       404:
 *         description: Shift not found
 */
shiftRouter.get(
  "/:id",
  catchAsync(async (req, res) => {
    const shift = await shiftService.getShiftById(req.params.id);
    res.status(200).json(shift);
  })
);

/**
 * @swagger
 * /shifts/{id}:
 *   patch:
 *     summary: Update a shift by ID
 *     description: This endpoint allows you to update specific details of a shift by its ID.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startingHour:
 *                 type: integer
 *                 description: The starting hour of the shift (e.g., 9 for 9AM)
 *               endingHour:
 *                 type: integer
 *                 description: The ending hour of the shift
 *               employees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: Employee IDs
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift not found
 */
shiftRouter.patch(
  "/:id",
  catchAsync(async (req, res) => {
    const updated = await shiftService.updateShift(req.params.id, req.body);
    res.status(200).json(updated);
  })
);

/**
 * @swagger
 * /shifts/{shiftId}/assign-employee:
 *   patch:
 *     summary: Assign an employee to a shift
 *     description: Assigns an employee to a specific shift by shift ID.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empId:
 *                 type: string
 *                 description: The ID of the employee to assign
 *     responses:
 *       200:
 *         description: Employee assigned to shift successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift or employee not found
 */
shiftRouter.patch(
  "/:shiftId/assign-employee",
  catchAsync(async (req, res) => {
    const { empId } = req.body;
    const { shiftId } = req.params;

    const updatedShift = await shiftService.assignEmployeeToShift(
      shiftId,
      empId
    );
    res.status(200).json(updatedShift);
  })
);

/**
 * @swagger
 * /shifts/{shiftId}/remove-employee:
 *   patch:
 *     summary: Remove an employee from a shift
 *     description: Removes an employee from a specific shift by shift ID.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: shiftId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empId:
 *                 type: string
 *                 description: The ID of the employee to remove
 *     responses:
 *       200:
 *         description: Employee removed from shift successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Shift or employee not found
 */
shiftRouter.patch(
  "/:shiftId/remove-employee",
  catchAsync(async (req, res) => {
    const { empId } = req.body;
    const { shiftId } = req.params;

    const updatedShift = await shiftService.removeEmployeeFromShift(
      shiftId,
      empId
    );
    res.status(200).json(updatedShift);
  })
);

/**
 * @swagger
 * /shifts/{id}:
 *   delete:
 *     summary: Delete a shift by ID
 *     description: This endpoint allows you to delete a specific shift by its ID.
 *     security:
 *      - bearerAuth: []
 *     tags: [Shifts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shift to delete
 *     responses:
 *       204:
 *         description: Shift deleted successfully
 *       404:
 *         description: Shift not found
 */
shiftRouter.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await shiftService.deleteShift(req.params.id);
    res.status(204).send();
  })
);

module.exports = shiftRouter;
