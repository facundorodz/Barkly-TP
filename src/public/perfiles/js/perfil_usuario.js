document.addEventListener("DOMContentLoaded", async () => {
    try {
        const resp = await fetch("http://localhost:8080/api/users/profile_data", {
            credentials: "include"
        });

        const data = await resp.json();

        document.getElementById("user_place_holder").innerText = data.nombre_perfil;
        document.getElementById("profile_name").value = data.nombre_perfil;
        document.getElementById("name").value = data.nombre_completo;
        document.getElementById("profile_photo").src = data.foto_perfil;
        document.getElementById("pass").value = data.contraseña;

    } catch (error) {
        console.log("Error: ", error);
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
    const profile_photo = document.getElementById("photo").value.trim();

    if (profile_name !== ""){
        body.profile_name = profile_name;
    } 
    if (name !== ""){
        body.name = name;
    }
    if (pass !== ""){
        body.pass = pass;
    }
    if (profile_photo) {
        body.profile_photo = profile_photo;
    } 
    const response = await fetch("http://localhost:8080/api/crud_users/edit_user", {
        method: "PUT",
        credentials: "include",
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
        alert("Perfil actualizado correctamente");
        window.location.reload();
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
        const resp = await fetch("http://localhost:8080/api/crud_users/delete_user", {
            method: "DELETE",
            credentials: "include"
        });
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

async function agregar_mascota() {
    const dog_name = document.getElementById("dog_name").value.trim();
    const age = document.getElementById("inputEdad").value;
    const raza = document.getElementById("input_raza").value;

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
        age: age,
        raza:raza
    };

    try {
        const resp = await fetch("http://localhost:8080/api/crud_users/add_dog", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
            alert("Mascota agregada correctamente");
            closeModal();
            document.getElementById("formMascota").reset(); 
            mostrar_mascotas();
        } else {
            alert("Error al guardar la mascota");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar la mascota");
    }
}

async function mostrar_mascotas() {
    try {
        const resp = await fetch("http://localhost:8080/api/crud_users/show_dogs", {
        credentials: "include"
        });
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
                        <button class="btn btn-sm btn-danger" onclick="eliminar_mascota(${dog.id})">
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
        header.insertAdjacentHTML("afterend", html); // inserta en alguna posicion (afterend -> seria despues del elemento) alguna cadena de codigo html

    } catch (error) {
        console.error("Error al mostrar mascotas:", error);
    }
}

async function eliminar_mascota(dog_id) {
    const confirmar = confirm("⚠️ ¿Seguro que quieres eliminar esta mascota?");
    if (!confirmar){
        return;
    } 
    try {
        const resp = await fetch(`http://localhost:8080/api/crud_users/delete_dog/${dog_id}`, {
        method: "DELETE",
        credentials: "include"
        });

        const data = await resp.json();

        if (data.success) {
            alert("Mascota eliminada correctamente");
            mostrar_mascotas(); 
        } else {
            alert("Error al eliminar mascota");
        }
    } catch (error) {
        console.error(error);
        alert("Error al eliminar mascota");
    }
}




document.addEventListener("DOMContentLoaded", mostrar_mascotas);


