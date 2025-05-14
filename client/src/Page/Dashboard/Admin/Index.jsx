import { useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import AppointmentStatistics from './Appointment/AppointmentStatistics'
import PrescriptionOverView from './Prescription/PrescriptionOverView'
import DoctorReviews from './Doctor/Reviews'
import DoctorSalary from './Salary/DoctorSalary'
import "../../../Style/Admin.css"
import Admin from './Admin'
import UserAdmin from './UserAdmin'
import Review from './Service/Review'
import SpecialtyAdmin from './SpecialtyAdmin'
import ServiceAdmin from './Service/ServiceAdmin'

function Index() {
    const [tabActive, setTabActive] = useState("admin")
    const [systemMenuOpen, setSystemMenuOpen] = useState(false)
    const [MenuOpen, setMenuOpen] = useState(false)

    // const handleTabSelect = (k) => {
    //     setTabActive(k)
    //     if (k === "services" || k === "specialties") {
    //         setSystemMenuOpen(true)
    //     }
    // }

    // const handleTabSelect2 = (k) => {
    //     setTabActive(k)
    //     if (k === "reviewservices" || k === "doctors") {
    //         setMenuOpen(true)
    //     }
    // }

    return (
        <Tab.Container activeKey={tabActive} onSelect={(k) => {
            setTabActive(k)
            if (k === "reviewservices" || k === "doctors") {
                setMenuOpen(true)
            }
            if (k === "services" || k === "specialties") {
                setSystemMenuOpen(true)
            }
        }}>
            <Container fluid className="p-4">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4 sidebar">
                            <Card.Body>
                                <h5 className="text-primary mb-4 text-center">QUẢN TRỊ HỆ THỐNG</h5>
                                
                                <Nav className="flex-column">
                                    <Nav.Link 
                                        eventKey="admin"
                                        className={`sidebar-link mb-2 ${tabActive === "admin" ? "active" : ""}`}
                                    >
                                        Admin
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="appointments"
                                        className={`sidebar-link mb-2 ${tabActive === "appointments" ? "active" : ""}`}
                                    >
                                        Lịch hẹn
                                    </Nav.Link>
                                    
                                    {/* Menu dropdown quản lý hệ thống */}
                                    {/* Khu vực quản lý hệ thống với chức năng đóng/mở */}
                                    <div className="system-management-section mb-2">
                                    <div 
                                        className="system-management-header px-3 py-2 mb-1 bg-light rounded d-flex justify-content-between align-items-center"
                                        onClick={() => setMenuOpen(!MenuOpen)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className="fw-medium text-primary">Quản Lý Đánh Giá</span>
                                        <i className={`fas ${MenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'} small text-secondary`}></i>
                                    </div>
                                    
                                    {MenuOpen && (
                                        <>
                                        <Nav.Link 
                                            eventKey="reviewservices" 
                                            className={`sidebar-link ms-3 mb-1 ${tabActive === "reviewservices" ? "active" : ""}`}
                                        >
                                            <i className="fas fa-cogs me-2 small"></i>
                                            Dịch vụ
                                        </Nav.Link>
                                        
                                        <Nav.Link 
                                            eventKey="doctors"
                                            className={`sidebar-link ms-3 mb-1 ${tabActive === "doctors" ? "active" : ""}`}
                                        >
                                            <i className="fas fa-cogs me-2 small"></i>
                                            Bác sĩ
                                        </Nav.Link>
                                        </>
                                    )}
                                    </div>

                                    {/* Khu vực quản lý hệ thống với chức năng đóng/mở */}
                                    <div className="system-management-section mb-2">
                                    <div 
                                        className="system-management-header px-3 py-2 mb-1 bg-light rounded d-flex justify-content-between align-items-center"
                                        onClick={() => setSystemMenuOpen(!systemMenuOpen)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span className="fw-medium text-primary">Quản lý hệ thống</span>
                                        <i className={`fas ${systemMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'} small text-secondary`}></i>
                                    </div>
                                    
                                    {systemMenuOpen && (
                                        <>
                                        <Nav.Link 
                                            eventKey="services" 
                                            className={`sidebar-link ms-3 mb-1 ${tabActive === "services" ? "active" : ""}`}
                                        >
                                            <i className="fas fa-cogs me-2 small"></i>
                                            Dịch vụ
                                        </Nav.Link>
                                        
                                        <Nav.Link 
                                            eventKey="specialties" 
                                            className={`sidebar-link ms-3 mb-1 ${tabActive === "specialties" ? "active" : ""}`}
                                        >
                                            <i className="fas fa-stethoscope me-2 small"></i>
                                            Chuyên khoa
                                        </Nav.Link>
                                        </>
                                    )}
                                    </div>
                                    <Nav.Link 
                                        eventKey="prescriptions"
                                        className={`sidebar-link mb-2 ${tabActive === "prescriptions" ? "active" : ""}`}
                                    >
                                        Hồ sơ bệnh nhân
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="salary"
                                        className={`sidebar-link mb-2 ${tabActive === "salary" ? "active" : ""}`}
                                    >
                                        Lương
                                    </Nav.Link>                                    
                                    <Nav.Link 
                                        eventKey="users"
                                        className={`sidebar-link mb-2 ${tabActive === "users" ? "active" : ""}`}
                                    >
                                        Người Dùng
                                    </Nav.Link>
                                </Nav>

                                <div className="mt-5 pt-5">
                                    <div className="bg-light p-3 rounded">
                                        <p className="small text-muted mb-0">Phiên đăng nhập hiện tại:</p>
                                        <p className="mb-2"><strong>Admin</strong></p>
                                        <p className="small text-muted mb-0">Đăng nhập lúc:</p>
                                        <p className="mb-0"><small>{new Date().toLocaleString()}</small></p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={9} style={{ fontSize: "14px" }} className='p-0'>
                        <Tab.Content>
                            <Tab.Pane eventKey="admin">
                                <Admin />
                            </Tab.Pane>

                            <Tab.Pane eventKey="appointments">
                                <AppointmentStatistics />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="reviewservices">
                                <Review />
                            </Tab.Pane>

                            <Tab.Pane eventKey="doctors">
                                <DoctorReviews />
                            </Tab.Pane>

                            <Tab.Pane eventKey="services">
                                <ServiceAdmin />
                            </Tab.Pane>

                            <Tab.Pane eventKey="specialties">
                                <SpecialtyAdmin/>
                            </Tab.Pane>

                            <Tab.Pane eventKey="prescriptions">
                                <PrescriptionOverView />
                            </Tab.Pane>

                            <Tab.Pane eventKey="salary">
                                <DoctorSalary />
                            </Tab.Pane>

                            <Tab.Pane eventKey="users">
                                <UserAdmin />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>
        </Tab.Container>
    )
}

export default Index