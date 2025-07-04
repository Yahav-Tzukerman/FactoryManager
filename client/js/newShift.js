// Client/js/newShift.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";
  if (!user?.token) return logout();

  document
    .getElementById("newShiftForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await createShift();
    });

  const cancelBtn = document.getElementById("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "shifts.html";
    });
  }
});

async function createShift() {
  const payload = {
    date: document.getElementById("date").value,
    startingHour: +document.getElementById("startingHour").value,
    endingHour: +document.getElementById("endingHour").value,
    employees: [],
  };

  await apiRequest("/shifts", {
    method: "POST",
    body: payload,
  });

  alert("Shift created successfully!");
  window.location.href = "shifts.html";
}
