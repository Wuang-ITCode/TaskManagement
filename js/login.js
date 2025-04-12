// API base URL
const API_BASE_URL = 'http://localhost:3000/api/auth';

// Element của trang
const formlogin = document.getElementById("formlogin");
const EmailElement = document.getElementById("Email");
const PasswordElement = document.getElementById("Password");

// Element hiển thị lỗi
const EmailError = document.getElementById("EmailError");
const PasswordError = document.getElementById("PasswordError");

// Hàm gọi API với xử lý lỗi
async function callApi(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
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
function showError(element, message) {
    element.style.display = "block";
    element.innerHTML = message;
}

// Ẩn thông báo lỗi
function hideError(element) {
    element.style.display = "none";
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

// Kiểm tra token hết hạn
function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
}

// Lắng nghe sự kiện submit form đăng nhập tài khoản
formlogin.addEventListener("submit", async function (e) {
    // Ngăn chặn sự kiện load lại trang
    e.preventDefault();

    // Reset các thông báo lỗi
    hideError(EmailError);
    hideError(PasswordError);

    let hasError = false;

    // Validate dữ liệu đầu vào
    if (!EmailElement.value) {
        showError(EmailError, "Email không được để trống");
        hasError = true;
    }

    if (!PasswordElement.value) {
        showError(PasswordError, "Mật khẩu không được để trống");
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        showLoading();
        // Tạo đối tượng login data để gửi lên API
        const loginData = {
            email: EmailElement.value,
            password: PasswordElement.value
        };

        // Gọi API đăng nhập
        const response = await callApi('/login', 'POST', loginData);

        // Kiểm tra token hết hạn
        if (isTokenExpired(response.token)) {
            throw new Error('Token đã hết hạn');
        }

        // Lưu token và thông tin người dùng
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Hiển thị thông báo thành công
        alert("Đăng nhập thành công");

        // Chuyển hướng về trang chủ
        window.location.href = "home.html";
    } catch (error) {
        // Xử lý lỗi từ API
        if (error.message.includes('credentials')) {
            showError(EmailError, "Email hoặc mật khẩu không đúng");
        } else if (error.message.includes('Token')) {
            showError(EmailError, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
            showError(EmailError, "Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
        }
    } finally {
        hideLoading();
    }
});
