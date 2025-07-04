const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidator = require("../validators/userValidator");
const usersRepository = require("../repositories/usersRepository");
const AppError = require("../exceptions/AppError");

const getAllUsers = (filters) => usersRepository.getAllUsers(filters);

const findById = (id) => usersRepository.findById(id);

const findByUsername = (username) => usersRepository.findByUsername(username);

const addUser = async (user) => {
  user.numOfActions = user.maxActionsPerDay || 0;
  user.lastActionDate = new Date().toDateString();

  userValidator.isUserValid(user);

  user.password = await bcrypt.hash(user.password, 10);

  const existingUser = await usersRepository.findByUsername(user.username);
  if (existingUser) throw new AppError("Username already exists", 400);
  return usersRepository.addUser(user);
};

const login = async ({ username, password }) => {
  const user = await usersRepository.findByUsername(username);
  if (!user) throw new AppError("User not found", 404);

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new AppError("Incorrect password", 403);

  const token = jwt.sign(
    { id: user._id, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  if (user.numOfActions === 0) {
    resetActionsIfNewDay(user._id);
  }
  return {
    token,
    fullName: user.fullName,
    maxActionsPerDay: user.maxActionsPerDay,
    numOfActions: user.numOfActions,
  };
};

const decrementAction = async (userId) => {
  return usersRepository.decrementNumOfActions(userId);
};

const isActionLimitReached = async (userId) => {
  const user = await usersRepository.findById(userId);
  if (!user) throw new AppError("User not found", 404);
  return user.numOfActions == 0;
};

const resetActionsIfNewDay = async (userId) => {
  const user = await usersRepository.findById(userId);
  const today = new Date().toDateString();
  const lastAction = new Date(user.lastActionDate).toDateString();

  if (today !== lastAction) {
    return usersRepository.resetActionsForNewDay(userId);
  }
};

module.exports = {
  getAllUsers,
  findById,
  findByUsername,
  addUser,
  login,
  decrementAction,
  isActionLimitReached,
  resetActionsIfNewDay,
};
