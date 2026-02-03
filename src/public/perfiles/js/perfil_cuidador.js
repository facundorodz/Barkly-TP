

const API_BASE_URL = "http://localhost:8080/api";
const API_CUIDADORES = `${API_BASE_URL}/cuidadores`;

const CUIDADOR_ID = 2;



function checkInputs() {
  const inputNombreCuidador = document.getElementById('nickname').value.trim();
  const inputFranquicia = document.getElementById('franquicia').value.trim();
  const inputPoderes = document.getElementById('poderes').value.trim();
  const inputExperiencia = document.getElementById('experiencia').value;
  const inputContrasena = document.getElementById('contrasena').value.trim();
  const inputPaquetesOfrecidos = document.getElementById('inputState')?.value;

  if (
    !inputNombreCuidador ||
    !inputFranquicia ||
    !inputPoderes ||
    !inputExperiencia ||
    !inputContrasena ||
    inputPaquetesOfrecidos === 'Elegir...'
  ) {
    alert('Debe añadir TODOS los datos.');
    return false;
  }

  if (inputNombreCuidador.length > 120) {
    alert('El campo "nombre" es demasiado largo.');
    return false;
  }

  if (inputFranquicia.length > 100) {
    alert('El campo "franquicia" es demasiado largo.');
    return false;
  }

  if (Number(inputExperiencia) <= 0) {
    alert('La experiencia debe ser mayor a 0.');
    return false;
  }

  return true;
}

const experiencia = document.getElementById('experiencia');
experiencia.addEventListener("input", () => {
  experiencia.value = experiencia.value.replace(/[^0-9]/g, "");
});


async function cargarCuidador() {
  try {
    const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
      credentials: "include"
    });

    const data = await res.json();

    document.getElementById("nombre-superheroe-header").textContent = data.nombre;
    document.getElementById("franquicia-header").textContent = data.franquicia;
    document.getElementById("contador-paquetes").textContent = data.paquetes_ofrecidos ?? 0;
    document.getElementById("profilePic").src = data.foto_perfil;

    document.getElementById("nickname").value = data.nombre;
    document.getElementById("franquicia").value = data.franquicia;
    document.getElementById("experiencia").value = data.experiencia;
    document.getElementById("poderes").value = data.poderes;
    document.getElementById("contrasena").value = data.contrasenia;

  } catch (err) {
    console.error("Error cargando cuidador:", err);
  }
}


document.getElementById("form-perfil").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!checkInputs()) return;

  const cambios = {
    nombre: document.getElementById("nickname").value,
    franquicia: document.getElementById("franquicia").value,
    experiencia: Number(document.getElementById("experiencia").value),
    poderes: document.getElementById("poderes").value,
    contrasenia: document.getElementById("contrasena").value,
  };

  await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(cambios),
  });

  alert("Datos actualizados");
  cargarCuidador();
});


document.getElementById("btn-eliminar-cuenta").addEventListener("click", async () => {
  if (!confirm("⚠️ ¿Estás seguro? Esta acción NO se puede deshacer")) return;

  try {
    const res = await fetch(`${API_CUIDADORES}`, {
      method: "DELETE",
      credentials: "include"
    });

    const data = await res.json();

    if (data.success) {
      alert("Cuenta eliminada correctamente");
      window.location.href = "/index.html";
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
    alert("Error al borrar cuenta");
  }
});


const LIMITE_PAQUETES = 3;

async function cargarPaquetes() {
  try {
    const res = await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`, {
      credentials: "include"
    });

    const paquetes = await res.json();
    const tbody = document.querySelector("#tabla-paquetes tbody");
    tbody.innerHTML = "";

    paquetes.forEach(p => {
      tbody.innerHTML += `
        <tr>
          <td>${p.nombre_paquete}</td>
          <td>${p.descripcion}</td>
          <td>$${p.precio}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarPaquete(${p.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });

    document.getElementById("contador-paquetes").textContent = paquetes.length;
  } catch (error) {
    console.error("Error cargando paquetes:", error);
  }
}

async function guardarPaquete() {
  const descripcion = document.getElementById("descripcion_paquete_modal").value.trim();
  const precio = Number(document.getElementById("precio_paquete_modal").value);

  if (!descripcion || precio <= 0) {
    alert("Datos inválidos");
    return;
  }

  await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ descripcion, precio })
  });

  cargarPaquetes();
}

async function eliminarPaquete(id) {
  if (!confirm("¿Eliminar paquete?")) return;

  await fetch(`${API_CUIDADORES}/${CUIDADOR_ID}/paquetes/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  cargarPaquetes();
}


document.addEventListener("DOMContentLoaded", () => {
  cargarCuidador();
  cargarPaquetes();
});
