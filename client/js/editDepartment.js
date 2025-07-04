// Client/js/editDepartment.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";

  const urlParams = new URLSearchParams(window.location.search);
  const deptId = urlParams.get("id");
  if (!deptId) return alert("Missing department ID");

  document.getElementById("departmentId").value = deptId;

  await loadDepartmentData(deptId);
  await loadManagers(deptId);
  await loadAvailableEmployees(deptId);

  document
    .getElementById("editDepartmentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await updateDepartment(deptId);
    });

  document.getElementById("deleteBtn").addEventListener("click", async () => {
    await deleteDepartment(deptId);
  });

  document
    .getElementById("assignEmployeeBtn")
    .addEventListener("click", async () => {
      await assignEmployeeToDepartment(deptId);
    });
});

async function loadDepartmentData(deptId) {
  const dept = await apiRequest(`/departments/${deptId}`);
  document.getElementById("deptName").value = dept?.name;
  if (dept.manager) {
    document
      .getElementById("managerSelect")
      .setAttribute("data-managerid", dept.manager._id || dept.manager);
  }
}

async function loadManagers(deptId) {
  const employees = await apiRequest("/employees");
  const select = document.getElementById("managerSelect");
  select.innerHTML = "";
  const selectedId = select.getAttribute("data-managerid");

  employees.forEach((emp) => {
    const opt = document.createElement("option");
    opt.value = emp._id;
    opt.textContent = `${emp.firstName} ${emp.lastName}`;
    if (emp._id === selectedId) opt.selected = true;
    select.appendChild(opt);
  });
}

async function loadAvailableEmployees(deptId) {
  const employees = await apiRequest("/employees");
  const select = document.getElementById("employeeSelect");
  select.innerHTML = "";

  employees
    .filter(
      (emp) =>
        !emp.department || (emp.department._id || emp.department) !== deptId
    )
    .forEach((emp) => {
      const opt = document.createElement("option");
      opt.value = emp._id;
      opt.textContent = `${emp.firstName} ${emp.lastName}`;
      select.appendChild(opt);
    });
}

async function updateDepartment(deptId) {
  const name = document.getElementById("deptName").value;
  const manager = document.getElementById("managerSelect").value;

  await apiRequest(`/departments/${deptId}`, {
    method: "PATCH",
    body: { name, manager },
  });

  alert("Department updated.");
  window.location.href = "departments.html";
}

async function deleteDepartment(deptId) {
  if (!confirm("Are you sure you want to delete this department?")) return;

  await apiRequest(`/departments/${deptId}`, { method: "DELETE" });

  alert("Department deleted.");
  window.location.href = "departments.html";
}

async function assignEmployeeToDepartment(deptId) {
  const empId = document.getElementById("employeeSelect").value;
  if (!empId) return alert("Choose an employee");

  await apiRequest(`/employees/${empId}/assignDepartment`, {
    method: "PATCH",
    body: { department: deptId },
  });

  alert("Employee assigned to department.");
  await loadAvailableEmployees(deptId);
}
