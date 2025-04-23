import React, { useState, useContext } from "react"
import { Container, Col, Form, Button, InputGroup, Alert } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import "../Style/Signin.css"
import axios from '../Util/AxiosConfig'
import { AuthContext } from "../Context/AuthContext"
import { useNavigate } from "react-router-dom"

const Signin = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPasswords, setShowPasswords] = useState(false)
  const [loading, setLoading] = useState(false)
  const [otpSending, setOtpSending] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [otpSuccess, setOtpSuccess] = useState(false)
  const [loginData, setLoginData] = useState({ Email: "", Password: "" })
  const [registerData, setRegisterData] = useState({ 
    fullname: "", 
    phone: "", 
    email: "", 
    password: "", 
    passwordConfirmed: "", 
    otp: "" 
  })
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  // Gọi API đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post("/auth/Signin", loginData)
      login(response.data.userName, response.data.role)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  // Gọi API gửi mã OTP
  const handleSendOTP = async () => {
    if (!registerData.email) {
      setOtpError("Vui lòng nhập email trước khi lấy mã OTP")
      return
    }
    
    setOtpSending(true)
    setOtpError("")
    setOtpSuccess(false)
    
    try {
      const normalizedEmail = registerData.email.trim().toLowerCase();
      await axios.post("/auth/send-otp", { email: normalizedEmail })
      setOtpSuccess(true)
    } catch (error) {
      setOtpError(error.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại sau.")
    } finally {
      setOtpSending(false)
    }
  }

  // Gọi API đăng ký
  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!registerData.otp) {
      setOtpError("Vui lòng nhập mã OTP để đăng ký")
      return
    }
    
    setLoading(true)
    try {
      await axios.post("/auth/register", registerData)
      setIsLogin(true)
    } catch (error) {
      console.log(error)
      setOtpError(error.response?.data?.message || "Đăng ký không thành công")
    }
    setLoading(false)
  }

  return (
    <Container className="auth-container">
      {/* Form Đăng Nhập */}
      <Col md={6} className={`auth-section ${isLogin ? "show" : "hide"}`}>
        <h2>Đăng Nhập</h2>
        <Form className="auth-form" onSubmit={handleLogin}>
          <Form.Control
            type="email"
            placeholder="Email"
            className="mb-3"
            value={loginData.Email}
            onChange={(e) => setLoginData({ ...loginData, Email: e.target.value })}
            required
          />
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            className="mb-3"
            value={loginData.Password}
            onChange={(e) => setLoginData({ ...loginData, Password: e.target.value })}
            required
          />
          <Button variant="primary" disabled={loading} type="submit">
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </Button>
        </Form>
        <p style={{ cursor: "pointer", color: "blue" }} onClick={() => navigate("/auth/forgot-password")}>
          Quên mật khẩu?
        </p>
        <p>
          Chưa có tài khoản? <Button variant="link" onClick={() => setIsLogin(false)}>Đăng ký</Button>
        </p>
      </Col>

      {/* Form Đăng Ký */}
      <Col md={6} className={`auth-section ${isLogin ? "hide" : "show"}`}>
        <h2>Đăng Ký</h2>
        <Form className="auth-form" onSubmit={handleRegister}>
          <Form.Control
            type="text"
            placeholder="Họ và Tên"
            className="mb-3"
            value={registerData.fullname}
            onChange={(e) => setRegisterData({ ...registerData, fullname: e.target.value })}
            required
          />
          <Form.Control
            type="text"
            placeholder="Số điện thoại"
            className="mb-3"
            value={registerData.phone}
            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
            required
          />
          <Form.Control
            type="email"
            placeholder="Email"
            className="mb-3"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            required
          />
          
          <div className="otp-group">
            <Form.Control
              type="text"
              placeholder="Mã OTP"
              value={registerData.otp}
              onChange={(e) => setRegisterData({ ...registerData, otp: e.target.value })}
              required
            />
            <Button
              variant="primary"
              className="otp-button"
              onClick={handleSendOTP}
              disabled={otpSending || !registerData.email}
            >
              {otpSending ? "Đang gửi..." : "Lấy mã OTP"}
            </Button>
          </div>
          
          {otpError && <Alert variant="danger" className="mt-2 mb-3 py-2">{otpError}</Alert>}
          {otpSuccess && <Alert variant="success" className="mt-2 mb-3 py-2">OTP đã được gửi đến email của bạn!</Alert>}

          <InputGroup className="mb-3">
            <Form.Control
              type={showPasswords ? "text" : "password"}
              placeholder="Mật khẩu"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control
              type={showPasswords ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
              value={registerData.passwordConfirmed}
              onChange={(e) => setRegisterData({ ...registerData, passwordConfirmed: e.target.value })}
              required
            />
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
      </Col>

      {/* Chuyển đổi giữa đăng nhập và đăng ký */}
      <div className={`toggle-section ${isLogin ? "" : "move"}`}>
        <h2>{isLogin ? "Chào Mừng!" : "Chào Mừng Trở Lại!"}</h2>
        <p>{isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}</p>
        <Button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </Button>
      </div>
    </Container>
  )
}

export default Signin