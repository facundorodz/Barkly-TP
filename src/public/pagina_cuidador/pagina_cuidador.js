document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const datos = {
        profile_name: document.getElementById("profile_name").value,
        franchise_name: document.getElementById("franchise_name").value,
        powers: document.getElementById("powers").value,
        experience: document.getElementById("experience").value
    };

    try {
        const resp = await fetch("/users/register_hero", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        const data = await resp.json();
        
        if (data.success) {
            window.location.href = "/index.html";  
        } else {
            alert(data.error);
        }

    } catch (error) {
        console.error("Error en fetch:", error);
        alert("Error al conectar con el servidor");
    }
});

// resenias -> que haya un ver mas como con los superheroes
// registro de superheroes correcto y que vaya a la pagina que deberia
// mostrar bien los cuidadores en el index.html
// el buscar superheroes hacerlo bien la busqueda en index.html