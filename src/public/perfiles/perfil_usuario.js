
function displayProfilePic() {
    const input = document.getElementById("photo");
    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const url = e.target.result;
        document.getElementById("profilePic").src = url;

        localStorage.setItem("profilePic", url);
    };
    reader.readAsDataURL(file);
}
////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.getItem("profilePic");

    if (savedImage) {
        document.getElementById("profilePic").src = savedImage;
    }
});
////////////////////////////

function submitForm() {
    const datos = {
        nickname: document.getElementById("nickname").value,
        nombre: document.getElementById("nombre").value,
        password: document.getElementById("contrasena").value,
        perros: document.getElementById("inputState").value,
        mascotas: JSON.parse(localStorage.getItem("mascotas")) || []
    };

    localStorage.setItem("perfilUsuario", JSON.stringify(datos));
    alert("Datos guardados correctamente");
}
////////////////////////////
window.addEventListener("load", () => {
    const datosGuardados = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (datosGuardados) {
        document.getElementById("nickname").value = datosGuardados.nickname;
        document.getElementById("nombre").value = datosGuardados.nombre;
        document.getElementById("contrasena").value = datosGuardados.password;
        document.getElementById("inputState").value = datosGuardados.perros;
        mostrarMascotas();
    }
});
////////////////////////////

const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")

openModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
})

closeModalButtons.forEach(button => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal")
        closeModal(modal)
    })
})

function openModal(modal) {
    if (modal == null) return
    modal.classList.add("active")
}

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active")
}
////////////////////////////
function submitMascota() {
    const nombreMascota = document.getElementById("nombre-mascota").value;
    const edad = document.getElementById("inputEdad").value;
    const raza = document.getElementById("inputraza").value;

    if (!nombreMascota || !edad || !raza) {
        alert("Complete todos los campos");
        return;
    }

    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];
    mascotas.push({ nombre: nombreMascota, edad: edad, raza: raza });
    localStorage.setItem("mascotas", JSON.stringify(mascotas));

    mostrarMascotas();
    document.getElementById("formMascota").reset();
    document.querySelector("[data-close-button]").click(); 
}

function mostrarMascotas() {
    const contenedor = document.querySelector(".mis-mascotas");

    let lista = document.querySelector(".mascotas-lista");
    if (!lista) {
        lista = document.createElement("div");
        lista.classList.add("mascotas-lista");
        contenedor.appendChild(lista);
    }

    lista.innerHTML = ""; 

    const mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    mascotas.forEach((m, index) => {
        const card = document.createElement("div");
        card.classList.add("card-mascota");

        card.innerHTML = `
            <div class="card-info">
                <p><b>Nombre:</b> ${m.nombre}</p>
                <p><b>Edad:</b> ${m.edad}</p>
                <p><b>Raza:</b> ${m.raza}</p>
            </div>
            <button class="btn-delete" onclick="eliminarMascota(${index})">Eliminar</button>
        `;

        lista.appendChild(card);
    });
}
////////////////////////////