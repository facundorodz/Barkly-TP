let planes = 1;

document.getElementById("boton-agregar-plan").addEventListener("click", function() {
    if (planes == 1) {
        crearPlanPremium();
        planes++;        
    } else if (planes == 2) {
        crearPlanDeluxe();
        planes++;
    } else alert("No podes tener más de 3 planes!")
});

function crearPlanPremium() {}
function crearPlanDeluxe() {}