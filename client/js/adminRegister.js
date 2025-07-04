// js/adminRegister.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminRegisterForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const userName = document.getElementById("userName").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ fullName, userName, password, isAdmin: true }),
      });

      if (res.status === 201) {
        alert("Admin user created successfully.");
        window.location.href = "users.html";
      } else {
        const data = await res.json();
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error registering admin:", err);
      alert("Network error");
    }
  });
});
