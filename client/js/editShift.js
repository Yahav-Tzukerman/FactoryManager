// Client/js/editShift.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";

  const urlParams = new URLSearchParams(window.location.search);
  const shiftId = urlParams.get("id");
  if (!shiftId) return alert("Missing shift ID");

  document.getElementById("shiftId").value = shiftId;

  await loadShiftData(shiftId);
  await loadEmployees(shiftId);

  document
    .getElementById("editShiftForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await updateShift(shiftId);
    });

  document
    .getElementById("assignEmployeeBtn")
    .addEventListener("click", async () => {
      await assignEmployeeToShift(shiftId);
    });
});

// Load the shift details and assigned employees table
async function loadShiftData(shiftId) {
  const shift = await apiRequest(`/shifts/${shiftId}`);

  document.getElementById("shiftDate").value = shift.date
    ? new Date(shift.date).toISOString().slice(0, 10)
    : "";
  document.getElementById("startingHour").value = shift.startingHour ?? "";
  document.getElementById("endingHour").value = shift.endingHour ?? "";

  renderAssignedEmployees(shift.employees || []);
}

async function loadEmployees(shiftId) {
  const employees = await apiRequest("/employees");
  const shift = await apiRequest(`/shifts/${shiftId}`);

  const assignedIds = (shift.employees || []).map((e) =>
    typeof e === "string" ? e : e._id
  );
  const select = document.getElementById("employeeSelect");
  select.innerHTML = "";

  employees
    .filter((emp) => !assignedIds.includes(emp._id))
    .forEach((emp) => {
      const opt = document.createElement("option");
      opt.value = emp._id;
      opt.textContent = `${emp.firstName} ${emp.lastName}`;
      select.appendChild(opt);
    });

  renderAssignedEmployees(shift.employees || []);
}

function renderAssignedEmployees(employees) {
  const tbody = document.querySelector("#assignedEmployeesTable tbody");
  tbody.innerHTML = "";
  employees.forEach((emp) => {
    const id = emp._id || emp;
    const name = emp.firstName ? `${emp.firstName} ${emp.lastName}` : id;
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><a href="editEmployee.html?id=${id}">${name}</a></td>
      <td><button data-empid="${id}" class="remove-emp-btn">Remove</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Attach remove event
  document.querySelectorAll(".remove-emp-btn").forEach((btn) => {
    btn.onclick = async function () {
      const empId = this.getAttribute("data-empid");
      await removeEmployeeFromShift(empId);
    };
  });
}

// Update shift details
async function updateShift(shiftId) {
  const payload = {
    date: document.getElementById("shiftDate").value,
    startingHour: +document.getElementById("startingHour").value,
    endingHour: +document.getElementById("endingHour").value,
  };

  await apiRequest(`/shifts/${shiftId}`, {
    method: "PATCH",
    body: payload,
  });

  alert("Shift updated");
  window.location.href = "shifts.html";
}

// Assign an employee to this shift
async function assignEmployeeToShift(shiftId) {
  const empId = document.getElementById("employeeSelect").value;
  if (!empId) return alert("Choose an employee");

  await apiRequest(`/shifts/${shiftId}/assign-employee`, {
    method: "PATCH",
    body: { empId },
  });

  alert("Employee assigned to shift.");
  await loadEmployees(shiftId);
  await loadShiftData(shiftId);
}

// Remove an employee from this shift
async function removeEmployeeFromShift(empId) {
  const urlParams = new URLSearchParams(window.location.search);
  const shiftId = urlParams.get("id");
  if (!shiftId) return;

  await apiRequest(`/shifts/${shiftId}/remove-employee`, {
    method: "PATCH",
    body: { empId },
  });

  alert("Employee removed from shift.");
  await loadEmployees(shiftId);
  await loadShiftData(shiftId);
}
