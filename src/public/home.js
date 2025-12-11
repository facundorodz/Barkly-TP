document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("ver-mas-boton");
    const contenedor = document.getElementById("mas-cuidadores");

    if (!boton) {
        console.error("No se encontró el elemento #ver-mas-boton");
        return;
    }

    if (!contenedor) {
        console.error("No se encontró el elemento #mas-cuidadores");
        return;
    }

    boton.addEventListener("click", (e) => {
        e.preventDefault(); 

        const isHidden =
            contenedor.style.display === "none" ||
            contenedor.style.display === "";

        contenedor.style.display = isHidden ? "block" : "none";
        boton.textContent = isHidden ? "Ver menos" : "Ver más";
    });
});


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/users/session_info");
        const data = await response.json();
        const container = document.getElementById("auth-buttons");

        if (data.logged) {
            container.innerHTML = `
                <a role="button" id="miPerfilBtn" class="btn btn-danger" href="/perfiles/perfil_usuario.html">
                    Mi perfil
                </a>
            `;
        } else {
            container.innerHTML = `
                <a role="button" id="login" class="btn btn-danger" href="/login/login.html">
                    Iniciar Sesión
                </a>
                <a role="button" id="registrarse" class="btn btn-outline-danger" href="/pagina_seleccion_registrar/pagina_seleccion_registro.html">
                    Registrar
                </a>
            `;
        }
    } catch (err) {
        console.log("Error obteniendo sesión:", err);
    }
});

