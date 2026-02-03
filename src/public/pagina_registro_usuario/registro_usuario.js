

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fotoInput = document.getElementById("profile_photo");
  if (!fotoInput.files.length) {
    alert("Debes subir una foto");
    return;
  }

  const formData = new FormData();
  formData.append("name", document.getElementById("nombre").value);
  formData.append("profile_name", document.getElementById("perfil").value);
  formData.append("pass", document.getElementById("password").value);
  formData.append("profile_photo", fotoInput.files[0]);

  try {
    const resp = await fetch("http://localhost:8080/api/users/register_user", {
      method: "POST",
      credentials: "include",
      body: formData
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
