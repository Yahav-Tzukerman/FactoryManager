const AppError = require("../exceptions/AppError");

const isUsernameValid = (username) => /^[a-zA-Z0-9_]{2,20}$/.test(username);

const isFullNameValid = (fullName) => /^[a-zA-Z\s]{2,50}$/.test(fullName);

const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

const isEmail = (password) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(password);

const isPasswordValid = (password) =>
  isStrongPassword(password) || isEmail(password);

const isNumOfActionsValid = (num) => typeof num === "number" && num >= 0;

const isUserValid = (user) => {
  if (!isUsernameValid(user.username))
    throw new AppError(
      "Invalid username (4-20 characters, letters/numbers/underscores only)",
      400
    );
  if (!isFullNameValid(user.fullName))
    throw new AppError("Invalid full name (letters and spaces only)", 400);
  if (!isPasswordValid(user.password))
    throw new AppError(
      "Password must include uppercase, lowercase and a number (min 6 chars), or be a valid email address",
      400
    );
  if (!isNumOfActionsValid(user.numOfActions))
    throw new AppError("Invalid number of actions", 400);
};

module.exports = {
  isUserValid,
  isUsernameValid,
  isFullNameValid,
  isPasswordValid,
  isNumOfActionsValid,
};
