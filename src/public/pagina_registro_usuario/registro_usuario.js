document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        const resp = await fetch("/users/register_user", {
            method: "POST",
            body: formData
        });

        const data = await resp.json();

        if (data.success) {
            alert("Registro exitoso");
            window.location.href = "/index.html";
        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
});


