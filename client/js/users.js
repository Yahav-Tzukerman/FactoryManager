// Client/js/users.js

document.addEventListener("DOMContentLoaded", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  document.getElementById("fullName").textContent = user?.fullName || "Guest";
  if (!user?.token) return logout();

  await loadUsers();
});

async function loadUsers() {
  try {
    const users = await apiRequest("/users", {
      _skipDecrement: true,
    });

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");
      // Username
      tr.innerHTML += `<td>${user.username || user.userName || ""}</td>`;
      // Full name
      tr.innerHTML += `<td>${user.fullName || ""}</td>`;
      // Created At (if you want it, otherwise remove)
      // tr.innerHTML += `<td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "-"}</td>`;
      // Max actions allowed
      tr.innerHTML += `<td style="text-align: center;">${
        user.maxActionsPerDay ?? "-"
      }</td>`;
      // Current actions left (today)
      tr.innerHTML += `<td style="text-align: center;">${
        user.numOfActions ?? "-"
      }</td>`;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Error loading users");
    console.error(err);
  }
}
