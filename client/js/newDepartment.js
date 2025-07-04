// Client/js/newDepartment.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";

  await loadManagers();

  document
    .getElementById("newDepartmentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await createDepartment();
    });

  document.getElementById("cancelBtn").addEventListener("click", () => {
    window.location.href = "departments.html";
  });
});

async function loadManagers() {
  const employees = await apiRequest("/employees");
  const select = document.getElementById("managerSelect");
  select.innerHTML = `<option value="">-- No Manager --</option>`;
  employees.forEach((emp) => {
    const opt = document.createElement("option");
    opt.value = emp._id;
    opt.textContent = `${emp.firstName} ${emp.lastName}`;
    select.appendChild(opt);
  });
}

async function createDepartment() {
  const payload = {
    name: document.getElementById("deptName").value,
    manager: document.getElementById("managerSelect").value || null,
  };

  await apiRequest("/departments", {
    method: "POST",
    body: payload,
  });

  alert("Department created successfully");
  window.location.href = "departments.html";
}
