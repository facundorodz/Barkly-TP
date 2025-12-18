
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

document.addEventListener("DOMContentLoaded", () => {
    const savedImage = localStorage.getItem("profilePic");

    if (savedImage) {
        document.getElementById("profilePic").src = savedImage;
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const nickname = localStorage.getItem("nickname");
    if (nickname) {
        document.getElementById("user_place_holder").innerText = nickname;
        document.getElementById("profile_name").value = nickname;
    }
});


function submitForm() {
    const datos = {
        nickname: document.getElementById("profile_name").value,
        nombre: document.getElementById("name").value,
        password: document.getElementById("pass").value,
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


window.addEventListener("load", () => {
    const datosGuardados = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (datosGuardados) {
        document.getElementById("profile_name").value = datosGuardados.nickname;
        document.getElementById("name").value = datosGuardados.nombre;
        document.getElementById("pass").value = datosGuardados.password;
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
    if (e.target.closest("[data-close-button]")) return; // 👈 clave
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


function closeModal(modal) {
    if (modal == null) return
    modal.classList.remove("active")
}


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resp = await fetch("/users/session_info");
        const data = await resp.json();

        if (data.logged && data.profile_name) {
            const contenedor = document.getElementById("user_place_holder");
            contenedor.innerHTML = `<h2>${data.profile_name}</h2>`;
        }
    } catch (error) {
        console.error("Error obteniendo session_info:", error);
    }
});


document.getElementById("btn_edit_user").addEventListener("click", async (e) => {
    e.preventDefault();

    const body = {};
    const profile_name = document.getElementById("profile_name").value.trim();
    const name = document.getElementById("name").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (profile_name !== ""){
        body.profile_name = profile_name;
    } 
    if (name !== ""){
        body.name = name;
    }
    if (pass !== ""){
        body.pass = pass;
    } 
    const response = await fetch("/edit_user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) { 
        alert(data.error);
        return;
    }
    if (data.success) {
        if (body.profile_name) {
            document.getElementById("user_place_holder").textContent = body.profile_name;
        }
        document.getElementById("profile_name").value = "";
        document.getElementById("name").value = "";
        document.getElementById("pass").value = "";
        alert("Perfil actualizado correctamente");
    }
});


async function borrarCuenta() {
    const confirmar = confirm(
        "⚠️ ¿Estás seguro? Esta acción NO se puede deshacer"
    );
    if (!confirmar){
        return;
    } 
    try {
        const resp = await fetch("/delete_user", { method: "DELETE" });
        const data = await resp.json();
        if (data.success) {
            alert("Cuenta eliminada correctamente");
            window.location.href = "/index.html"; 
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error(error);
        alert("Error al borrar cuenta");
    }
}

// Función para enviar nueva mascota
async function submitMascota() {
    const dog_name = document.getElementById("dog_name").value.trim();
    const age = document.getElementById("inputEdad").value;

    if (!dog_name) {
        alert("Debes ingresar el nombre de la mascota");
        return;
    }
    if (age === "") {
        alert("Debes seleccionar la edad de la mascota");
        return;
    }
    const body = {
        dog_name: dog_name,
        age: age
    };

    try {
        const resp = await fetch("/add_dog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            alert("Mascota agregada correctamente");
            closeModal();
            document.getElementById("formMascota").reset(); 

        } else {
            alert(data.error || "Error al guardar la mascota");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar la mascota");
    }
}
