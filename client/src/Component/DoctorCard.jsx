import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap"
import { useNavigate } from 'react-router-dom'
import "../Style/DoctorCard.css"

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate() // <-- thêm useNavigate ở đây

  return (
    <Card
      className="doctor-card p-3"
      style={{
        width: "22rem",
        borderRadius: "15px",
        overflow: "hidden",
        border: "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <Row className="g-0 align-items-center">
        <Col xs={5} className="d-flex justify-content-center">
          <img
            src={doctor.doctorImage}
            alt={doctor.userName}
            className="rounded-circle"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              border: "4px solid #0d6efd",
            }}
          />
        </Col>
        <Col xs={7}>
          <Card.Body className="text-start">
            <Card.Title className="fw-bold text-primary">{doctor.userName}</Card.Title>
            <Card.Subtitle className="text-muted fst-italic mb-2">
              {doctor.position}
            </Card.Subtitle>
            <Card.Text className="small text-dark">{doctor.experienceYears} năm kinh nghiệm</Card.Text>
            <Button variant="primary" size="sm">
              Xem chi tiết
            </Button>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default DoctorCard;