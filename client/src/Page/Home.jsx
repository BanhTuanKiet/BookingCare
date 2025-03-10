import React from "react"
import { useNavigate } from "react-router"
import { Col, Container, Row } from "react-bootstrap"
import images from "../Image/Index"
import "../Style/Home.css"
import SpecialtyLogo from "../Component/SpecialtyLogo"

const Home = () => {
  const navigate = useNavigate()
  const services = [
    {
      id: 1,
      image: "https://via.placeholder.com/150",
      title: "Khám tổng quát",
      description: "Dịch vụ khám tổng quát để kiểm tra sức khỏe định kỳ.",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/150",
      title: "Xét nghiệm máu",
      description: "Cung cấp dịch vụ xét nghiệm máu chính xác và nhanh chóng.",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/150",
      title: "Khám nha khoa",
      description: "Dịch vụ chăm sóc và điều trị nha khoa chuyên nghiệp.",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/150",
      title: "Siêu âm",
      description: "Trang thiết bị hiện đại cho dịch vụ siêu âm chất lượng cao.",
    },
  ]

  const specialities = [
    { name: "Khoa Nội tổng quát", link: "/specialty/internalMedicine", src: images.internalMedicine },
    { name: "Khoa Nhi", link: "/specialty/pediatrics", src: images.pediatrics },
    { name: "Khoa Tai - Mũi - Họng", link: "/specialty/ent", src: images.ent },
    { name: "Khoa Mắt (Nhãn khoa)", link: "/specialty/ophthalmology", src: images.ophthalmology },
    { name: "Khoa Gây Mê", link: "/specialty/dermatology", src: images.dermatology },
    { name: "Khoa Răng - Hàm - Mặt", link: "/specialty/dentistry", src: images.dentistry },
  ]
  
  const HandleSpec = (link) => {
    navigate(link)
  }

  return (
    <div className="">
      <div className="py-5 text-center">
        <h1 className="text-primary fw-bold">Chào mừng đến với Phòng Khám ABC</h1>
        <p className="text-muted">Nơi chăm sóc sức khỏe tận tâm và chuyên nghiệp</p>
      </div>

      <div style={{ backgroundColor: "#e3f1fc" }}>
        <Row className="mx-auto py-3" style={{ width: "80%" }}>
          <h5>Chuyên khoa</h5>
          {specialities.map(({ name, link, src }, index) => (
            <Col key={index} xs={12} sm={6} className="specialities d-flex justify-content-center px-2">
              <div className="bg-white rounded w-100 text-start m-1 p-4 d-flex align-items-center" onClick={() => HandleSpec(link)}>
                <SpecialtyLogo src={src} />
                <span className="ms-2">{name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <div className="my-5 py-3" style={{ backgroundColor: "#e3f1fc" }} id="services">
        <Container style={{ width: "80%" }}>
          <h2 className="text-center text-primary fw-bold mb-4">Dịch vụ của chúng tôi</h2>
          <div className="row g-4">
            {services.map((service) => (
              <div className="col-md-6 col-lg-4" key={service.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={service.image}
                    className="card-img-top"
                    alt={service.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title text-primary">{service.title}</h5>
                    <p className="card-text text-muted">{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Home