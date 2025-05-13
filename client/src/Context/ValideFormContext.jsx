import { createContext, useState } from "react"

const ValideFormContext = createContext()

const ValideFormProvider = ({ children }) => {
    const [formErrors, setFormErrors] = useState({})

    const validateForm = (formData) => {
        const errors = {}
        
        // Kiểm tra các trường không được để trống
        Object.keys(formData).forEach((key) => {
            const value = formData[key]?.toString().trim()
            
            if (!value) {
                // Tạo tên trường hiển thị thân thiện hơn
                const fieldNames = {
                    fullname: "Họ và Tên",
                    phone: "Số điện thoại",
                    email: "Email",
                    password: "Mật khẩu",
                    passwordConfirmed: "Xác nhận mật khẩu"
                }
                errors[key] = `Vui lòng nhập ${fieldNames[key] || key}`
            }
        })
        
        // Kiểm tra định dạng email
        if (formData.email && !errors.email) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail.com/
            if (!emailRegex.test(formData.email)) {
                errors.email = "Email không đúng định dạng"
            }
        }
        
        // Kiểm tra số điện thoại
        if (formData.phone && !errors.phone) {
            const phoneRegex = /^[0-9]{10,11}$/
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
                errors.phone = "Số điện thoại phải có 10-11 chữ số"
            }
        }
        
        // Kiểm tra mật khẩu mạnh
        if (formData.password && !errors.password) {
            const password = formData.password
            
            // Tạo danh sách các lỗi của mật khẩu
            const passwordErrors = []
            
            if (password.length < 6) {
                passwordErrors.push("ít nhất 6 ký tự")
            }
            if (!/[0-9]/.test(password)) {
                passwordErrors.push("ít nhất 1 chữ số")
            }
            if (!/[a-z]/.test(password)) {
                passwordErrors.push("ít nhất 1 chữ thường")
            }
            if (!/[A-Z]/.test(password)) {
                passwordErrors.push("ít nhất 1 chữ hoa")
            }
            if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
                passwordErrors.push("ít nhất 1 ký tự đặc biệt")
            }
            
            // Nếu có lỗi, tạo thông báo lỗi
            if (passwordErrors.length > 0) {
                errors.password = `Mật khẩu phải có ${passwordErrors.join(", ")}`
            }
        }
        
        // Kiểm tra mật khẩu xác nhận
        if (formData.passwordConfirmed && !errors.passwordConfirmed) {
            if (formData.password !== formData.passwordConfirmed) {
                errors.passwordConfirmed = "Mật khẩu xác nhận không khớp với mật khẩu đã nhập"
            }
        }
        
        setFormErrors(errors)
        return Object.keys(errors).length
    }

    return (
        <ValideFormContext.Provider value={{ validateForm, formErrors, setFormErrors }}>
        {children}
        </ValideFormContext.Provider>
    )
}

export { ValideFormContext, ValideFormProvider }