document.getElementById("cuidador-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        profile_name: document.getElementById("profile_name").value,
        franchise_name: document.getElementById("franchise_name").value,
        password: document.getElementById("password").value,
        powers: document.getElementById("powers").value,
        experience: document.getElementById("experience").value,
        profile_photo: document.getElementById("foto_perfil").value
    };

    try {
        const resp = await fetch("/users/register_hero", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
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
});
