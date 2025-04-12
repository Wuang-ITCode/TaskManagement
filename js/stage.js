// API base URL
const API_BASE_URL = 'http://localhost:3000/api/phases';

// Hàm gọi API với xử lý lỗi tốt hơn
async function callApi(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Hiển thị thông báo lỗi
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('h1'));
    setTimeout(() => errorDiv.remove(), 5000);
}

// Hiển thị loading state
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-overlay';
    loadingDiv.innerHTML = '<div class="spinner-border text-primary" role="status"></div>';
    document.body.appendChild(loadingDiv);
}

// Ẩn loading state
function hideLoading() {
    const loadingDiv = document.querySelector('.loading-overlay');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Lấy danh sách giai đoạn từ API
async function getPhases() {
    try {
        showLoading();
        const data = await callApi('/');
        return data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
        showError("Không thể tải danh sách giai đoạn. Vui lòng thử lại sau.");
        return [];
    } finally {
        hideLoading();
    }
}

// Cập nhật danh sách giai đoạn
async function updatePhaseList() {
    const phaseList = document.getElementById("phaseList");
    phaseList.innerHTML = "";
    
    try {
        const phases = await getPhases();

        if (phases.length === 0) {
            phaseList.innerHTML = `<tr><td colspan="5" class="text-center">Chưa có giai đoạn nào!</td></tr>`;
            return;
        }

        phases.forEach((phase) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${phase.name}</td>
                <td>${formatDate(phase.startDate)}</td>
                <td>${formatDate(phase.endDate)}</td>
                <td>${phase.status}</td>
                <td>
                    <button class="btn-edit" onclick="editPhase(${phase.id})">✏️ Sửa</button>
                    <button class="btn-delete" onclick="deletePhase(${phase.id})">❌ Xóa</button>
                </td>
            `;
            phaseList.appendChild(row);
        });
    } catch (error) {
        phaseList.innerHTML = `<tr><td colspan="5" class="text-center">Có lỗi xảy ra khi tải dữ liệu!</td></tr>`;
    }
}

// Định dạng ngày tháng
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Thêm giai đoạn mới
async function addPhase() {
    const name = document.getElementById("phaseName").value.trim();
    const startDate = document.getElementById("phaseStart").value;
    const endDate = document.getElementById("phaseEnd").value;
    const status = document.getElementById("phaseStatus").value;

    if (!name || !startDate || !endDate) {
        showError("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        showError("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!");
        return;
    }

    const newPhase = {
        name,
        startDate,
        endDate,
        status
    };

    try {
        showLoading();
        await callApi('/', 'POST', newPhase);
        await updatePhaseList();
        document.getElementById("phaseModal").style.display = "none";
        document.getElementById("phaseName").value = "";
        document.getElementById("phaseStart").value = "";
        document.getElementById("phaseEnd").value = "";
        document.getElementById("phaseStatus").value = "Chưa bắt đầu";
    } catch (error) {
        showError("Có lỗi xảy ra khi thêm giai đoạn!");
    } finally {
        hideLoading();
    }
}

// Chỉnh sửa giai đoạn
async function editPhase(id) {
    try {
        showLoading();
        const phase = await callApi(`/${id}`);
        if (!phase) return;

        document.getElementById("editPhaseName").value = phase.name;
        document.getElementById("editPhaseStart").value = phase.startDate;
        document.getElementById("editPhaseEnd").value = phase.endDate;
        document.getElementById("editPhaseStatus").value = phase.status;
        document.getElementById("editPhaseModal").dataset.phaseId = id;

        document.getElementById("editPhaseModal").style.display = "flex";
    } catch (error) {
        showError("Có lỗi xảy ra khi tải thông tin giai đoạn!");
    } finally {
        hideLoading();
    }
}

// Cập nhật giai đoạn
async function updatePhase() {
    const id = document.getElementById("editPhaseModal").dataset.phaseId;
    const name = document.getElementById("editPhaseName").value.trim();
    const startDate = document.getElementById("editPhaseStart").value;
    const endDate = document.getElementById("editPhaseEnd").value;
    const status = document.getElementById("editPhaseStatus").value;

    if (!name || !startDate || !endDate) {
        showError("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        showError("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu!");
        return;
    }

    const updatedPhase = {
        name,
        startDate,
        endDate,
        status
    };

    try {
        showLoading();
        await callApi(`/${id}`, 'PUT', updatedPhase);
        await updatePhaseList();
        document.getElementById("editPhaseModal").style.display = "none";
    } catch (error) {
        showError("Có lỗi xảy ra khi cập nhật giai đoạn!");
    } finally {
        hideLoading();
    }
}

// Xóa giai đoạn
async function deletePhase(id) {
    if (confirm("Bạn có chắc chắn muốn xóa giai đoạn này?")) {
        try {
            showLoading();
            await callApi(`/${id}`, 'DELETE');
            await updatePhaseList();
        } catch (error) {
            showError("Có lỗi xảy ra khi xóa giai đoạn!");
        } finally {
            hideLoading();
        }
    }
}

// Khởi tạo khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
    const createPhaseBtn = document.getElementById("createPhase");
    const modal = document.getElementById("phaseModal");
    const closeModal = document.querySelector(".close");
    const savePhaseBtn = document.getElementById("savePhase");
    const editModal = document.getElementById("editPhaseModal");
    const editCloseModal = document.querySelector(".edit-close");
    const updatePhaseBtn = document.getElementById("updatePhase");

    // Mở modal thêm giai đoạn
    createPhaseBtn.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    // Đóng modal
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

    editCloseModal.addEventListener("click", function () {
        editModal.style.display = "none";
    });

    // Lưu giai đoạn mới
    savePhaseBtn.addEventListener("click", addPhase);

    // Cập nhật giai đoạn
    updatePhaseBtn.addEventListener("click", updatePhase);

    // Hiển thị danh sách giai đoạn khi tải trang
    updatePhaseList();
});
