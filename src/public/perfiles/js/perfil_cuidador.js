function checkInputs() {
    const inputNombreCuidador = document.getElementById('nickname').value
    const inputFranquicia = document.getElementById('franquicia').value
    const inputPoderes = document.getElementById('poderes').value
    const inputExperiencia = document.getElementById('experiencia').value
    const inputContrasena = document.getElementById('contrasena').value
    const inputPaquetesOfrecidos = document.getElementById('inputState').value
    const btnLimpiarPaquete = document.getElementById("btn-limpiar-paquete");
    const formPaquete = document.getElementById("form-paquete");


    btnLimpiarPaquete.addEventListener("click", () => {
      // Limpia todos los campos visibles
      formPaquete.reset();

      // Limpia el ID oculto (sale del modo edición)
      document.getElementById("paquete_id").value = "";
    });
    
    const CHEQUEO = true
    // Chequeo general.
    if (!inputNombreCuidador || 
        !inputFranquicia || 
        !inputPoderes || 
        !inputExperiencia || 
        !inputContrasena || 
        inputPaquetesOfrecidos == 'Elegir...') {
            alert('Debe añadir TODOS los datos.')
            CHEQUEO = false
        }
        // Chequeos particulares.
        else if (inputNombreCuidador.length > 120) { alert('El campo "nombre" no puede ser tan largo.'); CHEQUEO = false }
        else if (inputFranquicia.length > 100) { alert('El campo "franquicia" no puede ser tan largo.'); CHEQUEO = false }
        else if (inputExperiencia <= 0) { alert('El campo "experiencia" contiene un valor 0 o menor.'); CHEQUEO = false }
        
        return CHEQUEO 
    }

// Chequeo para evitar que se pongan letras en el campo "experiencia"
const experiencia = document.getElementById('experiencia')

experiencia.addEventListener("input", () => {
  experiencia.value = experiencia.value.replace(/[^0-9]/g, "")
})

function submitForm() { // Sube el form() de los datos de usuario.
    checkInputs()
}

function crearPlanPremium() {
    const modal = document.getElementById("cuerpo-modal")
    const planPremium = document.createElement("div");
    planPremium.classList.add("plan-item");
    planPremium.setAttribute("id", "plan-premium");
    
    planPremium.innerHTML = `
        <h2>Plan Premium</h2>
        <hr>
        <label>Descripción</label>
        <input type="text" class="form-control w-75 mx-auto">
        <label>Precio</label>
        <input type="text" class="form-control w-75 mx-auto">
        <hr>
    `;
    modal.appendChild(planPremium);
}

function crearPlanDeluxe() {    
    const modal = document.getElementById("cuerpo-modal");
    const planDeluxe = document.createElement("div");
    planDeluxe.classList.add("plan-item");
    planDeluxe.setAttribute("id", "plan-deluxe");
    
    planDeluxe.innerHTML = `
        <h2>Plan Deluxe</h2>
        <hr>
        <label>Descripción</label>
        <input type="text" class="form-control w-75 mx-auto">
        <label>Precio</label>
        <input type="text" class="form-control w-75 mx-auto">
        <hr>
    `;
    modal.appendChild(planDeluxe);
}

let plan_activo = "basico";
function agregarPaquetes() {
    if (plan_activo == "basico") {
        crearPlanPremium();
        plan_activo = "premium";
    } else if (plan_activo == "premium") {
        crearPlanDeluxe();
        plan_activo = "deluxe";
    } else { alert("¡No puedes tener más de 3 planes!") }
}

function eliminarPaquete() {
    if (plan_activo == "deluxe") {
        planSeleccionado = document.getElementById("plan-deluxe");
        plan_activo = "premium"
    } else if (plan_activo == "premium") {
        planSeleccionado = document.getElementById("plan-premium");
        plan_activo = "basico"
    } else if (plan_activo == "basico") { alert("No puede eliminar el plan básico") }
    planSeleccionado.remove()
}

function cancelar() {
    if (plan_activo == "deluxe") { // Es porque existe tanto el deluxe como el premium.
        planDeluxe = document.getElementById("plan-deluxe");
        planPremium = document.getElementById("plan-premium");
        planDeluxe.remove()
        planPremium.remove()
    } else if (plan_activo == "premium") { // Es porque existe solo el premium.
        planPremium = document.getElementById("plan-premium");
        planPremium.remove()
    } plan_activo = "basico"
}


const API_URL = "http://localhost:3000/cuidadores";
const CUIDADOR_ID = 2;

    // ===============================
    // CARGAR DATOS DEL CUIDADOR
    // ===============================
    async function cargarCuidador() {
      try {
        const res = await fetch(`${API_URL}/${CUIDADOR_ID}`);
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

      await fetch(`${API_URL}/${CUIDADOR_ID}`, {
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
      if (!confirm("¿Seguro que querés eliminar este cuidador?")) return;

      await fetch(`${API_URL}/${CUIDADOR_ID}`, {
        method: "DELETE"
      });

      alert("Cuenta eliminada");
    });


  // ===============================
  // CARGAR LISTA DE PAQUETES
  // ===============================
  async function cargarPaquetes() {
    try {
      const res = await fetch(`http://localhost:3000/cuidadores/${CUIDADOR_ID}/paquetes`);
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

      // 🔥 EL CONTADOR SIEMPRE SE ACTUALIZA DESDE LA BDD
      document.getElementById("contador-paquetes").textContent = paquetes.length;
    } catch (error) {
      console.error("Error cargando paquetes:", error);
    }
  }

  function cargarFormularioPaquete(p) {
    document.getElementById("paquete_id").value = p.id;
    document.getElementById("nombre_paquete").value = p.nombre_paquete;
    document.getElementById("descripcion_paquete").value = p.descripcion;
    document.getElementById("precio_paquete").value = p.precio;
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

  async function eliminarPaquete(id) {
    if (!confirm("Eliminar paquete?")) return;

    await fetch(`${API_URL}/paquetes/${id}`, { method: "DELETE" });

    cargarPaquetes();
  }

    // ===============================
    // AL CARGAR LA PÁGINA
    // ===============================
    cargarCuidador();
    cargarPaquetes();