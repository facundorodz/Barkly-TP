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