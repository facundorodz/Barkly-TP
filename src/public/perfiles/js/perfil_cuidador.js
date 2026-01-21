/*function checkInputs() {
  const inputNombreCuidador = document.getElementById('nickname').value.trim();
  const inputFranquicia = document.getElementById('franquicia').value.trim();
  const inputPoderes = document.getElementById('poderes').value.trim();
  const inputExperiencia = document.getElementById('experiencia').value;
  const inputContrasena = document.getElementById('contrasena').value.trim();
  const inputPaquetesOfrecidos = document.getElementById('inputState')?.value;

  let CHEQUEO = true;

  if (
    !inputNombreCuidador ||
    !inputFranquicia ||
    !inputPoderes ||
    !inputExperiencia ||
    !inputContrasena ||
    inputPaquetesOfrecidos === 'Elegir...'
  ) {
    alert('Debe añadir TODOS los datos.');
    CHEQUEO = false;
  } else if (inputNombreCuidador.length > 120) {
    alert('El campo "nombre" es demasiado largo.');
    CHEQUEO = false;
  } else if (inputFranquicia.length > 100) {
    alert('El campo "franquicia" es demasiado largo.');
    CHEQUEO = false;
  } else if (Number(inputExperiencia) <= 0) {
    alert('La experiencia debe ser mayor a 0.');
    CHEQUEO = false;
  }

  return CHEQUEO;
}

// Chequeo para evitar que se pongan letras en el campo "experiencia"
const experiencia = document.getElementById('experiencia')

const API_BASE = "http://localhost:3000";
const CUIDADOR_ID = 2;
const API_CUIDADORES = `${API_BASE}/cuidadores`;
const API_PAQUETES = `${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`;

experiencia.addEventListener("input", () => {
  experiencia.value = experiencia.value.replace(/[^0-9]/g, "")
})

function submitForm() { // Sube el form() de los datos de usuario.
    checkInputs()
}

document.addEventListener("DOMContentLoaded", () => {

  const btnCancelar = document.getElementById("btn-cancelar-paquete");
  if (!btnCancelar) return;

  btnCancelar.addEventListener("click", cancelar);
});


// ==========================
// HELPERS
// ==========================
function setEstado(tipo, mensaje) {
  const area = document.getElementById("estadoArea");
  if (!mensaje) { area.innerHTML = ""; return; }

    const clase =
      tipo === "ok" ? "alert-success" :
      tipo === "warn" ? "alert-warning" :
      "alert-danger";

    area.innerHTML = `<div class="alert ${clase} mb-0" role="alert">${mensaje}</div>`;
}

function money(v) {
  if (v === undefined || v === null || v === "") return "—";
  return `$${v}`;
}

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || "Error en respuesta"}`);
  }
  // algunas rutas pueden responder sin json; intentamos parsear
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}
    let paquetesCache = [];
    document.getElementById("formPaqueteModal").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!CUIDADOR_ID) {
        setEstado("warn", "No hay sesión de cuidador. Iniciá sesión.");
        return;
      }

      const maximo = 3;

      // 1) Validación máximo
      if (paquetesCache.length >= maximo) {
        setEstado("warn", "Ya alcanzaste el máximo de 3 paquetes.");
        return;
      }

      const nombreSeleccionado = document.getElementById("m_nombre_paquete").value.trim();

      // 2) (Opcional pero recomendado) Evitar duplicados por nombre
      const yaExiste = paquetesCache.some(p =>
        String(p.nombre_paquete || "").toLowerCase() === nombreSeleccionado.toLowerCase()
      );
      if (yaExiste) {
        setEstado("warn", `Ya tenés creado el paquete "${nombreSeleccionado}". Elegí otro.`);
        return;
      }

      const payload = {
        nombre_paquete: nombreSeleccionado,
        descripcion: document.getElementById("m_descripcion").value.trim(),
        precio: Number(document.getElementById("m_precio").value || 0),
      };

      try {
        setEstado("ok", "Creando paquete...");
        await fetchJSON(`${API_PAQUETES}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // limpiar inputs del modal
        document.getElementById("formPaqueteModal").reset();

        // cerrar modal
        const modalEl = document.getElementById("modalAgregarPaquete");
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        setEstado("ok", "Paquete agregado correctamente.");
        await cargarPaquetes(); // recarga paquetesCache + tabla + contador + botón
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo agregar el paquete. Verificá el backend (POST /cuidadores/:id/paquetes).");
      }
    });

    document.getElementById("btnAbrirModalPaquete")?.addEventListener("click", (e) => {
      if (paquetesCache.length >= 3) {
        e.preventDefault();
        setEstado("warn", "Ya alcanzaste el máximo de 3 paquetes.");
      }
    });

    function actualizarUIAgregarPaquete() {
      const btn = document.getElementById("btnAbrirModalPaquete");
      if (!btn) return;

      const maximo = 3;
      const cantidad = paquetesCache.length;

      if (cantidad >= maximo) {
        btn.disabled = true;
        btn.textContent = "Máximo de 3 paquetes";
      } else {
        btn.disabled = false;
        btn.textContent = "+ Agregar paquete";
      }
    }




  function cancelar() {
    const inputDescripcion = document.getElementById("descripcion_paquete_modal");
    const inputPrecio = document.getElementById("precio_paquete");

    // Limpiar campos si existen
    if (inputDescripcion) inputDescripcion.value = "";
    if (inputPrecio) inputPrecio.value = "";

    agregarOtroPaquete();
    actualizarEstadoBotonAgregar();

    // Cerrar modal
    const modalEl = document.getElementById("modalPaquetes");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    console.log("Registro de paquete cancelado");
  }


    // ===============================
    // CARGAR DATOS DEL CUIDADOR
    // ===============================
    async function cargarCuidador() {
      try {
        const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`);
        const data = await res.json();

        // Encabezado
        document.getElementById("nombre-superheroe-header").textContent = data.nombre;
        document.getElementById("franquicia-header").textContent = data.franquicia;
        document.getElementById("contador-paquetes").textContent = data.paquetes_ofrecidos ?? 0;
        document.getElementById("profilePic").src = data.foto_perfil;

        // Formulario
        document.getElementById("nickname").value = data.nombre;
        document.getElementById("franquicia").value = data.franquicia;
        document.getElementById("experiencia").value = data.experiencia;
        document.getElementById("poderes").value = data.poderes;
        document.getElementById("contrasena").value = data.contrasenia;
        actualizarUIAgregarPaquete();

      } catch (err) {
        console.error("Error cargando cuidador:", err);
      }
    }

    // ===============================
    // GUARDAR CAMBIOS
    // ===============================
    document.getElementById("form-perfil").addEventListener("submit", async (e) => {
      e.preventDefault();

      const cambios = {
        nombre: document.getElementById("nickname").value,
        franquicia: document.getElementById("franquicia").value,
        experiencia: Number(document.getElementById("experiencia").value),
        poderes: document.getElementById("poderes").value,
        contrasenia: document.getElementById("contrasena").value,
      };

      await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cambios),
      });

      alert("Datos actualizados");
      cargarCuidador();
    });

    // ===============================
    // ELIMINAR CUENTA
    // ===============================
  document.getElementById("btn-eliminar-cuenta").addEventListener("click", async () => {
      const confirmar = confirm(
          "⚠️ ¿Estás seguro? Esta acción NO se puede deshacer"
      );
      if (!confirmar){
          return;
      } 
      try {
          const resp = await fetch("/heros/cuidadores/session", { method: "DELETE" });
          const data = await resp.json();
          if (data.success) {
              alert("Cuenta eliminada correctamente");
              window.location.href = "/index.html"; 
          } else {
              alert(data.error);
          }
      } catch (error) {
          console.error(error);
          alert("Error al borrar cuenta");
      }
  });


//const btnGuardar = document.getElementById("btn-guardar-paquete");
//btnGuardar.addEventListener("click", guardarPaquete);



  // ====================================
  // CREA NUEVOS PAQUETES DESDE EL MODAL
  // ====================================

async function guardarPaquete() {

  const inputNombre = document.getElementById("nombre_paquete_modal");
  const inputDescripcion = document.getElementById("descripcion_paquete_modal");
  const inputPrecio = document.getElementById("precio_paquete_modal");
  const paquetes = document.querySelectorAll(".paquete-item");

  if (paquetes.length > LIMITE_PAQUETES) {
    alert("No podés guardar más de 3 paquetes");
    return;
  }

  if (!inputDescripcion || !inputPrecio) {
    alert("Error interno: inputs no encontrados");
    return;
  }

  const nombre_paquete = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const precio = Number(inputPrecio.value);

  if (!descripcion || !precio) {
    alert("Completá todos los campos");
    return;
  }

  if (precio <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  try {
    const res = await fetch(`${API_PAQUETES}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_paquete,
        descripcion,
        precio
      })
    });

    if (!res.ok) throw new Error("Error al guardar paquete");

    inputDescripcion.value = "";
    inputPrecio.value = "";

    cargarPaquetes();
    alert("Paquete guardado correctamente");

  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el paquete");
  }
}



  // ===============================
  // FUNCIONES AUXILIARES
  // ===============================
  function limpiarInputs() {
    inputDescripcion.value = "";
    inputPrecio.value = "";
  }

  document.getElementById("btn-limpiar-paquete").addEventListener("click", limpiarFormularioPaquete);

  function limpiarFormularioPaquete() {

    document.getElementById("paquete_id").value = "";
    document.getElementById("nombre_paquete").value = "";
    document.getElementById("descripcion_paquete").value = "";
    document.getElementById("precio_paquete").value = "";

    document.querySelector(".card-header h5").textContent = "Editar paquete";
  }


  // ===============================
  // CARGAR LISTA DE PAQUETES
  // ===============================
  async function cargarPaquetes() {
    try {
      const res = await fetch(`${API_PAQUETES}`);
      const paquetes = await res.json();

      const tbody = document.querySelector("#tabla-paquetes tbody");
      tbody.innerHTML = "";

      paquetes.forEach(p => {
        tbody.innerHTML += `
          <tr>
            <td>${p.nombre_paquete}</td>
            <td>${p.descripcion}</td>
            <td>$${p.precio}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary" onclick='cargarFormularioPaquete(${JSON.stringify(p)})'>Editar</button>
              <button class="btn btn-sm btn-outline-danger" onclick="eliminarPaquete(${p.id})">Eliminar</button>
            </td>
          </tr>
        `;
      });
      actualizarUIAgregarPaquete();

      document.getElementById("contador-paquetes").textContent = paquetes.length;
    } catch (error) {
      console.error("Error cargando paquetes:", error);
    }
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

    await fetch(`${API_PAQUETES}/${id}`, {
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
      const res = await fetch(`${API_PAQUETES}/${paqueteId}`,{
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
    const res = await fetch(`${API_PAQUETES}/${id}`,{ method: "DELETE" });

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
    // AL CARGAR LA PÁGINA
    // ===============================
  document.addEventListener("DOMContentLoaded", () => {
    cargarCuidador();
    cargarPaquetes();
  });

        // Encabezado
        document.getElementById("nombre-superheroe-header").textContent = data.nombre;
        document.getElementById("franquicia-header").textContent = data.franquicia;
        document.getElementById("contador-paquetes").textContent = data.paquetes_ofrecidos ?? 0;
        document.getElementById("profilePic").src = data.foto_perfil;

        // Formulario
        document.getElementById("nickname").value = data.nombre;
        document.getElementById("franquicia").value = data.franquicia;
        document.getElementById("experiencia").value = data.experiencia;
        document.getElementById("poderes").value = data.poderes;
        document.getElementById("contrasena").value = data.contrasenia;
        actualizarUIAgregarPaquete();


            document.getElementById("paquete_id").value = "";
    document.getElementById("nombre_paquete").value = "";
    document.getElementById("descripcion_paquete").value = "";
    document.getElementById("precio_paquete").value = "";*/




// ==========================
    // CONFIG
    // ==========================
    const API_BASE = "http://localhost:3000";
    const CUIDADOR_ID = 2;
    const API_CUIDADORES = `${API_BASE}/cuidadores`;
    const API_PAQUETES = `${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`;

    // ID del cuidador: se espera que el login lo guarde así.
    // Ej: localStorage.setItem("id_cuidador", "1");
    const cuidadorId = localStorage.getItem("id_cuidador");

    // ==========================
    // HELPERS
    // ==========================
    function setEstado(tipo, mensaje) {
      const area = document.getElementById("estadoArea");
      if (!mensaje) { area.innerHTML = ""; return; }

      const clase =
        tipo === "ok" ? "alert-success" :
        tipo === "warn" ? "alert-warning" :
        "alert-danger";

      area.innerHTML = `<div class="alert ${clase} mb-0" role="alert">${mensaje}</div>`;
    }

    function money(v) {
      if (v === undefined || v === null || v === "") return "—";
      return `$${v}`;
    }

    async function fetchJSON(url, options) {
      const res = await fetch(url, options);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} - ${text || "Error en respuesta"}`);
      }
      // algunas rutas pueden responder sin json; intentamos parsear
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) return res.json();
      return null;
    }

    function resetFormPaquete() {
      document.getElementById("paquete_id").value = "";
      document.getElementById("nombre_paquete").value = "";
      document.getElementById("descripcion_paquete").value = "";
      document.getElementById("precio_paquete").value = "";

      //document.getElementById("tituloFormPaquete").textContent = "Agregar paquete";
      document.getElementById("modoFormPaquete").textContent = "Modo: Crear";
      document.getElementById("btnGuardarPaquete").textContent = "Guardar";
    }

    function fillFormPaquete(p) {
      document.getElementById("paquete_id").value = p.id;
      document.getElementById("nombre_paquete").value = p.nombre_paquete ?? "";
      document.getElementById("descripcion_paquete").value = p.descripcion ?? "";
      document.getElementById("precio_paquete").value = p.precio ?? "";

      //document.getElementById("tituloFormPaquete").textContent = "Editar paquete";
      document.getElementById("guardar-boton").textContent = "Actualizar";
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }

    // ==========================
    // RENDER
    // ==========================
    function renderCuidador(c) {
      document.getElementById("badgeId").textContent = `ID: ${c.id ?? "—"}`;

      document.getElementById("nombre").value = c.nombre ?? "";
      document.getElementById("franquicia").value = c.franquicia ?? "";
      document.getElementById("experiencia").value = (c.experiencia ?? "");
      document.getElementById("poderes").value = c.poderes ?? "";
      document.getElementById("foto_perfil").value = c.foto_perfil ?? "";

      document.getElementById("nombre-superheroe-header").textContent = c.nombre ?? "Perfil del cuidador";
      document.getElementById("franquicia-header").textContent = c.franquicia ?? "Sin franquicia";
      document.getElementById("contador-paquetes").textContent = (c.experiencia ?? "—");
      //document.getElementById("poderesHeader").textContent = (c.poderes ?? "—");

      if (c.foto_perfil) document.getElementById("profilePic").src = c.foto_perfil;
    }

    function renderPaquetes(paquetes) {
      const tbody = document.getElementById("tbodyPaquetes");
      const nota = document.getElementById("notaPaquetes");
      tbody.innerHTML = "";

      document.getElementById("contadorPaquetes").textContent = paquetes.length;

      if (!paquetes.length) {
        tbody.innerHTML = `
          <tr>
            <td colspan="4" class="text-center muted py-4">
              No hay paquetes cargados todavía.
            </td>
          </tr>
        `;
        nota.textContent = "Podés agregar paquetes desde el formulario de abajo.";
        return;
      }

      paquetes.forEach(p => {
        tbody.innerHTML += `
          <tr>
            <td class="fw-semibold">${p.nombre_paquete ?? "—"}</td>
            <td class="text-break">${p.descripcion ?? "—"}</td>
            <td class="text-end">${money(p.precio)}</td>
            <td class="text-center">
              <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-id="${p.id}">Editar</button>
              <button class="btn btn-sm btn-outline-danger" data-action="del" data-id="${p.id}">Eliminar</button>
            </td>
          </tr>
        `;
      });

      nota.textContent = "Tip: usá “Editar” para cargar el paquete en el formulario y luego “Actualizar”.";
    }

    // ==========================
    // LOAD
    // ==========================
    async function cargarTodo() {
      if (!CUIDADOR_ID) {
        setEstado("warn", "No hay sesión activa de cuidador. Iniciá sesión para ver tu perfil.");
        document.getElementById("notaSesion").textContent =
          'Falta "id_cuidador" en localStorage. Guardalo al iniciar sesión.';
        // Dejar tabla vacía
        renderPaquetes([]);
        return;
      }

      setEstado("ok", "Cargando perfil y paquetes...");

      try {
        const cuidador = await fetchJSON(`${API_CUIDADORES}/${CUIDADOR_ID}`);
        if (!cuidador || !cuidador.id) {
          setEstado("warn", "El cuidador no está registrado. Verificá tu ID o registrate.");
          return;
        }
        renderCuidador(cuidador);

        const paquetes = await fetchJSON(`${API_PAQUETES}`);
        paquetesCache = Array.isArray(paquetes) ? paquetes : [];
        renderPaquetes(paquetesCache);
        actualizarUIAgregarPaquete();

        setEstado("", "");
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo cargar. Verificá que el backend esté corriendo y que las rutas existan.");
      }
    }

    // ==========================
    // PERFIL: UPDATE / DELETE
    // ==========================
    document.getElementById("formPerfil").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!CUIDADOR_ID) return;

      const body = {
        nombre: document.getElementById("nombre").value.trim(),
        franquicia: document.getElementById("franquicia").value.trim(),
        experiencia: Number(document.getElementById("experiencia").value || 0),
        poderes: document.getElementById("poderes").value.trim(),
        foto_perfil: document.getElementById("foto_perfil").value.trim()
      };

      try {
        setEstado("ok", "Guardando cambios del perfil...");
        await fetchJSON(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        setEstado("ok", "Perfil actualizado correctamente.");
        await cargarTodo();
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo actualizar el perfil. Revisá el backend y la consola.");
      }
    });

    document.getElementById("btnRecargar").addEventListener("click", () => {
      cargarTodo();
    });

    document.getElementById("btnEliminarCuenta").addEventListener("click", async () => {
      if (!CUIDADOR_ID) return;
      const ok = confirm("¿Seguro que querés eliminar tu cuenta? Esto eliminará tu perfil.");
      if (!ok) return;

      try {
        setEstado("ok", "Eliminando cuenta...");
        await fetchJSON(`${API_CUIDADORES}/${CUIDADOR_ID}`, { method: "DELETE" });
        setEstado("ok", "Cuenta eliminada.");
        localStorage.removeItem("id_cuidador");
        renderPaquetes([]);
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo eliminar la cuenta. Verificá que tu backend tenga DELETE /cuidadores/:id.");
      }
    });

    // ==========================
    // MODAL: CREAR PAQUETE (POST)
    // ==========================

    let paquetesCache = []; // lista actual de paquetes del cuidador
    document.getElementById("formPaqueteModal").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!CUIDADOR_ID) {
        setEstado("warn", "No hay sesión de cuidador. Iniciá sesión.");
        return;
      }

      const maximo = 3;

      // 1) Validación máximo
      if (paquetesCache.length >= maximo) {
        setEstado("warn", "Ya alcanzaste el máximo de 3 paquetes.");
        return;
      }

      const nombreSeleccionado = document.getElementById("m_nombre_paquete").value.trim();

      // 2) (Opcional pero recomendado) Evitar duplicados por nombre
      const yaExiste = paquetesCache.some(p =>
        String(p.nombre_paquete || "").toLowerCase() === nombreSeleccionado.toLowerCase()
      );
      if (yaExiste) {
        setEstado("warn", `Ya tenés creado el paquete "${nombreSeleccionado}". Elegí otro.`);
        return;
      }

      const payload = {
        nombre_paquete: nombreSeleccionado,
        descripcion: document.getElementById("m_descripcion").value.trim(),
        precio: Number(document.getElementById("m_precio").value || 0),
      };

      try {
        setEstado("ok", "Creando paquete...");
        await fetchJSON(`${API_PAQUETES}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        // limpiar inputs del modal
        document.getElementById("formPaqueteModal").reset();

        // cerrar modal
        const modalEl = document.getElementById("modalAgregarPaquete");
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();

        setEstado("ok", "Paquete agregado correctamente.");
        await cargarTodo(); // recarga paquetesCache + tabla + contador + botón
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo agregar el paquete. Verificá el backend (POST /cuidadores/:id/paquetes).");
      }
    });

    document.getElementById("btnAbrirModalPaquete")?.addEventListener("click", (e) => {
      if (paquetesCache.length >= 3) {
        e.preventDefault();
        setEstado("warn", "Ya alcanzaste el máximo de 3 paquetes.");
      }
    });

    function actualizarUIAgregarPaquete() {
      const btn = document.getElementById("btnAbrirModalPaquete");
      if (!btn) return;

      const maximo = 3;
      const cantidad = paquetesCache.length;

      if (cantidad >= maximo) {
        btn.disabled = true;
        btn.textContent = "Máximo de 3 paquetes";
      } else {
        btn.disabled = false;
        btn.textContent = "+ Agregar paquete";
      }
    }

    // ==========================
    // PAQUETES: CREATE / UPDATE
    // ==========================
    document.getElementById("formPaquete").addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!CUIDADOR_ID) return;

      const paqueteId = document.getElementById("paquete_id").value.trim();
      const payload = {
        // tu backend puede esperar nombre_paquete/descripcion/precio
        nombre_paquete: document.getElementById("nombre_paquete").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: Number(document.getElementById("precio").value || 0)
      };

      try {
        if (!paqueteId) {
          // CREAR
          setEstado("ok", "Creando paquete...");
          await fetchJSON(`${API_PAQUETES}/${paqueteId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          setEstado("ok", "Paquete creado.");
        } else {
          // ACTUALIZAR
          setEstado("ok", "Actualizando paquete...");
          await fetchJSON(`${API_PAQUETES}/${paqueteId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          setEstado("ok", "Paquete actualizado.");
        }

        resetFormPaquete();
        await cargarTodo();
      } catch (err) {
        console.error(err);
        setEstado("error", "No se pudo guardar el paquete. Revisá el backend (POST/PUT) y la consola.");
      }
    });

    document.getElementById("btnLimpiarPaquete").addEventListener("click", () => {
      resetFormPaquete();
    });

    // ==========================
    // PAQUETES: EDIT / DELETE (delegación)
    // ==========================
    document.getElementById("tbodyPaquetes").addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (!action || !id) return;

      if (action === "edit") {
        // Buscar paquete en la tabla (recargando desde API para mayor consistencia)
        try {
          const paquetes = await fetchJSON(`${API_PAQUETES}`);
          const p = (Array.isArray(paquetes) ? paquetes : []).find(x => String(x.id) === String(id));
          if (p) fillFormPaquete(p);
        } catch (err) {
          console.error(err);
          setEstado("error", "No se pudo cargar el paquete para edición.");
        }
      }

      if (action === "del") {
        const ok = confirm("¿Eliminar este paquete?");
        if (!ok) return;

        try {
          setEstado("ok", "Eliminando paquete...");
          await fetchJSON(`${API_PAQUETES}/${id}`, { method: "DELETE" });
          setEstado("ok", "Paquete eliminado.");
          resetFormPaquete();
          await cargarTodo();
        } catch (err) {
          console.error(err);
          setEstado("error", "No se pudo eliminar el paquete. Verificá tu backend (DELETE /paquetes/:id).");
        }
      }
    });

    // INIT
    resetFormPaquete();
    cargarTodo();
