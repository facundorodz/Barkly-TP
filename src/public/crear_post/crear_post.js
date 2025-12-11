let plan = 1;

document.getElementById("boton-agregar-plan").addEventListener("click", function() {
    
    if (plan == 1) { 
    const nuevoPlan = document.createElement("div");
    nuevoPlan.classList.add("plan-premium");

    nuevoPlan.innerHTML = `
        <h3>Plan premium</h3>
    `;
    document.getElementById("contenedor-planes").appendChild(nuevoPlan);
    plan++;

    } else if (plan == 2) {
            const nuevoPlan = document.createElement("div");
    nuevoPlan.classList.add("plan-deluxe");

    nuevoPlan.innerHTML = `
        <h3>Plan deluxe</h3>
    `;
    document.getElementById("contenedor-planes").appendChild(nuevoPlan);
    plan++;
    }
    else {
        alert('No puedes tener MÁS de 3 planes en total')
    }
});