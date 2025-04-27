import React, { useState, useContext, useEffect } from "react"
import { Container, Col, Button } from "react-bootstrap"
import { ValideFormContext } from "../../Context/ValideFormContext"
import "../../Style/Signin.css"
import SignIn from "./SignIn"
import SignUp from "./SignUp"

const Index = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { setFormErrors } = useContext(ValideFormContext)


  useEffect(() => {
    setFormErrors({}) 
  }, [isLogin, setFormErrors])

  return (
    <Container className="auth-container mx-auto d-flex justify-content-center align-items-center mt-5 w-50">
      <Col md={6} className={`auth-section ${isLogin ? "show" : "hide"}`}>
        <SignIn setIsLogin={setIsLogin}  />
      </Col>

      <Col md={6} className={`auth-section ${isLogin ? "hide" : "show"} my-auto` }>
        <SignUp setIsLogin={setIsLogin} />
      </Col>

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

export default Index