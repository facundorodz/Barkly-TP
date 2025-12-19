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


        
