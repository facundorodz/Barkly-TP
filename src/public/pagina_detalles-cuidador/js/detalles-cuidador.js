// Obtener ID desde la URL
const params = new URLSearchParams(window.location.search);
const cuidadorId = params.get("id");

if (!cuidadorId) {
  alert("Cuidador no encontrado");
  window.location.href = "/index.html";
}

// Llamar al backend
fetch(`/heros/${cuidadorId}`)
  .then(res => res.json())
  .then(cuidador => {
    document.getElementById("foto").src = cuidador.foto_perfil;
    document.getElementById("nombre").textContent = cuidador.nombre;
    document.getElementById("franquicia").textContent = cuidador.franquicia;
    document.getElementById("experiencia").textContent = cuidador.experiencia;

    // Poderes como lista
    const lista = document.getElementById("lista-poderes");
    lista.innerHTML = "";

    cuidador.poderes.split(",").forEach(poder => {
      const li = document.createElement("li");
      li.textContent = poder.trim();
      lista.appendChild(li);
    });
  })
  .catch(() => {
    alert("Error al cargar el cuidador");
    window.location.href = "/index.html";
  });