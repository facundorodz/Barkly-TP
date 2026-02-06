<<<<<<< HEAD


const API_BASE_URL = "http://localhost:8080/api";
const API_CUIDADORES = `${API_BASE_URL}/cuidadores`;

const CUIDADOR_ID = 2;



function checkInputs() {
  const inputNombreCuidador = document.getElementById('nickname').value.trim();
  const inputFranquicia = document.getElementById('franquicia').value.trim();
  const inputPoderes = document.getElementById('poderes').value.trim();
  const inputExperiencia = document.getElementById('experiencia').value;
  const inputContrasena = document.getElementById('contrasena').value.trim();
  const inputPaquetesOfrecidos = document.getElementById('inputState')?.value;

  if (
    !inputNombreCuidador ||
    !inputFranquicia ||
    !inputPoderes ||
    !inputExperiencia ||
    !inputContrasena ||
    inputPaquetesOfrecidos === 'Elegir...'
  ) {
    alert('Debe añadir TODOS los datos.');
    return false;
  }

  if (inputNombreCuidador.length > 120) {
    alert('El campo "nombre" es demasiado largo.');
    return false;
  }

  if (inputFranquicia.length > 100) {
    alert('El campo "franquicia" es demasiado largo.');
    return false;
  }

  if (Number(inputExperiencia) <= 0) {
    alert('La experiencia debe ser mayor a 0.');
    return false;
  }

  return true;
}

const experiencia = document.getElementById('experiencia');
experiencia.addEventListener("input", () => {
  experiencia.value = experiencia.value.replace(/[^0-9]/g, "");
});


async function cargarCuidador() {
  try {
    const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
      credentials: "include"
    });

    const data = await res.json();

    document.getElementById("nombre-superheroe-header").textContent = data.nombre;
    document.getElementById("franquicia-header").textContent = data.franquicia;
    document.getElementById("contador-paquetes").textContent = data.paquetes_ofrecidos ?? 0;
    document.getElementById("profilePic").src = data.foto_perfil;

    document.getElementById("nickname").value = data.nombre;
    document.getElementById("franquicia").value = data.franquicia;
    document.getElementById("experiencia").value = data.experiencia;
    document.getElementById("poderes").value = data.poderes;
    document.getElementById("contrasena").value = data.contrasenia;

  } catch (err) {
    console.error("Error cargando cuidador:", err);
  }
}


document.getElementById("form-perfil").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkInputs()) return;

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
    credentials: "include",
    body: JSON.stringify(cambios),
  });

  alert("Datos actualizados");
  cargarCuidador();
});


document.getElementById("btn-eliminar-cuenta").addEventListener("click", async () => {
  if (!confirm("⚠️ ¿Estás seguro? Esta acción NO se puede deshacer")) return;

  try {
    const res = await fetch(`${API_CUIDADORES}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

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


const LIMITE_PAQUETES = 3;

async function cargarPaquetes() {
  try {
    const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`, {
      credentials: "include"
    });

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
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPaquete(${p.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    document.getElementById("contador-paquetes").textContent = paquetes.length;
  } catch (error) {
    console.error("Error cargando paquetes:", error);
  }
}

async function guardarPaquete() {
  const descripcion = document.getElementById("descripcion_paquete_modal").value.trim();
  const precio = Number(document.getElementById("precio_paquete_modal").value);

  if (!descripcion || precio <= 0) {
    alert("Datos inválidos");
    return;
  }

  await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ descripcion, precio })
  });

  cargarPaquetes();
}

async function eliminarPaquete(id) {
  if (!confirm("¿Eliminar paquete?")) return;

  await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  cargarPaquetes();
}


document.addEventListener("DOMContentLoaded", () => {
  cargarCuidador();
  cargarPaquetes();
});
=======

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
      document.getElementById("descripcion").value = "";
      document.getElementById("precio").value = "";

      document.getElementById("tituloFormPaquete").textContent = "Agregar paquete";
      document.getElementById("modoFormPaquete").textContent = "Modo: Crear";
      document.getElementById("btnGuardarPaquete").textContent = "Guardar";
    }

    function fillFormPaquete(p) {
      document.getElementById("paquete_id").value = p.id;
      document.getElementById("nombre_paquete").value = p.nombre_paquete ?? "";
      document.getElementById("descripcion").value = p.descripcion ?? "";
      document.getElementById("precio").value = p.precio ?? "";

      document.getElementById("tituloFormPaquete").textContent = "Editar paquete";
      document.getElementById("modoFormPaquete").textContent = `Modo: Editar (ID ${p.id})`;
      document.getElementById("btnGuardarPaquete").textContent = "Actualizar";
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
      document.getElementById("contrasenia").value = c.contrasenia ?? "";
      const togglePassword = document.getElementById("togglePassword");
      const passwordInput = document.getElementById("contrasenia");

      if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", () => {
          const isPassword = passwordInput.type === "password";
          passwordInput.type = isPassword ? "text" : "password";
          togglePassword.textContent = isPassword ? "🙈" : "👁";
        });
      }
      document.getElementById("foto_perfil").value = c.foto_perfil ?? "";

      document.getElementById("nombreHeader").textContent = c.nombre ?? "Perfil del cuidador";
      document.getElementById("franquiciaHeader").textContent = c.franquicia ?? "Sin franquicia";
      document.getElementById("experienciaHeader").textContent = (c.experiencia ?? "—");
      document.getElementById("poderesHeader").textContent = (c.poderes ?? "—");

      if (c.foto_perfil) document.getElementById("avatar").src = c.foto_perfil;
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
        setEstado("error", "No se pudo cargar los datos.");
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
        contrasenia: document.getElementById("contrasenia").value.trim(),
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
>>>>>>> origin/main
