import React from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import images from '../Image/Service/Index';
import '../Style/ServiceCard.css';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const serviceImage = images[service.serviceID] || '/default-service.png';

  const truncateText = (text = "", wordLimit) => {
    const words = text ? text.split(' ') : [];
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + ' ...' : text;
  };
  

  return (
    <Card 
      className="shadow-sm border-2 p-2 service-card"
      style={{ 
        width: '17rem', 
        height: '18rem',
        cursor: 'pointer', 
        transition: '0.3s', 
        // border: '2px solid transparent',
        // overflow: 'hidden'
      }}
      onClick={() => navigate(`/dịch vụ/${service.serviceName}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'darkturquoise';
        e.currentTarget.style.color = 'white';
        e.currentTarget.querySelector('.service-icon').style.backgroundColor = 'white';
        // e.currentTarget.style.border = '2px solid #0056b3';
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.color = 'black';
        e.currentTarget.querySelector('.service-icon').style.backgroundColor = '#0056b3';
        // e.currentTarget.style.border = '2px solid transparent';
      }}
    >
      <div className="d-flex align-items-start m-1">
        <Card.Img 
          variant="top" 
          src={serviceImage}
          alt={service.serviceName}
          className="img-fluid rounded service-icon p-1" 
          style={{ 
            width: '35px', 
            height: '35px',
            objectFit: 'cover',
            backgroundColor: '#0056b3',
            transition: '0.3s' 
          }}
        />
      </div>
      <Card.Body className="text-left p-0 m-1">
        <Card.Title 
          className="fw-bold text-start"
          style={{ fontSize: '1.2rem', marginBottom: '15px' }}
        >
          {service.serviceName}
        </Card.Title>
        <Card.Text 
          className="text-start"
          style={{ marginBottom: '15px' }}
        >
          {truncateText(service.description, 15)}
        </Card.Text>
        <Card.Text 
          className="fw-bold text-start"
          style={{ fontSize: '1.1rem' }}
        >
          {service.price} VNĐ
        </Card.Text>
        <Card.Text className="text-end text-primary fw-bold m-0" style={{ cursor: 'pointer', position: 'absolute', bottom: '20px', right: '20px' }}>
          Chi tiết
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ServiceCard;
