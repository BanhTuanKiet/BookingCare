import React, { useState } from "react";
import { Container, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/Signin.css";
import axios from '../Util/AxiosConfig';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const navigate = useNavigate();

  // Gửi yêu cầu mã xác thực
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.post("/auth/forgot-password", { Email: email });
      setMessage("Mã xác thực đã được gửi đến email của bạn");
      setVerificationSent(true);
    } catch (error) {
      setError(error.response?.data || "Có lỗi xảy ra khi gửi mã xác thực");
    }
    
    setLoading(false);
  };

  // Xác thực mã và đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    
    setLoading(true);
    setError(null);
    setMessage(null);
    
    try {
      const response = await axios.post("/auth/verify-reset-code", {
        Email: email,
        Code: code,
        NewPassword: newPassword
      });
      
      setMessage("Đặt lại mật khẩu thành công");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError(error.response?.data || "Mã xác thực không hợp lệ hoặc đã hết hạn");
    }
    
    setLoading(false);
  };

  return (
    <Container className="auth-container">
      <Col md={6} className="auth-section show">
        {!verificationSent ? (
          // Form gửi yêu cầu mã xác thực
          <>
            <h2>Quên Mật Khẩu</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            
            <Form className="auth-form" onSubmit={handleForgotPassword}>
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                className="mb-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              
              <Button variant="primary" type="submit" block disabled={loading}>
                {loading ? "Đang xử lý..." : "Gửi mã xác thực"}
              </Button>
            </Form>
            
            <p className="mt-3">
              <Button variant="link" onClick={() => navigate("/")}>
                Quay lại đăng nhập
              </Button>
            </p>
          </>
        ) : (
          // Form xác thực mã và đặt lại mật khẩu
          <>
            <h2>Đặt Lại Mật Khẩu</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}
            
            <Form className="auth-form" onSubmit={handleResetPassword}>
              <p className="text-muted mb-3">
                Mã xác thực đã được gửi tới: {email}
              </p>
              
              <Form.Control
                type="text"
                placeholder="Nhập mã xác thực"
                className="mb-3"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              
              <Form.Control
                type={showPasswords ? "text" : "password"}
                placeholder="Mật khẩu mới"
                className="mb-3"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              
              <Form.Control
                type={showPasswords ? "text" : "password"}
                placeholder="Xác nhận mật khẩu mới"
                className="mb-3"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              
              <div className="checkbox-container mb-3">
                <input
                  type="checkbox"
                  id="showPasswordToggle"
                  className="small-checkbox"
                  checked={showPasswords}
                  onChange={() => setShowPasswords(!showPasswords)}
                />
                <label htmlFor="showPasswordToggle">
                  {showPasswords ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                </label>
              </div>
              
              <Button variant="primary" type="submit" block disabled={loading}>
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Button>
            </Form>
            
            <p className="mt-3">
              <Button variant="link" onClick={() => navigate("/")}>
                Quay lại đăng nhập
              </Button>
            </p>
          </>
        )}
      </Col>
    </Container>
  );
};

export default ForgotPassword;