import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Form, Modal, Spinner, Alert } from 'react-bootstrap';
import axios from '../Util/AxiosConfig';

const AppointmentAdmin = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [updateMessage, setUpdateMessage] = useState(null);

  const statusOptions = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đã hoàn thành',
    'Đã hủy'
  ];

  const statusColors = {
    'Chờ xác nhận': 'warning',
    'Đã xác nhận': 'info',
    'Đã hoàn thành': 'success',
    'Đã hủy': 'danger'
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/appointments', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAppointments(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleOpenModal = (appointment) => {
    setCurrentAppointment(appointment);
    setNewStatus(appointment.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAppointment(null);
    setNewStatus('');
    setUpdateMessage(null);
  };

  const handleUpdateStatus = async () => {
    if (!currentAppointment || newStatus === currentAppointment.status) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/appointments/${currentAppointment.appointmentId}/status`, 
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update the local state to reflect the change
      setAppointments(appointments.map(app => 
        app.appointmentId === currentAppointment.appointmentId 
          ? { ...app, status: newStatus } 
          : app
      ));
      
      setUpdateMessage({
        type: 'success',
        text: 'Cập nhật trạng thái thành công!'
      });
      
      // Close modal after 1.5 seconds
      setTimeout(() => {
        handleCloseModal();
      }, 1500);
      
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setUpdateMessage({
        type: 'danger',
        text: 'Không thể cập nhật trạng thái. Vui lòng thử lại sau.'
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Quản lý lịch hẹn</h2>
      
      <div className="mb-3 d-flex justify-content-between">
        <Button variant="primary" onClick={fetchAppointments}>
          <i className="bi bi-arrow-clockwise"></i> Làm mới
        </Button>
      </div>
      
      <Table responsive striped bordered hover>
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
          {appointments.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">Không có lịch hẹn nào</td>
            </tr>
          ) : (
            appointments.map(appointment => (
              <tr key={appointment.appointmentId}>
                <td>{appointment.appointmentId}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>{appointment.serviceName}</td>
                <td>{formatDate(appointment.appointmentDate)}</td>
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

      {/* Status Update Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateMessage && (
            <Alert variant={updateMessage.type}>
              {updateMessage.text}
            </Alert>
          )}
          
          {currentAppointment && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Thông tin lịch hẹn:</Form.Label>
                <p><strong>Bệnh nhân:</strong> {currentAppointment.patientName}</p>
                <p><strong>Bác sĩ:</strong> {currentAppointment.doctorName}</p>
                <p><strong>Ngày hẹn:</strong> {formatDate(currentAppointment.appointmentDate)}</p>
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
            disabled={!currentAppointment || newStatus === currentAppointment.status || updateMessage}
          >
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AppointmentAdmin;