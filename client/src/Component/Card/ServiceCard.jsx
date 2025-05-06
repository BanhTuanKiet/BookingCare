import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import images from '../../Image/Service/Index'
import imageService from '../../Image/ServiceImage/Index'
import '../../Style/ServiceCard.css'

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()
  const serviceImage = images[service.serviceId] || '/default-service.png'
  const imageOfEachService = imageService

  const truncateText = (text = "", wordLimit) => {
    const words = text ? text.split(' ') : []
    return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + ' ...' : text
  }

  return (
    <div className="custom-card-wrapper mb-3" onClick={() => navigate(`/dịch vụ/${service.serviceName}`)}>
      <Card className="custom-service-card" style={{height:'400px', width: '210px'}}>
        <div className="image-container">
          <Card.Img
            variant="top"
            src={imageOfEachService[service.serviceName]}
            alt={`Hình ảnh của dịch vụ ${service.serviceName}`}
            className="service-main-image"
          />
        </div>

        <div className="service-icon-wrapper custom-service-image">
          <img
            src={serviceImage}
            alt={service.serviceName}
            className="service-icon-img"
          />
        </div>

        <Card.Body className="card-body-custom text-center px-3 d-flex flex-column justify-content-between" style={{ height: "80px" }}>
          <div>
            <Card.Text className="fw-bold card-title text-primary pt-2">
              {service.serviceName}
            </Card.Text>
            <Card.Text className="card-description px-0">
              {truncateText(service.description, 15)}
            </Card.Text>
          </div>

          <Button
            variant="info"
            className="button-end see-more-button mt-1"
          >
            Xem thêm
          </Button>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ServiceCard
