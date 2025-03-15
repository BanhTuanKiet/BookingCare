import React from 'react';

const ServiceCard = ({ service }) => {
  return (
    <div
      key={service.ServiceID}
      className="card h-100 shadow-sm border-0"
      style={{ width: '250px', cursor: 'pointer', transition: 'transform 0.3s' }}
    >
      <img
        src={service.image}
        alt={service.ServiceName}
        className="card-img-top img-fluid rounded"
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <div className="card-body text-center d-flex flex-column justify-content-center">
        <h6 className="card-title my-2">{service.ServiceName}</h6>
        <p className="card-text fst-italic mb-2">{service.Description}</p>
        <p className="fw-bold text-danger mb-0">
          Giá: {service.Price.toLocaleString()} VNĐ
        </p>
      </div>
    </div>
  );
};

export default ServiceCard;
