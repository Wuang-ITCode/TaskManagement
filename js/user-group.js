const API_BASE_URL = 'http://localhost:3000/api/members';
const API_PROJECT_URL = 'http://localhost:3000/api/projects';

// Gọi API có xử lý lỗi
async function callApi(endpoint = '', method = 'GET', data = null, api = API_BASE_URL) {
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

        const response = await fetch(`${api}${endpoint}`, options);

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

// Hiển thị lỗi
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
        console.error('Không tìm thấy phần tử #error-message.');
        alert(message); // fallback nếu không có errorDiv
        return;
    }

    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Hiển thị & ẩn loading
function showLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = 'flex';
}
function hideLoading() {
    const el = document.getElementById('loading-overlay');
    if (el) el.style.display = 'none';
}

// Lấy danh sách thành viên
async function getMembers() {
    try {
        return await callApi();
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        return [];
    }
}

// Lấy danh sách dự án từ API
async function getProjects() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        let query = '?user=' + user.id;
        const res = await callApi(query, 'GET', null, API_PROJECT_URL);

        const selectElement = document.getElementById('memberProject');

        // Xóa các option cũ (nếu có)
        selectElement.innerHTML = '';

        // Thêm option mặc định
        const defaultOption = document.createElement('option');
        defaultOption.text = '-- Chọn dự án --';
        defaultOption.value = '';
        selectElement.appendChild(defaultOption);

        // Thêm từng project vào select
        res.forEach(project => {
            const option = document.createElement('option');
            option.value = project._id;// giá trị gửi lên khi form submit
            option.text = project.name;// tên hiển thị
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', function () {
            console.log(selectElement.value);
        });

    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        return [];
    }
}

// Hiển thị bảng thành viên
async function renderTable() {
    const tableBody = document.getElementById("memberTableBody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    try {
        const members = await getMembers();

        if (members.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Không có thành viên nào!</td></tr>`;
            return;
        }

        members.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.role}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editMember('${member._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('${member._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Có lỗi xảy ra khi tải dữ liệu!</td></tr>`;
    }
}

// Thêm hoặc cập nhật thành viên
async function addOrUpdateMember(event) {
    event.preventDefault();
    const form = document.getElementById('memberForm');
    if (!form) return;

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const nameInput = document.getElementById("memberName");
    const emailInput = document.getElementById("memberEmail");
    const projectInput = document.getElementById("memberProject").value;
    const roleInput = document.getElementById("memberRole");
    const editIdInput = document.getElementById("editId");

    if (!nameInput || !emailInput || !roleInput || !editIdInput) {
        showError("Thiếu phần tử form trong DOM.");
        return;
    }

    const memberData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        projectID: projectInput,
        role: roleInput.value
    };

    const editId = editIdInput.value;

    try {
        if (editId) {
            await callApi(`/${editId}`, 'PUT', memberData);
        } else {
            await callApi('', 'POST', memberData);
        }

        form.reset();
        editIdInput.value = "";
        $('#addMemberModal').modal('hide');
        await renderTable();
    } catch (error) {
        console.error('Error saving member:', error);
    }
}

// Chỉnh sửa thành viên
async function editMember(id) {
    try {
        if (!id) {
            showError('ID thành viên không hợp lệ');
            return;
        }

        const res = await callApi(`/${id}`);
        if (!res || !res.member._id) {
            showError('Không tìm thấy thông tin thành viên');
            return;
        }

        const nameInput = document.getElementById("memberName");
        const projectInput = document.getElementById("memberProject");
        const emailInput = document.getElementById("memberEmail");
        const roleInput = document.getElementById("memberRole");
        const editIdInput = document.getElementById("editId");

        if (!nameInput || !emailInput || !roleInput || !editIdInput) {
            showError("Thiếu phần tử form trong DOM.");
            return;
        }

        nameInput.value = res.member.name;
        emailInput.value = res.member.email;
        projectInput.value = res.projectID;
        roleInput.value = res.member.role;
        editIdInput.value = res.member._id;

        $('#addMemberModal').modal('show');
    } catch (error) {
        console.error('Error fetching member details:', error);
    }
}

// Xác nhận xóa
function confirmDelete(id) {
    if (confirm("Bạn có chắc muốn xóa thành viên này không?")) {
        deleteMember(id);
    }
}

// Xóa thành viên
async function deleteMember(id) {
    try {
        await callApi(`/${id}`, 'DELETE');
        await renderTable();
    } catch (error) {
        console.error('Error deleting member:', error);
    }
}

// Tìm kiếm thành viên
async function searchMember() {
    const searchBox = document.getElementById("searchBox");
    const tableBody = document.getElementById("memberTableBody");
    if (!searchBox || !tableBody) return;

    const keyword = searchBox.value.toLowerCase();
    tableBody.innerHTML = "";

    try {
        const members = await getMembers();
        const filteredMembers = members.filter(member =>
            member.name.toLowerCase().includes(keyword) ||
            member.email.toLowerCase().includes(keyword)
        );

        if (filteredMembers.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Không tìm thấy thành viên nào!</td></tr>`;
            return;
        }

        filteredMembers.forEach((member, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${member.name}</td>
                <td>${member.email}</td>
                <td>${member.role}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editMember('${member._id}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="confirmDelete('${member._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center">Có lỗi xảy ra khi tìm kiếm!</td></tr>`;
    }
}

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', async () => {
    if (! checkLogin()) {
        return;
    }
    await renderTable();

    const form = document.getElementById('memberForm');
    if (form) {
        form.addEventListener('submit', addOrUpdateMember);
    }

    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', searchMember);
    }
    getProjects();

    const btnAdd = document.getElementById('btn-add-member');
    btnAdd.addEventListener('click',() => {
        let editId = document.getElementById("editId");
        editId.value = null;
        form.reset();
    })
});

function checkLogin() {
    const check = localStorage.getItem('user');
    if (check == null) {
        window.location.href = "http://localhost:3000/login.html";

        return false;
    }
    return true;
}