document.getElementById("cuidador-form").addEventListener("submit", async (e) => {
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

const experiencia = document.getElementById("input-experiencia");
experiencia.addEventListener("input", () => {
  experiencia.value = experiencia.value.replace(/[^0-9]/g, "");
});

function checkInputs() {
    const inputNombreCuidador = document.getElementById("input-nombre").value
    const inputFranquicia = document.getElementById("input-franquicia").value
    const inputPoderes = document.getElementById("input-poderes").value
    const inputExperiencia = document.getElementById("input-experiencia").value
    
    let CHEQUEO = true
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
        else if (inputExperiencia < 0) { alert('El campo "experiencia" contiene un número MENOR a 0'); CHEQUEO = false}
        
        return CHEQUEO
}

function submitForm() {
    checkInputs()
}