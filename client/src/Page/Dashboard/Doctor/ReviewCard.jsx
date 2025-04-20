import { Card, Badge, Button } from 'react-bootstrap'
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { BsCheckCircle } from 'react-icons/bs'
import { useState } from 'react'

export default function ReviewCard({ patient }) {
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = patient.review.length > 100
  const truncatedText = expanded ? patient.review : patient.review.slice(0, 100) + (shouldTruncate ? '...' : '')

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-warning me-1" />)
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-warning me-1" />)
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-warning me-1" />)
    }

    return stars
  }

  return (
    <Card className="shadow-sm border-0 rounded-4" style={{ maxWidth: '450px' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <Card.Title as="h5" className="mb-1 p-0">{patient.patientName}</Card.Title>
            <Card.Subtitle className="text-muted small">{patient.date}</Card.Subtitle>
          </div>
          {patient.verified && (
            <div className="text-success d-flex align-items-center small fw-semibold">
              <BsCheckCircle className="me-1" />
              Verified
            </div>
          )}
        </div>

        <div className="d-flex align-items-center mb-3">
          <div className="d-flex">{renderStars(patient.rating)}</div>
          <div className="ms-2 fw-semibold">{patient.rating.toFixed(1)}</div>
        </div>

        <Card.Text className="text-muted small mb-4">
          {truncatedText}
          {shouldTruncate && (
            <Button
              variant="link"
              size="sm"
              className="p-0 ms-1 fw-semibold text-decoration-none"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Read less" : "Read more"}
            </Button>
          )}
        </Card.Text>

        <Badge bg="light" text="dark" className="fw-semibold px-3 py-2 rounded-pill">
          {patient.treatmentType}
        </Badge>
      </Card.Body>
    </Card>
  );
}
