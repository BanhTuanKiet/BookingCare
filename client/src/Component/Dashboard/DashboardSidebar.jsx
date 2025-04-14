import { Nav } from 'react-bootstrap';

const DashboardSidebar = ({ role, setTabActive }) => {
    const adminSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#dashboard" onClick={() => setTabActive("")}>🏥 Quản lý bệnh viện</Nav.Link>
            <Nav.Link href="#users" onClick={() => setTabActive("hồ sơ")}>👥 Quản lý người dùng</Nav.Link>
            <Nav.Link href="#settings" onClick={() => setTabActive("hồ sơ")}>⚙️ Cài đặt</Nav.Link>
            <Nav.Link href="#logout" className="text-danger mt-4">🚪 Đăng xuất</Nav.Link>
        </Nav>
    )

    const doctorSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#hồ sơ" onClick={() => setTabActive("hồ sơ")}>🧑‍⚕️ Hồ sơ</Nav.Link>
            <Nav.Link href="#lịch làm việc" onClick={() => setTabActive("lịch làm việc")}>📋 Lịch làm việc</Nav.Link>
            <Nav.Link href="#danh sách bệnh nhân" onClick={() => setTabActive("danh sách bệnh nhân")}>🩺 Danh sách bệnh nhân</Nav.Link>
            <Nav.Link href="#đánh giá" onClick={() => setTabActive("đánh giá")}>⭐ Đánh giá</Nav.Link>
            <Nav.Link href="#logout" className="text-danger mt-4">🚪 Đăng xuất</Nav.Link>
        </Nav>
    )

    const patientSidebar = () => (
        <Nav className="flex-column">
            <Nav.Link href="#profile" onClick={() => setTabActive("hồ sơ")}>🧑‍💼 Hồ sơ cá nhân</Nav.Link>
            <Nav.Link href="#appointments" onClick={() => setTabActive("lịch sử hẹn")}>📅 Lịch sử hẹn</Nav.Link>
            <Nav.Link href="#appointments" onClick={() => setTabActive("lịch sử thanh toán")}>📅 Lịch sử thanh toán</Nav.Link>
            <Nav.Link href="#logout" className="text-danger mt-4">🚪 Đăng xuất</Nav.Link>
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
          {sidebar["doctor"]}
        </div>
    )  
}

export default DashboardSidebar
