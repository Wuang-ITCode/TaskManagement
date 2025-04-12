// Mảng lưu danh sách công việc từ LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Hàm hiển thị danh sách công việc
function displayTasks() {
    let projectList = document.getElementById("projectList");
    projectList.innerHTML = ""; // Xóa danh sách cũ

    tasks.forEach((task, index) => {
        let row = `<tr>
            <td>${index + 1}</td>
            <td>${task.name}</td>
            <td>
                <button class="btn-edit" onclick="editTask(${index})">Sửa</button>
                <button class="btn-delete" onclick="deleteTask(${index})">Xóa</button>
            </td>
        </tr>`;
        projectList.innerHTML += row;
    });
}

// Hàm thêm công việc
function addTask() {
    let nameInput = document.getElementById("projectName");
    let name = nameInput.value.trim();

    if (name === "") {
        alert("Vui lòng nhập tên công việc mới!");
        return;
    }

    tasks.push({ name }); // Thêm vào mảng
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Lưu vào localStorage
    displayTasks(); // Cập nhật danh sách

    // Xóa nội dung nhập vào
    nameInput.value = "";
}

// Hàm sửa công việc
function editTask(index) {
    let newName = prompt("Nhập tên mới:", tasks[index].name);

    if (newName !== null && newName.trim() !== "") {
        tasks[index].name = newName.trim();
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Cập nhật localStorage
        displayTasks(); // Cập nhật danh sách
    }
}

// Hàm xóa công việc
function deleteTask(index) {
    if (confirm("Bạn có chắc chắn muốn xóa công việc này?")) {
        tasks.splice(index, 1); // Xóa công việc khỏi mảng
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Cập nhật localStorage
        displayTasks(); // Cập nhật danh sách
    }
}

// Hiển thị danh sách ban đầu
displayTasks();