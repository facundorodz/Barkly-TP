/*const params = new URLSearchParams(window.location.search);
const idCuidador = params.get("id");*/
const API_BASE = "http://localhost:8080"; // <- tu backend real
const API_PREFIX = "/api"

const ENDPOINTS = {
  cuidador: (id) => `${API_BASE}${API_PREFIX}/cuidadores/${id}`,
  paquetes: (id) => `${API_BASE}${API_PREFIX}/cuidadores/${id}/paquetes`,
  promedioResenias: (id) => `${API_BASE}${API_PREFIX}/resenias/promedio/${id}`,
};

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

function getIdCuidadorElegido() {
  // 1) URL (?id=123)
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("id");
  const idUrl = Number(raw);

  if (Number.isInteger(idUrl) && idUrl > 0) return idUrl;

  // 2) Fallback: localStorage (por si abrís la página sin ?id)
  const rawLS = localStorage.getItem("cuidadorSeleccionadoId");
  const idLS = Number(rawLS);

  if (Number.isInteger(idLS) && idLS > 0) return idLS;

  return null;
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
      window.location.href = `/checkout.html?idCuidador=${encodeURIComponent(idCuidador)}&idPaquete=${encodeURIComponent(idPaquete)}`;

      // B) Si preferís POST directo, te lo agrego.
    });
  });
}



  /*const API_BASE = "http://localhost:8080"; // <- tu backend real
  const API_PREFIX = "/api";

  const ENDPOINTS = {
    cuidador: (id) => `${API_BASE}${API_PREFIX}/cuidadores/${id}`,
    paquetes: (id) => `${API_BASE}${API_PREFIX}/cuidadores/${id}/paquetes`,
    promedioResenias: (id) => `${API_BASE}${API_PREFIX}/resenias/promedio/${id}`,
  };

  // -----------------------------
  // ✅ Obtener ID del cuidador elegido
  // -----------------------------
  function getIdCuidadorElegido() {
    // 1) URL (?id=123)
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("id");
    const idUrl = Number(raw);

    if (Number.isInteger(idUrl) && idUrl > 0) return idUrl;

    // 2) Fallback: localStorage (por si abrís la página sin ?id)
    const rawLS = localStorage.getItem("cuidadorSeleccionadoId");
    const idLS = Number(rawLS);

    if (Number.isInteger(idLS) && idLS > 0) return idLS;

    return null;
  }

  const idCuidador = getIdCuidadorElegido();

  // -----------------------------
  // Helpers UI
  // -----------------------------
  const $ = (id) => document.getElementById(id);

  function setText(id, value, fallback = "—") {
    const el = $(id);
    if (!el) return;
    el.textContent = value ?? fallback;
  }

  function splitToList(texto) {
    return String(texto ?? "")
      .split(/[\n,;•-]+/g)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  function money(v) {
    if (v === null || v === undefined || v === "") return "—";
    return `$${v}`;
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderBones(promedio) {
    const cont = $("calificacionBones");
    if (!cont) return;

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

  function renderPoderes(poderes) {
    const ul = $("listaPoderes");
    const fallback = $("poderesFallback");

    if (ul) ul.innerHTML = "";
    if (fallback) fallback.textContent = "";

    const items = Array.isArray(poderes) ? poderes : splitToList(poderes);

    if (!items.length) {
      if (fallback) fallback.textContent = "—";
      return;
    }

    if (!ul) return;
    items.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      ul.appendChild(li);
    });
  }

  function paqueteCardHTML(paquete, idx) {
    const nombre = paquete.nombre_paquete || `Paquete ${idx + 1}`;
    const actividades = splitToList(paquete.descripcion);

    const actividadesHTML = (actividades.length ? actividades : ["Sin descripción"])
      .map((a) => `<li>${escapeHtml(a)}</li>`)
      .join("");

    return `
      <div class="card card-accent">
        <h3 class="card-title">${escapeHtml(nombre)}</h3>
        <div class="divider"></div>

        <p class="pack-label">Descripción:</p>
        <ul class="list">
          ${actividadesHTML}
        </ul>

        <div class="divider"></div>

        <div class="price-row">
          <span>PRECIO:</span>
          <strong>${money(paquete.precio)}</strong>
        </div>

        <button class="btn" data-id="${paquete.id}">Contratar paquete</button>
      </div>
    `;
  }

  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${url} - ${t}`);
    }
    return res.json();
  }

  // -----------------------------
  // Carga principal
  // -----------------------------
  async function cargarDetallePublico() {
    if (!idCuidador) {
      alert("No se encontró la ID del cuidador. Abrí la página con ?id= (ej: detalles-cuidador.html?id=1).");
      return;
    }

    // 1) CUIDADOR
    const cuidador = await fetchJSON(ENDPOINTS.cuidador(idCuidador));

    setText("cuidadorNombre", cuidador.nombre, "Nombre cuidador");
    setText("cuidadorFranquicia", cuidador.franquicia, "Franquicia");
    setText("cuidadorExperiencia", `${cuidador.experiencia ?? 0} años`, "0 años");

    renderPoderes(cuidador.poderes);

    // 2) PROMEDIO RESEÑAS (si existe endpoint)
    try {
      const prom = await fetchJSON(ENDPOINTS.promedioResenias(idCuidador));
      renderBones(Number(prom?.promedio || 0));
    } catch {
      renderBones(0);
    }

    // 3) PAQUETES
    const grid = $("packsGrid");
    if (grid) grid.innerHTML = "";

    let paquetes = [];
    try {
      const data = await fetchJSON(ENDPOINTS.paquetes(idCuidador));
      paquetes = Array.isArray(data) ? data : [];
    } catch {
      paquetes = [];
    }

    if (!grid) return;

    if (paquetes.length === 0) {
      grid.innerHTML = `
        <div class="card card-accent">
          <h3 class="card-title">Sin paquetes</h3>
          <div class="divider"></div>
          <p class="pack-sub">Este cuidador aún no cargó paquetes.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = paquetes.slice(0, 3).map((p, i) => paqueteCardHTML(p, i)).join("");

    grid.querySelectorAll("button[data-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idPaquete = btn.getAttribute("data-id");
        window.location.href =
          `/checkout.html?idCuidador=${encodeURIComponent(idCuidador)}&idPaquete=${encodeURIComponent(idPaquete)}`;
      });
    });
  }*/

  // -----------------------------
  // Init
  // -----------------------------
  /*document.addEventListener("DOMContentLoaded", () => {
    cargarDetallePublico().catch((err) => {
      console.error("Error cargando detalle:", err);
      alert("No se pudo cargar el detalle del cuidador. Revisá consola y endpoints.");
    });
  });*/



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
  /*cargarDetallePublico().catch((err) => {
    console.error("Error cargando detalle:", err);
    alert("No se pudo cargar el detalle del cuidador. Revisá consola y endpoints.");
  });*/

  // opcional
  //cargarResenias();
});

// init
/*cargarDetallePublico().catch((err) => {
  console.error("Error cargando detalle:", err);
  alert("No se pudo cargar el detalle del cuidador. Revisá consola y endpoints.");
});*/
cargarCuidadorYPaquetes().catch(err => {
  console.error(err);
  alert("Error cargando detalle. Revisá backend y endpoints.");
});
