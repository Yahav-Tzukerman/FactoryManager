// services/loggingService.js
const loggingRepository = require("../repositories/loggingRepository");

const logAction = async ({
  userId,
  action,
  method,
  success = true,
  maxActions,
  numOfActions,
  date,
}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action,
    method,
    success,
    maxActions,
    numOfActions,
    date,
  };
  await loggingRepository.writeLog(logEntry);
};

module.exports = { logAction };
