// Client/js/departments.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";
  await loadDepartments();
});

async function loadDepartments() {
  try {
    const [departments, employees] = await Promise.all([
      apiRequest("/departments"),
      apiRequest("/employees"),
    ]);

    const tbody = document
      .getElementById("departmentsTable")
      .querySelector("tbody");
    tbody.innerHTML = "";

    departments.forEach((dep) => {
      const depLink = `<a href="editDepartment.html?id=${dep._id}">${dep.name}</a>`;
      const manager = dep.manager;
      const managerName = manager
        ? `${manager.firstName} ${manager.lastName}`
        : "-";

      const employeeList = employees
        .filter((e) => e.department?._id === dep._id)
        .map(
          (e) =>
            `<a href="editEmployee.html?id=${e._id}">${e.firstName} ${e.lastName}</a>`
        );

      const employeesHtml = employeeList.length
        ? employeeList.join(", ")
        : '<span class="text-muted">No Employees</span>';

      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${depLink}</td><td>${managerName}</td><td>${employeesHtml}</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Failed to load departments:", err);
    alert("Failed to load departments");
  }
}
