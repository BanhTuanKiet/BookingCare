import React from 'react';
import images from '../Image/Doctors/Index';
const DoctorCard = ({ doctor }) => {
    const doctorImage = images[doctor.doctorId] || '/default-doctor.png';
    return (
    <div
        key={doctor.doctorId}
        className="doctor-card"
        style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centers the content horizontally
        justifyContent: 'center', // Centers the content vertically
      }}
    >
    <img
        src={doctorImage}
        alt={doctor.userName}
        style={{
            width: '200px',
            height: '200px',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderRadius: '100%',
            overflow: 'hidden',
            marginBottom: '15px',
        }}
    />
        <h6 style={{ marginTop: '10px', marginBottom: '5px' }}>{doctor.userName}</h6>
        <p style={{ margin: '0', fontStyle: 'italic' }}>{doctor.position}</p>
        <p style={{ margin: '5px 0 0' }}>{doctor.experienceYears}</p>
    </div>
    );
};

export default DoctorCard;
