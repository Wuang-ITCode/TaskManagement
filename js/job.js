let tasks = [];

// API base URL
const API_BASE_URL = 'http://localhost:3000/api/tasks';

// Hàm gọi API với xử lý lỗi tốt hơn
async function callApi(endpoint = '', method = 'GET', data = null) {
    try {
        showLoading();
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }
        console.log(options);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // Kiểm tra nếu response không phải JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error('Server không phản hồi dữ liệu JSON. Có thể server chưa được khởi động.');
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `Lỗi ${response.status}: ${response.statusText}`);
        }

        return result;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            showError('Không thể kết nối đến server. Vui lòng kiểm tra server đã được khởi động chưa.');
        } else {
            showError(error.message);
        }
        throw error;
    } finally {
        hideLoading();
    }
}

// Hiển thị thông báo lỗi
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Hiển thị loading state
function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
}

// Ẩn loading state
function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
}

// Lấy danh sách công việc từ API
async function getTasks() {
    try {
        return await callApi();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

// Thêm công việc mới
async function addTask(event) {
    event.preventDefault();
    const form = document.getElementById('addTaskForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const taskData = {
        title: document.getElementById('taskName').value,
        userID: '67f78ad4565b73fc44c34b0b',
        description: document.getElementById('taskDescription').value,
        members: parseInt(document.getElementById('workerCount').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        status: document.getElementById('taskStatus').value
    };

    try {
        await callApi('', 'POST', taskData);
        $('#addTaskModal').modal('hide');
        form.reset();
        await updateTaskList();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Cập nhật danh sách công việc
async function updateTaskList() {
    const tasks = await getTasks();
    const tbody = document.querySelector('#taskTable tbody');
    tbody.innerHTML = '';

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.members}</td>
            <td>${new Date(task.startDate).toLocaleDateString()}</td>
            <td>${new Date(task.endDate).toLocaleDateString()}</td>
            <td>${task.status}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editTask('${task._id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask('${task._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Xóa công việc
async function deleteTask(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
        return;
    }

    try {
        await callApi(`/${id}`, 'DELETE');
        await updateTaskList();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Chỉnh sửa công việc
async function editTask(id) {
    try {
        if (!id) {
            showError('ID công việc không hợp lệ');
            return;
        }
        
        const task = await callApi(`/${id}`);
        
        if (!task || !task._id) {
            showError('Không tìm thấy thông tin công việc');
            return;
        }

        document.getElementById('editTaskId').value = task._id;
        document.getElementById('editTaskName').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editWorkerCount').value = task.members;
        document.getElementById('editStartDate').value = task.startDate.split('T')[0];
        document.getElementById('editEndDate').value = task.endDate.split('T')[0];
        document.getElementById('editTaskStatus').value = task.status;
        
        $('#editTaskModal').modal('show');
    } catch (error) {
        console.error('Error fetching task details:', error);
        // Lỗi đã được xử lý trong hàm callApi
    }
}

// Cập nhật công việc đã chỉnh sửa
async function updateTask(event) {
    event.preventDefault();
    const form = document.getElementById('editTaskForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById('editTaskId').value;
    const taskData = {
        title: document.getElementById('editTaskName').value,
        description: document.getElementById('editTaskDescription').value,
        members: parseInt(document.getElementById('editWorkerCount').value),
        startDate: document.getElementById('editStartDate').value,
        endDate: document.getElementById('editEndDate').value,
        status: document.getElementById('editTaskStatus').value
    };

    try {
        await callApi(`/${id}`, 'PUT', taskData);
        $('#editTaskModal').modal('hide');
        form.reset();
        await updateTaskList();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Lắng nghe sự kiện khi DOM tải xong
document.addEventListener('DOMContentLoaded', async () => {
    await updateTaskList();
    document.getElementById('addTaskForm').addEventListener('submit', addTask);
    document.getElementById('editTaskForm').addEventListener('submit', updateTask);
});
