const User = require("../models/userModel");

const getAllUsers = (filters) => User.find(filters);
const addUser = (obj) => new User(obj).save();
const findByUsername = (username) => User.findOne({ username });
const findById = (id) => User.findById(id);

const incrementNumOfActions = (userId) =>
  User.findByIdAndUpdate(userId, { $inc: { numOfActions: 1 } }, { new: true });

const decrementNumOfActions = (userId) =>
  User.findByIdAndUpdate(userId, { $inc: { numOfActions: -1 } }, { new: true });

const resetActionsForNewDay = async (userId) => {
  const user = await User.findById(userId);
  return User.findByIdAndUpdate(
    userId,
    {
      numOfActions: user.maxActionsPerDay,
      lastActionDate: new Date(),
    },
    { new: true }
  );
};

module.exports = {
  getAllUsers,
  addUser,
  findByUsername,
  incrementNumOfActions,
  decrementNumOfActions,
  findById,
  resetActionsForNewDay,
};
