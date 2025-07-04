require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  dbUri: process.env.DB_URI || "mongodb://localhost:27017/FactoryManagerDB",
  env: process.env.NODE_ENV || "development",
};
