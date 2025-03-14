import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div
      key={service.ServiceID}
      className="service-card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={service.image}
        alt={service.ServiceName}
        style={{
          width: '200px',
          height: '200px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '15px',
        }}
      />
      <h6 style={{ marginTop: '10px', marginBottom: '5px' }}>
        {service.ServiceName}
      </h6>
      <p style={{ margin: '0', fontStyle: 'italic' }}>{service.Description}</p>
      <p style={{ margin: '5px 0 0', fontWeight: 'bold' }}>
        Giá: {service.Price.toLocaleString()} VNĐ
      </p>
    </div>
  );
};

export default ServiceCard;
