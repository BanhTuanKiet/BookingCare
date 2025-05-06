import React, { useContext, useEffect, useState } from 'react'
import { Button, InputGroup, Modal, Form } from 'react-bootstrap'
import { ValideFormContext } from '../../Context/ValideFormContext'
import axios from '../../Util/AxiosConfig'

function SignUp({ setIsLogin }) {
    const { validateForm, formErrors } = useContext(ValideFormContext)
    const [registerData, setRegisterData] = useState({ 
        fullname: "", 
        phone: "", 
        email: "", 
        password: "", 
        passwordConfirmed: ""
    })
    const [showPasswords, setShowPasswords] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [isValidOtp, setIsValidOtp] = useState(false)
    const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""])

    useEffect(() => {
        const register = async () => {
          if (!isValidOtp) return
            
            try {
                await axios.post("/auth/register", registerData)
                setIsLogin(true)
                setShowOtpModal(false)
            } catch (error) {
                console.log(error.response?.data?.message || "Đăng ký thất bại")
            } finally {
                setLoading(false)
            }
        }
    
        register()
      }, [isValidOtp, registerData])

    const handleRegister = async (e) => {
        e.preventDefault()
        const errors = validateForm(registerData)   
        if (errors > 0) return
        setShowOtpModal(true)
    }  
    
    const handleOtpChange = (e, index) => {
        const { value } = e.target
        if (!/^\d*$/.test(value)) return
        
        const newOtp = [...otpInputs]
        newOtp[index] = value
        setOtpInputs(newOtp)
      
        if (value && index < 5) {
            const nextInput = document.querySelector(`.otp-input:nth-child(${index + 2})`)
            nextInput?.focus()
        }
    }
      
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otpInputs[index] && index > 0) {
            const prevInput = document.querySelector(`.otp-input:nth-child(${index})`)
            prevInput?.focus()
        }
    }
    
    const handleConfirmOtp = async () => {
        try {
            const normalizedEmail = registerData.email.trim().toLowerCase()
            await axios.post("/auth/send-otp", { email: normalizedEmail })
            setIsValidOtp(true)
        } catch (error) {
            console.log(error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.")
        }
    }  
    
    return (
        <>
            <>
                <h2>Đăng Ký</h2>
                <Form className="auth-form" onSubmit={handleRegister}>
                <Form.Control
                    type="text"
                    placeholder="Họ và Tên"
                    className={!!formErrors.fullname ? "mb-1" : ""}
                    value={registerData.fullname}
                    onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
                    isInvalid={!!formErrors.fullname}
                />
                <Form.Control.Feedback className="my-1" type="invalid">{formErrors.fullname}</Form.Control.Feedback>

                <Form.Control
                    type="text"
                    placeholder="Số điện thoại"
                    className={!!formErrors.phone ? "mb-1" : ""}
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    isInvalid={!!formErrors.phone}
                />
                <Form.Control.Feedback className="my-1" type="invalid">{formErrors.phone}</Form.Control.Feedback>          

                <Form.Control
                    type="email"
                    placeholder="Email"
                    className={!!formErrors.email ? "mb-1" : ""}
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    isInvalid={!!formErrors.email}
                />
                <Form.Control.Feedback className="my-1" type="invalid">{formErrors.email}</Form.Control.Feedback>          
                
                <InputGroup className="my-1" style={{ zIndex: "0" }}>
                    <Form.Control
                    type={showPasswords ? "text" : "password"}
                    placeholder="Mật khẩu"
                    className={!!formErrors.password ? "mb-1" : ""}
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    isInvalid={!!formErrors.password}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.password}</Form.Control.Feedback>
                </InputGroup>

                <InputGroup className="my-1">
                    <Form.Control
                    type={showPasswords ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu"
                    className={!!formErrors.passwordConfirmed ? "mb-1" : ""}
                    value={registerData.passwordConfirmed}
                    onChange={(e) => setRegisterData({ ...registerData, passwordConfirmed: e.target.value })}
                    isInvalid={!!formErrors.passwordConfirmed}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.passwordConfirmed}</Form.Control.Feedback>
                </InputGroup>
                
                <div className="checkbox-container">
                    <input
                    type="checkbox"
                    id="showPasswordToggle"
                    className="small-checkbox mb-0"
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                    />
                    <label htmlFor="showPasswordToggle">{showPasswords ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}</label>
                </div>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đăng Ký"}
                </Button>
                </Form>
                <p>
                Đã có tài khoản? <Button variant="link" onClick={() => setIsLogin(true)}>Đăng nhập</Button>
                </p>
            </>
            <>
                <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Nhập Mã OTP</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group>
                        <div className="d-flex justify-content-between">
                            {otpInputs.map((value, index) => (
                            <Form.Control
                                key={index}
                                type="text"
                                maxLength="1"
                                className="otp-input"
                                value={value}
                                onChange={(e) => handleOtpChange(e, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                style={{ width: "40px", textAlign: "center", fontSize: "1.5rem" }}
                            />
                            ))}
                        </div>
                            <Form.Control.Feedback type="invalid">{formErrors.otp}</Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowOtpModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleConfirmOtp}>
                            Xác Nhận
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    )
}

export default SignUp