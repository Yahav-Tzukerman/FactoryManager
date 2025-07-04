const jwt = require("jsonwebtoken");
const usersService = require("../services/usersService");
const loggingService = require("../services/loggingService");
const config = require("../configs/config");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json("No token provided.");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;

    await usersService.resetActionsIfNewDay(decoded.id);

    const user = await usersService.findById(decoded.id);
    const today = new Date().toLocaleDateString("en-GB");

    // LOG THE ACTION (before blocking user)
    await loggingService.logAction({
      userId: user._id,
      action: req.originalUrl,
      method: req.method,
      maxActions: user.maxActionsPerDay,
      numOfActions: user.numOfActions,
      date: today,
      success: user.numOfActions > 0,
    });

    if (user.numOfActions <= 0) {
      return res.status(403).json("Action limit reached. Come back tomorrow.");
    }

    if (
      ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
      !req.originalUrl.includes("/users")
    ) {
      await usersService.decrementAction(decoded.id);
    }

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json("Unauthorized.");
  }
};

module.exports = verifyToken;
