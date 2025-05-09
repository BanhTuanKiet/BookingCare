import { Star } from "lucide-react"
import { Card, Row, Col, Badge } from "react-bootstrap"
import { formatDateToLocale, formatTimeToLocale } from "../../Util/DateUtils"

const renderStars = (score) => {
  return (
    <div className="d-flex justify-content-start gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={16}
          className={i < score ? "text-warning" : "text-secondary"}
          fill={i < score ? "#ffc107" : "none"}
        />
      ))}
    </div>
  )
}

const ReviewDetailCard = ({ review }) => {
  return (
    <Card className="border-1 mb-4 p-4 rounded-4">
        <Row className="align-items-center mb-3">
            <Col>
                <div className="d-flex align-items-center">
                    <h5 className="mb-0 fw-semibold">{review?.patientName}</h5>
                    <small className="text-muted ms-3">
                        {formatDateToLocale(review?.createdAt)} {formatTimeToLocale(review?.createdAt)}
                    </small>
                </div>
            </Col>
        </Row>

      <div className="mb-3">{renderStars(review?.overallRating)}</div>

      <p className="text-secondary fst-italic mb-4">{review?.comment}</p>

      <Row className="gy-3">
        {[
            { label: "Thái độ", score: review?.attitude },
            { label: "Chuyên môn", score: review?.knowledge },
            { label: "Tận tâm", score: review?.dedication },
            { label: "Giao tiếp", score: review?.communicationSkill },
        ].map((item, index) => (
            <Col key={index} lg={3} md={6} xs={12}>
                <Badge
                    bg="light"
                    className="w-100 py-3 px-3 border shadow-sm rounded-3 d-flex flex-column align-items-center"
                >
                    <span className="text-dark fw-medium">{item.label}</span>
                    {renderStars(item.score)}
                </Badge>
            </Col>
        ))}
      </Row>
    </Card>
  )
}

export default ReviewDetailCard