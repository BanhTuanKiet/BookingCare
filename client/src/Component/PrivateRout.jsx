import { Navigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"

const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()

    return isAuthenticated ? children : <Navigate to="/Đăng nhập" />
}

export default PrivateRoute
