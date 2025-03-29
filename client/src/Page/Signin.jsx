import React, { useState } from "react";
import { Container, Col, Form, Button, InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/Signin.css";

const Signin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPasswords, setShowPasswords] = useState(false);

  return (
    <Container className="auth-container">
      <Col md={6} className={`auth-section ${isLogin ? "show" : "hide"}`}>
        <h2>Đăng Nhập</h2>
        <Form className="auth-form">
          <Form.Control type="text" placeholder="Tên đăng nhập" className="mb-3" />
          <Form.Control type="password" placeholder="Mật khẩu" className="mb-3" />
          <Button variant="primary" block>
            Đăng Nhập
          </Button>
        </Form>
        <p>Quên mật khẩu?</p>
        <p>
          Chưa có tài khoản?{" "}
          <Button variant="link" onClick={() => setIsLogin(false)}>
            Đăng ký
          </Button>
        </p>
      </Col>

      <Col md={6} className={`auth-section ${isLogin ? "hide" : "show"}`}>
        <h2>Đăng Ký</h2>
        <Form className="auth-form">
          <Form.Control type="text" placeholder="Họ và Tên" className="mb-3" />
          <Form.Control type="text" placeholder="Số điện thoại" className="mb-3" />
          <Form.Control type="email" placeholder="Email" className="mb-3" />

          {/* Mật khẩu */}
          <InputGroup className="mb-3">
            <Form.Control
              type={showPasswords ? "text" : "password"}
              placeholder="Mật khẩu"
            />
          </InputGroup>

          {/* Xác nhận mật khẩu */}
          <InputGroup className="mb-3">
            <Form.Control
              type={showPasswords ? "text" : "password"}
              placeholder="Xác nhận mật khẩu"
            />
          </InputGroup>

          {/* Checkbox hiện/ẩn mật khẩu */}
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="showPasswordToggle"
                    className="small-checkbox mb-0"
                    checked={showPasswords}
                    onChange={() => setShowPasswords(!showPasswords)}
                />
                <label htmlFor="showPasswordToggle">
                    {showPasswords ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                </label>
                </div>

          <Button variant="primary" block>
            Đăng Ký
          </Button>
        </Form>
        <p>
          Đã có tài khoản?{" "}
          <Button variant="link" onClick={() => setIsLogin(true)}>
            Đăng nhập
          </Button>
        </p>
      </Col>
      {/* Phần giao diện động */}
      <div className={`toggle-section ${isLogin ? "" : "move"}`}>
        <h2>{isLogin ? "Chào Mừng!" : "Chào Mừng Trở Lại!"}</h2>
        <p>{isLogin ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}</p>
        <Button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </Button>
      </div>
    </Container>
  );
};

export default Signin;
