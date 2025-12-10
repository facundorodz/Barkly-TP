
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
        franquicia: document.getElementById("franquicia").value,
        password: document.getElementById("contrasena").value,
        poderes: document.getElementById("poderes").value,
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
        document.getElementById("franquicia").value = datosGuardados.franquicia;
        document.getElementById("contrasena").value = datosGuardados.password;
        document.getElementById("inputState").value = datosGuardados.perros;
        mostrarPaquetes();
    }
});

function mostrarPaquetes() {}

function redirigir() {
    window.location.href = "/posts";
}