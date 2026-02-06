function checkInputs() {
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




