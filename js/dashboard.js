function checkRole() {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {
        window.location.href = "../web/login.html"; // Chuyển về trang đăng nhập nếu chưa đăng nhập
        return;
    }

    document.getElementById("welcome-message").innerText = `Xin chào, ${user.username}!`;

    // Kiểm tra quyền hạn
    if (user.role === "admin") {
        document.getElementById("admin-section").style.display = "block";
    } else {
        document.getElementById("admin-section").style.display = "none";
    }
}

function logout() {
    localStorage.removeItem("loggedInUser"); // Xóa thông tin đăng nhập
    window.location.href = "../web/login.html"; // Chuyển về trang đăng nhập
}

window.onload = checkRole;
