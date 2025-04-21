import { Clock, FileText } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Nav, Row, Tab } from 'react-bootstrap'
import ReviewDoctor from './ReviewDoctor'
import PatientHistory from './PatientHistory'
import DoctorSchedule from './DoctorSchedule'
import DoctorShiftDetail from './DoctorShiftDetail'
import axios from '../../../Util/AxiosConfig'

function Index() {
    const [tabActive, setTabActive] = useState("overview")
    const [doctor, setDoctor] = useState()
    const [showShiftDetail, setShowShiftDetail] = useState(false)
    const [dateTime, setDateTime] = useState({
        date: null,
        time: null
    })

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get("/users/profile")
                setDoctor(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchPatient()
    }, [])

    return (
        <Container fluid className="p-4">
            <Row>
                <Col md={3}>
                    <Card className="mb-4">
                        <Card.Body className="text-center">
                            <h5 className="text-success mb-4">Thông Tin Bệnh Nhân</h5>
                            
                            <div className="mb-4">
                                <div 
                                    className="rounded-circle bg-light text-success mx-auto d-flex align-items-center justify-content-center"
                                    style={{ width: '120px', height: '120px', fontSize: '48px' }}
                                >
                                    A
                                </div>
                            </div>
                            
                            <h4>{doctor?.userName}</h4>
                            <p className="text-muted">Mã BN: BN-12345</p>
                            
                            <div className="text-start mt-4">
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Ngày sinh:</Col>
                                    <Col md={7}>{doctor?.dateOfBirth ?? "15/05/1985"}</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Giới tính:</Col>
                                    <Col md={7}>{doctor?.sex ?? "Nam"}</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Nhóm máu:</Col>
                                    <Col md={7}>O+</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Dị ứng:</Col>
                                    <Col md={7}>Penicillin</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Điện thoại:</Col>
                                    <Col md={7}>{doctor?.phoneNumber}</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Địa chỉ:</Col>
                                    <Col md={7}>
                                        123 Đường Lê Lợi, Quận 1, TP.HCM
                                    </Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Liên hệ khẩn cấp:</Col>
                                    <Col md={7}>Nguyễn Thị B - 0909876543</Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={9}>
                    <Tab.Container id="dashboard-tabs" activeKey={tabActive} onSelect={(k) => setTabActive(k)}>
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Tổng Quan
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="doctorSchedule" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Lịch làm việc
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="patientHistory" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Danh sách bệnh nhân
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="evaluate" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Đánh giá
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        
                        <Tab.Content>
                            <Tab.Pane eventKey="overview">
                                <Card>
                                    <Card.Body>
                                        <h4>Tổng Quan Bệnh Án</h4>
                                        <p className="text-muted">Thông tin tổng hợp về lịch hẹn và đơn thuốc gần đây</p>
                                        
                                        <Row className="mt-4">
                                            <Col md={6}>
                                                <Card>
                                                    <Card.Body>
                                                        <h5>Lịch Hẹn Sắp Tới</h5>
                                                        
                                                        <div className="border rounded p-3 mt-3">
                                                            <div className="d-flex">
                                                                <div className="bg-light rounded-circle p-2 me-3">
                                                                    <Clock size={24} className="text-success" />
                                                                </div>
                                                                <div>
                                                                    <h6>Khoa Xét Nghiệm</h6>
                                                                    <p className="mb-1">25/04/2025 - 14:30</p>
                                                                    <p className="mb-0 text-muted">BS. Lê Thị D</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="border rounded p-3 mt-3">
                                                            <div className="d-flex">
                                                                <div className="bg-light rounded-circle p-2 me-3">
                                                                    <Clock size={24} className="text-success" />
                                                                </div>
                                                                <div>
                                                                    <h6>Khoa Tim Mạch</h6>
                                                                    <p className="mb-1">05/05/2025 - 10:15</p>
                                                                    <p className="mb-0 text-muted">BS. Trần Văn C</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            
                                            <Col md={6}>
                                                <Card>
                                                    <Card.Body>
                                                        <h5>Đơn Thuốc Gần Đây</h5>
                                                        
                                                        <div className="border rounded p-3 mt-3">
                                                            <div className="d-flex">
                                                                <div className="bg-light rounded-circle p-2 me-3">
                                                                    <FileText size={24} className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h6>Khoa Tim Mạch</h6>
                                                                    <p className="mb-1">20/04/2025</p>
                                                                    <p className="mb-0 text-muted">BS. Trần Văn C</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="border rounded p-3 mt-3">
                                                            <div className="d-flex">
                                                                <div className="bg-light rounded-circle p-2 me-3">
                                                                    <FileText size={24} className="text-primary" />
                                                                </div>
                                                                <div>
                                                                    <h6>Khoa Nội Tổng Hợp</h6>
                                                                    <p className="mb-1">10/04/2025</p>
                                                                    <p className="mb-0 text-muted">BS. Phạm Thị E</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="doctorSchedule">
                                <Card>
                                    <Card.Body>
                                        {
                                            showShiftDetail ? 
                                            <DoctorShiftDetail dateTime={dateTime} setShowShiftDetail={setShowShiftDetail} /> : 
                                            <DoctorSchedule setShowShiftDetail={setShowShiftDetail} setDateTime={setDateTime} />
                                        }
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="patientHistory">
                                <Card>
                                    <Card.Body>
                                        <h4>Danh sách bệnh nhân</h4>

                                        <PatientHistory />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="evaluate"> 
                                <Card>
                                    <Card.Body>
                                        <h4>Đánh giá</h4>
                                        <p>Đánh giá từ bệnh nhân</p>
                                        
                                        <ReviewDoctor />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Index