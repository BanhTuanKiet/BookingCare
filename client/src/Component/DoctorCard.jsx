import React from 'react';
import { Card, Image } from 'react-bootstrap';
import images from '../Image/Doctors/Index'; // Import ảnh từ thư mục Image/Doctors
import '../Style/DoctorCard.css'; // Giữ file CSS hover hiệu ứng ở đây

const DoctorCard = ({ doctor }) => {
    const doctorImage = images[doctor.doctorId] || '/default-doctor.png';

    return (
        <Card
            key={doctor.doctorId}
            className="text-center shadow-sm doctor-card-hover"
            style={{ width: '18rem', cursor: 'pointer' }}
        >
            <Card.Body className="d-flex flex-column align-items-center">
                <Image
                    src={doctorImage}
                    alt={doctor.userName}
                    roundedCircle
                    className="mb-3"
                    style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        border: '2px solid #ddd',
                    }}
                />
                <Card.Title>{doctor.userName}</Card.Title>
                <Card.Text className="text-muted fst-italic mb-1"> {doctor.position} </Card.Text>
                <Card.Text className="fw-bold"> {doctor.experienceYears} năm kinh nghiệm </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default DoctorCard;
