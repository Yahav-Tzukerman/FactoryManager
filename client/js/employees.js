// Client/js/employees.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const fullName = user?.fullName;
  document.getElementById("fullName").textContent = fullName || "Guest";

  await loadDepartments();
  await loadEmployees();

  document.getElementById("departmentFilter").addEventListener("change", () => {
    loadEmployees();
  });
});

async function loadDepartments() {
  try {
    const departments = await apiRequest("/departments");

    const select = document.getElementById("departmentFilter");
    departments.forEach((dep) => {
      const option = document.createElement("option");
      option.value = dep._id;
      option.textContent = dep.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load departments:", err);
  }
}

async function loadEmployees() {
  try {
    const filter = document.getElementById("departmentFilter").value;
    const employees = await apiRequest("/employees");

    const tbody = document
      .getElementById("employeesTable")
      .querySelector("tbody");
    tbody.innerHTML = "";

    const filtered = filter
      ? employees.filter((emp) => emp.department?._id === filter)
      : employees;

    for (const emp of filtered) {
      const tr = document.createElement("tr");

      const fullName = `${emp.firstName} ${emp.lastName}`;
      const nameLink = `<a href="editEmployee.html?id=${emp._id}">${fullName}</a>`;

      // If department is not set, show "No Department" instead of a link
      const depName = emp.department
        ? emp.department.name
        : "No Department Assigned";
      const depLink = emp.department
        ? `<a href="editDepartment.html?id=${emp.department?._id}">${depName}</a>`
        : `<span class="text-muted">${depName}</span>`;

      const formattedShifts = formatShiftsDates(emp.shifts || []);

      formattedShifts.sort((a, b) => {
        if (a.date && b.date) {
          return new Date(a.date) - new Date(b.date);
        }
        return 0;
      });

      const shiftsList = formattedShifts
        .map((s) =>
          s.date ? `${s.date} (${s.startingHour}:00–${s.endingHour}:00)` : "–"
        )
        .join("<br>");

      tr.innerHTML = `<td>${nameLink}</td><td>${depLink}</td><td>${shiftsList}</td>`;
      tbody.appendChild(tr);
    }
  } catch (err) {
    console.error("Failed to load employees:", err);
  }
}
