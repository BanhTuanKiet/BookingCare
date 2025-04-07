import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [UserName, setUserName] = useState("");
    const [role, setRole] = useState()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserName = localStorage.getItem("UserName");
        if (token) {
            setIsAuthenticated(true);
            setUserName(storedUserName || "Người dùng");
        }
    }, []);

    const login = (token, name, role) => {
        console.log(role)
        localStorage.setItem("token", token);
        localStorage.setItem("UserName", name);
        setIsAuthenticated(true);
        setUserName(name);
        setRole(role)

        setTimeout(() => {
            const redirectPath = localStorage.getItem("prevPage") || "/";
            localStorage.removeItem("prevPage");
            navigate(redirectPath || "/");
        }, 200);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("UserName");
        setIsAuthenticated(false);
        setUserName("");
    };

    const hanelePrevPage = () => {
        console.log(location.pathname)
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, UserName, login, logout, hanelePrevPage, role }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };


