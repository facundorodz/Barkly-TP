// ===============================
// CONFIGURACIÓN
// ===============================
const API_BASE = "http://localhost:3000";
const CUIDADOR_ID = 2; // ⚠️ luego lo reemplazás por sesión/login

// ===============================
// ELEMENTOS DEL DOM
// ===============================
const btnGuardar = document.getElementById("btn-guardar-paquete");
const inputNombre = document.getElementById("nombre_paquete");
const inputDescripcion = document.getElementById("descripcion_paquete");
const inputPrecio = document.getElementById("precio_paquete");
const mensaje = document.getElementById("mensaje");

// ===============================
// EVENTO PRINCIPAL
// ===============================
btnGuardar.addEventListener("click", guardarPaquete);

// ===============================
// FUNCIÓN GUARDAR PAQUETE
// ===============================
async function guardarPaquete() {
  const nombre_paquete = inputNombre.value.trim();
  const descripcion = inputDescripcion.value.trim();
  const precio = Number(inputPrecio.value);

  // ===============================
  // VALIDACIONES
  // ===============================
  if (!nombre_paquete || !descripcion || !precio) {
    alert("Completá todos los campos");
    return;
  }

  if (precio <= 0) {
    alert("El precio debe ser mayor a 0");
    return;
  }

  const paquete = {
    nombre_paquete,
    descripcion,
    precio
  };

  try {
    const res = await fetch(
      `${API_BASE}/cuidadores/${CUIDADOR_ID}/paquetes`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paquete)
      }
    );

    if (!res.ok) {
      throw new Error("Error al guardar paquete");
    }

    // ===============================
    // ÉXITO
    // ===============================
    mostrarMensajeExito();
    limpiarInputs();

  } catch (error) {
    console.error(error);
    alert("No se pudo guardar el paquete");
  }
}

// ===============================
// FUNCIONES AUXILIARES
// ===============================
function limpiarInputs() {
  inputNombre.value = "";
  inputDescripcion.value = "";
  inputPrecio.value = "";
}

function mostrarMensajeExito() {
  mensaje.classList.remove("d-none");

  setTimeout(() => {
    mensaje.classList.add("d-none");
  }, 3000);
}
