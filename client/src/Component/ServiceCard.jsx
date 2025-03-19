import React from 'react'
import { Card } from 'react-bootstrap'
import images from '../Image/Service/Index'
import '../Style/ServiceCard.css'

const ServiceCard = ({ service }) => {
  const serviceImage = images[service.serviceID] || '/default-service.png'

  return (
    <Card className="shadow-sm border-0 p-3 service-card" >
      {/* Icon nằm trong khung tròn nền xanh */}
      <div className="d-flex align-items-center justify-content-center rounded mb-3 service-logo bg-primary">
        <Card.Img 
          className='service-img'
          variant="top" 
          src={serviceImage}
          alt={service.serviceName}
          style={{ width: '60%', height: '60%', objectFit: 'contain' }}
        />
      </div>

      {/* Phần nội dung */}
      <Card.Body className="p-0">
        <Card.Title className="fw-bold text-start" style={{ fontSize: '1rem', marginBottom: '10px' }} >
          {service.serviceName}
        </Card.Title>

        <Card.Text className="text-start text-muted" style={{ fontSize: '0.9rem' }} >
          {service.description}
        </Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ServiceCard
