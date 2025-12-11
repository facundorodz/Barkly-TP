function submitForm() {
    checkInputs()
    // conexión a la BD.
}

function checkInputs() {
    const inputNombreCuidador = document.getElementById('nickname').value
    const inputFranquicia = document.getElementById('franquicia').value
    const inputPoderes = document.getElementById('poderes').value
    const inputContrasena = document.getElementById('contrasena').value
    const inputPaquetesOfrecidos = document.getElementById('inputState').value

    if (!inputNombreCuidador || !inputFranquicia || !inputPoderes || !inputContrasena || inputPaquetesOfrecidos == 'Elegir...') {
        alert('Debe añadir TODOS los datos.')
        return false;
    }
}