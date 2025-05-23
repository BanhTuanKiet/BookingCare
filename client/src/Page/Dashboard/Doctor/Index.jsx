import { Clock, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, Col, Container, Nav, Row, Tab } from 'react-bootstrap'
import ReviewDoctor from './ReviewDoctor'
import PatientHistory from './PatientHistory'
import DoctorSchedule from './DoctorSchedule'
import axios from '../../../Util/AxiosConfig'
import UserProfileCard from '../../../Component/UserProfileCard'

function Index() {
    const [tabActive, setTabActive] = useState("overview")
    const [doctor, setDoctor] = useState()

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
                    <UserProfileCard user={doctor} setUser={setDoctor} userType="doctor" />
                </Col>
                
                <Col md={9}>
                    <Tab.Container id="dashboard-tabs" activeKey={tabActive} onSelect={(k) => setTabActive(k)}>
                        <Nav variant="tabs" className="mb-3">
                            {/* <Nav.Item>
                                <Nav.Link eventKey="overview" className="d-flex align-items-center">
                                    Tổng Quan
                                </Nav.Link>
                            </Nav.Item> */}

                            <Nav.Item>
                                <Nav.Link eventKey="doctorSchedule" className="d-flex align-items-center">
                                    Lịch làm việc
                                </Nav.Link>
                            </Nav.Item>

                            <Nav.Item>
                                <Nav.Link eventKey="patientHistory" className="d-flex align-items-center">
                                    Danh sách bệnh nhân
                                </Nav.Link>
                            </Nav.Item>

                            {/* <Nav.Item>
                                <Nav.Link eventKey="reviews" className="d-flex align-items-center">
                                    Đánh giá
                                </Nav.Link>
                            </Nav.Item> */}
                        </Nav>
                        
                        <Tab.Content>
                            {/* <Tab.Pane eventKey="overview">
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
                            </Tab.Pane> */}

                            <Tab.Pane eventKey="doctorSchedule">
                                <Card>
                                    <Card.Body>
                                        <DoctorSchedule tabActive={tabActive} />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane eventKey="patientHistory">
                                <Card>
                                    <Card.Body>
                                        <PatientHistory tabActive={tabActive} />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                            
                            {/* <Tab.Pane eventKey="reviews"> 
                                <Card>
                                    <Card.Body>
                                        <h4>Đánh giá</h4>
                                        <p>Đánh giá từ bệnh nhân</p>
                                        
                                        <ReviewDoctor tabActive={tabActive} />
                                    </Card.Body>
                                </Card>
                            </Tab.Pane> */}
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    )
}

export default Index