import React, { useContext } from "react"
import { Col, Row, Container } from "react-bootstrap"
import images from '../Image/Others/Index'
import "../Style/Home.css"
import { NavContext } from "../Context/NavContext"
import ServiceCarousels from "../Component/ServiceCarousels"
import DoctorCarousels from "../Component/DoctorCarousels"
import SpecialtyCarousels from "../Component/SpecialtyCarousels"

const Home = () => {
  const { specialties, services, doctors } = useContext(NavContext);

  return (
    <Row>
      <div
        className="specialty-section py-5"
        style={{
          backgroundImage: `url(${images.home})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          zIndex: 0,
        }}
      >

          <Container fluid>
            <Container className="text-center">
              <h2 className="text-primary fw-bold mb-4">LĨNH VỰC ĐẦU NGÀNH</h2>
              <p className="mb-5 fw-bold">
                Bệnh viện DBK ngày nay đã trở thành địa chỉ tin cậy trong chăm sóc điều trị chất lượng cao của nhân dân
              </p>
              <SpecialtyCarousels specialties={specialties} />
            </Container>
          </Container>
      </div>

      {/* Dịch vụ Section */}
      <div className="service-section py-5">
        <Container>
          <h3 className="text-primary fw-bold text-center">DỊCH VỤ</h3>
          <ServiceCarousels services={services} />
        </Container>
      </div>

      {/* Đội ngũ bác sĩ Section */}
      <div className="doctor-section py-4" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <DoctorCarousels doctors={doctors} />
        </Container>
      </div>
    </Row>
  )
}

export default Home
