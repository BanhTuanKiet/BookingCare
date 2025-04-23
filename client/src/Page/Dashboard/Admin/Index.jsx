import React, { useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import AppointmentAdmin from './AppointmentAdmin'
import "../../../Style/Admin.css"

function Index() {
    const [tabActive, setTabActive] = useState("dashboard")
    const [loading, setLoading] = useState(false)

    return (
        <Container fluid className="p-4">
            <Row>
                {/* Sidebar - 25% width of the 75% content area */}
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
                
                {/* Main content area - 75% width of the 75% content area */}
                <Col md={9} style={{ fontSize: "14px" }} className='p-0'>
                    <Tab.Content>
                        {tabActive === "dashboard" && (
                            <Card>
                                <Card.Body>
                                    <h4>Tổng Quan Hệ Thống</h4>
                                    <p className="text-muted">Thống kê và báo cáo tổng hợp</p>
                                    
                                    {/* Dashboard content placeholder */}
                                    <div className="p-4 bg-light rounded text-center">
                                        <p>Nội dung tổng quan sẽ hiển thị ở đây</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {tabActive === "appointments" && (
                            <Card>
                                <Card.Body>
                                    <AppointmentAdmin />
                                </Card.Body>
                            </Card>
                        )}

                        {tabActive === "prescriptions" && (
                            <Card>
                                <Card.Body>
                                    <h4>Quản Lý Đơn Thuốc</h4>
                                    <p className="text-muted">Xem và quản lý đơn thuốc trong hệ thống</p>
                                    
                                    {/* Prescriptions content placeholder */}
                                    <div className="p-4 bg-light rounded text-center">
                                        <p>Nội dung quản lý đơn thuốc sẽ hiển thị ở đây</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                        
                        {tabActive === "users" && (
                            <Card>
                                <Card.Body>
                                    <h4>Quản Lý Người Dùng</h4>
                                    <p className="text-muted">Quản lý tài khoản bác sĩ, nhân viên và bệnh nhân</p>
                                    
                                    {/* Users content placeholder */}
                                    <div className="p-4 bg-light rounded text-center">
                                        <p>Nội dung quản lý người dùng sẽ hiển thị ở đây</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}
                    </Tab.Content>
                </Col>
            </Row>
        </Container>
    )
}

export default Index