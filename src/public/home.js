document.addEventListener("DOMContentLoaded", () => {

  const boton = document.getElementById("ver-mas-boton");
  const conteiner = document.getElementById("mas-cuidadores");
  const catalogo = document.getElementById("catalogo");


  fetch("http://localhost:8080/api/cuidadores")
    .then(res => res.json())
    .then(cuidadores => {

      if (!catalogo) return;

      if (!Array.isArray(cuidadores) || cuidadores.length === 0) {
        catalogo.innerHTML = `
          <div class="col-12 text-center text-muted">
            No se encontraron cuidadores
          </div>
        `;
        return;
      }

      catalogo.innerHTML = "";

      cuidadores.forEach(c => {

        const poderes = String(c.poderes ?? "")
          .split(",")
          .map(p => p.trim())
          .filter(Boolean);

        catalogo.innerHTML += `
          <div class="col-md-4">
            <div class="cuidador_perfil">

              <img
                src="${c.foto_perfil || "https://via.placeholder.com/150"}"
                class="polaroid"
                width="400"
                height="400"
                alt="Foto de ${c.nombre || "Cuidador"}"
              >

              <h3>${c.nombre || "Sin nombre"}</h3>
              ${c.franquicia || ""}

              <hr>

              <ul style="text-align:left">
                ${
                  poderes.length
                    ? poderes.map(p => `<li>${p}</li>`).join("")
                    : "<li>—</li>"
                }
              </ul>

              <hr>

              <a onclick="verDetalle(${c.id})" class="btn btn-danger mt-2">
                Ver cuidador
              </a>

            </div>
          </div>
        `;
      });
    })
    .catch(err => console.error("Error cargando cuidadores:", err));


  if (boton && conteiner) {
    boton.addEventListener("click", e => {
      e.preventDefault();

      const oculto =
        conteiner.style.display === "" ||
        conteiner.style.display === "none";

      conteiner.style.display = oculto ? "block" : "none";
      boton.textContent = oculto ? "Ver menos" : "Ver más";
    });
  }

  (async () => {
    try {
      const resp = await fetch("http://localhost:8080/api/users/user_info", {
        credentials: "include"
      });

      const data = await resp.json();
      const container = document.getElementById("buttons");

      if (!container) return;

      if (data.response) {
        container.innerHTML = `
          <a class="btn btn-danger" href="/perfiles/perfil_usuario.html">
            Ver perfil
          </a>
        `;
      }

    } catch (err) {
      console.error("Error obteniendo sesión:", err);
    }
  })();

});
