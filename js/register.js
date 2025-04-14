console.log("Hello");
// API base URL - using relative path
const API_BASE_URL = '/api/auth';

// Lấy ra element của trang
const formregister = document.getElementById("formregister");
const userNameElement = document.getElementById("userName");
const EmailElement = document.getElementById("Email");
const PasswordElement = document.getElementById("Password");
const rePasswordElement = document.getElementById("rePassword");

/**
 * Validate địa chỉ email
 * @param {*} email : Chuỗi email người dùng nhập vào
 * @returns : Xuất dữ liệu nếu email đúng định dạng, undifined nếu email không đúng định dạng
 * Author: Thái Minh Quang(15/03/2025)
 */
function validateEmail(email) {
    const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailPattern.test(email);
}

//Element liên quan đến lỗi
const userNameError = document.getElementById("userNameError");
const EmailError = document.getElementById("EmailError");
const PasswordError = document.getElementById("PasswordError");
const rePasswordError = document.getElementById("rePasswordError");

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
            console.log('Request options:', {
                url: `${API_BASE_URL}${endpoint}`,
                method,
                headers: options.headers,
                body: data
            });
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        if (!response.ok) {
            const error = new Error(responseData.message || `HTTP error! status: ${response.status}`);
            error.response = response;
            error.data = responseData;
            throw error;
        }
        
        return responseData;
    } catch (error) {
        console.error('API Error:', error);
        if (error.data) {
            console.error('Error details:', error.data);
        }
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

// Lắng nghe sự kiện submit form đăng ký tài khoản
formregister.addEventListener("submit", async function (e) {
    // Ngăn chặn sự kiện load lại trang
    e.preventDefault();

    // Reset các thông báo lỗi
    hideError(userNameError);
    hideError(EmailError);
    hideError(PasswordError);
    hideError(rePasswordError);

    let hasError = false;

    // Validate dữ liệu đầu vào
    const fullName = userNameElement.value.trim();
    const email = EmailElement.value.toLowerCase().trim();
    const password = PasswordElement.value;
    const rePassword = rePasswordElement.value;

    // Log dữ liệu form
    console.log('Form data:', {
        fullName,
        email,
        password: password ? '***' : undefined,
        rePassword: rePassword ? '***' : undefined
    });

    if (!fullName) {
        showError(userNameError, "Họ và tên không được để trống");
        hasError = true;
    } else if (fullName.length < 2) {
        showError(userNameError, "Họ và tên phải có ít nhất 2 ký tự");
        hasError = true;
    }

    if (!email) {
        showError(EmailError, "Email không được để trống");
        hasError = true;
    } else if (!validateEmail(email)) {
        showError(EmailError, "Email không hợp lệ");
        hasError = true;
    }

    if (!password) {
        showError(PasswordError, "Mật khẩu không được để trống");
        hasError = true;
    } else if (password.length < 6) {
        showError(PasswordError, "Mật khẩu phải có ít nhất 6 ký tự");
        hasError = true;
    }

    if (!rePassword) {
        showError(rePasswordError, "Vui lòng nhập lại mật khẩu");
        hasError = true;
    }

    // Kiểm tra mật khẩu với nhập lại mật khẩu
    if (password !== rePassword) {
        showError(rePasswordError, "Mật khẩu không khớp");
        hasError = true;
    }

    if (hasError) {
        return;
    }

    try {
        showLoading();
        // Tạo đối tượng user để gửi lên API
        const userData = {
            fullName,
            email,
            password
        };

        console.log('Sending registration data:', {
            ...userData,
            password: '***'
        });

        // Gọi API đăng ký
        const response = await callApi('/register', 'POST', userData);
        console.log('Registration success:', {
            token: response.token ? '***' : undefined,
            user: response.user
        });

        // Lưu token và thông tin người dùng
        if (response.token && response.user) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            // Hiển thị thông báo thành công
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            
            // Chuyển hướng về trang đăng nhập
            window.location.href = "login.html";
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Xử lý lỗi từ API
        if (error.data && error.data.errors && Array.isArray(error.data.errors)) {
            console.error('Validation errors:', error.data.errors);
            error.data.errors.forEach(err => {
                const errLower = err.toLowerCase();
                if (errLower.includes('email')) {
                    showError(EmailError, err);
                } else if (errLower.includes('mật khẩu')) {
                    showError(PasswordError, err);
                } else if (errLower.includes('tên')) {
                    showError(userNameError, err);
                } else {
                    // Nếu không xác định được trường nào, hiển thị ở email
                    showError(EmailError, err);
                }
            });
        } else {
            const errorMessage = error.data?.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.";
            console.error('Error message:', errorMessage);
            showError(EmailError, errorMessage);
        }
    } finally {
        hideLoading();
    }
});