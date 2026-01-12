(() => {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const API_BASE = "http://localhost:3000";
  const API_CUIDADORES = `${API_BASE}/cuidadores`;
  const API_PAQUETES = `${API_BASE}/paquetes`;
  const CUIDADOR_ID = 2;

  // ID del cuidador desde login
  // En tu login guardá: localStorage.setItem("cuidadores_id", data.id)
  /*function getCuidadorIdDesdeLogin() {
    const id = localStorage.getItem("cuidadores_id");
    return id ? Number(id) : null;
  }

  let CUIDADOR_ID = null;*/
  let paquetesCache = []; // cache de paquetes actuales

  // =========================
  // DOM HELPERS
  // =========================
  const $ = (sel) => document.querySelector(sel);

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  }

  function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
  }

  function onlyNumbersInput(el) {
    el.addEventListener("input", () => {
      el.value = el.value.replace(/[^0-9]/g, "");
    });
  }

  // =========================
  // PERFIL - VALIDACIONES BÁSICAS
  // =========================
  function checkInputsPerfil() {
    const nickname = $("#nickname")?.value?.trim();
    const franquicia = $("#franquicia")?.value?.trim();
    const poderes = $("#poderes")?.value?.trim();
    const experiencia = $("#experiencia")?.value;
    const contrasena = $("#contrasena")?.value?.trim();

    let ok = true;

    if (!nickname || !franquicia || !poderes || !experiencia || !contrasena) {
      alert("Debe añadir TODOS los datos.");
      ok = false;
    } else if (nickname.length > 120) {
      alert('El campo "nombre" es demasiado largo.');
      ok = false;
    } else if (franquicia.length > 100) {
      alert('El campo "franquicia" es demasiado largo.');
      ok = false;
    } else if (Number(experiencia) <= 0) {
      alert("La experiencia debe ser mayor a 0.");
      ok = false;
    }

    return ok;
  }

  // =========================
  // API CALLS
  // =========================
  async function apiJson(url, options = {}) {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");

    // Si el backend devuelve HTML de error, esto evita JSON.parse error
    const body = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      const message = isJson ? (body?.error || JSON.stringify(body)) : body;
      throw new Error(message || `HTTP ${res.status}`);
    }

    return body;
  }

  // =========================
  // CARGAR CUIDADOR
  // =========================
  async function cargarCuidador() {
  try {
    const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "No se pudo obtener el cuidador");
    }

    const data = await res.json();

    // Header
    const nombreHeader = document.getElementById("nombre-superheroe-header");
    const franquiciaHeader = document.getElementById("franquicia-header");
    const profilePic = document.getElementById("profilePic");

    if (nombreHeader) nombreHeader.textContent = data.nombre ?? "";
    if (franquiciaHeader) franquiciaHeader.textContent = data.franquicia ?? "";

    if (profilePic) {
      profilePic.src = data.foto_perfil || "https://via.placeholder.com/150";
      profilePic.alt = `Foto de ${data.nombre || "cuidador"}`;
    }

    // Form inputs
    const nickname = document.getElementById("nickname");
    const franquicia = document.getElementById("franquicia");
    const experiencia = document.getElementById("experiencia");
    const poderes = document.getElementById("poderes");
    const contrasena = document.getElementById("contrasena");

    if (nickname) nickname.value = data.nombre ?? "";
    if (franquicia) franquicia.value = data.franquicia ?? "";
    if (experiencia) experiencia.value = data.experiencia ?? "";
    if (poderes) poderes.value = data.poderes ?? "";
    if (contrasena) contrasena.value = data.contrasenia ?? "";

    // contador (si lo guardás en tabla superheroes)
    const contador = document.getElementById("contador-paquetes");
    if (contador) contador.textContent = data.paquetes_ofrecidos ?? 0;

  } catch (err) {
    console.error("Error cargando cuidador:", err);
    alert("No se pudo cargar la información del cuidador. Revisá consola.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarCuidador();
});

  // =========================
  // GUARDAR PERFIL
  // =========================
  async function guardarPerfil(e) {
    e.preventDefault();

    if (!checkInputsPerfil()) return;

    const cambios = {
      nombre: $("#nickname").value.trim(),
      franquicia: $("#franquicia").value.trim(),
      experiencia: Number($("#experiencia").value),
      poderes: $("#poderes").value.trim(),
      contrasenia: $("#contrasena").value.trim(),
    };

    try {
      await apiJson(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });

      alert("Datos actualizados");
      await cargarCuidador();
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el perfil");
    }
  }

  // =========================
  // ELIMINAR CUENTA
  // =========================
  async function eliminarCuenta() {
    if (!confirm("¿Seguro que querés eliminar este cuidador?")) return;

    try {
      await apiJson(`${API_CUIDADORES}/${CUIDADOR_ID}`, { method: "DELETE" });
      alert("Cuenta eliminada");
      localStorage.removeItem("cuidadores_id");
      window.location.href = "/index.html";
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar la cuenta");
    }
  }

  // =========================
  // PAQUETES - LISTAR
  // =========================
  async function cargarPaquetes() {
    try {
      const paquetes = await apiJson(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`);

      paquetesCache = Array.isArray(paquetes) ? paquetes : [];
      const tbody = $("#tabla-paquetes tbody");
      tbody.innerHTML = "";

      paquetesCache.forEach((p) => {
        tbody.innerHTML += `
          <tr>
            <td>${escapeHtml(p.nombre_paquete || "")}</td>
            <td>${escapeHtml(p.descripcion || "")}</td>
            <td>$${Number(p.precio || 0)}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary" data-action="editar" data-id="${p.id}">
                Editar
              </button>
              <button class="btn btn-sm btn-outline-danger" data-action="eliminar" data-id="${p.id}">
                Eliminar
              </button>
            </td>
          </tr>
        `;
      });

      setText("contador-paquetes", paquetesCache.length);
      actualizarEstadoBotonAgregar();
    } catch (err) {
      console.error("Error cargando paquetes:", err);
      alert("Error al cargar paquetes");
    }
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================
  // PAQUETES - MODAL CREAR (hasta 3)
  // =========================
  function actualizarEstadoBotonAgregar() {
    const btnAbrir = $("#btn-abrir-modal-paquete");
    const max = 3;
    const count = paquetesCache.length;

    if (!btnAbrir) return;

    if (count >= max) {
      btnAbrir.disabled = true;
      btnAbrir.textContent = "Límite alcanzado";
    } else {
      btnAbrir.disabled = false;
      btnAbrir.textContent = "Añadir paquete";
    }
  }

  function resetModalPaquetes() {
    const cont = $("#contenedor-paquetes-modal");
    cont.innerHTML = `
      <div class="border rounded p-3 mb-3 paquete-modal-item" data-index="1">
        <h2 class="h5 mb-3" id="nombre_paquete_modal_1">Plan Básico</h2>

        <label class="form-label">Descripción</label>
        <input type="text" class="form-control mb-2" id="descripcion_paquete_modal_1" />

        <label class="form-label">Precio</label>
        <input type="number" min="0" class="form-control" id="precio_paquete_modal_1" />
      </div>
    `;
  }

  function agregarOtroPaqueteEnModal() {
    const cont = $("#contenedor-paquetes-modal");
    const items = cont.querySelectorAll(".paquete-modal-item");
    const max = 3;

    if (items.length >= max) {
      alert("No podés agregar más de 3 paquetes.");
      return;
    }

    const nextIndex = items.length + 1;
    const nombrePorIndex = nextIndex === 2 ? "Plan Premium" : "Plan Deluxe";

    const div = document.createElement("div");
    div.className = "border rounded p-3 mb-3 paquete-modal-item";
    div.dataset.index = String(nextIndex);

    div.innerHTML = `
      <h2 class="h5 mb-3" id="nombre_paquete_modal_${nextIndex}">${nombrePorIndex}</h2>

      <label class="form-label">Descripción</label>
      <input type="text" class="form-control mb-2" id="descripcion_paquete_modal_${nextIndex}" />

      <label class="form-label">Precio</label>
      <input type="number" min="0" class="form-control" id="precio_paquete_modal_${nextIndex}" />
    `;

    cont.appendChild(div);
  }

  async function guardarPaqueteDesdeModal() {
    const nombreEl = document.getElementById("nombre_paquete_modal");
    const descEl = document.getElementById("descripcion_paquete_modal");
    const precioEl = document.getElementById("precio_paquete_modal");

    if (!nombreEl || !descEl || !precioEl) {
      console.error("Inputs del modal no encontrados");
      return;
    }

    const nombre_paquete = nombreEl.textContent.trim();
    const descripcion = descEl.value.trim();
    const precio = Number(precioEl.value);

    const res = await fetch(`/cuidadores/${CUIDADOR_ID}/paquetes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_paquete, descripcion, precio })
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Fallo POST: ${res.status} - ${txt}`);
    }

    // limpiar + recargar
    descEl.value = "";
    precioEl.value = "";
    await cargarPaquetes();
  }

  function cancelarModalPaquetes() {
    resetModalPaquetes();
    const modalEl = $("#modalPaquetes");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  // =========================
  // PAQUETES - EDICIÓN DESDE FORMULARIO INFERIOR
  // =========================
  function limpiarFormularioEdicion() {
    setValue("paquete_id", "");
    setValue("nombre_paquete_select", "");
    setValue("descripcion_paquete", "");
    setValue("precio_paquete", "");
    setText("titulo-edicion", "Editar paquete");
  }

  function cargarEnFormularioEdicion(paquete) {
    setValue("paquete_id", paquete.id);
    setValue("nombre_paquete_select", paquete.nombre_paquete || "");
    setValue("descripcion_paquete", paquete.descripcion || "");
    setValue("precio_paquete", paquete.precio ?? "");
    setText("titulo-edicion", `Editando paquete #${paquete.id}`);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  async function guardarEdicionPaquete(e) {
    e.preventDefault();

    const paqueteId = $("#paquete_id").value;
    const nombre = $("#nombre_paquete_select").value;
    const descripcion = $("#descripcion_paquete").value.trim();
    const precio = Number($("#precio_paquete").value);

    if (!paqueteId) {
      alert("No hay paquete seleccionado para editar");
      return;
    }
    if (!nombre || !descripcion || !precio || precio <= 0) {
      alert("Completá todos los campos correctamente (incluye nombre).");
      return;
    }

    try {
      await apiJson(`${API_PAQUETES}/${paqueteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_paquete: nombre,
          descripcion,
          precio,
        }),
      });

      alert("Paquete actualizado");
      limpiarFormularioEdicion();
      await cargarPaquetes();
    } catch (err) {
      console.error(err);
      alert("No se pudo editar el paquete");
    }
  }

  async function eliminarPaquetePorId(id) {
    if (!confirm("¿Eliminar paquete?")) return;

    try {
      await apiJson(`${API_PAQUETES}/${id}`, { method: "DELETE" });
      await cargarPaquetes();

      // si justo estabas editando ese id, limpiar
      if ($("#paquete_id").value === String(id)) {
        limpiarFormularioEdicion();
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el paquete");
    }
  }

  async function eliminarPaqueteSeleccionado() {
    const id = $("#paquete_id").value;
    if (!id) {
      alert("No hay paquete seleccionado");
      return;
    }
    await eliminarPaquetePorId(id);
  }

  // =========================
  // EVENTS
  // =========================
  function bindEvents() {
    // experiencia solo números
    const exp = $("#experiencia");
    if (exp) onlyNumbersInput(exp);

    // perfil
    $("#form-perfil")?.addEventListener("submit", guardarPerfil);
    $("#btn-eliminar-cuenta")?.addEventListener("click", eliminarCuenta);
    $("#btn-cancelar-perfil")?.addEventListener("click", cargarCuidador);

    // logout
    $("#btn-logout")?.addEventListener("click", () => {
      localStorage.removeItem("cuidadores_id");
      window.location.href = "/index.html";
    });

    // modal
    $("#btn-agregar-otro-paquete")?.addEventListener("click", agregarOtroPaqueteEnModal);
    $("#btn-guardar-paquete")?.addEventListener("click", guardarPaquetesDesdeModal);
    $("#btn-cancelar-paquete")?.addEventListener("click", cancelarModalPaquetes);

    // al abrir modal, reset
    const modalEl = $("#modalPaquetes");
    modalEl?.addEventListener("shown.bs.modal", () => {
      // asegurar DOM listo + evitar residuos de pruebas
      resetModalPaquetes();
    });

    // edición inferior
    $("#form-paquete-edicion")?.addEventListener("submit", guardarEdicionPaquete);
    $("#btn-limpiar-paquete")?.addEventListener("click", limpiarFormularioEdicion);
    $("#btn-eliminar-paquete-seleccionado")?.addEventListener("click", eliminarPaqueteSeleccionado);

    // acciones en la tabla (delegación)
    $("#tabla-paquetes")?.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;
      const id = btn.dataset.id ? Number(btn.dataset.id) : null;

      if (!action || !id) return;

      if (action === "editar") {
        const paquete = paquetesCache.find((p) => Number(p.id) === id);
        if (!paquete) return;
        cargarEnFormularioEdicion(paquete);
      }

      if (action === "eliminar") {
        eliminarPaquetePorId(id);
      }
    });
  }

  // =========================
  // INIT
  // =========================
  /*document.addEventListener("DOMContentLoaded", async () => {
    CUIDADOR_ID = getCuidadorIdDesdeLogin();

    if (!CUIDADOR_ID) {
      alert("No hay sesión iniciada. Iniciá sesión para ver tu perfil.");
      window.location.href = "/login/login.html";
      return;
    }

    bindEvents();
    await cargarCuidador();
    await cargarPaquetes();
  });*/
})();
