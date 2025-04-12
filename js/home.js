document.addEventListener("DOMContentLoaded", function () {
    // 🟢 Hiển thị tên người dùng
    const usernameDisplay = document.getElementById("usernameDisplay");
    const logoutBtn = document.getElementById("logoutBtn");

    // Lấy thông tin người dùng từ localStorage
    const currentUser = JSON.parse(localStorage.getItem("userLogin"));

    if (currentUser && currentUser.Email) {
        usernameDisplay.textContent = `Xin chào, ${currentUser.Email}`;
    } else {
        usernameDisplay.textContent = "";
    }

    // 🟢 Xử lý đăng xuất
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("userLogin"); // Xóa thông tin đăng nhập
            window.location.href = "../web/login.html"; // Chuyển về trang đăng nhập
        });
    }

    // 🟢 Xử lý lịch
    const calendar = document.getElementById("calendar");
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const monthTitle = document.createElement("h2");

    prevButton.textContent = "<";
    nextButton.textContent = ">";

    document.querySelector(".calendar").prepend(prevButton, monthTitle, nextButton);

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function generateCalendar(month, year) {
        calendar.innerHTML = "";
        monthTitle.textContent = `${new Date(year, month).toLocaleString("vi-VN", {
            month: "long",
            year: "numeric"
        })}`;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            calendar.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.addEventListener("click", () => addEvent(day, month, year));
            calendar.appendChild(dayCell);
        }
    }

    prevButton.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextButton.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    generateCalendar(currentMonth, currentYear);
});
