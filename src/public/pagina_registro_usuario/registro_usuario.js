

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    name: document.getElementById("nombre").value,
    profile_name: document.getElementById("perfil").value,
    pass: document.getElementById("password").value,
    profile_photo: document.getElementById("profile_photo").value
};


  try {
    const resp = await fetch("http://localhost:8080/api/users/register_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(body)
    });

    const data = await resp.json();

    if (data.success) {
      alert("Registro exitoso");
      window.location.href = "/index.html";
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Error al conectar con el servidor");
  }
});
