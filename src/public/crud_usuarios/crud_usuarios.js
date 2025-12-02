
document.getElementById("btn_delete_user").addEventListener("click", async () => {
    const res = await fetch("/delete_user", {
        method: "DELETE"
    });

    if (res.redirected) {
        window.location.href = '/login.html';
    }
});

document.getElementById("btn_edit_user").addEventListener("click", async () => {
    const response = await fetch("/edit_user", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            profile_name: document.getElementById("profile_name").value,
            name: document.getElementById("name").value,
            pass: document.getElementById("pass").value
        })
    });

    const data = await response.json();

    if (data.success) {
        document.getElementById("profile_name").value = "";
        document.getElementById("pass").value = "";
        document.getElementById("name").value = "";
        alert("Usuario actualizado correctamente");
    }
});


document.getElementById("btn_add_dog").addEventListener("click", async () => {
    const response = await fetch("/add_dog", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            //breed: document.getElementById("dog_breed").value,
            dog_name: document.getElementById("dog_name").value,
            age: document.getElementById("dog_age").value
        })
    });

    const data = await response.json();

    if (data.success) {
        alert("Perro agregado correctamente");
    }
});

