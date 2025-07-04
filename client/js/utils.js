// ----- Configurable Environment -----
const API_CONFIG = {
  protocol: "https", // or "https"
  host: "factorymanager-6t60.onrender.com",
  basePath: "", // e.g. "/api" if all routes are prefixed
};

function getApiBaseUrl() {
  return `${API_CONFIG.protocol}://${API_CONFIG.host}${API_CONFIG.basePath}`;
}

async function apiRequest(path, options = {}) {
  let user = JSON.parse(localStorage.getItem("user"));

  if ((!user || !user.token) && !options._skipValidation) {
    logout();
    throw new Error("Not logged in");
  }

  if (
    user &&
    typeof user.numOfActions === "number" &&
    user.numOfActions <= 0 &&
    !options._skipValidation
  ) {
    alert("No more actions available for today. Please try again tomorrow.");
    logout();
    throw new Error("No actions available");
  }

  options.headers = options.headers || {};
  if (user && user.token) {
    options.headers["Authorization"] = `Bearer ${user.token}`;
  }

  if (options.body && typeof options.body === "object") {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(options.body);
  }

  const url = path.startsWith("http")
    ? path
    : `${getApiBaseUrl()}${path.startsWith("/") ? path : "/" + path}`;

  const res = await fetch(url, options);

  if ((res.status === 401 || res.status === 403) && !options._skipValidation) {
    alert("Session expired or unauthorized. Please log in again.");
    logout();
    throw new Error("Session expired");
  }

  if (user && !options._skipDecrement && !options._skipValidation) {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    let numOfActions =
      currentUser.numOfActions && typeof currentUser.numOfActions === "number"
        ? currentUser.numOfActions - 1
        : 0;
    localStorage.setItem(
      "user",
      JSON.stringify({ ...currentUser, numOfActions })
    );
  }

  let data = null;
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    if (data?.message) alert("Error: " + data.message);
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }

  return data;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

function formatShiftsDates(shifts) {
  return shifts.map((shift) => ({
    ...shift,
    date: formatShiftDate(shift.date),
  }));
}

function formatShiftDate(dateStr) {
  const dateObj = new Date(dateStr);
  return dateObj.toLocaleDateString("en-GB"); // "dd/mm/yyyy"
}
