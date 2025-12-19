const API_URL = "http://localhost:3000/cuidadores";

document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("ver-mas-boton");
    const conteiner = document.getElementById("mas-cuidadores");

    fetch("/cuidadores").then(res => res.json()).then(cuidadores => {
        const catalogo = document.getElementById("catalogo");
        catalogo.innerHTML = "";

        try {
            cuidadores.forEach(c => {
                catalogo.innerHTML += `
                    <div class="col-md-4">
                        <div class="cuidador_perfil">
                            <img src="${c.foto_perfil  || 'https://via.placeholder.com/150'}"
                                class="polaroid" width="400" height="400" alt="Foto de ${c.nombre}">
                            <h3 class="card-title">${c.nombre}</h3>
                            ${c.franquicia} <br>
                            <hr>
                            <ul style="text-align: left; margin: 0 auto; width: fit-content;">
                                ${c.poderes.split(',').map(p =>
                                `<li>${p.trim()}</li>`).join('')}
                            </ul>
                            <hr>
                            <a onclick="verDetalle(${c.id})"
                                class="btn btn-danger mt-2">
                                    Ver cuidador
                            </a>
                        </div>
                    </div>
                `;
            });
        } catch (error) {
            console.error("Error cargando catálogo:", error);
        }
    })
    .catch(err => console.error("Error cargando cuidadores:", err));




    if (!boton) {
        console.error("No se encontró el elemento #ver-mas-boton");
        return;
    }

    if (!conteiner) {
        console.error("No se encontró el elemento #mas-cuidadores");
        return;
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault(); 

        const isHidden =
            conteiner.style.display === "none" ||
            conteiner.style.display === "";

        conteiner.style.display = isHidden ? "block" : "none";
        boton.textContent = isHidden ? "Ver menos" : "Ver más";
    });
});

function verDetalle(id) {
  if (!id) {
    console.error("ID inválido:", id);
    return;
  }

  window.location.href = `/pagina_detalles-cuidador/prueba_detalle-cuidador.html?id=${id}`;
}