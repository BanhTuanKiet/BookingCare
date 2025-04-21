import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import Overview from './Overview'
import Appointments from './Appointments'
import Prescriptions from './Prescriptions'
import axios from '../../../Util/AxiosConfig'

function Index() {
    const [tabActive, setTabActive] = useState("overview")
    const [patient, setPatient] = useState()
    const [recordIsChoose, setRecordIschoose] = useState()

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await axios.get("/users/profile")
                setPatient(response.data)
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
                            
                            <h4>{patient?.userName}</h4>
                            <p className="text-muted">Mã BN: BN-12345</p>
                            
                            <div className="text-start mt-4">
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Ngày sinh:</Col>
                                    <Col md={7}>{patient?.dateOfBirth ?? "15/05/1985"}</Col>
                                </Row>
                                
                                <Row className="mb-2">
                                    <Col md={5} className="text-muted">Giới tính:</Col>
                                    <Col md={7}>{patient?.sex ?? "Nam"}</Col>
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
                                    <Col md={7}>{patient?.phoneNumber}</Col>
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
                        <Nav variant="tabs" className="mb-3 pt-0">
                            <Nav.Item>
                                <Nav.Link eventKey="overview" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Tổng Quan
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="appointments" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Lịch Hẹn
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="prescriptions" className="d-flex align-items-center">
                                    <span className="me-2">
                                        {/* icon can be added here */}
                                    </span>
                                    Đơn Thuốc
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        
                        <Tab.Content>
                            <Tab.Pane eventKey="overview">
                                <Overview tabActive={tabActive} setTabActive={setTabActive} recordIsChoose={recordIsChoose} setRecordIschoose={setRecordIschoose} />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="appointments">
                                <Appointments tabActive={tabActive} />
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="prescriptions"> 
                                <Prescriptions tabActive={tabActive} setTabActive={setTabActive} recordIsChoose={recordIsChoose} setRecordIschoose={setRecordIschoose} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Index