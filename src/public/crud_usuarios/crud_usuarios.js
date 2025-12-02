
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
        alert("Usuario actualizado correctamente");
    }
});
