
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


function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active")
}


// para traer el nombre del usuario registrado y mostrarlo
fetch("/user_info") 
    .then(res => res.json())
    .then(data => {
      if (data.response) {
        document.getElementById("userNamePlaceholder").textContent = data.username;
      } else {
        document.getElementById("userNamePlaceholder").textContent = "";
      }
});


document.getElementById("btn_edit_user").addEventListener("click", async () => {
    const profile_name_input = document.getElementById("profile_name");
    const response = await fetch("/edit_user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            profile_name: document.getElementById("profile_name").value,
            name: document.getElementById("name").value,
            pass: document.getElementById("pass").value
        })
    });

    const data = await response.json();

    if (data.success) {
        if(profile_name_input.value != ""){
            document.getElementById("userNamePlaceholder").textContent = profile_name_input.value;
        }
        document.getElementById("profile_name").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("name").value = "";
        alert("Usuario actualizado correctamente");
    }
});


document.getElementById("btn_delete_user").addEventListener("click", async () => {
    const res = await fetch("/delete_user", {
        method: "DELETE"
    });

    if (res.redirected) {
        window.location.href = '../index.html';
    }
});

document.getElementById("btn_add_dog").addEventListener("click", async () => {
    const response = await fetch("/add_dog", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            //breed: document.getElementById("dog_breed").value,
            dog_name: document.getElementById("dog_name").value,
            age: document.getElementById("dog_age").value
        })
    });

    const data = await response.json();

    if (data.success) {
        alert("Perro agregado correctamente");
    }
});


// agregar boton de eliminar el perfil
// agregar el mostrar los paquetes comprado
// tema foto que se hace / mostrar el nombre de perfil y el nombre completo
// boton de cambiar el usuario hacerlo lindo
// hacer el aniadir mascota
// espacio para eliminar mascota
// mostrar todas tus mascotas
// editar una mascota
// terminar login y registro de superheroe cuando este bien la bd
