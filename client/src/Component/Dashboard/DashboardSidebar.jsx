import { Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext";
import '../../Style/DashboardSidebar.css'; // Import CSS file

const DashboardSidebar = ({ role, setTabActive }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate("/");
    }
    
    const adminSidebar = () => (
        <Nav className="flex-column w-100">
            <div className="sidebar-header">
                <h4 className="fw-bold">Dashboard</h4>
                <div className="user-role">Admin</div>
            </div>
            
            <Nav.Link className="sidebar-link" href="#dashboard" onClick={() => setTabActive("")}>
                <span className="sidebar-icon">🏥</span> 
                <span>Quản lý bệnh viện</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#quản lý người dùng" onClick={() => setTabActive("quản lý người dùng")}>
                <span className="sidebar-icon">👥</span> 
                <span>Quản lý người dùng</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#settings" onClick={() => setTabActive("hồ sơ")}>
                <span className="sidebar-icon">⚙️</span> 
                <span>Cài đặt</span>
            </Nav.Link>
            
            <div className="sidebar-footer">
                <Nav.Link onClick={handleLogout} href="#logout" className="sidebar-link text-danger">
                    <span className="sidebar-icon">🚪</span> 
                    <span>Đăng xuất</span>
                </Nav.Link>
            </div>
        </Nav>
    );
    
    const doctorSidebar = () => (
        <Nav className="flex-column w-100">
            <div className="sidebar-header">
                <h4 className="fw-bold">Dashboard</h4>
                <div className="user-role">Bác sĩ</div>
            </div>
            
            <Nav.Link className="sidebar-link" href="#hồ sơ" onClick={() => setTabActive("hồ sơ")}>
                <span className="sidebar-icon">🧑‍⚕️</span> 
                <span>Hồ sơ</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#lịch làm việc" onClick={() => setTabActive("lịch làm việc")}>
                <span className="sidebar-icon">📋</span> 
                <span>Lịch làm việc</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#danh sách bệnh nhân" onClick={() => setTabActive("danh sách bệnh nhân")}>
                <span className="sidebar-icon">🩺</span> 
                <span>Danh sách bệnh nhân</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#đánh giá" onClick={() => setTabActive("đánh giá")}>
                <span className="sidebar-icon">⭐</span> 
                <span>Đánh giá</span>
            </Nav.Link>
            
            <div className="sidebar-footer">
                <Nav.Link onClick={handleLogout} href="#logout" className="sidebar-link text-danger">
                    <span className="sidebar-icon">🚪</span> 
                    <span>Đăng xuất</span>
                </Nav.Link>
            </div>
        </Nav>
    );
    
    const patientSidebar = () => (
        <Nav className="flex-column w-100">
            <div className="sidebar-header">
                <h4 className="fw-bold">Dashboard</h4>
                <div className="user-role">Bệnh nhân</div>
            </div>
            
            <Nav.Link className="sidebar-link" href="#profile" onClick={() => setTabActive("hồ sơ")}>
                <span className="sidebar-icon">🧑‍💼</span> 
                <span>Hồ sơ cá nhân</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#appointments" onClick={() => setTabActive("lịch sử hẹn")}>
                <span className="sidebar-icon">📅</span> 
                <span>Lịch sử hẹn</span>
            </Nav.Link>
            <Nav.Link className="sidebar-link" href="#payments" onClick={() => setTabActive("lịch sử thanh toán")}>
                <span className="sidebar-icon">💳</span> 
                <span>Lịch sử thanh toán</span>
            </Nav.Link>
            
            <div className="sidebar-footer">
                <Nav.Link onClick={handleLogout} href="#logout" className="sidebar-link text-danger">
                    <span className="sidebar-icon">🚪</span> 
                    <span>Đăng xuất</span>
                </Nav.Link>
            </div>
        </Nav>
    );
    
    const sidebar = {
        "admin": adminSidebar(),
        "doctor": doctorSidebar(),
        "patient": patientSidebar()
    };
    
    return (
        <div className="sidebar-container">
            {sidebar[role]}
        </div>
    );
};

export default DashboardSidebar;