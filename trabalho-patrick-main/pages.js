function mostrarToast(mensagem, bgClass) {
    const toastEl = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toast-message");
    if (!toastEl || !toastMessage) {
        alert(mensagem);
        return;
    }
    const bsToast = new bootstrap.Toast(toastEl);
    toastMessage.textContent = mensagem;

    toastEl.classList.remove("bg-success", "bg-danger");
    toastEl.classList.add(bgClass);

    bsToast.show();
}

function token_expirado(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
        return payload.exp && payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;
    }
}

function atualizar_navbar() {
    const nome = localStorage.getItem("nome_cliente");
    const token = localStorage.getItem("token");

    if (token && token_expirado(token)) {
        localStorage.removeItem("nome_cliente");
        localStorage.removeItem("token");
        location.reload();
        return;
    }

    const nav_login = document.getElementById("nav-login");
    const btn_user_info = document.getElementById("user-info");

    if (token && nome) {
        if (nav_login) nav_login.style.display = "none";
        if (btn_user_info) {
            btn_user_info.style.display = "inline";
            btn_user_info.innerText = "Olá, " + nome.split(" ")[0];
        }
    } else {
        if (nav_login) nav_login.style.display = "inline";
        if (btn_user_info) btn_user_info.style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("nome_cliente");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

window.addEventListener("DOMContentLoaded", atualizar_navbar);