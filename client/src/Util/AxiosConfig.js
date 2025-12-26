import axios from "axios"
import { SuccessNotify, WarningNotify, ErrorNotify } from "./ToastConfig"

const instance = axios.create({
    baseURL: "http://127.0.0.1:5140/api",
    // baseURL: "https://clinic-cj96.onrender.com/api",
    withCredentials: true,
})

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config
}, function (error) {
    // Do something with request error
    return Promise.reject(error)
})

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // MỞ COMMENT ĐOẠN NÀY ĐỂ HIỆN ALERT KHI THÀNH CÔNG
    if (response.status === 200 && response.data.message) {
        if (response.data.message === "Đăng nhập thành công!") return response
        alert(response.data.message); 
    }
    return response;
}, function (error) {
    // ... các đoạn code xử lý lỗi giữ nguyên ...
    if (error && error.response && error.response.data) {
        const errorMessage = error.response.data.ErrorMessage || error.response.data.errorMessage || "Lỗi không xác định";
        const statusCode = error.response.status;
        
        switch (statusCode) {
            case 400:
            case 401:
            case 403:
            case 404:
            case 500:
                alert(errorMessage); // Dùng alert đồng nhất cho tất cả các lỗi
                break;
            default:
                alert("Đã có lỗi xảy ra");
        }
    }
    return Promise.reject(error);
});

export default instance