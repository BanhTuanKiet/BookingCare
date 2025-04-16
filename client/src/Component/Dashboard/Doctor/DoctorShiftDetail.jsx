import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Badge, Form, Modal, Spinner, Row, Col, ListGroup, Card } from 'react-bootstrap'
import axios from "../../../Util/AxiosConfig"
import { parseDateString, extractDateOnly } from "../../../Util/DateUtils"

function DoctorShiftDetail({ tabActive }) {
    const time = tabActive.slice(9)
    const params = time.split(" - ")

    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
    const [currentAppointment, setCurrentAppointment] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [prescription, setPrescription] = useState('')
    const [diagnosis, setDiagnosis] = useState('')
    const [treatment, setTreatment] = useState('')
    const [medicinesList, setMedicinesList] = useState([])
    const [selectedMedicines, setSelectedMedicines] = useState([])
    
    // Current medicine being edited
    const [currentMedicine, setCurrentMedicine] = useState({
        medicineId: '',
        dosage: 0,
        frequencyPerDay: 0,
        durationInDays: 0,
        usage: ''
    })
    
    const statusOptions = [
        'Đã xác nhận',
        'Đã khám',
        'Đã hoàn thành'
    ]

    const statusColors = {
        'Đã xác nhận': 'info',
        'Đã khám': 'primary',
        'Đã hoàn thành': 'success'
    }

    const [dateTime, setDateTime] = useState(() => {
        const rawDate = params[0].trim()
        const rawTime = params[1].trim()
        const { day, month, year } = parseDateString(rawDate);
        const formattedDate = `${year}-${month}-${day}`
        
        return {
            date: formattedDate,
            time: rawTime
        };
    })

    useEffect(() => {
        fetchDoctorSchedule()
        fetchMedicines()
    }, [dateTime])

    const fetchDoctorSchedule = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/appointments/schedule_detail', {
                params: {
                    date: dateTime.date,
                    time: dateTime.time
                }
            })
            setSchedules(response.data.schedules || [])
        } catch (error) {
            console.log(error.response?.data || error.message)
        } finally {
            setLoading(false)
        }
    }

    const fetchMedicines = async () => {
        try {
            const response = await axios.get('/medicines')
            setMedicinesList(response.data || [])
        } catch (error) {
            console.log(error.response?.data || error.message)
        }
    }

    const handleOpenStatusModal = (appointment) => {
        setCurrentAppointment(appointment)
        setNewStatus(appointment.status)
        setShowStatusModal(true)
    }

    const handleCloseStatusModal = () => {
        setShowStatusModal(false)
        setCurrentAppointment(null)
        setNewStatus('')
    }

    const handleOpenPrescriptionModal = async (appointment) => {
        setCurrentAppointment(appointment)
        setPrescription(appointment.prescription || '')
        setDiagnosis(appointment.diagnosis || '')
        setTreatment(appointment.treatment || '')
        setSelectedMedicines([])
        resetCurrentMedicine()
        
        // Fetch existing prescription if available
        try {
            const response = await axios.get(`/medical_records/${appointment.appointmentId}/medicines`)
            if (response.data && response.data.medicines) {
                setSelectedMedicines(response.data.medicines)
            }
        } catch (error) {
            console.log(error.response?.data || error.message)
        }
        
        setShowPrescriptionModal(true)
    }

    const handleClosePrescriptionModal = () => {
        setShowPrescriptionModal(false)
        setCurrentAppointment(null)
        setPrescription('')
        setDiagnosis('')
        setTreatment('')
        setSelectedMedicines([])
        resetCurrentMedicine()
    }

    const resetCurrentMedicine = () => {
        setCurrentMedicine({
            medicineId: '',
            dosage: 0,
            frequencyPerDay: 0,
            durationInDays: 0,
            usage: ''
        })
    }

    const handleUpdateStatus = async () => {
        if (!currentAppointment || newStatus === currentAppointment.status) {
            return
        }
      
        try {
            await axios.put(`/appointments/status/${currentAppointment.appointmentId}`, { status: newStatus })
            
            // Reload list after successful update
            await fetchDoctorSchedule()
            
            handleCloseStatusModal()
        } catch (err) {
            console.error('Error updating appointment status:', err)
        }
    }

    const handleSavePrescription = async () => {
        if (!currentAppointment) {
            return
        }
      
        try {
            // Save prescription, diagnosis, and treatment
            await axios.put(`/appointments/prescription/${currentAppointment.appointmentId}`, { 
                prescription, 
                diagnosis, 
                treatment 
            })
            
            // Save selected medicines
            if (selectedMedicines.length > 0) {
                await axios.post(`/medical_records/${currentAppointment.appointmentId}/medicines`, {
                    medicines: selectedMedicines
                })
            }
            
            // Reload list after successful update
            await fetchDoctorSchedule()
            
            handleClosePrescriptionModal()
        } catch (err) {
            console.error('Error saving prescription:', err)
        }
    }

    const handleAddMedicine = () => {
        if (!currentMedicine.medicineId || 
            !currentMedicine.dosage || 
            !currentMedicine.frequencyPerDay || 
            !currentMedicine.durationInDays) {
            return; // Validate required fields
        }
        
        // Calculate quantity based on the formula
        const quantity = 
            parseInt(currentMedicine.dosage) * 
            parseInt(currentMedicine.frequencyPerDay) * 
            parseInt(currentMedicine.durationInDays);
        
        // Find medicine details from the list
        const selectedMedicine = medicinesList.find(med => med.medicineId == currentMedicine.medicineId);
        const medicineName = selectedMedicine ? selectedMedicine.medicalName : '';
        const unit = selectedMedicine ? selectedMedicine.unit : '';
        
        // Add to selected medicines with calculated quantity
        const newMedicine = {
            ...currentMedicine,
            quantity,
            medicineName, // For display purposes
            unit // For display purposes
        };
        
        setSelectedMedicines([...selectedMedicines, newMedicine]);
        
        // Reset form for next medicine
        resetCurrentMedicine();
    }

    const handleRemoveMedicine = (index) => {
        const updated = [...selectedMedicines];
        updated.splice(index, 1);
        setSelectedMedicines(updated);
    }

    const handleCurrentMedicineChange = (field, value) => {
        setCurrentMedicine({
            ...currentMedicine,
            [field]: value
        });
    }

    const getMedicineName = (medicineId) => {
        const medicine = medicinesList.find(med => med.medicineId == medicineId);
        return medicine ? medicine.medicalName : 'Unknown Medicine';
    }

    const getMedicineUnit = (medicineId) => {
        const medicine = medicinesList.find(med => med.medicineId == medicineId);
        return medicine ? medicine.unit : '';
    }

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </Spinner>
            </Container>
        )
    }

    return (
        <Container fluid className="mt-4">
            <h2 className="mb-4">Chi tiết ca làm việc: {params[0]} {params[1]}</h2>
            
            <Table responsive striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Bệnh nhân</th>
                        <th>Dịch vụ</th>
                        <th>Ngày hẹn</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {schedules.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">Không có lịch hẹn nào</td>
                        </tr>
                    ) : (
                        schedules.map((appointment, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{appointment.patientName}</td>
                                <td>{appointment.serviceName}</td>
                                <td>{extractDateOnly(appointment.appointmentDate)}</td>
                                <td>
                                    <Badge bg={statusColors[appointment.status] || 'secondary'}>
                                        {appointment.status}
                                    </Badge>
                                </td>
                                <td>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleOpenStatusModal(appointment)}
                                    >
                                        Cập nhật
                                    </Button>
                                    <Button 
                                        variant="outline-success" 
                                        size="sm"
                                        onClick={() => handleOpenPrescriptionModal(appointment)}
                                    >
                                        Kê đơn thuốc
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Status Update Modal */}
            <Modal show={showStatusModal} onHide={handleCloseStatusModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentAppointment && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Thông tin lịch hẹn:</Form.Label>
                                <p><strong>Bệnh nhân:</strong> {currentAppointment.patientName}</p>
                                <p><strong>Bác sĩ:</strong> {currentAppointment.doctorName}</p>
                                <p><strong>Ngày hẹn:</strong> {extractDateOnly(currentAppointment.appointmentDate)}</p>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Trạng thái:</Form.Label>
                                <Form.Select 
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                >
                                    {statusOptions.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseStatusModal}>
                        Đóng
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleUpdateStatus}
                        disabled={!currentAppointment || newStatus === currentAppointment.status}
                    >
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Prescription Modal */}
            <Modal show={showPrescriptionModal} onHide={handleClosePrescriptionModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Kê đơn thuốc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {currentAppointment && (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Thông tin lịch hẹn:</Form.Label>
                                <p><strong>Bệnh nhân:</strong> {currentAppointment.patientName}</p>
                                <p><strong>Bác sĩ:</strong> {currentAppointment.doctorName}</p>
                                <p><strong>Dịch vụ:</strong> {currentAppointment.serviceName}</p>
                                <p><strong>Ngày hẹn:</strong> {extractDateOnly(currentAppointment.appointmentDate)}</p>
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Chẩn đoán bệnh</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Nhập chẩn đoán"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Hướng điều trị</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={treatment}
                                    onChange={(e) => setTreatment(e.target.value)}
                                    placeholder="Nhập hướng điều trị"
                                />
                            </Form.Group>
                            
                            <hr className="my-4" />
                            
                            <h5>Thêm thuốc</h5>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Row className="mb-3 align-items-end">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Tên thuốc</Form.Label>
                                                <Form.Select
                                                    value={currentMedicine.medicineId}
                                                    onChange={(e) => handleCurrentMedicineChange('medicineId', e.target.value)}
                                                    required
                                                >
                                                    <option value="">-- Chọn thuốc --</option>
                                                    {medicinesList.map(med => (
                                                        <option key={med.medicineId} value={med.medicineId}>
                                                            {med.medicalName} ({med.unit})
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>Liều dùng (mỗi lần)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={currentMedicine.dosage}
                                                    onChange={(e) => handleCurrentMedicineChange('dosage', e.target.value)}
                                                    placeholder="VD: 1"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={3}>
                                            <Form.Group>
                                                <Form.Label>Đơn vị</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={getMedicineUnit(currentMedicine.medicineId)}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3">
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>Số lần/ngày</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={currentMedicine.frequencyPerDay}
                                                    onChange={(e) => handleCurrentMedicineChange('frequencyPerDay', e.target.value)}
                                                    placeholder="VD: 3"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>Số ngày uống</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    min="0"
                                                    value={currentMedicine.durationInDays}
                                                    onChange={(e) => handleCurrentMedicineChange('durationInDays', e.target.value)}
                                                    placeholder="VD: 7"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group>
                                                <Form.Label>
                                                    Tổng số lượng
                                                    <span className="text-muted ms-2">
                                                        (Tự động tính)
                                                    </span>
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={currentMedicine.dosage * currentMedicine.frequencyPerDay * currentMedicine.durationInDays || 0}
                                                    disabled
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Form.Group>
                                                <Form.Label>Cách dùng</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={currentMedicine.usage}
                                                    onChange={(e) => handleCurrentMedicineChange('usage', e.target.value)}
                                                    placeholder="VD: Uống sau khi ăn"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button 
                                            variant="primary" 
                                            onClick={handleAddMedicine}
                                            disabled={!currentMedicine.medicineId || !currentMedicine.dosage || !currentMedicine.frequencyPerDay || !currentMedicine.durationInDays}
                                        >
                                            <i className="bi bi-plus-circle me-1"></i> Thêm thuốc vào đơn
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            
                            <h5>Danh sách thuốc đã kê</h5>
                            {selectedMedicines.length === 0 ? (
                                <p className="text-muted">Chưa có thuốc nào được thêm vào đơn</p>
                            ) : (
                                <ListGroup className="mb-4">
                                    {selectedMedicines.map((medicine, idx) => (
                                        <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6>{medicine.medicineName || getMedicineName(medicine.medicineId)}</h6>
                                                <div><strong>Liều dùng:</strong> {medicine.dosage} {medicine.unit || getMedicineUnit(medicine.medicineId)}/lần, {medicine.frequencyPerDay} lần/ngày, {medicine.durationInDays} ngày</div>
                                                <div><strong>Cách dùng:</strong> {medicine.usage}</div>
                                                <div><strong>Tổng số lượng:</strong> {medicine.quantity} {medicine.unit || getMedicineUnit(medicine.medicineId)}</div>
                                            </div>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleRemoveMedicine(idx)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Lưu ý bổ sung:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={3}
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    placeholder="Nhập các lưu ý bổ sung về đơn thuốc..."
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePrescriptionModal}>
                        Đóng
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSavePrescription}
                    >
                        Lưu đơn thuốc
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default DoctorShiftDetail