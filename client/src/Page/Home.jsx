import React, { useContext } from "react"
import { useNavigate } from "react-router"
import { Col, Row } from "react-bootstrap"
import SpecialtyLogo from "../Component/SpecialtyLogo"
import "../Style/Home.css"
import { NavContext } from "../Context/NavContext"

const Home = () => {
  const navigate = useNavigate()
  const { specialties } = useContext(NavContext)

  const HandleSpec = (link) => {
    navigate(link)
  }

  return (
    <div>
      <div className="py-5 text-center">
        <h1 className="text-primary fw-bold">Chào mừng đến với Phòng Khám ABC</h1>
        <p className="text-muted">Nơi chăm sóc sức khỏe tận tâm và chuyên nghiệp</p>
      </div>

      <div style={{ backgroundColor: "#e3f1fc" }}>
        <Row className="mx-auto py-3" style={{ width: "80%" }}>
          <h5>Chuyên khoa</h5>
          {specialties.map(({ name, link, src }, index) => (
            <Col key={index} xs={12} sm={6} className="specialities d-flex justify-content-center px-2">
              <div className="bg-white rounded w-100 text-start m-1 p-4 d-flex align-items-center" onClick={() => HandleSpec(link)}>
                <SpecialtyLogo src={src} />
                <span className="ms-2">{name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

export default Home