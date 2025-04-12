document.addEventListener("DOMContentLoaded", function () {
    if (! checkLogin()) {
        return;
    }
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
            localStorage.removeItem("user"); // Xóa thông tin đăng nhập
            localStorage.removeItem("token"); // Xóa thông tin đăng nhập
            window.location.href = "http://localhost:3000/login.html"; // Chuyển về trang đăng nhập
        });
    }

    // 🟢 Xử lý lịch
    const calendar = document.getElementById("calendar");
    const prevButton = document.createElement("button");
    const nextButton = document.createElement("button");
    const monthTitle = document.createElement("h2");
    monthTitle.style.margin = '0 12px';
    const divEl = document.createElement("div");

    prevButton.textContent = "<";
    nextButton.textContent = ">";

    [prevButton, nextButton].forEach(btn => {
        btn.style.width = "40px";
        btn.style.height = "40px";
        btn.style.borderRadius = "50%";
        btn.style.margin = "0 12px";
        btn.style.padding = "8px 12px";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = "#9cafc2";
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "16px";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
    });

    divEl.prepend(prevButton, monthTitle, nextButton);
    divEl.style.display = 'flex';
    divEl.style.margin = '0 0 32px 0';
    document.querySelector(".calendar").prepend(divEl);

    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function generateCalendar(month, year) {
        calendar.innerHTML = "";
        monthTitle.textContent = ` ${new Date(year, month).toLocaleString("vi-VN", {
            month: "long",
            year: "numeric"
        })} `;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();

        const days = [
            'Thứ 2',
            'Thứ 3',
            'Thứ 4',
            'Thứ 5',
            'Thứ 6',
            'Thứ 7',
            'Chủ nhật',
        ];

        for (let i = 0; i < days.length; i++) {
            let dayCell = document.createElement("div");
            dayCell.textContent = days[i];
            dayCell.style.backgroundColor = 'orange';
            calendar.appendChild(dayCell);
        }
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

function checkLogin() {
    const check = localStorage.getItem('user');
    if (check == null) {
        window.location.href = "http://localhost:3000/login.html";

        return false;
    }
    return true;
}