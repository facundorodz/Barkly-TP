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
        const res = await fetch(API_URL);
        const cuidadores = await res.json();
        const contenedor = document.getElementById("catalogo");
        contenedor.innerHTML = "";

        cuidadores.forEach(c => {
            contenedor.innerHTML += `
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
                        <a href="prueba_crud.html?id=${c.id}"
                            class="btn btn-danger mt-2">
                                Ver paquetes
                        </a>
                    </div>
                `;
            });
    } catch (error) {
        console.error("Error cargando catálogo:", error);
    }
}
cargarCatalogo();

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resp = await fetch("/users/session_info");
        const data = await resp.json();
        const authContainer = document.getElementById("auth-buttons");
        
        if (!authContainer){
            return;
        } 

        if (data.logged) {
            authContainer.innerHTML = 
            `
                <a role="button" class="btn btn-danger" href="/perfiles/perfil_usuario.html">
                    Ver perfil
                </a>
            `;
        }
    } catch (error) {
        console.error("Error al obtener session_info:", error);
    }
});

