const AppError = require("../exceptions/AppError");

const isDateValid = (date) => !isNaN(new Date(date).getTime());

const isHourValid = (hour) =>
  typeof hour === "number" && hour >= 0 && hour <= 23;

const isEmployeeIdsArrayValid = (arr) =>
  Array.isArray(arr) && arr.every((id) => /^[a-fA-F0-9]{24}$/.test(id));

const isShiftValid = (shift) => {
  if (!isDateValid(shift.date)) throw new AppError("Invalid date", 400);
  if (!isHourValid(shift.startingHour))
    throw new AppError("Invalid starting hour", 400);
  if (!isHourValid(shift.endingHour))
    throw new AppError("Invalid ending hour", 400);
  if (shift.startingHour >= shift.endingHour)
    throw new AppError("Starting hour must be less than ending hour", 400);
};

module.exports = {
  isShiftValid,
  isDateValid,
  isHourValid,
  isEmployeeIdsArrayValid,
};
