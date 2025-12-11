function agregarPaquetes() {
    window.location.href = "../crear_post/crear_post.html"
}


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

function submitForm() {
    checkInputs()
    // conexión a la BD.
}