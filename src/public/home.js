document.addEventListener("DOMContentLoaded"), () => {
    const boton = document.getElementById("ver-mas-boton");
    const conteiner = document.getElementById("mas-cuidadores");

    fetch("http://localhost:8080/api/cuidadores").then(res => res.json()).then(cuidadores => {
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
    if (!Array.isArray(lista) || lista.length === 0) {
      catalogo.innerHTML = `
        <div class="col-12">
          <p class="text-center text-muted">No se encontraron cuidadores.</p>
        </div>
      `;
      return;
    }

    lista.forEach((c) => {
      const poderes = String(c.poderes ?? "").split(",").map((p) => p.trim()).filter(Boolean);
      
      catalogo.innerHTML += `
        <div class="col-md-4">
          <div class="cuidador_perfil cuidador_item">
            <img
              src="${c.foto_perfil || "https://via.placeholder.com/150"}"
              class="polaroid"
              width="400"
              height="400"
              alt="Foto de ${c.nombre || "Cuidador"}"
            >
            <h3 class="card-title">${c.nombre || "Sin nombre"}</h3>
            ${c.franquicia || "—"} <br>
            <hr>
            <ul style="text-align: left; margin: 0 auto; width: fit-content;">
              ${
                poderes.length
                  ? poderes.map((p) => `<li>${p}</li>`).join("")
                  : "<li>—</li>"
              }
            </ul>
            <hr>
            <a onclick="verDetalle(${c.id})" class="btn btn-danger mt-2">
              Ver cuidador
            </a>
          </div>
        </div>
      `;
    });
const aplicarFiltroNombre = () => {
  if (!input) return;

  const q = normalizar(input.value).trim();

  // Si no hay texto, mostrar todo el catálogo
  if (!q) {
    renderCatalogo(cuidadoresCache);
    return;
  }

  // Filtrar SOLO coincidencias
  const filtrados = cuidadoresCache.filter((c) =>
    normalizar(c.nombre).includes(q)
  );

  
  if (catalogo) catalogo.scrollIntoView({ behavior: "smooth", block: "start" });
  renderCatalogo(filtrados);
};

  const cargarCuidadores = async () => {
    try {
      if (!catalogo) return;

      catalogo.innerHTML = `
        <div class="col-12">
          <p class="text-center text-muted">Cargando cuidadores...</p>
        </div>
      `;

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      cuidadoresCache = Array.isArray(data) ? data : [];

      renderCatalogo(cuidadoresCache);
      aplicarFiltroNombre(); 
    } catch (err) {
      console.error("Error cargando cuidadores:", err);
      if (catalogo) {
        catalogo.innerHTML = `
          <div class="col-12">
            <p class="text-center text-danger">
              Error cargando cuidadores. Revisá el backend y el endpoint /cuidadores
            </p>
          </div>
        `;
      }
    }
  };

  cargarCuidadores();
  
  if (input) {
    input.addEventListener("input", aplicarFiltroNombre);
  }
  if (!boton) {
    console.error("No se encontró el elemento #ver-mas-boton");
  } else if (!conteiner) {
    console.error("No se encontró el elemento #mas-cuidadores");
  } else {
    boton.addEventListener("click", (e) => {
      e.preventDefault();

      const isHidden =
        conteiner.style.display === "none" || conteiner.style.display === "";

      conteiner.style.display = isHidden ? "block" : "none";
      boton.textContent = isHidden ? "Ver menos" : "Ver más";
    });
  }
  (async () => {
    try {
        const resp = await fetch("http://localhost:8080/api/users/user_info", {
            credentials: "include"
        });

        const data = await resp.json();
        const container = document.getElementById("buttons");

        if (!container) return;

        if (data.response) {
            container.innerHTML = `
                <a role="button" class="btn btn-danger" href="/perfiles/perfil_usuario.html">
                    Ver perfil
                </a>
            `;
        }

    } catch (error) {
      console.error("Error al obtener session_info:", error);
    }
});
}
