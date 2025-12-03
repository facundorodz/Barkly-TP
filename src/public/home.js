const API_URL = "http://localhost:3000/cuidadores";
//const CUIDADOR_ID = 2;

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("ver-mas-boton");
    const contenedor = document.getElementById("mas-cuidadores");

    if (!boton) {
        console.error("No se encontró el elemento #ver-mas-boton");
        return;
    }

    if (!contenedor) {
        console.error("No se encontró el elemento #mas-cuidadores");
        return;
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault(); 

        const isHidden =
            contenedor.style.display === "none" ||
            contenedor.style.display === "";

        contenedor.style.display = isHidden ? "block" : "none";
        boton.textContent = isHidden ? "Ver menos" : "Ver más";
    });
});

async function cargarSuperheroe() {
  try {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();

        // Encabezado
    document.getElementById("nombre_superheroe").textContent = data.nombre;
    document.getElementById("foto_perfil").src = data.foto_perfil;

        // Formulario

    document.getElementById("poderes").innerText = data.poderes;

  } catch (err) {
    console.error("Error cargando cuidador:", err);
  }
}
