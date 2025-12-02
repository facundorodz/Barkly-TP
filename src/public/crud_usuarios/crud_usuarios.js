document.getElementById("profile_name").value = datos.nombre_perfil
document.getElementById("email").value = datos.email

let contenedor = document.getElementById("dogs_list")

datos.perros.forEach(dog => {
    let div = document.createElement("div")
    div.className = "dog-card"
    div.innerHTML = `
        <p>${dog.nombre}</p>
        <p>Raza: ${dog.raza}</p>
        <button onclick="editarPerro(${dog.id})">Editar</button>
        <button onclick="eliminarPerro(${dog.id})" class="danger">Eliminar</button>
    `
    contenedor.appendChild(div)
})

document.getElementById("btn_delete_user").addEventListener("click", async () => {
    const res = await fetch("/delete_user", {
        method: "DELETE"
    });

    if (res.redirected) {
        window.location.href = '/login.html';
    }
});
