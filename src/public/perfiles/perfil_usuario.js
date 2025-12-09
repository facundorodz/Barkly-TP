// Funcion cambiar foto

function displayProfilePic() {
    const input = document.getElementById("photo");
    const img = document.getElementById ("profilePic");
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            img.src = e.target.result;
            img.style.display = "block";
        };

        reader.readAsDataURL(input.files[0]);
    }
}

//Funcion guardar datos

function submitForm() {
    const formData = new FormData(document.getElementById("formPerfil"));

    for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
}

//Añadir mascota pop-up

const openModalButtons = document.querySelectorAll("[data-modal-target]")
const closeModalButtons = document.querySelectorAll("[data-close-button]")
const overlay = document.getElementById("overlay")

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

function submitMascota() {
    const formData = new FormData(document.getElementById("formMascota"));

    for (const pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }
}
