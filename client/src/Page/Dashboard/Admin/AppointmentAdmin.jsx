import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Badge, Form, Modal, Spinner, Pagination, Row, Col } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import { extractDateOnly } from '../../../Util/DateUtils'

const AppointmentAdmin = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentAppointment, setCurrentAppointment] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerPage = 10
  const totalPages = Math.ceil(appointments.length / itemsPerPage)

  const statusOptions = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đã hoàn thành',
    'Đã hủy'
  ]

  const statusColors = {
    'Chờ xác nhận': 'warning',
    'Đã xác nhận': 'info',
    'Đã hoàn thành': 'success',
    'Đã hủy': 'danger'
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)

    try {
      const response = await axios.get('/appointments')
      setAppointments(response.data)
    } catch (err) {
      console.error('Error fetching appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (appointment) => {
    setCurrentAppointment(appointment)
    setNewStatus(appointment.status)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setCurrentAppointment(null)
    setNewStatus('')
  }

  const handleUpdateStatus = async () => {
    if (!currentAppointment || newStatus === currentAppointment.status) {
      return
    }

    try {
      await axios.put(`/appointments/status/${currentAppointment.appointmentId}`, { status: newStatus })
      await fetchAppointments()
      handleCloseModal()
    } catch (err) {
      console.error('Error updating appointment status:', err)
    }
  }

  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = appointments.slice(startIndex, endIndex)

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          <h2 className="my-4">Quản lý lịch hẹn</h2>
          
          <div className="table-responsive">
            <Table bordered hover className="w-100">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bệnh nhân</th>
                  <th>Bác sĩ</th>
                  <th>Dịch vụ</th>
                  <th>Ngày hẹn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">Không có lịch hẹn nào</td>
                  </tr>
                ) : (
                  currentAppointments.map(appointment => (
                    <tr key={appointment.appointmentId}>
                      <td>{appointment.appointmentId}</td>
                      <td>{appointment.patientName}</td>
                      <td>{appointment.doctorName}</td>
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
                          onClick={() => handleOpenModal(appointment)}
                        >
                          Cập nhật
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          <Row>
            <Col className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
                <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0} />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index === currentPage}
                    onClick={() => setCurrentPage(index)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
              </Pagination>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
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
          <Button variant="secondary" onClick={handleCloseModal}>
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
    </Container>
  )
}

export default AppointmentAdmin