import React, { useEffect, useState } from 'react'
import { Container, Table, Button, Badge, Form, Modal, Spinner } from 'react-bootstrap'
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
    const [diagnosis, setDiagnosis] = useState()
    const [treatment, setTreatment] = useState()
    const statusOptions = [
        'Đã xác nhận',
        'Đã khám',
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
            console.log(response.data)
        } catch (error) {
            console.log(error.response?.data || error.message)
        } finally {
            setLoading(false)
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

    const handleOpenPrescriptionModal = (appointment) => {
        setCurrentAppointment(appointment)
        setPrescription(appointment.prescription || '')
        setShowPrescriptionModal(true)
    }

    const handleClosePrescriptionModal = () => {
        setShowPrescriptionModal(false)
        setCurrentAppointment(null)
        setPrescription('')
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
            await axios.put(`/appointments/prescription/${currentAppointment.appointmentId}`, { prescription })
            
            // Reload list after successful update
            await fetchDoctorSchedule()
            
            handleClosePrescriptionModal()
        } catch (err) {
            console.error('Error saving prescription:', err)
        }
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
                            <Form.Group className="mb-3">
                                <Form.Label>Đơn thuốc:</Form.Label>
                                <Form.Control 
                                    as="textarea" 
                                    rows={5}
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    placeholder="Nhập thông tin đơn thuốc..."
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