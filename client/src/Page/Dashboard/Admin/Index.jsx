import React, { useState } from 'react'
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap'
import AppointmentAdmin from '../Admin/Appointment/AppointmentAdmin'
import AppointmentStatistics from '../Admin/Appointment/AppointmentStatistics'
import Reviews from '../Admin/Doctor/Reviews'
import "../../../Style/Admin.css"
import UserAdmin from './UserAdmin'
// import PatientAdmin from '../Admin/Patient/PatientAdmin'
import PrescriptionOverView from '../Admin/Prescription/PrescriptionOverView'
import DoctorSalaryTable from '../Admin/Salary/DoctorSalary'
import SpecialtyAdmin from './SpecialtyAdmin'
import RevenueChart from './RevenueChart'
import DepartmentRatings from './DepartmentRatings'

function Index() {
  const [tabActive, setTabActive] = useState("dashboard")

  return (
    <Tab.Container activeKey={tabActive} onSelect={(k) => setTabActive(k)}>
      <Container fluid className="p-4">
        <Row>
          <Col md={3}>
            <Card className="mb-4 sidebar">
              <Card.Body>
                <h5 className="text-primary mb-4 text-center">QUẢN TRỊ HỆ THỐNG</h5>

                <Nav className="flex-column">
                  <Nav.Link eventKey="dashboard" className={`sidebar-link mb-2 ${tabActive === "dashboard" ? "active" : ""}`}>
                    Tổng Quan
                  </Nav.Link>
                  <Nav.Link eventKey="appointment_statistics" className={`sidebar-link mb-2 ${tabActive === "appointment_statistics" ? "active" : ""}`}>
                    Thống kê lịch hẹn
                  </Nav.Link>
                  <Nav.Link eventKey="reviews" className={`sidebar-link mb-2 ${tabActive === "reviews" ? "active" : ""}`}>
                    Thống kê đánh giá
                  </Nav.Link>
                  <Nav.Link eventKey="appointments" className={`sidebar-link mb-2 ${tabActive === "appointments" ? "active" : ""}`}>
                    Lịch Hẹn
                  </Nav.Link>
                  <Nav.Link eventKey="prescriptions" className={`sidebar-link mb-2 ${tabActive === "prescriptions" ? "active" : ""}`}>
                    Đơn Thuốc
                  </Nav.Link>
                  <Nav.Link eventKey="users" className={`sidebar-link mb-2 ${tabActive === "users" ? "active" : ""}`}>
                    Người Dùng
                  </Nav.Link>
                  <Nav.Link eventKey="patients" className={`sidebar-link mb-2 ${tabActive === "patients" ? "active" : ""}`}>
                    Bệnh Nhân
                  </Nav.Link>
                  <Nav.Link eventKey="salaries" className={`sidebar-link mb-2 ${tabActive === "salaries" ? "active" : ""}`}>
                    Lương Bác Sĩ
                  </Nav.Link>
                  <Nav.Link eventKey="specialties" className={`sidebar-link mb-2 ${tabActive === "specialties" ? "active" : ""}`}>
                    Chuyên Khoa
                  </Nav.Link>
                  <Nav.Link eventKey="revenues" className={`sidebar-link mb-2 ${tabActive === "revenues" ? "active" : ""}`}>
                    Thống Kê
                  </Nav.Link>
                  <Nav.Link eventKey="ratings" className={`sidebar-link mb-2 ${tabActive === "ratings" ? "active" : ""}`}>
                    Đánh Giá Chuyên Khoa
                  </Nav.Link>
                </Nav>

                <div className="mt-5 pt-5">
                  <div className="bg-light p-3 rounded">
                    <p className="small text-muted mb-0">Phiên đăng nhập hiện tại:</p>
                    <p className="mb-2"><strong>Admin</strong></p>
                    <p className="small text-muted mb-0">Đăng nhập lúc:</p>
                    <p className="mb-0"><small>{new Date().toLocaleString()}</small></p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={9} style={{ fontSize: "14px" }} className='p-0'>
            <Tab.Content>
              <Tab.Pane eventKey="dashboard">
                <Card>
                  <Card.Body>
                    <h4>Tổng Quan Hệ Thống</h4>
                    <p className="text-muted">Thống kê và báo cáo tổng hợp</p>
                    <div className="p-4 bg-light rounded text-center">
                      <p>Nội dung tổng quan sẽ hiển thị ở đây</p>
                    </div>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="appointment_statistics">
                <AppointmentStatistics />
              </Tab.Pane>

              <Tab.Pane eventKey="reviews">
                <Reviews />
              </Tab.Pane>

              <Tab.Pane eventKey="appointments">
                <AppointmentAdmin />
              </Tab.Pane>

              <Tab.Pane eventKey="prescriptions">
                <PrescriptionOverView />
              </Tab.Pane>

              <Tab.Pane eventKey="users">
                <UserAdmin />
              </Tab.Pane>

              {/* <Tab.Pane eventKey="patients">
                <PatientAdmin />
              </Tab.Pane> */}

              <Tab.Pane eventKey="salaries">
                <DoctorSalaryTable />
              </Tab.Pane>

              <Tab.Pane eventKey="specialties">
                <SpecialtyAdmin />
              </Tab.Pane>

              <Tab.Pane eventKey="revenues">
                <RevenueChart />
              </Tab.Pane>

              <Tab.Pane eventKey="ratings">
                <DepartmentRatings />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </Tab.Container>
  )
}

export default Index
