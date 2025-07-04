const axios = require("axios");
const usersService = require("../services/usersService");
const employeesService = require("../services/employeesService");
const departmentsService = require("../services/departmentsService");
const shiftsService = require("../services/shiftsService");

const cleanUsername = (username) => username.replace(/[^a-z0-9_]/gi, "_");
const cleanFullName = (fullName) =>
  fullName
    .replace(/[_\.]/g, " ")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim();

const DEPARTMENTS = [
  "Product",
  "Engineering",
  "HR",
  "Finance",
  "Logistics",
  "QA",
  "Sales",
];
const SHIFTS_PER_DEPARTMENT = 1;

async function bootstrapUsers() {
  try {
    // 1. Create Departments (manager: null)
    let createdDepartments = [];
    for (const deptName of DEPARTMENTS) {
      let dept = await departmentsService.findByName(deptName);
      if (!dept) {
        dept = await departmentsService.addDepartment({
          name: deptName,
          manager: null,
        });
        console.log(`✅ Created department: ${deptName} (_id: ${dept._id})`);
      } else {
        console.log(`⏭️ Department exists: ${deptName} (_id: ${dept._id})`);
      }
      createdDepartments.push(dept);
    }

    // 2. Create Users & Employees (only if not exists)
    const res = await axios.get("https://jsonplaceholder.typicode.com/users");
    const users = res.data;

    let employeesCreated = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const cleanedUsername = cleanUsername(user.username);
      const cleanedFullName = cleanFullName(user.name);

      // USERS
      let appUser = await usersService.findByUsername(cleanedUsername);
      if (!appUser) {
        appUser = await usersService.addUser({
          username: cleanedUsername,
          password: user.email,
          fullName: cleanedFullName,
          maxActionsPerDay: 10,
        });
        console.log(`✅ Registered user: ${user.username} _id: ${appUser._id}`);
      } else {
        console.log(`⏭️ User exists: ${user.username} _id: ${appUser._id}`);
      }

      // EMPLOYEES (assign a department using round robin, but only once)
      let firstName = cleanedFullName.split(" ")[0];
      let lastName = cleanedFullName.split(" ").slice(1).join(" ");
      let emp = await employeesService.findByFirstAndLastName(
        firstName,
        lastName
      );
      if (!emp) {
        // Assign department in round robin, but check how many employees per department already
        let dept = null;
        // Assign to department with fewest employees
        let minCount = Infinity;
        for (const d of createdDepartments) {
          const count = employeesCreated.filter(
            (e) => e.department && String(e.department) === String(d._id)
          ).length;
          if (count < minCount) {
            dept = d;
            minCount = count;
          }
        }
        emp = await employeesService.addEmployee({
          firstName: cleanedFullName.split(" ")[0],
          lastName: cleanedFullName.split(" ").slice(1).join(" ") || "Smith",
          user: appUser._id,
          startWorkYear:
            2019 + (parseInt(String(appUser._id).toString().slice(-1), 16) % 5),
          department: dept._id,
        });
        console.log(
          `✅ Created employee: ${emp.firstName} ${emp.lastName}, _id: ${emp._id}, user: ${appUser._id}, dept: ${dept.name} (${dept._id})`
        );
        employeesCreated.push(emp);
      } else {
        console.log(
          `⏭️ Employee exists for user: ${user.username}, _id: ${emp._id}, user: ${appUser._id}, dept: ${emp.department}`
        );
        // Ensure employeesCreated contains all employees (existing and new)
        employeesCreated.push(emp);
      }
    }

    // 3. Assign Managers to Departments (first employee in dept, deterministic)
    for (const dept of createdDepartments) {
      // All employees in this department
      const deptEmployees = employeesCreated.filter(
        (e) => e.department && String(e.department) === String(dept._id)
      );
      if (!deptEmployees.length) continue;
      const manager = deptEmployees[0];
      await departmentsService.updateDepartment(dept._id, {
        name: dept.name,
        manager: manager._id,
      });
      console.log(
        `✅ Set manager ${manager.firstName} (_id: ${manager._id}) for department ${dept.name} (_id: ${dept._id})`
      );
    }

    // 4. Shifts (CREATE ONLY if enough employees for a shift!)
    // Use the database so it works for rerun and skip duplicate shifts
    const employeesFresh = await employeesService.getAllEmployees();
    const today = new Date();
    for (let d = 0; d < createdDepartments.length; d++) {
      const dept = createdDepartments[d];
      for (let s = 0; s < SHIFTS_PER_DEPARTMENT; s++) {
        const shiftDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + d + s
        );
        const dateStr = shiftDate.toISOString().split("T")[0];
        const startingHour = 8 + s * 3;
        const endingHour = startingHour + 2;

        if (!dept || !dept._id) {
          console.error(`[SHIFTS] Department object:`, dept);
          throw new Error(`Invalid department for shift: ${dept}`);
        }

        // employees for this department
        const deptEmployees = employeesFresh.filter(
          (e) => e.department && String(e.department.name) === String(dept.name)
        );
        const assignedEmployees = deptEmployees.slice(0, 2).map((e) => e._id);
        console.log(assignedEmployees);

        if (assignedEmployees.length < 1) {
          console.warn(
            `⚠️ Not enough employees for department ${dept.name} (${dept._id}). Skipping shift on ${dateStr} ${startingHour}:00`
          );
          continue;
        }

        let shift = await shiftsService.findByDetails(
          dateStr,
          startingHour,
          endingHour
        );
        if (!shift) {
          shift = await shiftsService.addShift({
            date: dateStr,
            startingHour,
            endingHour,
            employees: [],
            department: dept._id,
          });
          for (const empId of assignedEmployees) {
            await employeesService.assignShiftToEmployee(empId, shift._id);
          }
          console.log(
            `✅ Created shift for ${dept.name} (${
              dept._id
            }) on ${dateStr} ${startingHour}:00–${endingHour}:00 with employees: ${assignedEmployees.join(
              ", "
            )}`
          );
        } else {
          console.log(
            `⏭️ Shift exists for ${dept.name} (${dept._id}) on ${dateStr} ${startingHour}:00`
          );
        }
      }
    }

    // 5. Finalize: Rest actions for all users if new day
    const CheckActionsUsers = await usersService.getAllUsers();
    for (const user of CheckActionsUsers) {
      await usersService.resetActionsIfNewDay(user._id);
      console.log(
        `✅ Reset actions for user ${user.username} (${user._id}) if new day`
      );
    }

    console.log("🎉 All bootstrapping complete!");
  } catch (error) {
    console.error(
      "❌ Bootstrap failed:",
      (error && error.stack) || error.message
    );
  }
}

module.exports = bootstrapUsers;
