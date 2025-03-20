import React from "react"
import { Card, Button } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import "../Style/DoctorCard.css"

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate() // <-- thêm useNavigate ở đây

  return (
    <Card className="doctor-card text-center shadow-sm">
      <Card.Img
        variant="top"
        src={doctor.doctorImage}
        alt={doctor.userName}
        className="mx-auto mt-3 card-img"
      />
      <Card.Body className="pb-0">
        <Card.Title className="fw-bold text-primary mb-3">
          {doctor.degree} {doctor.userName}
        </Card.Title>
        <Card.Subtitle className="text-muted fst-italic mb-3">
          {doctor.position}
        </Card.Subtitle>
        <Card.Text className="small text-dark mb-3">
          {doctor.experienceYears} năm kinh nghiệm
        </Card.Text>

        {/* Nút xem chi tiết điều hướng qua trang bác sĩ */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate(`/bac-si/${(doctor.userName)}`)}
        >
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  )
}

export default DoctorCard