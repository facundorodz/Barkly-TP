const API_URL = "http://localhost:3000/cuidadores";

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
async function cargarCatalogo() {
    try {
        const res = await fetch(API);
        const cuidadores = await res.json();
        const contenedor = document.getElementById("catalogo");
        contenedor.innerHTML = "";

        cuidadores.forEach(c => {
            contenedor.innerHTML += `
                <div class="col-md-4">
                    <div class="cuidador_perfil">
                        <img src="${c.foto_perfil || 'https://via.placeholder.com/150'}"
                            class="foto-perfil" alt="Foto de ${c.nombre}">
                        <h4 class="card-title">${c.nombre}</h4>
                        <strong>Franquicia:</strong> ${c.franquicia} <br>
                        <strong>Poderes:</strong>
                        <ul style="text-align: left; margin: 0 auto; width: fit-content;">
                            ${c.poderes
                            .split(',')
                            .map(p => `<li>${p.trim()}</li>`)
                            .join('')
                            }
                        </ul>
                        <a href="prueba_crud.html?id=${c.id}"
                            class="btn btn-primary mt-2">
                                Ver Perfil
                        </a>
                    </div>
                `;
            });

        } catch (error) {
            console.error("Error cargando catálogo:", error);
        }
    }
    cargarCatalogo();
