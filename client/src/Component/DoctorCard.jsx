import React from "react";
import { Card, Button } from "react-bootstrap"
import "../Style/DoctorCard.css"

const DoctorCard = ({ doctor }) => {
  return (
    <Card className="doctor-card text-center shadow-sm" >
      <Card.Img variant="top" src={doctor.doctorImage} alt={doctor.userName} className="mx-auto mt-3 card-img"/>
      <Card.Body className="pb-0">
        <Card.Title className="fw-bold text-primary mb-3">{doctor.degree} {doctor.userName}</Card.Title>
        <Card.Subtitle className="text-muted fst-italic mb-3">
          {doctor.position}
        </Card.Subtitle>
        <Card.Text className="small text-dark mb-3">
          {doctor.experienceYears} năm kinh nghiệm
        </Card.Text>
        <Button variant="primary" size="sm">
          Xem chi tiết
        </Button>
      </Card.Body>
    </Card>
  );
};

export default DoctorCard;