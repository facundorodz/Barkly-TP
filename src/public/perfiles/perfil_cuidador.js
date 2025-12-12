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