document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
      // Validate against jsonplaceholder API (as before)
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users?username=${username}`
      );
      const users = await response.json();
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        errorMessage.textContent = "Invalid username or email.";
        return;
      }

      // Login to backend using apiRequest with _skipDecrement
      let result;
      try {
        result = await apiRequest("/users/login", {
          method: "POST",
          body: { username, password: email },
          _skipDecrement: true,
          _skipValidation: true,
        });
      } catch (err) {
        errorMessage.textContent = (err && err.message) || "Login failed.";
        return;
      }

      if (result?.numOfActions === 0) {
        errorMessage.textContent =
          "No more actions available for this user today.";
        localStorage.removeItem("user");
        return;
      }

      // Login success
      localStorage.setItem("user", JSON.stringify(result));
      window.location.href = "employees.html";
    } catch (err) {
      console.error(err);
      errorMessage.textContent = "Login error. Please try again.";
    }
  });
