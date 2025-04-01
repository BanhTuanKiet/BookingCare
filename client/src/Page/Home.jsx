import React, { useContext } from "react"
import { Col, Row, Container } from "react-bootstrap"
import SpecialtyLogo from "../Component/SpecialtyLogo"
import "../Style/Home.css"
import { NavContext } from "../Context/NavContext"
import ServiceCarousels from "../Component/ServiceCarousels"
import DoctorCarousels from "../Component/DoctorCarousels"

const Home = () => {
  const { specialties, services, doctors, HandleNavigation } = useContext(NavContext)

  return (
    <div>
      {/* <div className="py-5 text-center">
        <h1 className="text-primary fw-bold">Chào mừng đến với Phòng Khám ABC</h1>
        <p className="text-muted">Nơi chăm sóc sức khỏe tận tâm và chuyên nghiệp</p>
      </div> */}

      <div style={{ backgroundColor: "#e3f1fc" }}>
        <Row className="mx-auto py-3 w-75">
          <h5 className="text-primary fw-bold">Chuyên khoa</h5>
          {specialties.map((specialty, index) => (
            <Col key={index} xs={12} sm={6} className="specialities d-flex justify-content-center px-2">
              <div className="bg-white rounded w-100 text-start m-1 p-4 d-flex align-items-center" onClick={() => HandleNavigation("chuyên khoa" , specialty.name)}>
                <SpecialtyLogo src={specialty.src} />
                <span className="ms-2">{specialty.name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Phần Dịch vụ */}
      <div className="service-section py-5">
        <Container>
          <h3 className="text-primary fw-bold text-center">DỊCH VỤ</h3>
          <ServiceCarousels services={services} />
        </Container>
      </div>

      {/* Phần Đội ngũ bác sĩ */}
      {/* <div className="doctor-section py-5" style={{ backgroundColor: "#f5f5f5" }}>
        <Container>
          <h3 className="text-primary fw-bold text-center">ĐỘI NGŨ BÁC SĨ</h3>
          <DoctorCarousels doctors={doctors} />
        </Container>
      </div> */}
      <div className="doctor-section py-4" style={{ backgroundColor: "#f8f9fa" }}>
      <Container>
        <DoctorCarousels doctors={doctors} />
      </Container>
    </div>
    </div>
  )
}

export default Home