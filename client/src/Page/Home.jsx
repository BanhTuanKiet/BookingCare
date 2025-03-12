import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Col, Row } from "react-bootstrap"
import images from "../Image/Specalty/Index"
import SpecialtyLogo from "../Component/SpecialtyLogo"
import axios from "axios"
import "../Style/Home.css"

const Home = () => {
  const navigate = useNavigate()
  const [specialties, setSpecialties] = useState([])

    const specialities = [
      { name: "Khoa Nội tổng quát", link: "/chuyên khoa/Khoa Nội tổng quát" },
      { name: "Khoa Nhi", link: "/chuyên khoa/Khoa Nhi" },
      { name: "Khoa Tai - Mũi - Họng", link: "/chuyên khoa/Khoa Tai - Mũi - Họng" },
      { name: "Khoa Mắt (Nhãn khoa)", link: "/chuyên khoa/Khoa Mắt (Nhãn khoa)" },
      { name: "Khoa Gây Mê", link: "/chuyên khoa/Khoa Gây Mê" },
      { name: "Khoa Răng - Hàm - Mặt", link: "/chuyên khoa/Khoa Răng - Hàm - Mặt" },
    ]

    useEffect(() => {
      const GetAllSpecialties = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:5140/api/specialties")

          // Ghép dữ liệu từ API với danh sách link và src
          const mergedSpecialties = response.data.map((spec) => {
            const matchedSpec = specialities.find((s) => s.name === spec.name)

            return {
              id: spec.specialtyId,
              name: spec.name,
              link: matchedSpec?.link,
              src: images[spec.name]
            }
          })        

          setSpecialties(mergedSpecialties)
        } catch (error) {
          console.error("Lỗi khi lấy danh sách chuyên khoa:", error)
        }
      }

      GetAllSpecialties()
    }, [])

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