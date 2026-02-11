const params = new URLSearchParams(window.location.search);
const idCuidador = params.get("id");

function splitToList(texto) {
  return String(texto ?? "")
    .split(/[\n,;•-]+/g)  
    .map(s => s.trim())
    .filter(Boolean);
}

function money(v) {
  if (v === null || v === undefined || v === "") return "—";
  return `$${v}`;
}

function renderBones(promedio) {
  const cont = document.getElementById("calificacionBones");
  cont.innerHTML = "";
  const n = Math.max(0, Math.min(5, Math.round(Number(promedio || 0))));
  for (let i = 0; i < 5; i++) {
    const span = document.createElement("span");
    span.className = "bone";
    span.style.opacity = i < n ? "1" : ".25";
    span.innerHTML = "<i></i>";
    cont.appendChild(span);
  }
}

// Render poderes como lista
function renderPoderes(poderes) {
  const ul = document.getElementById("listaPoderes");
  //const fallback = document.getElementById("poderesFallback");
  ul.innerHTML = "";
  //fallback.textContent = "";

  let items = [];
  if (Array.isArray(poderes)) items = poderes;
  else items = splitToList(poderes);

  if (items.length === 0) {
    //fallback.textContent = "—";
    return;
  }

  items.forEach(p => {
    const li = document.createElement("li");
    li.textContent = p;
    ul.appendChild(li);
  });
}

// Render un paquete con lista de actividades (descripción)
function paqueteCardHTML(paquete, idx) {
  const nombre = paquete.nombre_paquete || `Paquete ${idx + 1}`;
  const actividades = splitToList(paquete.descripcion);

  const actividadesHTML = (actividades.length ? actividades : ["Sin descripción"])
    .map(a => `<li>${a}</li>`)
    .join("");

  return `
    <div class="card card-accent">
      <h3 class="card-title">${nombre}</h3>
      <div class="divider"></div>

      <p class="pack-label">Descripción:</p>
      <ul class="list">
        ${actividadesHTML}
      </ul>

      <div class="divider"></div>

      <div class="price-row">
        <strong>${money(paquete.precio)}</strong>
      </div>

      <button class="btn" data-id="${paquete.id}">Contratar paquete</button>
    </div>
  `;
}

async function cargarCuidadorYPaquetes() {
  if (!idCuidador) {
    alert("Falta ?id= en la URL");
    return;
  }

  // 1) cuidador
  const r1 = await fetch(`http://localhost:8080/api/cuidadores/${idCuidador}`);
  if (!r1.ok) throw new Error("No se pudo obtener el cuidador");
  const c = await r1.json();

  document.getElementById("cuidadorNombre").textContent = c.nombre ?? "Nombre cuidador";
  document.getElementById("cuidadorFranquicia").textContent = c.franquicia ?? "Franquicia";
  document.getElementById("cuidadorExperiencia").textContent = `${c.experiencia ?? "0"} años`;

  renderPoderes(c.poderes);

  // si tu backend devuelve promedio de calificación:
  renderBones(c.calificacion_promedio || c.promedio || 0);

  // 2) paquetes
  const r2 = await fetch(`http://localhost:8080/api/cuidadores/${idCuidador}/paquetes`);
  if (!r2.ok) throw new Error("No se pudieron obtener los paquetes");
  const paquetes = await r2.json();

  const grid = document.getElementById("packsGrid");
  grid.innerHTML = "";

  const list = Array.isArray(paquetes) ? paquetes : [];

  // Si querés forzar 3 columnas siempre (aunque falten), podríamos crear placeholders.
  if (list.length === 0) {
    grid.innerHTML = `<div class="card card-accent"><h3 class="card-title">Sin paquetes</h3><div class="divider"></div><p class="pack-sub">Este cuidador aún no cargó paquetes.</p></div>`;
    return;
  }

  // Render
  grid.innerHTML = list.slice(0, 3).map((p, i) => paqueteCardHTML(p, i)).join("");

  // botones contratar
  grid.querySelectorAll("button[data-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idPaquete = btn.getAttribute("data-id");

      // A) Redirigir a checkout (recomendado)
      window.location.href =
        `/checkout.html?idCuidador=${encodeURIComponent(idCuidador)}&idPaquete=${encodeURIComponent(idPaquete)}`;

      // B) Si preferís POST directo, te lo agrego.
    });
  });
}

/* =========================
   RESEÑAS (mismo estilo)
========================= */

let rating = 0;

function paintStars(value) {
  document.querySelectorAll(".star").forEach(s => {
    const v = Number(s.dataset.value);
    s.textContent = v <= value ? "★" : "☆";
    s.classList.toggle("active", v <= value);
  });
}

function initStars() {
  const stars = document.querySelectorAll(".star");
  stars.forEach(star => {
    const v = Number(star.dataset.value);

    // hover izq -> der
    star.addEventListener("mouseenter", () => paintStars(v));
    star.addEventListener("mouseleave", () => paintStars(rating));

    // click fija calificación
    star.addEventListener("click", () => {
      rating = v;
      paintStars(rating);
    });
  });

  paintStars(0);
}

async function enviarResenia() {
  const msg = document.getElementById("reviewMsg");
  const text = document.getElementById("reviewText").value.trim();

  if (!idCuidador) {
    msg.textContent = "Falta el id del cuidador.";
    return;
  }
  if (rating < 1 || rating > 5) {
    msg.textContent = "Seleccioná una calificación (1 a 5).";
    return;
  }
  if (text.length < 5) {
    msg.textContent = "La reseña es muy corta (mínimo 5 caracteres).";
    return;
  }

  msg.textContent = "Enviando reseña...";

  // Si tenés login: id_usuario en localStorage (opcional)
  //const idUsuario = localStorage.getItem("id_usuario");
  const DEBUG_ID_USUARIO = 1;

  const payload = {
    //id_usuario: idUsuario ? Number(idUsuario) : null,
    id_usuario: DEBUG_ID_USUARIO,
    id_superheroe: Number(idCuidador),
    calificacion: rating,
    comentario: text
  };

  try {
    const res = await fetch(`http://localhost:8080/api/cuidadores/resenias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${t}`);
    }

    const data = await res.json();

    // ✅ actualizar bloque “Calificación” del cuidador
    renderBones(Number(data.calificacion?.promedio || 0));

    msg.textContent = "¡Gracias! Reseña guardada ✅";
    document.getElementById("reviewText").value = "";
    rating = 0;
    paintStars(0);

    // (Opcional) recargar listado
    await cargarResenias();

  } catch (err) {
    console.error(err);
    msg.textContent = "No se pudo guardar la reseña. Revisá el endpoint /resenias.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initStars();

  const btn = document.getElementById("btnSendReview");
  if (btn) btn.addEventListener("click", enviarResenia);

  // opcional
  //cargarResenias();
});

// init
cargarCuidadorYPaquetes().catch(err => {
  console.error(err);
  alert("Error cargando detalle. Revisá backend y endpoints.");
});
