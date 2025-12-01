document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        name: document.getElementById("nombre").value,
        profile_name: document.getElementById("perfil").value,
        pass: document.getElementById("password").value,
        cantidad_perros: document.getElementById("perros").value
    };

    try {
        const resp = await fetch("/users/register_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await resp.json();

        if (data.success) {
            alert("Registro exitoso");  
        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error al conectar con el servidor");
    }
});

