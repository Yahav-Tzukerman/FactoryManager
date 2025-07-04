const express = require("express");
const usersService = require("../services/usersService");
const catchAsync = require("../utils/catchAsync");

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad Request
 */
router.post(
  "/",
  catchAsync(async (req, res) => {
    const result = await usersService.addUser(req.body);
    res.status(201).json(result);
  })
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: username
 *               password:
 *                 type: string
 *                 example: passeword
 *     responses:
 *       201:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 *       404:
 *         description: User not found
 *       403:
 *         description: Incorrect password
 *       500:
 *         description: Internal Server Error
 */
// Login
router.post(
  "/login",
  catchAsync(async (req, res) => {
    const result = await usersService.login(req.body);
    res.status(200).json(result);
  })
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  catchAsync(async (req, res) => {
    const users = await usersService.getAllUsers();

    const safe = users.map((u) => {
      const obj = u.toObject();
      delete obj.password;
      return obj;
    });
    res.status(200).json(safe);
  })
);

module.exports = router;
