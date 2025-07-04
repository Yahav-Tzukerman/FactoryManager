# 🚀 Factory Manager – Node.js + Express + MongoDB

## 🌍 Live Demo

🎉 Explore the live application 👉 [FactoryManager](https://factorymanager-6t60.onrender.com/login.html)

Swagger Docs: [View Swagger](https://factorymanager-6t60.onrender.com/api-docs)

This project is a fullstack Node.js application powered by Express for server-side logic and MongoDB for persistent database storage. It demonstrates robust backend development, dynamic environment handling, modern security practices, and a clean, modular structure.

---

## 📋 Table of Contents

- [🚀 Features](#-features)
- [⚙️ Installation](#️-installation)
- [▶️ Usage](#️-usage)
- [🌱 Environment Configuration](#-environment-configurations)
- [📖 API Documentation (Swagger)](#-api)
- [👤 Test Users](#-test-users)
- [🔍 Key Features](#-key-features)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

## 🚀 Features

Fullstack Node.js Express server with MongoDB database

Clean separation between API (backend) and front-end (HTML, JS, CSS in /client)

Dynamic Environment: Easily switch between development (localhost) and production (onrender.com)

JWT-based authentication and action tracking per user

REST API for Users, Employees, Departments, and Shifts

Swagger documentation out-of-the-box (/api-docs)

Robust error handling and logging

MIT license – open source!

## ⚙️ Installation

To install the project dependencies, run the following command:

1. Clone the repository:

   ```bash
   git clone https://github.com/Yahav-Tzukerman/Factory-Manager.git
   cd Factory-Manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your MongoDB connection:

- Create a .env file in the root directory.
- Add the following environment variables:

  ```bash
  MONGO_URI=your-mongodb-connection-string
  APP_ENV=development
  JWT_SECRET=your_jwt_secret
  PORT=3000
  ```

Adjust as needed for production.

Optional: Configure other settings in /configs/config.js as needed.

## ▶️ Usage

1. Start the server locally:

   ```bash
   npm start
   ```

Local app: [http://localhost:3000/login.html](http://localhost:3000/login.html)

Swagger docs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## 🌱 Environment Configuration

The app automatically selects API endpoints for local or production use based on the environment variable APP_ENV.

Development: Uses [http://localhost:3000](http://localhost:3000)

Production: Uses [https://factorymanager-6t60.onrender.com](https://factorymanager-6t60.onrender.com)

Update your .env file or environment variables to toggle between environments.

## 📖 API Documentation (Swagger)

Swagger UI is integrated and available at:

/api-docs (Production Swagger)

Explore and test all available API endpoints directly from your browser!

## 👤 Test Users

Default Users:

Users can be bootstrapped via the /users endpoint.

For demo/testing, use any user registered in your MongoDB database.

Users are bootstrapped from [jsonplaceholder](https://jsonplaceholder.typicode.com/users), use any user with username and email to login.
Each user have 50 actions per day.

## 🔍 Key Features

- Node.js + Express API: Modular, maintainable, and scalable codebase.

- MongoDB Database: For persistent storage of users, departments, employees, and shifts.

- JWT Authentication: Secure, stateless user authentication.

- Dynamic Frontend: All HTML, JS, and CSS files are served statically from the /client folder.

- Swagger: Built-in API documentation.

- Secure Headers: Using Helmet for best practices.

- CSP: Security policies configured for safe deployment.

- Action Limiting: Demo of user action quotas (for school requirements).

- Ready for Deployment: Runs on Render or any Node.js host with MongoDB.

## 🤝 Contributing

We welcome all contributions!
How to contribute:

1. Fork this repo.

2. Create a new branch:
   ```bash
   git checkout -b feature/my-feature
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add your message here"
   ```

4. Push to your fork:

   ```bash
   git push origin feature-name
   ```

5. Open a pull request on GitHub.

## 📜 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

Made with ❤️ for educational purposes.
