

document.addEventListener("DOMContentLoaded", () => {
    const nickname = localStorage.getItem("nickname");
    if (nickname) {
        document.getElementById("user_place_holder").innerText = nickname;
        document.getElementById("profile_name").value = nickname;
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
    if (e.target.closest("[data-close-button]")){
        return;
    } 
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
            mostrarMascotas();
        } else {
            alert(data.error || "Error al guardar la mascota");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar la mascota");
    }
}

async function mostrarMascotas() {
    try {
        const resp = await fetch("/show_dogs");
        const data = await resp.json();
        const contenedor = document.querySelector(".my_dogs");
        
        const exists_table = contenedor.querySelector("table");
        if (exists_table){
            exists_table.remove();
        } 
        let html = `
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Raza</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.mascotas.forEach(dog => {
            html += `
            
                <tr>
                    <td>${dog.dog_name}</td>
                    <td>${dog.dog_age}</td>
                    <td>${dog.raza}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="eliminarMascota(${dog.id})">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        `;
        const header = contenedor.querySelector(".mascotas-header");
        header.insertAdjacentHTML("afterend", html);

    } catch (error) {
        console.error("Error al mostrar mascotas:", error);
    }
}

async function eliminarMascota(dog_id) {
    const confirmar = confirm("⚠️ ¿Seguro que quieres eliminar esta mascota?");
    if (!confirmar){
        return;
    } 
    try {
        const resp = await fetch(`/delete_dog/${dog_id}`, {
            method: "DELETE"
        });
        const data = await resp.json();

        if (data.success) {
            alert("Mascota eliminada correctamente");
            mostrarMascotas(); 
        } else {
            alert(data.error || "Error al eliminar mascota");
        }
    } catch (error) {
        console.error(error);
        alert("Error al eliminar mascota");
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resp = await fetch("/show_photo");
        const data = await resp.json();

        const img = document.getElementById("profile_photo");

        if (data.profile_photo) {
            img.src = data.profile_photo;
        } else {
            img.src = "/assets/images/subir_imagen.png";
        }
    } catch (err) {
        console.error("Error cargando foto de perfil", err);
    }
});

document.getElementById("photo").addEventListener("change", async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("profile_photo", file);

    try {
        const resp = await fetch("/update_profile_photo", {
            method: "POST",
            body: formData
        });

        const data = await resp.json();

        if (data.success) {
            document.getElementById("profile_photo").src =
                data.profile_photo + "?t=" + Date.now();
        } else {
            alert("Error al guardar la imagen");
        }
    } catch (err) {
        console.error("Error al subir la foto", err);
    }
});





document.addEventListener("DOMContentLoaded", mostrarMascotas);


