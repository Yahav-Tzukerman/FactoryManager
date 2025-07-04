// Client/js/newEmployee.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";

  await loadDepartments();

  document
    .getElementById("newEmployeeForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await createEmployee();
    });
});

async function loadDepartments() {
  const departments = await apiRequest("/departments");
  const select = document.getElementById("departmentSelect");
  select.innerHTML = "";
  departments.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d._id;
    opt.textContent = d.name;
    select.appendChild(opt);
  });
}

async function createEmployee() {
  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    startWorkYear: +document.getElementById("startWorkYear").value,
    department: document.getElementById("departmentSelect").value,
    shifts: [],
  };

  try {
    await apiRequest("/employees", {
      method: "POST",
      body: payload,
    });
    alert("Employee created successfully");
    window.location.href = "employees.html";
  } catch (err) {
    alert("Failed to create employee");
  }
}
