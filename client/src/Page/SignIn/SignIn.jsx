import React, { useContext, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/AuthContext'
import { ValideFormContext } from '../../Context/ValideFormContext'
import axios from '../../Util/AxiosConfig'

function SignIn({ setIsLogin }) {
    const { login } = useContext(AuthContext)
    const { validateForm, formErrors } = useContext(ValideFormContext)
    const [loginData, setLoginData] = useState({ email: "", password: "" })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const errors = validateForm(loginData)   
        if (errors > 0) return
        console.log(loginData)
        try {
            const response = await axios.post("/auth/Signin", loginData)
            login(response.data.userName, response.data.role)
            setLoading(true)
            navigate("/")
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <>
            <h2>Đăng Nhập</h2>
            <Form className="auth-form" onSubmit={handleLogin}>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    isInvalid={!!formErrors.email}
                />
                <Form.Control.Feedback className="mb-3" type="invalid">{formErrors.email}</Form.Control.Feedback>

                <Form.Control
                    type="password"
                    placeholder="Mật khẩu"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    isInvalid={!!formErrors.password}
                />
                <Form.Control.Feedback className="mb-3" type="invalid">{formErrors.password}</Form.Control.Feedback>

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
        </>
    )
}

export default SignIn