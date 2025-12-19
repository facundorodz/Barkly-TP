document.getElementById("cuidador-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("profile_name", document.getElementById("profile_name").value);
    formData.append("franchise_name", document.getElementById("franchise_name").value);
    formData.append("password", document.getElementById("password").value);
    formData.append("powers", document.getElementById("powers").value);
    formData.append("experience", document.getElementById("experience").value);

    const photo = document.getElementById("foto_perfil");
    if (photo.files.length > 0) {
        formData.append("foto_perfil", photo.files[0]);
    }

    try {
        const resp = await fetch("/users/register_hero", {
            method: "POST",
            body: formData
        });
        const data = await resp.json();
        if (data.success) {
            window.location.href = "/ver_superheroe/detalles-cuidador.html";
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error al conectar con el servidor");
    }

    document.querySelector("form").reset();
});

