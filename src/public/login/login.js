const API_URL = "https://barkly-tp-1.onrender.com";


document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    profile_name: document.getElementById("profile_name").value,
    pass: document.getElementById("pass").value,
    login_type: document.getElementById("loginElegir").value
  };

  try {
    const resp = await fetch(`${API_URL}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(datos)
    });

    const data = await resp.json();

    if (!data.success) {
      alert(data.error);
      return;
    }

    if (data.type === "user") {
      window.location.href = "/index.html";
    }

    if (data.type === "hero") {
      localStorage.setItem("id_cuidador", JSON.stringify(data.cuidador.id));
      window.location.href = "/perfiles/perfil_cuidador.html";
    }

  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor");
  }
});


