
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

// para traer el nombre del usuario registrado y mostrarlo
fetch("/user_info") 
    .then(res => res.json())
    .then(data => {
      if (data.response) {
        document.getElementById("userNamePlaceholder").textContent = data.username;
      } else {
        document.getElementById("userNamePlaceholder").textContent = "NO REGISTRADO";
      }
});


document.getElementById("btn_delete_user").addEventListener("click", async () => {
    const res = await fetch("/delete_user", {
        method: "DELETE"
    });

    if (res.redirected) {
        window.location.href = '/login.html';
    }
});

document.getElementById("btn_edit_user").addEventListener("click", async () => {
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
        document.getElementById("profile_name").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("name").value = "";
        alert("Usuario actualizado correctamente");
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
