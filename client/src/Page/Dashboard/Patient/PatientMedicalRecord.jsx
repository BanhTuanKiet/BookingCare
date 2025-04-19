import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab, Table, Badge, Button, Collapse } from 'react-bootstrap'
import { Clock, FileText, ChevronUp, ChevronDown, Printer } from 'lucide-react'
import axios from '../../../Util/AxiosConfig'

function PatientMedicalRecord() {
    const [tabActive, setTabActive] = useState("overview")
    const [patient, setPatient] = useState()
    const [appointments, setAppointments] = useState()
    const [medicalRecords, setMedicalRecords] = useState([])
    const [openRecords, setOpenRecords] = useState({})

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

    useEffect(() => {
        const fetchAppointmentInfo = async () => {
            try {
                const response = await axios.post(`appointments/by-patient`)
                setAppointments(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (tabActive === "overview") {
            fetchAppointmentInfo()
        }
    }, [tabActive])

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get("/medicalRecords/prescriptions")
                console.log(response.data)
                setMedicalRecords(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (tabActive === "prescriptions") {
            fetchPrescriptions()
        }
    }, [tabActive])

    const handleCancelAppointment = async (appointmentId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")
        if (!isConfirmed) return
    
        try {
            await axios.put(`/appointments/cancel/${appointmentId}`)
            // Refresh appointments after cancellation
            const response = await axios.post(`appointments/by-patient`)
            setAppointments(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    const toggleRecord = (recordId) => {
        setOpenRecords(prev => ({
            ...prev,
            [recordId]: !prev[recordId]
        }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN')
        } catch (error) {
            return dateString
        }
    }

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
                            
                            <Tab.Pane eventKey="appointments">
                                <Card>
                                    <Card.Body>
                                        <h4>Lịch Hẹn</h4>
                                        <p>Danh sách các lịch hẹn sắp tới</p>
                                        <div className="table-responsive">
                                            <Table bordered hover>
                                                <thead className="table-light">
                                                    <tr className="text-center">
                                                        <th>Ngày hẹn</th>
                                                        <th>Bác sĩ</th>
                                                        <th>Dịch vụ</th>
                                                        <th>Trạng thái</th>
                                                        <th>Thao tác</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {appointments?.map((appointment) => (
                                                        <tr key={appointment.appointmentId} className="align-middle text-center">
                                                            <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                                            <td>{appointment.doctorName}</td>
                                                            <td>{appointment.serviceName}</td>
                                                            <td>
                                                                <Badge bg={
                                                                    appointment.status === "Chờ xác nhận" ? "warning"
                                                                    : appointment.status === "Đã xác nhận" ? "primary"
                                                                    : appointment.status === "Đã hủy" ? "danger"
                                                                    : appointment.status === "Đã hoàn thành" ? "success"
                                                                    : "secondary"
                                                                }>
                                                                    {appointment.status}
                                                                </Badge>
                                                            </td>
                                                            <td>
                                                                {(appointment.status !== "Đã hủy" && appointment.status !== "Đã hoàn thành") && (
                                                                    <button
                                                                        className="btn btn-sm btn-danger"
                                                                        onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                            
                            <Tab.Pane eventKey="prescriptions"> 
                                <Card>
                                    <Card.Body>
                                        <h4>Đơn Thuốc</h4>
                                        <p>Lịch sử đơn thuốc đã kê</p>
                                        
                                        {medicalRecords && medicalRecords.length > 0 ? (
                                            medicalRecords.map((record) => (
                                                <Card key={record.recordId} className="mb-3 border">
                                                    <Card.Body>
                                                        <Row className="align-items-center">
                                                            <Col xs={2} sm={1} className="text-center">
                                                                <div className="bg-light rounded-circle p-2 d-inline-flex">
                                                                    <FileText size={24} className="text-primary" />
                                                                </div>
                                                            </Col>
                                                            <Col xs={8} sm={9}>
                                                                <div className="d-flex align-items-center mb-1">
                                                                    <h5 className="mb-0 me-2">RX-{record.recordId}</h5>
                                                                    <Badge bg="light" text="dark" className="me-2">
                                                                        {record.date ? formatDate(record.date) : "Không có ngày"}
                                                                    </Badge>
                                                                </div>
                                                                <div>{record.department || "Khoa không xác định"}</div>
                                                                <div className="text-muted">{record.doctor || "Bác sĩ không xác định"}</div>
                                                                <div className="text-muted">
                                                                    <strong>Chuẩn đoán:</strong> {record.diagnosis || "Không có"}
                                                                </div>
                                                            </Col>
                                                            <Col xs={2} className="text-end">
                                                                <Button
                                                                    variant="light" 
                                                                    onClick={() => toggleRecord(record.recordId)}
                                                                    aria-expanded={openRecords[record.recordId]}
                                                                    className="border"
                                                                >
                                                                    {openRecords[record.recordId] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                
                                                        <Collapse in={openRecords[record.recordId]}>
                                                            <div className="mt-3">
                                                                <hr />
                                                                <h6 className="mb-3">Chi tiết đơn thuốc:</h6>
                                                                
                                                                {record.prescriptions && record.prescriptions.length > 0 ? (
                                                                    <table className="table table-bordered">
                                                                        <thead className="table-light">
                                                                            <tr>
                                                                                <th>Tên thuốc</th>
                                                                                <th>Liều lượng</th>
                                                                                <th>Tần suất</th>
                                                                                <th>Thời gian</th>
                                                                                <th>Ghi chú</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {record.prescriptions.map((med, idx) => (
                                                                                <tr key={idx}>
                                                                                    <td>
                                                                                        <strong>{med.name}</strong>
                                                                                        <div className="small text-muted">{med.form}</div>
                                                                                    </td>
                                                                                    <td>{med.dosage}</td>
                                                                                    <td>{med.frequency}</td>
                                                                                    <td>{med.duration}</td>
                                                                                    <td>{med.notes}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                ) : (
                                                                    <p>Không có thuốc được kê trong đơn này</p>
                                                                )}
                                                                
                                                                <div className="mt-3 d-flex justify-content-between">
                                                                    <div className="text-muted">
                                                                        <strong>Hướng dẫn điều trị:</strong> {record.treatment || "Không có"}
                                                                    </div>
                                                                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                                                        <Printer size={16} className="me-1" /> In đơn thuốc
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </Card.Body>
                                                </Card>
                                            ))
                                        ) : (
                                            <div className="text-center p-4">
                                                <p>Không có đơn thuốc nào trong hồ sơ</p>
                                            </div>
                                        )}
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

export default PatientMedicalRecord