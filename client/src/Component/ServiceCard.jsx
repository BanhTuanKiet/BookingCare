import React from 'react';
import images from '../Image/Service/Index';
import '../Style/ServiceCard.css'

const ServiceCard = ({ service }) => {
  const serviceImage = images[service.serviceId] || '/default-service.png';
  
  return (  
    <div
      key={service.serviceId}
      className="card h-100 shadow-sm border-0"
      style={{ width: '250px', cursor: 'pointer', transition: 'transform 0.3s' }}
    >
      <img
        src={serviceImage}
        alt={service.serviceName}
        className="card-img-top img-fluid rounded"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body text-center d-flex flex-column justify-content-center">
        <h6 className="card-title my-2">{service.serviceName}</h6>
        <p className="card-text fst-italic mb-2">{service.serviceDescription}</p>
        <p className="fw-bold text-danger mb-0">
          Giá: {service.servicePrice} VNĐ
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
