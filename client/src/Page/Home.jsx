import React, { useContext } from "react"
import { Col, Row } from "react-bootstrap"
import SpecialtyLogo from "../Component/SpecialtyLogo"
import "../Style/Home.css"
import { NavContext } from "../Context/NavContext"
import ServiceList from "../Component/ServiceList"

const Home = () => {
  const { specialties, services, HandleNavigation } = useContext(NavContext)

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
          <h5>Dịch vụ</h5>
          <div className="service-list d-flex flex-wrap gap-3">
            <ServiceList services={services} />
          </div>
        </Row>
      </div>
    </div>
  )
}

export default Home