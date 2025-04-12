// API base URL
const API_BASE_URL = 'http://localhost:3000/api/projects';

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

// Lấy danh sách dự án từ API
async function getProjects() {
    try {
        return await callApi();
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        return [];
    }
}

// Hiển thị danh sách dự án
async function displayProjects() {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = "";

    try {
        const projects = await getProjects();

        if (projects.length === 0) {
            projectList.innerHTML = `<tr><td colspan="8" class="text-center">Không có dự án nào!</td></tr>`;
            return;
        }

    projects.forEach((project, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${project.name}</td>
            <td>${project.desc}</td>
            <td>${project.type}</td>
                <td>${formatDate(project.startDate)}</td>
                <td>${formatDate(project.endDate)}</td>
            <td>${project.status}</td>
            <td>
                    <button class="btn btn-info btn-sm" onclick="stageProject('${project._id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="editProject('${project._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProject('${project._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
            </td>
            `;
            projectList.appendChild(row);
        });
    } catch (error) {
        projectList.innerHTML = `<tr><td colspan="8" class="text-center">Có lỗi xảy ra khi tải dữ liệu!</td></tr>`;
    }
}

// Định dạng ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

async function stageProject(id) {
    try {
        if (!id) {
            showError('ID dự án không hợp lệ');
            return;
        }

        const project = await callApi(`/${id}`);
        if (!project || !project._id) {
            showError('Không tìm thấy thông tin dự án');
            return;
        }

        localStorage.setItem("selectedProject", JSON.stringify(project));
        window.location.href = "http://localhost:3000/stage.html?project_id=" + id;
    } catch (error) {
        console.error('Error loading project:', error);
    }
}

// Thêm dự án
async function addProject(event) {
    event.preventDefault();
    const form = document.getElementById('addProjectForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const projectData = {
        name: document.getElementById("projectName").value.trim(),
        desc: document.getElementById("projectDesc").value.trim(),
        type: document.getElementById("projectType").value.trim(),
        startDate: document.getElementById("projectstartDate").value,
        endDate: document.getElementById("projectendDate").value,
        status: document.getElementById("projectStatus").value
    };

    if (new Date(projectData.endDate) < new Date(projectData.startDate)) {
        showError("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!");
        return;
    }

    try {
        await callApi('', 'POST', projectData);
        form.reset();
        $('#addProjectModal').modal('hide');
        await displayProjects();
    } catch (error) {
        console.error('Error adding project:', error);
    }
}

// Sửa dự án
async function editProject(id) {
    try {
        if (!id) {
            showError('ID dự án không hợp lệ');
            return;
        }

        const project = await callApi(`/${id}`);
        if (!project || !project._id) {
            showError('Không tìm thấy thông tin dự án');
            return;
        }

        document.getElementById("editProjectId").value = project._id;
    document.getElementById("editProjectName").value = project.name;
    document.getElementById("editProjectDesc").value = project.desc;
    document.getElementById("editProjectType").value = project.type;
        document.getElementById("editProjectStartDate").value = project.startDate.split('T')[0];
        document.getElementById("editProjectEndDate").value = project.endDate.split('T')[0];
    document.getElementById("editProjectStatus").value = project.status;

        $('#editProjectModal').modal('show');
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}

async function updateProject(event) {
    event.preventDefault();
    const form = document.getElementById('editProjectForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const id = document.getElementById("editProjectId").value;
    const projectData = {
        name: document.getElementById("editProjectName").value.trim(),
        desc: document.getElementById("editProjectDesc").value.trim(),
        type: document.getElementById("editProjectType").value.trim(),
        startDate: document.getElementById("editProjectStartDate").value,
        endDate: document.getElementById("editProjectEndDate").value,
        status: document.getElementById("editProjectStatus").value
    };

    if (new Date(projectData.endDate) < new Date(projectData.startDate)) {
        showError("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!");
        return;
    }

    try {
        await callApi(`/${id}`, 'PUT', projectData);
        form.reset();
        $('#editProjectModal').modal('hide');
        await displayProjects();
    } catch (error) {
        console.error('Error updating project:', error);
    }
}

// Xóa dự án
async function deleteProject(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa dự án này?')) {
        return;
    }

    try {
        await callApi(`/${id}`, 'DELETE');
        await displayProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

// Lắng nghe sự kiện khi DOM tải xong
document.addEventListener('DOMContentLoaded', async () => {
    if (! checkLogin()) {
        return;
    }
    await displayProjects();
    
    document.getElementById('addProjectForm').addEventListener('submit', addProject);
    const addProjectModal = document.getElementById('addProjectModal');
    addProjectModal.style.zIndex = '1055';
    document.getElementById('editProjectForm').addEventListener('submit', updateProject);
});


function checkLogin() {
    const check = localStorage.getItem('user');
    if (check == null) {
        window.location.href = "http://localhost:3000/login.html";

        return false;
    }
    return true;
}