// Client/js/shifts.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";
  await loadShifts();
});

async function loadShifts() {
  try {
    // Parallel requests for shifts and employees
    const [shifts, employees] = await Promise.all([
      apiRequest("/shifts"),
      apiRequest("/employees"),
    ]);

    // Create map: employeeId => "First Last"
    const empMap = {};
    for (const emp of employees) {
      empMap[emp._id] = `${emp.firstName} ${emp.lastName}`;
    }

    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));

    const tbody = document.querySelector("#shiftsTable tbody");
    tbody.innerHTML = "";

    shifts.forEach((shift) => {
      // Format shift employees as links
      const employeeLinks = (shift.employees || [])
        .map(
          (emp) =>
            `<a href="editEmployee.html?id=${emp._id || emp}">${
              empMap[emp._id || emp] || "Unknown"
            }</a>`
        )
        .join(", ");

      // Format time
      const time =
        shift.startingHour !== undefined && shift.endingHour !== undefined
          ? `${shift.startingHour}:00 - ${shift.endingHour}:00`
          : "N/A";

      // Format date
      const date = shift.date
        ? new Date(shift.date).toLocaleDateString("en-GB")
        : "N/A";

      tbody.innerHTML += `
        <tr>
          <td>${date}</td>
          <td>${time}</td>
          <td><a href="editShift.html?id=${shift._id}"><button>Edit Shift</button></a></td>
          <td>${employeeLinks}</td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Failed to load shifts:", err);
  }
}
