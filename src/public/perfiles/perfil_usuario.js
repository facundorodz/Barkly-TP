
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

document.addEventListener("DOMContentLoaded", () => {
    const nickname = localStorage.getItem("nickname");
    if (nickname) {
        document.getElementById("usuarioPlaceHolder").innerText = nickname;
        document.getElementById("nickname").value = nickname;
    }
});


////////////////////////////

function submitForm() {
    if (checkInputs()) {
        const datos = {
            nickname: document.getElementById("nickname").value,
            nombre: document.getElementById("nombre").value,
            password: document.getElementById("contrasena").value,
            perros: document.getElementById("inputState").value,
            mascotas: JSON.parse(localStorage.getItem("mascotas")) || []
        };

        localStorage.setItem("perfilUsuario", JSON.stringify(datos));
        alert("Datos guardados correctamente");

        const nickname = document.getElementById("nickname").value;

        if(nickname.trim() !== ""){
            localStorage.setItem("nickname", nickname);
            document.getElementById("usuarioPlaceHolder").innerText = nickname;
        }

        alert("Datos guardados");
    }
}

function checkInputs() {
    let CHEQUEO = true
    const usuario = document.getElementById("nickname").value
    const nombre = document.getElementById("nombre").value
    const password = document.getElementById("contrasena").value

    if (!usuario || 
        !nombre ||
        !password) {
            alert("Debe completar TODOS los datos")
            CHEQUEO = false
        }
    else if (usuario > 100) { alert('El campo "Usuario" no puede tener más de 100 carácteres.'); CHEQUEO = false }
    else if (nombre > 150) { alert('El campo "Nombre completo" no puede tener más de 150 carácteres.'); CHEQUEO = false }
    else if (password > 200) { alert('El campo "Contraseña" no puede tener más de 200 carácteres.'); CHEQUEO = false }
    
    return CHEQUEO;
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

const modal = document.getElementById("modal");
const header = modal.querySelector(".modal-header");

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

header.addEventListener("mousedown", e => {
    isDragging = true;
    offsetX = e.clientX - modal.getBoundingClientRect().left;
    offsetY = e.clientY - modal.getBoundingClientRect().top;
});

document.addEventListener("mousemove", e => {
    if (isDragging) {
        modal.style.left = `${e.clientX - offsetX}px`;
        modal.style.top = `${e.clientY - offsetY}px`;
        modal.style.transform = "none";  
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});


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
            <button class="btn btn-danger" onclick="eliminarMascota(${index})">Eliminar</button>
        `;

        lista.appendChild(card);
    });
}

function eliminarMascota(index) {
    let mascotas = JSON.parse(localStorage.getItem("mascotas")) || [];

    mascotas.splice(index, 1);          
    localStorage.setItem("mascotas", JSON.stringify(mascotas));

    mostrarMascotas();                   
}
////////////////////////////

function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active")
}
