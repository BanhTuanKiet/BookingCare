import React, { useEffect, useState, useContext } from "react"
import axios from "../Util/AxiosConfig"
import { AuthContext } from "../Context/AuthContext";
import { Container, Row, Col, Card, Table, Badge, Spinner } from "react-bootstrap"

const PatientProfile = () => {
  const [patientInfo, setPatientInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { UserName } = useContext(AuthContext)

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/patients/user`)
        console.log("Patient Info:", response.data)
        setPatientInfo(response.data)
      } catch (error) {
        console.error("Error fetching patient information:", error)
        // Still set patientInfo to null to show empty form
        setPatientInfo(null)
      } finally {
        setLoading(false)
      }
    }

      fetchPatientInfo()
  }, [UserName])

  // Calculate age from date of birth if available
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A"
    
    const dob = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    
    return age
  }

  if (loading) {
    return (
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Đang tải thông tin bệnh nhân...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <Card className="border-0 shadow w-75 mx-auto">
        <Card.Header className="bg-primary text-white p-3">
          <h4 className="mb-0 fw-bold">Thông Tin Cá Nhân</h4>
        </Card.Header>
        
        <Card.Body className="p-4">
          <Row>
            {/* Thông tin cá nhân */}
            <Col md={4} className="mb-4 mb-md-0">
              <h5 className="border-bottom pb-2 mb-3">Hồ Sơ Bệnh Nhân</h5>
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Họ tên</div>
                <div>{patientInfo?.userName || "—"}</div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Tuổi</div>
                <div>{patientInfo ? calculateAge(patientInfo.dateOfBirth) : "—"}</div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Ngày sinh</div>
                <div>
                  {patientInfo?.dateOfBirth ? new Date(patientInfo.dateOfBirth).toLocaleDateString() : "—"}
                </div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Email</div>
                <div>{patientInfo?.email || "—"}</div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Số điện thoại</div>
                <div>{patientInfo?.phoneNumber || "—"}</div>
              </div>
              
              <div className="mb-3">
                <div className="fw-bold text-secondary mb-1">Địa chỉ</div>
                <div>{patientInfo?.address || "—"}</div>
              </div>
            </Col>
            
            {/* Lịch sử khám bệnh */}
            <Col md={8}>
              <h5 className="border-bottom pb-2 mb-3 ">Lịch Sử Khám Bệnh</h5>
              {patientInfo && patientInfo.appointments && patientInfo.appointments.length > 0 ? (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr className="bg-light">
                        <th>Ngày</th>
                        <th>Bác sĩ</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientInfo.appointments.map((appointment) => (
                        <tr key={appointment.appointmentId}>
                          <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                          <td>{appointment.doctorName}</td>
                          <td>
                            <Badge bg={
                              appointment.status === "Completed" ? "success" :
                              appointment.status === "Scheduled" ? "primary" :
                              appointment.status === "Cancelled" ? "danger" : "secondary"
                            }>
                              {appointment.status === "Completed" ? "Hoàn thành" :
                               appointment.status === "Scheduled" ? "Đã đặt lịch" :
                               appointment.status === "Cancelled" ? "Đã hủy" : appointment.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div>
                  <p className="text-muted">Chưa có lịch sử khám bệnh</p>
                  <Table hover className="opacity-50">
                    <thead>
                      <tr className="bg-light">
                        <th>Ngày</th>
                        <th>Bác sĩ</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan="3" className="text-center">Không có dữ liệu</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              )}
            </Col>
          </Row>
          
        </Card.Body>
      </Card>
    </Container>
  )
}

export default PatientProfile