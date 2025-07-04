const express = require("express");
const cors = require("cors");
const connectDB = require("./configs/db");
const verifyToken = require("./middleware/authMiddleware");
const errorHandler = require("./middleware/errorHandler");
const departmentsRouter = require("./controllers/departmentsController");
const employeesRouter = require("./controllers/employeesController");
const shiftsRouter = require("./controllers/shiftsController");
const usersRouter = require("./controllers/usersController");
const config = require("./configs/config");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const compression = require("compression");
const AppError = require("./exceptions/AppError");
const setupSwagger = require("./configs/swagger");
const bootstrapUsers = require("./utils/bootstrapUsers");

const app = express();
const PORT = config.port || 5000;
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "logs", "server.log"),
  { flags: "a" }
);

connectDB().then(bootstrapUsers());
setupSwagger(app);

app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://jsonplaceholder.typicode.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'self'", "'unsafe-inline'"],
      },
    },
  })
);
app.use(compression());

// Public routes
app.use(express.static("client"));
app.get("/", (req, res) => res.send("Welcome to Factory Manager API"));
app.use("/users", usersRouter);

// Protected routes
app.use("/departments", verifyToken, departmentsRouter);
app.use("/employees", verifyToken, employeesRouter);
app.use("/shifts", verifyToken, shiftsRouter);

// 404 fallback
app.use((req, res, next) => {
  next(new AppError("Route not found", 404));
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  if (config.env === "development") {
    console.log(`app is listening at http://localhost:${PORT}`);
    console.log("Running in DEVELOPMENT mode");
  } else {
    console.log(`app is listening at https://factorymanager-6t60.onrender.com`);
    console.log("Running in PRODUCTION mode");
  }
});
