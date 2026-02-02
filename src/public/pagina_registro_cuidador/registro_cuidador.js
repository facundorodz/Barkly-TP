document.getElementById("cuidador-form").addEventListener("submit", async (e) => {
    e.preventDefault();

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

