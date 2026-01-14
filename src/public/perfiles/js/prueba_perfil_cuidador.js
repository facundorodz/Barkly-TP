(() => {
  "use strict";

  // =========================
  // CONFIG
  // =========================
  const API_BASE = "http://localhost:3000";
  const CUIDADOR_ID = 2;
  const API_CUIDADORES = `${API_BASE}/cuidadores`;
  const API_PAQUETES = `${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`;

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

  // ===============================
  // MODAL: CREAR HASTA 3 PAQUETES
  // ===============================
  function actualizarEstadoBotonAgregar() {
    const btnAbrir = $("btn-abrir-modal-paquete");
    const btnAgregarOtro = $("btn-agregar-otro-paquete");

    const totalActual = paquetesCache.length;

    // Si ya tiene 3 en total, deshabilito abrir modal
    if (btnAbrir) btnAbrir.disabled = totalActual >= 3;

    // Dentro del modal, el "Agregar otro" depende de los items del modal y el total en BDD
    if (btnAgregarOtro) {
      const maxModalPermitido = Math.max(0, 3 - totalActual);
      btnAgregarOtro.disabled = modalCount >= maxModalPermitido;
    }
  }

  function resetModal() {
    // deja 1 item y limpia inputs
    const cont = $("contenedor-paquetes-modal");
    if (!cont) return;

    const items = cont.querySelectorAll(".paquete-modal-item");
    items.forEach((it, idx) => {
      if (idx === 0) {
        it.querySelector("input[type='text']").value = "";
        it.querySelector("input[type='number']").value = "";
      } else {
        it.remove();
      }
    });

    modalCount = 1;
    actualizarEstadoBotonAgregar();
  }

  function agregarOtroPaqueteModal() {
    const cont = $("contenedor-paquetes-modal");
    if (!cont) return;

    const totalActual = paquetesCache.length;
    const maxModalPermitido = Math.max(0, 3 - totalActual);

    if (modalCount >= maxModalPermitido) {
      alert("No podés agregar más paquetes (máximo 3 en total).");
      return;
    }

    modalCount += 1;

    const div = document.createElement("div");
    div.className = "border rounded p-3 mb-3 paquete-modal-item";
    div.dataset.index = String(modalCount);

    // Título predeterminado por orden
    const titulo =
      modalCount === 1 ? "Plan Básico" :
      modalCount === 2 ? "Plan Premium" :
      "Plan Deluxe";

    div.innerHTML = `
      <h2 class="h5 mb-3">${titulo}</h2>

      <label class="form-label">Descripción</label>
      <input type="text" class="form-control mb-2" />

      <label class="form-label">Precio</label>
      <input type="number" min="0" class="form-control" />
    `;

    cont.appendChild(div);
    actualizarEstadoBotonAgregar();
  }

  async function guardarPaquetesModal() {
    const cont = $("contenedor-paquetes-modal");
    if (!cont) return;

    const items = [...cont.querySelectorAll(".paquete-modal-item")];

    // Armar payloads
    const nuevos = [];
    for (const it of items) {
      const h2 = it.querySelector("h2");
      const titulo = (h2?.textContent || "Paquete").trim();

      const inputs = it.querySelectorAll("input");
      const descripcion = (inputs[0]?.value || "").trim();
      const precio = Number(inputs[1]?.value || 0);

      if (!descripcion || !precio || precio <= 0) {
        return alert("Completá descripción y precio válido en todos los paquetes del modal.");
      }

      nuevos.push({ nombre_paquete: titulo, descripcion, precio });
    }

    // Chequear límite total (existentes + nuevos)
    if (paquetesCache.length + nuevos.length > 3) {
      return alert("Excede el máximo de 3 paquetes en total.");
    }

    try {
      // Crear uno por uno (simple y claro)
      for (const pkg of nuevos) {
        const res = await fetch(`${API_PAQUETES}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pkg)
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Error al crear paquete: ${txt}`);
        }
      }

      await cargarPaquetes();

      // Cerrar y resetear modal
      const modal = getModalInstance();
      modal.hide();
      resetModal();

      alert("Paquetes creados correctamente");

    } catch (err) {
      console.error(err);
      alert("No se pudieron guardar los paquetes");
    }
  }

  function cancelarModal() {
    const modal = getModalInstance();
    modal.hide();
    resetModal();
  }

  // =========================
  // PAQUETES - LISTAR
  // =========================
  async function cargarPaquetes() {
    try {
      const res = await fetch(`${API_PAQUETES}`);
      if (!res.ok) throw new Error("No se pudieron obtener los paquetes");

      const paquetes = await res.json();

      const tbody = document.querySelector("#tabla-paquetes tbody");
      tbody.innerHTML = "";

      paquetes.forEach((p) => {
        tbody.innerHTML += `
          <tr>
            <td>${p.nombre_paquete}</td>
            <td>${p.descripcion}</td>
            <td>$${p.precio}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary" onclick='cargarFormularioPaquete(${JSON.stringify(p)})'>Editar</button>
              <button class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${p.id}">Eliminar</button>
            </td>
          </tr>
        `;
      });

      document.getElementById("contador-paquetes").textContent = paquetes.length;
    } catch (error) {
      console.error("Error cargando paquetes:", error);
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

  function cargarFormularioPaquete(p) {
    document.getElementById("paquete_id").value = p.id;

    // Cargar datos en el formulario inferior
    document.getElementById("nombre_paquete").value = p.nombre_paquete;
    document.getElementById("descripcion_paquete").value = p.descripcion;
    document.getElementById("precio_paquete").value = p.precio;

    // Feedback visual opcional
    document.querySelector(".card-header h5").textContent = "Editar paquete";
  }


  // ===============================
  // Editar paquete
  // ===============================
  async function editarPaquete(id) {
    const nombre = prompt("Nuevo nombre:");
    const desc = prompt("Nueva descripción:");
    const precio = prompt("Nuevo precio:");

    await fetch(`${API_URL}/paquetes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_paquete: nombre,
        descripcion: desc,
        precio: precio
      })
    });

    cargarPaquetes();
  }

  const btnGuardarEditado = document.getElementById("guardar-boton");
  btnGuardarEditado.addEventListener("click", (e) => {
    e.preventDefault();
    guardarPaqueteFormulario();
  });


  // ===================================
  // GUARDA LOS CAMBIOS DE LOS PAQUETES
  // ===================================

  async function guardarPaqueteFormulario() {

    const paqueteIdInput = document.getElementById("paquete_id");
    const nombreSelect = document.getElementById("nombre_paquete");
    const descripcionInput = document.getElementById("descripcion_paquete");
    const precioInput = document.getElementById("precio_paquete");

    if (!paqueteIdInput || !nombreSelect || !descripcionInput || !precioInput) {
      alert("Error interno: formulario incompleto");
      return;
    }

    const paqueteId = paqueteIdInput.value;
    const nombre_paquete = nombreSelect.value;
    const descripcion = descripcionInput.value.trim();
    const precio = Number(precioInput.value);

    if (!paqueteId) {
      alert("No hay paquete seleccionado para editar");
      return;
    }

    if (!nombre_paquete) {
      alert("Seleccioná un tipo de paquete");
      return;
    }

    if (!descripcion || !precio) {
      alert("Completá todos los campos");
      return;
    }

    if (precio <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/paquetes/${paqueteId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre_paquete,
            descripcion,
            precio
          })
        }
      );

      if (!res.ok) throw new Error("Error al editar paquete");

      paqueteIdInput.value = "";
      nombreSelect.value = "";
      descripcionInput.value = "";
      precioInput.value = "";

      document.querySelector(".card-header h5").textContent = "Editar paquete";

      cargarPaquetes();
      alert("Paquete actualizado correctamente");

    } catch (error) {
      console.error(error);
      alert("No se pudo editar el paquete");
    }
}




async function eliminarPaquete(id) {
  if (!id) {
    alert("ID de paquete inválido");
    return;
  }

  if (!confirm("¿Eliminar paquete?")) return;

  try {
    const res = await fetch(
      `${API_URL}/paquetes/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      throw new Error("Error al eliminar paquete");
    }

    cargarPaquetes();

  } catch (error) {
    console.error(error);
    alert("No se pudo eliminar el paquete");
  }
}


  // ===============================
  // EDICION (FORMULARIO INFERIOR)
  // ===============================
  /*function cargarFormularioPaquete(p) {
    setValue("paquete_id", p.id);
    setValue("precio_paquete", p.precio);
    setValue("descripcion_paquete", p.descripcion);

    const sel = $("nombre_paquete_select");
    if (sel) sel.value = p.nombre_paquete ?? "";

    setText("titulo-edicion", `Editando paquete #${p.id}`);
  }*/

  /*function cargarFormularioPaquete(p) {
    document.getElementById("paquete_id").value = p.id;

    // Cargar datos en el formulario inferior
    document.getElementById("nombre_paquete").value = p.nombre_paquete;
    document.getElementById("descripcion_paquete").value = p.descripcion;
    document.getElementById("precio_paquete").value = p.precio;
    const sel = $("nombre_paquete_select");
    if (sel) sel.value = p.nombre_paquete ?? "";

    // Feedback visual opcional
    document.querySelector(".card-header h5").textContent = "Editar paquete";
  }

  function limpiarFormularioEdicion() {
    setValue("paquete_id", "");
    setValue("precio_paquete", "");
    setValue("descripcion_paquete", "");

    const sel = $("nombre_paquete_select");
    if (sel) sel.value = "";

    setText("titulo-edicion", "Editar paquete");
  }

  async function guardarEdicionPaquete(e) {
    e.preventDefault();

    const paqueteId = Number($("paquete_id")?.value);
    const nombre_paquete = $("nombre_paquete_select")?.value?.trim();
    const descripcion = $("descripcion_paquete")?.value?.trim();
    const precio = Number($("precio_paquete")?.value);

    if (!paqueteId) return alert("No hay paquete seleccionado para editar");
    if (!nombre_paquete) return alert("Seleccioná un nombre de paquete");
    if (!descripcion) return alert("Completá la descripción");
    if (!precio || precio <= 0) return alert("El precio debe ser mayor a 0");

    try {
      const res = await fetch(`${API_PAQUETES}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre_paquete, descripcion, precio })
      });

      if (!res.ok) throw new Error("Error al editar paquete");

      await cargarPaquetes();
      limpiarFormularioEdicion();
      alert("Paquete actualizado correctamente");

    } catch (err) {
      console.error(err);
      alert("No se pudo editar el paquete");
    }
  }

  async function eliminarPaqueteSeleccionado() {
    const paqueteId = Number($("paquete_id")?.value);
    if (!paqueteId) return alert("No hay paquete seleccionado");
    await eliminarPaquete(paqueteId);
    limpiarFormularioEdicion();
  }

  async function eliminarPaquete(id) {
    if (!confirm("¿Eliminar paquete?")) return;

    try {
      const res = await fetch(`${API_PAQUETES}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar paquete");

      await cargarPaquetes();

    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el paquete");
    }
  }*/
  // =========================
  // EVENTS
  // =========================
  /*function bindEvents() {
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

    // al abrir modal, reset
    const modalEl = $("#modalPaquetes");
    modalEl?.addEventListener("shown.bs.modal", () => {
      // asegurar DOM listo + evitar residuos de pruebas
      resetModalPaquetes();
    });

      // Tabla: edit/delete
    const tbody = document.querySelector("#tabla-paquetes tbody");
    if (tbody) tbody.addEventListener("click", onTablaClick);

    // Form edición
    const formEdicion = $("form-paquete-edicion");
    if (formEdicion) formEdicion.addEventListener("submit", guardarEdicionPaquete);

    const btnLimpiar = $("btn-limpiar-paquete");
    if (btnLimpiar) btnLimpiar.addEventListener("click", limpiarFormularioEdicion);

    const btnEliminarSel = $("btn-eliminar-paquete-seleccionado");
    if (btnEliminarSel) btnEliminarSel.addEventListener("click", eliminarPaqueteSeleccionado);

    // Modal
    const btnAgregarOtro = $("btn-agregar-otro-paquete");
    if (btnAgregarOtro) btnAgregarOtro.addEventListener("click", agregarOtroPaqueteModal);

    const btnGuardarModal = $("btn-guardar-paquete");
    if (btnGuardarModal) btnGuardarModal.addEventListener("click", guardarPaquetesModal);

    const btnCancelarModal = $("btn-cancelar-paquete");
    if (btnCancelarModal) btnCancelarModal.addEventListener("click", cancelarModal);
    }

      // Cada vez que abrís el modal, resetea y recalcula límite
    const modalEl = $("modalPaquetes");
    if (modalEl) {
      modalEl.addEventListener("shown.bs.modal", () => {
        resetModal();
      });
    }*/


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
  document.addEventListener("DOMContentLoaded", () => {
    cargarCuidador();
    cargarPaquetes();
  });
})();
