function submitForm() {
    const comentario = document.getElementById("comentario").value.trim();

    if (comentario === "") {
        alert("El comentario no puede estar vacío");
        return;
    }

    const datos = {
        comentario: comentario
    };

    console.log(datos);
}

function submitForm() {
    const comentario = document.getElementById("comentario").value.trim();

    if (comentario === "") {
        alert("El comentario no puede estar vacío");
        return;
    }

    const datos = {
        comentario: comentario
    };

    console.log(datos);

    if(comentario.trim() !== ""){
        localStorage.setItem("comentario", comentario);
    }

    alert("Datos guardados");
}

function emptyForm () {

        const comentario = document.getElementById("comentario").value.trim();
        
        if (comentario) {
            document.getElementById("comentario").value = ""
        }

}

document.getElementById("mi-formulario").addEventListener("submit", function (e) {
    e.preventDefault(); 

    submitForm();   
    emptyForm();  
});


const API_URL = "http://localhost:3000";

// ===============================
// OBTENER ID DESDE URL
// ===============================
const params = new URLSearchParams(window.location.search);
const cuidadorId = params.get("id");


const CUIDADOR_ID = obtenerIdCuidador();

if (!CUIDADOR_ID) {
  alert("ID de cuidador no encontrado");
  window.location.href = "/index.html";
}

// Llamar al backend
fetch(`/heros/${cuidadorId}`).then(res => res.json()).then(cuidador => {
    document.getElementById("foto").src = cuidador.foto_perfil;
    document.getElementById("nombre").textContent = cuidador.nombre;
    document.getElementById("franquicia").textContent = cuidador.franquicia;
    document.getElementById("experiencia").textContent = cuidador.experiencia;

    // Poderes como lista
    const lista = document.getElementById("lista-poderes");
    lista.innerHTML = "";

    cuidador.poderes.split(",").forEach(poder => {
      const li = document.createElement("li");
      li.textContent = poder.trim();
      lista.appendChild(li);
    });
  })
  .catch(() => {
    alert("Error al cargar el cuidador");
    window.location.href = "/index.html";
  });


// ===============================
// CARGAR PAQUETES
// ===============================
async function cargarPaquetes() {
  try {
    const res = await fetch(`${API_URL}/cuidadores/${CUIDADOR_ID}/paquetes`);
    if (!res.ok) throw new Error("Error al cargar paquetes");

    const paquetes = await res.json();
    const contenedor = document.getElementById("lista-paquetes");
    contenedor.innerHTML = "";

    if (paquetes.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12">
          <p class="text-muted">Este cuidador no tiene paquetes cargados.</p>
        </div>
      `;
      return;
    }

    paquetes.forEach(p => {
      contenedor.innerHTML += `
        <div class="col-md-4">
          <div class="card h-100">
            <div class="card-body">
              <h5 class="card-title">${p.nombre_paquete}</h5>
              <p class="card-text">${p.descripcion}</p>
            </div>
            <div class="card-footer text-end">
              <strong>$${p.precio}</strong>
            </div>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los paquetes");
  }
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  cargarCuidador();
  cargarPaquetes();
});


        
