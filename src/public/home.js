
const API_URL = "http://localhost:3000/cuidadores";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("buscadorNombre");
  const boton = document.getElementById("ver-mas-boton");
  const conteiner = document.getElementById("mas-cuidadores");
  const catalogo = document.getElementById("catalogo");

  let cuidadoresCache = []; // guardo lista completa para filtrar

  // ===== Helpers =====
  const normalizar = (txt) =>
    String(txt ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // saca tildes

  const renderCatalogo = (lista) => {
    if (!catalogo) return;

    catalogo.innerHTML = "";

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
          <div class="cuidador_perfil">
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
  };

  const aplicarFiltroNombre = () => {
    if (!input) return;

    const q = normalizar(input.value).trim();
    if (!q) {
      renderCatalogo(cuidadoresCache);
      return;
    }

    const filtrados = cuidadoresCache.filter((c) =>
      normalizar(c.nombre).includes(q)
    );

    renderCatalogo(filtrados);
  };

  // ===== 1) Cargar cuidadores =====
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
      aplicarFiltroNombre(); // por si ya había texto en el input
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

  // ===== 2) Filtro por nombre (input) =====
  if (input) {
    input.addEventListener("input", aplicarFiltroNombre);
  }

  // ===== 3) Toggle "Ver más" =====
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

  // ===== 4) Botón "Ver perfil" si hay sesión =====
  (async () => {
    try {
      const resp = await fetch("/users/session_info");
      const data = await resp.json();
      const container = document.getElementById("buttons");

      if (!container) return;

      if (data.logged) {
        container.innerHTML = `
          <a role="button" class="btn btn-danger" href="/perfiles/perfil_usuario.html">
            Ver perfil
          </a>
        `;
      }
    } catch (error) {
      console.error("Error al obtener session_info:", error);
    }
  })();
});

// ===== Redirección al detalle =====
function verDetalle(id) {
  if (!id) {
    console.error("ID inválido:", id);
    return;
  }

  // OJO: asegurate que exista esa ruta/carpeta (guiones vs underscore)
  window.location.href = `/pagina_detalles-cuidador/detalles-cuidador.html?id=${id}`;
}
