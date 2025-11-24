document.getElementById("form-superheroe").addEventListener("submit", async (e) => {
    e.preventDefault();

    const datos = {
        nombre_paquete: document.getElementById("nombre_paquete").value,
        descripcion: document.getElementById("descripcion").value,
        precio: document.getElementById("precio").value,
        //cupos_disponibles: document.getElementById("cupos_disponibles").value
    };

    const res = await fetch("http://localhost:3000/registrar_superheroe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    });

    const data = await res.json();
    alert(data.mensaje);
});