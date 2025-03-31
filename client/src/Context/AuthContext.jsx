import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [UserName, setUserName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserName = localStorage.getItem("UserName");
        if (token) {
            setIsAuthenticated(true);
            setUserName(storedUserName || "Người dùng");
        }
    }, []);

    const login = (token, name) => {
        localStorage.setItem("token", token);
        localStorage.setItem("UserName", name);
        setIsAuthenticated(true);
        setUserName(name);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("UserName");
        setIsAuthenticated(false);
        setUserName("");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, UserName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };


