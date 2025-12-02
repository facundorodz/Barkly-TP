
document.getElementById("btn_delete_user").addEventListener("click", async () => {
    const res = await fetch("/delete_user", {
        method: "DELETE"
    });

    if (res.redirected) {
        window.location.href = '/login.html';
    }
});
