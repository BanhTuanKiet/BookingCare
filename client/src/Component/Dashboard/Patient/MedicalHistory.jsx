import React from 'react'
import { Badge, Card, Container, Table } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'

function AppointmentHistory({ appointmentInfo }) {
  const handleCancelAppointment = async (appointmentId) => {
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")
    if (!isConfirmed) return

    try {
      await axios.put(`/appointments/cancel/${appointmentId}`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Container className="p-0 m-0 w-100" style={{ width: "100%" }}>
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-primary text-white text-center py-3">
          <h4 className="fw-bold mb-0">Lịch Sử Đặt Lịch</h4>
        </Card.Header>

        <Card.Body className="p-4">
          {appointmentInfo && appointmentInfo.length > 0 ? (
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
                  {appointmentInfo.map((appointment) => (
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
          ) : (
            <div className="text-center text-muted">
              <p className="mb-4">Chưa có lịch sử khám bệnh nào.</p>
              <Table bordered hover className="opacity-50">
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
                  <tr>
                    <td colSpan="5" className="text-center">Không có dữ liệu</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default AppointmentHistory
