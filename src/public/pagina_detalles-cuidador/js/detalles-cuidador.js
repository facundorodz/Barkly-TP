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

/*document.getElementById("mi-formulario").addEventListener("submit", function (e) {
    e.preventDefault(); 

    submitForm();   
    emptyForm();  
});*/




// ===============================
// OBTENER ID DESDE URL
// ===============================

const params = new URLSearchParams(window.location.search);
const cuidadorId = params.get("id");
const API_URL = "http://localhost:3000/cuidadores";

if (!cuidadorId) {
  alert("Cuidador no encontrado");
  window.location.href = "/index.html";
}

// Llamar al backend
fetch(`${API_URL}/${cuidadorId}`)
  .then(res => res.json())
  .then(cuidador => {
    document.getElementById("profilePic").src = cuidador.foto_perfil;
    document.getElementById("nombre-cuidador").textContent = cuidador.nombre;
    document.getElementById("franquicia-cuidador").textContent.textContent =
      `${cuidador.franquicia} - ${cuidador.experiencia} años`;

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
// CARGAR PAQUETES (aun no anda)
// ===============================
/*async function cargarPaquetes(id) {
  try {
    const res = await fetch(`${API_URL}/cuidadores/${CUIDADOR_ID}/paquetes`);
    if (!res.ok) throw new Error("Error al cargar paquetes");

    const paquetes = await res.json();

    console.log("Paquetes recibidos:", paquetes);
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
        <div class="col-md-3">
          <div class="paquetes">

            <h2 id="nombre-paquete">${p.nombre_paquete}</h2>
            <hr>
            <h3 id="descripcion-paquete">${p.descripcion}</h3>
            <ul> 
              <li> Actividad 1</li>
              <li> Actividad 2</li>
              <li> Actividad 3</li>
              <li> Actividad 4</li>
            </ul>

            <hr>

            <div class="row">
              <p class="col-md-4 d-flex" id="precio-header"> PRECIO: </p>
              <p class="col-md-4 d-flex" id="precio">$${p.precio}</p>
            </div>

            <button type="button" class="btn btn-light anadir"> Contratar paquete </button>
          </div>
        </div>
      `;
    });

  } catch (error) {
    console.error(error);
    alert("No se pudieron cargar los paquetes");
  }
}*/



        
