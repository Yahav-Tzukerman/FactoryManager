// repositories/loggingRepository.js
const jsonfile = require("jsonfile");
const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "logs", "actions.json");

const ensureLogFileExists = () => {
  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(
      logFile,
      JSON.stringify({ actions: [] }, null, 2),
      "utf-8"
    );
  }
};

const readLogs = async () => {
  ensureLogFileExists();
  try {
    const content = await jsonfile.readFile(logFile);
    if (typeof content !== "object" || !Array.isArray(content.actions)) {
      return { actions: [] };
    }
    return content;
  } catch (err) {
    console.error("❌ Failed to read/parse actions.json:", err.message);
    return { actions: [] };
  }
};

const writeLog = async (entry) => {
  const logs = await readLogs();
  logs.actions.push(entry); // *** ALWAYS append ***
  await jsonfile.writeFile(logFile, logs, { spaces: 2 });
};

module.exports = { writeLog };
