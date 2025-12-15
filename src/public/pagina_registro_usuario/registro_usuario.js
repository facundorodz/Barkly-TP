document.querySelector("form").addEventListener("submit", async (e) => {
e.preventDefault();

const datos = {
    nombre_completo: document.getElementById("nombre").value,
    nombre_perfil: document.getElementById("perfil").value,
    contrasena: document.getElementById("password").value,
    cantidad_perros: document.getElementById("perros").value
};

const resp = await fetch("http://localhost:3000/registro_usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos)
});

const data = await resp.json();
alert(data.mensaje);
});

function chequearInputs() {
    const nombre_completo = document.getElementById("nombre").value
    const nombre_perfil = document.getElementById("perfil").value
    const contrasenia = document.getElementById("password").value

    if (!nombre_completo ||
        !nombre_perfil ||
        !contrasenia) {
            alert("Debes rellenar TODOS los campos")
        }
    else if (nombre_completo.length > 150) { alert('El campo "Nombre Completo" no puede superar los 150 carácteres.') }
    else if (nombre_perfil.length > 100) { alert('El campo "Nombre perfil" no puede superar los 150 carácteres.') }
    else if (contrasenia.length > 200) { alert('El campo "Contraseña" no puede superar los 150 carácteres.') }
}

function submitForm() {
    chequearInputs()
}