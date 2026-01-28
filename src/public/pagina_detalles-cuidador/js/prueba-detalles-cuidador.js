const API = "http://localhost:3000";

const params = new URLSearchParams(window.location.search);
const idCuidador = params.get("id");

let paquetes = [];

/* ========================
   CARGAR DATOS
======================== */
async function cargarCuidador() {
  const res = await fetch(`${API}/cuidadores/${idCuidador}`);
  if (!res.ok) throw new Error("No se pudo obtener el cuidador");

  const c = await res.json();

  document.getElementById("nombre").textContent = c.nombre ?? "Cuidador";
  document.getElementById("franquicia").textContent = c.franquicia ?? "—";
  document.getElementById("experiencia").textContent = c.experiencia ?? "—";
  document.getElementById("poderes").textContent = c.poderes ?? "—";
  document.getElementById("descripcion").textContent = c.descripcion ?? "—";
}

async function cargarPaquetes() {
  const res = await fetch(`${API}/cuidadores/${idCuidador}/paquetes`);
  if (!res.ok) throw new Error("No se pudieron obtener los paquetes");

  paquetes = await res.json();
  if (!Array.isArray(paquetes)) paquetes = [];

  const contenedor = document.getElementById("listaPaquetes");
  contenedor.innerHTML = "";

  if (paquetes.length === 0) {
    contenedor.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning mb-0">
          Este cuidador todavía no tiene paquetes cargados.
        </div>
      </div>
    `;
    return;
  }

  paquetes.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const nombre = p.nombre_paquete ?? "Paquete";
    const descripcion = p.descripcion ?? "Sin descripción";
    const precio = p.precio ?? 0;

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <div class="card-body d-flex flex-column">
          <h5 class="mb-1">${nombre}</h5>
          <p class="text-muted small flex-grow-1">${descripcion}</p>
          <div class="d-flex align-items-center justify-content-between mt-2">
            <span class="fw-bold">$${precio}</span>
            <button class="btn btn-primary btn-sm" data-id="${p.id}">
              Contratar
            </button>
          </div>
        </div>
      </div>
    `;

    col.querySelector("button").addEventListener("click", () => {
      contratarPaquete(p.id);
    });

    contenedor.appendChild(col);
  });
}

/* ========================
   CONTRATAR (sin formulario)
======================== */

/**
 * OPCIÓN 1 (RECOMENDADA): Redirigir a otra página de checkout/contratación
 * (podés crearla después)
 */
function contratarPaquete(idPaquete) {
  // Ejemplo de redirección:
  // checkout.html recibe cuidador y paquete por querystring
  window.location.href =
    `/checkout.html?idCuidador=${encodeURIComponent(idCuidador)}&idPaquete=${encodeURIComponent(idPaquete)}`;
}

/**
 * OPCIÓN 2: Si ya tenés endpoint, podés hacer POST directo en vez de redirect.
 * Descomentá esto y comentá la función de arriba si lo querés así.
 */
/*
async function contratarPaquete(idPaquete) {
  try {
    const payload = {
      id_superheroe: Number(idCuidador),
      id_paquete: Number(idPaquete),
      estado: "pendiente"
    };

    const res = await fetch(`${API}/contrataciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error al contratar");
    alert("Solicitud enviada correctamente");
  } catch (err) {
    console.error(err);
    alert("No se pudo enviar la solicitud");
  }
}
*/

/* ========================
   RESEÑAS
======================== */

let calificacion = 0;

const estrellas = document.querySelectorAll(".estrella");
const comentarioInput = document.getElementById("comentarioResenia");
const btnEnviarResenia = document.getElementById("btnEnviarResenia");
const estadoResenia = document.getElementById("estadoResenia");

function pintarEstrellas(valor) {
  estrellas.forEach(e => {
    const v = Number(e.dataset.valor);
    e.textContent = v <= valor ? "★" : "☆";
    e.classList.toggle("activa", v <= valor);
  });
}

estrellas.forEach(e => {
  const valor = Number(e.dataset.valor);

  // Hover (izq → der)
  e.addEventListener("mouseenter", () => {
    pintarEstrellas(valor);
  });

  // Salir del hover → vuelve a la selección real
  e.addEventListener("mouseleave", () => {
    pintarEstrellas(calificacion);
  });

  // Click → fija la calificación
  e.addEventListener("click", () => {
    calificacion = valor;
    pintarEstrellas(calificacion);
  });
});

btnEnviarResenia.addEventListener("click", async () => {
  const comentario = comentarioInput.value.trim();

  if (calificacion === 0) {
    estadoResenia.innerHTML =
      `<div class="alert alert-warning">Seleccioná una calificación.</div>`;
    return;
  }

  if (comentario.length < 5) {
    estadoResenia.innerHTML =
      `<div class="alert alert-warning">El comentario es muy corto.</div>`;
    return;
  }

  try {
    const payload = {
      id_superheroe: Number(idCuidador),
      calificacion,
      comentario
      // id_usuario: localStorage.getItem("id_usuario")  // si tenés login
    };

    const res = await fetch(`${API}/resenias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Error al guardar reseña");

    estadoResenia.innerHTML =
      `<div class="alert alert-success">¡Gracias por tu reseña!</div>`;

    comentarioInput.value = "";
    calificacion = 0;
    pintarEstrellas(0);

  } catch (err) {
    console.error(err);
    estadoResenia.innerHTML =
      `<div class="alert alert-danger">No se pudo enviar la reseña.</div>`;
  }
});


/* ========================
   INIT
======================== */
(async () => {
  try {
    if (!idCuidador) {
      alert("Falta el ID del cuidador en la URL (?id=).");
      return;
    }
    await cargarCuidador();
    await cargarPaquetes();
  } catch (err) {
    console.error(err);
    alert("Error cargando el detalle del cuidador. Revisá el backend.");
  }
})();
