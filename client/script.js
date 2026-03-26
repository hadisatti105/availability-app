const form = document.getElementById("form");
const result = document.getElementById("result");
const loading = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const phone = document.getElementById("phone").value.trim();
  const state = document.getElementById("state").value.trim().toUpperCase();
  const zip = document.getElementById("zip").value.trim();

  if (!/^\d{10}$/.test(phone)) {
    return alert("Phone must be 10 digits");
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    return alert("State must be 2 letters");
  }

  if (!/^\d{5}$/.test(zip)) {
    return alert("ZIP must be 5 digits");
  }

  loading.classList.remove("hidden");
  result.textContent = "";

  try {
    const response = await fetch(
      `https://availability-app-u85x.onrender.com/api/check?phone=${phone}&state=${state}&zip=${zip}`
    );

    const data = await response.json();

    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = "Error: " + error.message;
  } finally {
    loading.classList.add("hidden");
  }
});