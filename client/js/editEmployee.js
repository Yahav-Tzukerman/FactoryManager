// Client/js/editEmployee.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";

  const urlParams = new URLSearchParams(window.location.search);
  const employeeId = urlParams.get("id");
  if (!employeeId) return alert("Missing employee ID");

  document.getElementById("employeeId").value = employeeId;

  await loadDepartments();
  await loadEmployeeData(employeeId);
  await loadAllShifts();

  document
    .getElementById("editEmployeeForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await updateEmployee();
    });
});

async function loadDepartments() {
  const departments = await apiRequest("/departments");
  const select = document.getElementById("departmentSelect");
  select.innerHTML = ""; // Clear before appending
  departments.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d._id;
    opt.textContent = d.name;
    select.appendChild(opt);
  });
}

async function loadEmployeeData(id) {
  const emp = await apiRequest(`/employees/${id}`);

  document.getElementById("firstName").value = emp.firstName;
  document.getElementById("lastName").value = emp.lastName;
  document.getElementById("startWorkYear").value = emp.startWorkYear;
  document.getElementById("departmentSelect").value = emp.department?._id || "";

  const tbody = document.getElementById("shiftsTable").querySelector("tbody");
  tbody.innerHTML = "";
  const formattedShifts = formatShiftsDates(emp.shifts || []);

  formattedShifts.sort((a, b) => new Date(a.date) - new Date(b.date));

  formattedShifts.forEach((s) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${s.date}</td><td>${s.startingHour}</td><td>${s.endingHour}</td>`;
    tbody.appendChild(tr);
  });
}

async function updateEmployee() {
  const id = document.getElementById("employeeId").value;
  const payload = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    startWorkYear: +document.getElementById("startWorkYear").value,
    department: document.getElementById("departmentSelect").value,
  };

  try {
    await apiRequest(`/employees/${id}`, {
      method: "PATCH",
      body: payload,
    });
    alert("Employee updated");
    window.location.href = "employees.html";
  } catch (err) {
    alert("Failed to update employee");
  }
}

async function deleteEmployee() {
  const id = document.getElementById("employeeId").value;

  if (!confirm("Are you sure you want to delete this employee?")) return;

  try {
    await apiRequest(`/employees/${id}`, { method: "DELETE" });
    alert("Employee deleted");
    window.location.href = "employees.html";
  } catch (err) {
    alert("Failed to delete employee");
  }
}

async function loadAllShifts() {
  const shifts = await apiRequest("/shifts");
  const select = document.getElementById("shiftSelect");
  select.innerHTML = "";

  const now = new Date();
  const futureShifts = shifts
    .filter((s) => new Date(s.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  futureShifts.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s._id;
    const dateObj = new Date(s.date);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    opt.textContent = `${formattedDate} (${s.startingHour}-${s.endingHour})`;
    select.appendChild(opt);
  });
}

async function assignShift() {
  const employeeId = document.getElementById("employeeId").value;
  const shiftId = document.getElementById("shiftSelect").value;

  if (!shiftId) {
    alert("Please select a shift.");
    return;
  }

  try {
    await apiRequest(`/employees/${employeeId}/assign-shift`, {
      method: "PATCH",
      body: { shiftId },
    });
    alert("Shift assigned");
    window.location.reload();
  } catch (err) {
    alert("Failed to assign shift");
  }
}
