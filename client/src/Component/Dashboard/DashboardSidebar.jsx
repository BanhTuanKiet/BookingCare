import { Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../Context/AuthContext"

const DashboardSidebar = ({ role, setTabActive }) => {
    const { logout } = useContext(AuthContext)
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    const adminSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#dashboard" onClick={() => setTabActive("")}>🏥 Quản lý bệnh viện</Nav.Link>
            <Nav.Link href="#quản lý lịch hẹn" onClick={() => setTabActive("quản lý lịch hẹn")}>👥 Quản lý lịch hẹn</Nav.Link>
            <Nav.Link href="#settings" onClick={() => setTabActive("hồ sơ")}>⚙️ Cài đặt</Nav.Link>
            <Nav.Link onClick={handleLogout} href="#logout" className="text-danger mt-4">🚪 Đăng xuất</Nav.Link>
        </Nav>
    )

    const doctorSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#hồ sơ" onClick={() => setTabActive("hồ sơ")}>🧑‍⚕️ Hồ sơ</Nav.Link>
            <Nav.Link href="#lịch làm việc" onClick={() => setTabActive("lịch làm việc")}>📋 Lịch làm việc</Nav.Link>
            <Nav.Link href="#danh sách bệnh nhân" onClick={() => setTabActive("danh sách bệnh nhân")}>🩺 Danh sách bệnh nhân</Nav.Link>
            <Nav.Link href="#đánh giá" onClick={() => setTabActive("đánh giá")}>⭐ Đánh giá</Nav.Link>
            <Nav.Link onClick={handleLogout} href="#logout" className="text-danger mt-4">🚪 Đăng xuất </Nav.Link>
        </Nav>
    )

    const patientSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#profile" onClick={() => setTabActive("hồ sơ")}>🧑‍💼 Hồ sơ cá nhân</Nav.Link>
            <Nav.Link href="#appointments" onClick={() => setTabActive("lịch sử hẹn")}>📅 Lịch sử hẹn</Nav.Link>
            <Nav.Link href="#payments" onClick={() => setTabActive("lịch sử thanh toán")}>💳 Lịch sử thanh toán</Nav.Link>
            <Nav.Link onClick={handleLogout} href="#logout" className="text-danger mt-4">🚪 Đăng xuất</Nav.Link>
        </Nav>
    )

    const sidebar = {
        "admin": adminSidebar(),
        "doctor": doctorSidebar(),
        "patient": patientSidebar()
    }

    return (
        <div style={{ height: '100vh', borderLeft: '1px solid #dee2e6', padding: '1rem' }} className='m-0 bg-light'>
            <h5 className="mb-4 px-3">Dashboard</h5>
            {sidebar[role]}
        </div>
    )
}

export default DashboardSidebar;
