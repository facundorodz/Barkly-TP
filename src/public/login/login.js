document.getElementById("btnradio1").addEventListener("change", () => {
    document.getElementById("login_type").value = "user";
});

document.getElementById("btnradio2").addEventListener("change", () => {
    document.getElementById("login_type").value = "hero";
});


document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const datos = {
        profile_name: document.getElementById("profile_name").value,
        pass: document.getElementById("pass").value,
        login_type: document.getElementById("login_type").value
    };

    try {
        const resp = await fetch("/users/login_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });

        const data = await resp.json();

        if (data.success) {

            if (data.type === "user") {
                window.location.href = "/index.html";
            } 
            else if (data.type === "hero") {
                localStorage.setItem("hero", JSON.stringify(data.cuidador));
                window.location.href = "/ver_superheroe/detalles-cuidador.html";
            }

        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error al conectar con el servidor");
    }
});

function logout() {
  localStorage.removeItem("cuidador");
  window.location.href = "/login/login.html";
}


