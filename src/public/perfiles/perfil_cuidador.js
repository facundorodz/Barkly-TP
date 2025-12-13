function checkInputs() {
    const inputNombreCuidador = document.getElementById('nickname').value
    const inputFranquicia = document.getElementById('franquicia').value
    const inputPoderes = document.getElementById('poderes').value
    const inputExperiencia = document.getElementById('experiencia').value
    const inputContrasena = document.getElementById('contrasena').value
    const inputPaquetesOfrecidos = document.getElementById('inputState').value
    
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

// Evito los carácteres incorrectos en los campos (inputs) que solo utilizan números (como años de experiencia ó precio)
function evitarCaracteresIncorrectos(id_campo) {
    const campo = document.getElementById(id_campo)
    campo.addEventListener("input", () => {
      campo.value = campo.value.replace(/[^0-9]/g, "")
    });
}

evitarCaracteresIncorrectos("experiencia")
evitarCaracteresIncorrectos("precio-plan-basico")

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
        <input type="text" class="form-control w-75 mx-auto" id="precio-plan-premium">
        <hr>
    `;
    modal.appendChild(planPremium);
    evitarCaracteresIncorrectos("precio-plan-premium")
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
        <input type="text" class="form-control w-75 mx-auto" id="precio-plan-deluxe">
        <hr>
    `;
    modal.appendChild(planDeluxe);
    evitarCaracteresIncorrectos("precio-plan-deluxe")
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