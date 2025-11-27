document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        profile_name: document.getElementById("profile_name").value,
        pass: document.getElementById("pass").value
    };

    try {
        const resp = await fetch("/users/login_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await resp.json();

        if (data.success) {
            alert("Login exitoso");
            window.location.href = "/index.html";
        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error al conectar con el servidor");
    }
});

