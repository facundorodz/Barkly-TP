document.getElementById("form-superheroe").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        nombre_paquete: document.getElementById("nombre_paquete").value,
        descripcion: document.getElementById("descripcion").value,
        precio: document.getElementById("precio").value,
        //cupos_disponibles: document.getElementById("cupos_disponibles").value
    };

    const res = await fetch("http://localhost:3000/registrar_superheroe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const data = await res.json();
    alert(data.mensaje);
});

function checkInputs() {
    const inputNombreCuidador = document.getElementById("input-nombre") 
    const inputFranquicia = document.getElementById("input-franquicia")
    const inputPoderes = document.getElementById("input-poderes")
    const inputExperiencia = document.getElementById("input-experiencia")
    
    const CHEQUEO = true
    if (!inputNombreCuidador || 
        !inputFranquicia || 
        !inputPoderes || 
        !inputExperiencia ) { 
            alert('Debe añadir TODOS los datos.')
            CHEQUEO = false
        }
        // Chequeos particulares.
        else if (inputNombreCuidador.length > 120) { alert('El campo "nombre" no puede ser tan largo.'); CHEQUEO = false }
        else if (inputFranquicia.length > 100) { alert('El campo "franquicia" no puede ser tan largo.'); CHEQUEO = false }
        
        return CHEQUEO
}

function submitForm() {
    checkInputs()
}