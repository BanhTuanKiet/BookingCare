import { useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import AppointmentStatistics from './Appointment/AppointmentStatistics'
import PrescriptionOverView from './Prescription/PrescriptionOverView'
import DoctorReviews from './Doctor/Reviews'
import DoctorSalary from './Salary/DoctorSalary'
import UserAdmin from './UserAdmin'
import Review from './Service/Review'
import SpecialtyAdmin from './Management/SpecialtyAdmin'
import ServiceAdmin from './Management/ServiceAdmin'
import ReviewManagement from "./Review/Index"
import UserManagement from "./Management/Index"
import "../../../Style/Admin.css"

function Index() {
    const [tabActive, setTabActive] = useState("admin")
    const [menuOpen, setMenuOpen] = useState(false)
    const [systemMenuOpen, setSystemMenuOpen] = useState(false)
    
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
                                        eventKey="appointments"
                                        className={`sidebar-link mb-2 ${tabActive === "appointments" ? "active" : ""}`}
                                    >
                                        Lịch hẹn
                                    </Nav.Link>
                                    
                                    <ReviewManagement tabActive={tabActive} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                                    <UserManagement tabActive={tabActive} systemMenuOpen={systemMenuOpen} setSystemMenuOpen={setSystemMenuOpen} />

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
                            <Tab.Pane eventKey="appointments">
                                <AppointmentStatistics tabActive={tabActive} />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="reviewservices">
                                <Review tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="reviewDoctors">
                                <DoctorReviews tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="services">
                                <ServiceAdmin tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="specialties">
                                <SpecialtyAdmin tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="prescriptions">
                                <PrescriptionOverView tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="salary">
                                <DoctorSalary tabActive={tabActive} />
                            </Tab.Pane>

                            <Tab.Pane eventKey="users">
                                <UserAdmin tabActive={tabActive} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>
        </Tab.Container>
    )
}

export default Index