import React, { useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import AppointmentAdmin from './Appointment/AppointmentAdmin'
import AppointmentStatistics from './Appointment/AppointmentStatistics'
import PrescriptionOverView from './Prescription/PrescriptionOverView'
import Reviews from './Doctor/Reviews'
import DoctorSalary from './Salary/DoctorSalary'
import "../../../Style/Admin.css"
import AppointmentStatistics from './AppointmentStatistics'
import DepartmentRatings from './DepartmentRatings'
import UserAdmin from './UserAdmin'
import PrescriptionOverView from './PrescriptionOverView'
import RevenueChart from './RevenueChart'


function Index() {
    const [tabActive, setTabActive] = useState("dashboard")

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={3}>
                    <Card className="mb-4 sidebar">
                        <Card.Body>
                            <h5 className="text-primary mb-4 text-center">QUẢN TRỊ HỆ THỐNG</h5>
                            
                            <Nav className="flex-column">
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "dashboard" ? "active" : ""}`}
                                    onClick={() => setTabActive("dashboard")}
                                >
                                    Tổng Quan
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "appointments_statistics" ? "active" : ""}`}
                                    onClick={() => setTabActive("appointment_statistics")}
                                >
                                    Thống kê lịch hẹn
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "appointments" ? "active" : ""}`}
                                    onClick={() => setTabActive("appointments")}
                                >
                                    Lịch Hẹn
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "prescriptions" ? "active" : ""}`}
                                    onClick={() => setTabActive("prescriptions")}
                                >
                                    Đơn Thuốc
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "users" ? "active" : ""}`}
                                    onClick={() => setTabActive("users")}
                                >
                                    Người Dùng
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "revenue" ? "active" : ""}`}
                                    onClick={() => setTabActive("revenue")}
                                >
                                    Doanh Thu
                                </Nav.Link>
                                <Nav.Link 
                                    className={`sidebar-link mb-2 ${tabActive === "specialtyRatings" ? "active" : ""}`}
                                    onClick={() => setTabActive("specialtyRatings")}
                                >
                                   Đánh Giá Về Khoa
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
                        {tabActive === "dashboard" && (
                            <Card>
                                <Card.Body>
                                    <h4>Tổng Quan Hệ Thống</h4>
                                    <p className="text-muted">Thống kê và báo cáo tổng hợp</p>
                                    
                                    <div className="p-4 bg-light rounded text-center">
                                        <p>Nội dung tổng quan sẽ hiển thị ở đây</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                        {tabActive === "appointment_statistics" && (
                            <Card>
                                <Card.Body>
                                    <AppointmentStatistics />
                                </Card.Body>
                            </Card>
                        )
                        }
=======
        <Tab.Container activeKey={tabActive} onSelect={(k) => setTabActive(k)}>
            <Container fluid className="p-4">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4 sidebar">
                            <Card.Body>
                                <h5 className="text-primary mb-4 text-center">QUẢN TRỊ HỆ THỐNG</h5>
                                
                                <Nav className="flex-column">
                                    <Nav.Link 
                                        eventKey="dashboard"
                                        className={`sidebar-link mb-2 ${tabActive === "dashboard" ? "active" : ""}`}
                                    >
                                        Tổng Quan
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="appointment_statistics"
                                        className={`sidebar-link mb-2 ${tabActive === "appointment_statistics" ? "active" : ""}`}
                                    >
                                        Thống kê lịch hẹn
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="reviews"
                                        className={`sidebar-link mb-2 ${tabActive === "reviews" ? "active" : ""}`}
                                    >
                                        Thống kê đánh giá
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="appointments"
                                        className={`sidebar-link mb-2 ${tabActive === "appointments" ? "active" : ""}`}
                                    >
                                        Lịch Hẹn
                                    </Nav.Link>
                                    <Nav.Link 
                                        eventKey="prescriptions"
                                        className={`sidebar-link mb-2 ${tabActive === "prescriptions" ? "active" : ""}`}
                                    >
                                        Đơn Thuốc
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
                            <Tab.Pane eventKey="dashboard">
                                <Card>
                                    <Card.Body>
                                        <h4>Tổng Quan Hệ Thống</h4>
                                        <p className="text-muted">Thống kê và báo cáo tổng hợp</p>
                                        
                                        <div className="p-4 bg-light rounded text-center">
                                            <p>Nội dung tổng quan sẽ hiển thị ở đây</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="appointment_statistics">
                                <AppointmentStatistics />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="reviews">
                                <Reviews />
                            </Tab.Pane>

                            <Tab.Pane eventKey="appointments" >
                                <AppointmentAdmin />
                            </Tab.Pane>

                            <Tab.Pane eventKey="prescriptions">
                                <PrescriptionOverView />
                            </Tab.Pane>

                            <Tab.Pane eventKey="salary">
                                <DoctorSalary />
                            </Tab.Pane>

                            <Tab.Pane eventKey="users">
                                <Card>
                                    <Card.Body>
                                        <h4>Quản Lý Người Dùng</h4>
                                        <p className="text-muted">Quản lý tài khoản bác sĩ, nhân viên và bệnh nhân</p>
                                        
                                        <div className="p-4 bg-light rounded text-center">
                                            <p>Nội dung quản lý người dùng sẽ hiển thị ở đây</p>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>
        </Tab.Container>
    )
}

export default Index