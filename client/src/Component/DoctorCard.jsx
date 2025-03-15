import React from 'react';
import images from '../Image/Doctors/Index';
import '../Style/DoctorCard.css'; // Nhớ import file CSS

const DoctorCard = ({ doctor }) => {
  const doctorImage = images[doctor.doctorId] || '/default-doctor.png';

  return (
    <div
      key={doctor.doctorId}
      className="card text-center shadow-sm doctor-card-hover"
      style={{ width: '18rem', cursor: 'pointer', transition: 'transform 0.3s, box-shadow 0.3s' }}
    >
      <div className="card-body d-flex flex-column align-items-center">
        <img
          src={doctorImage}
          alt={doctor.userName}
          className="rounded-circle mb-3"
          style={{
            width: '150px',
            height: '150px',
            objectFit: 'cover',
            border: '2px solid #ddd',
          }}
        />
        <h5 className="card-title">{doctor.userName}</h5>
        <p className="card-text text-muted fst-italic mb-1">
          {doctor.position}
        </p>
        <p className="card-text fw-bold">
          {doctor.experienceYears} năm kinh nghiệm
        </p>
      </div>
    </div>
  );
};

export default DoctorCard;
