
const API_URL = "http://localhost:8080/api/cuidadores";
  (async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/users/user_info", {
        credentials: "include"
      });

      const data = await resp.json();
      const container = document.getElementById("buttons");

      if (!container) return;

      if (data.response) {
        if (data.role === "user"){
          container.innerHTML = `
          <a class="btn btn-danger" href="/perfiles/perfil_usuario.html">
            Ver perfil
          </a>
          <button class="btn btn-outline-danger" id="btnCerrarSesion">
          Cerrar sesión
        </button>
        `;
        } else {
          container.innerHTML = `
          <a class="btn btn-danger" href="/perfiles/perfil_cuidador.html">
            Ver perfil
          </a>
        `;
        }
      const btnCerrar = document.getElementById("btnCerrarSesion");
      btnCerrar.addEventListener("click", async () => {
        try {
          const logoutResp = await fetch("http://localhost:8080/api/users/logout", {
            method: "POST",
            credentials: "include"
          });
          if (!logoutResp.ok) throw new Error("Error al cerrar sesión");

          // Redirigir al home
          window.location.href = "/index.html";
        } catch (err) {
          console.error("No se pudo cerrar sesión:", err);
          alert("Error cerrando sesión, intente de nuevo.");
        }
      });
        
      }

    } catch (err) {
      console.error("Error obteniendo sesión:", err);
    }
  })();

document.addEventListener("DOMContentLoaded", () => {
  const catalogo = document.getElementById("catalogo");
  const botonVerMas = document.getElementById("ver-mas-boton");
  const input = document.getElementById("buscadorNombre");

  let cuidadoresCache = [];

  const normalizar = (txt) =>
    String(txt ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const renderCatalogo = (lista) => {
    if (!catalogo) return;
    catalogo.innerHTML = "";

    if (!Array.isArray(lista) || lista.length === 0) {
      catalogo.innerHTML = `<div class="col-12"><p class="text-center text-muted">No se encontraron cuidadores.</p></div>`;
      return;
    }

    lista.forEach(c => {
      const poderes = String(c.poderes ?? "").split(",").map(p => p.trim()).filter(Boolean);
      catalogo.innerHTML += `
        <div class="col-md-4">
          <div class="cuidador_perfil cuidador_item">
            <img src="${c.foto_perfil || 'https://via.placeholder.com/150'}" class="polaroid" width="400" height="400" alt="Foto de ${c.nombre || 'Cuidador'}">
            <h3 class="card-title">${c.nombre || "Sin nombre"}</h3>
            ${c.franquicia || "—"} <br>
            <hr>
            <ul style="text-align: left; margin: 0 auto; width: fit-content;">
              ${poderes.length ? poderes.map(p => `<li>${p}</li>`).join("") : "<li>—</li>"}
            </ul>
            <hr>
            <button class="btn btn-primary btnVerCuidador" data-id="${c.id}">Ver cuidador</button>
          </div>
        </div>`;
    });
  };

  const aplicarFiltroNombre = () => {
    if (!input) return;
    const q = normalizar(input.value).trim();
    renderCatalogo(q ? cuidadoresCache.filter(c => normalizar(c.nombre).includes(q)) : cuidadoresCache);
  };

  const cargarCuidadores = async () => {
    try {
      catalogo.innerHTML = `<div class="col-12"><p class="text-center text-muted">Cargando cuidadores...</p></div>`;
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      cuidadoresCache = Array.isArray(data) ? data : [];
      renderCatalogo(cuidadoresCache);
      aplicarFiltroNombre();
    } catch (err) {
      console.error("Error cargando cuidadores:", err);
      catalogo.innerHTML = `<div class="col-12"><p class="text-center text-danger">Error cargando cuidadores. Revisá el backend y el endpoint /cuidadores</p></div>`;
    }
  };

  if (input) input.addEventListener("input", aplicarFiltroNombre);

  if (botonVerMas) {
    botonVerMas.addEventListener("click", (e) => {
      e.preventDefault();
      const isHidden = catalogo.style.display === "none" || catalogo.style.display === "";
      catalogo.style.display = isHidden ? "flex" : "none";
      botonVerMas.textContent = isHidden ? "Ver menos" : "Ver más";
    });
  }

  // Delegación de eventos para botones "Ver cuidador"
  catalogo.addEventListener("click", async (e) => {
    const btn = e.target.closest(".btnVerCuidador");
    if (!btn) return;
    const cuidadorId = btn.getAttribute("data-id");
    if (!cuidadorId) return;

    try {
      const res = await fetch(`${API_URL}/${cuidadorId}`);
      if (!res.ok) throw new Error("Error al cargar cuidador");
      const cuidador = await res.json();

      const paquetesRes = await fetch(`${API_URL}/${cuidadorId}/paquetes`);
      const paquetes = await paquetesRes.json();

      // Renderizar modal
      document.getElementById("modalNombre").textContent = cuidador.nombre || "—";
      document.getElementById("modalFranquicia").textContent = cuidador.franquicia || "—";
      document.getElementById("modalExperiencia").textContent = cuidador.experiencia || "—";
      document.getElementById("modalPoderes").textContent = cuidador.poderes || "—";
      document.getElementById("modalAvatar").src = cuidador.foto_perfil || "";

      const ul = document.getElementById("modalPaquetes");
      ul.innerHTML = "";
      paquetes.forEach(p => {
        ul.innerHTML += `<li>${p.nombre_paquete} - $${p.precio}</li>`;
      });

      // Abrir modal
      const modalEl = document.getElementById("modalCuidador");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la información del cuidador.");
    }
  });

  cargarCuidadores();
});




