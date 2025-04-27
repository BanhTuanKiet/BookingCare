import { useState } from "react"
import { Modal, Button, Form, Row, Col } from "react-bootstrap"
import { Star } from "lucide-react"
import axios from "../../Util/AxiosConfig"

function RatingModal({ show, onHide, recordId }) {
  const [ratingType, setRatingType] = useState("doctor")
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [overallRating, setOverallRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [detailRatings, setDetailRatings] = useState({
    // Bác sĩ
    knowledge: 0,
    attitude: 0,
    dedication: 0,
    communicationSkill: 0,
    // Dịch vụ
    effectiveness: 0,
    price: 0,
    serviceSpeed: 0,
    convenience: 0,
  })
  
  const resetForm = () => {
    setComment("")
    setOverallRating(0)
    setHoverRating(0)
    setDetailRatings({
      knowledge: 0,
      attitude: 0,
      dedication: 0,
      communicationSkill: 0,
      effectiveness: 0,
      price: 0,
      serviceSpeed: 0,
      convenience: 0,
    })
  }
  
  const convertRatingForm = () => {
    const ratingData = {
      recordId,
      type: ratingType,
      overallRating,
      comment,
      detailRatings:
        ratingType === "doctor"
          ? {
              knowledge: detailRatings.knowledge,
              attitude: detailRatings.attitude,
              dedication: detailRatings.dedication,
              communicationSkill: detailRatings.communicationSkill,
            }
          : {
              effectiveness: detailRatings.effectiveness,
              price: detailRatings.price,
              serviceSpeed: detailRatings.serviceSpeed,
              convenience: detailRatings.convenience,
            },
    }
    return ratingData
  }  

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmitting(true)

    try {
      const ratingData = convertRatingForm()
      console.log(ratingData)
      // const response = await axios.post()

      resetForm()
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDetailRatingChange = (category, value) => {
    console.log(category, value)
    setDetailRatings((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const StarRating = ({ value, onChange }) => {
    const [localHover, setLocalHover] = useState(0)
  
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            fill={star <= (localHover || value) ? "#FFD700" : "none"}
            color={star <= (localHover || value) ? "#FFD700" : "#D3D3D3"}
            style={{ cursor: "pointer", marginRight: "4px" }}
            onMouseEnter={() => setLocalHover(star)}
            onMouseLeave={() => setLocalHover(0)}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    )
  }  

  const DetailRating = ({ category, label }) => {
    return (
      <div className="mb-3">
        <Form.Label>{label}</Form.Label>
        <div>
          <StarRating
            value={detailRatings[category]}
            onChange={(value) => handleDetailRatingChange(category, value)}
          />
        </div>
      </div>
    )
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Đánh giá {ratingType === "doctor" ? "Bác sĩ" : "Dịch vụ"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <p className="text-muted mb-3">
            Chia sẻ trải nghiệm của bạn sẽ giúp người khác tìm được dịch vụ y tế phù hợp
          </p>

          <div className="mb-3">
            <div className="d-flex">
              <Form.Check
                type="radio"
                id="doctor-rating"
                label="Đánh giá Bác sĩ"
                name="ratingType"
                checked={ratingType === "doctor"}
                onChange={() => setRatingType("doctor")}
                className="me-4"
              />
              <Form.Check
                type="radio"
                id="service-rating"
                label="Đánh giá Dịch vụ"
                name="ratingType"
                checked={ratingType === "service"}
                onChange={() => setRatingType("service")}
              />
            </div>
          </div>

          <div className="mb-4">
            <Form.Label>
              Đánh giá tổng thể <span className="text-danger">*</span>
            </Form.Label>
            <div>
              <StarRating
                value={overallRating}
                onChange={setOverallRating}
              />
            </div>
          </div>

          <div className="mb-4">
            <h6 className="mb-3">Đánh giá chi tiết</h6>

            {ratingType === "doctor" ? (
              <Row>
                <Col md={6}>
                  <DetailRating category="knowledge" label="Kiến thức chuyên môn" />
                </Col>
                <Col md={6}>
                  <DetailRating category="attitude" label="Thái độ phục vụ" />
                </Col>
                <Col md={6}>
                  <DetailRating category="dedication" label="Sự tận tâm" />
                </Col>
                <Col md={6}>
                  <DetailRating category="communicationSkill" label="Kỹ năng giao tiếp" />
                </Col>
              </Row>
            ) : (
              <Row>
                <Col md={6}>
                  <DetailRating category="effectiveness" label="Hiệu quả dịch vụ" />
                </Col>
                <Col md={6}>
                  <DetailRating category="price" label="Giá cả hợp lý" />
                </Col>
                <Col md={6}>
                  <DetailRating category="serviceSpeed" label="Tốc độ phục vụ" />
                </Col>
                <Col md={6}>
                  <DetailRating category="convenience" label="Sự thuận tiện" />
                </Col>
              </Row>
            )}
          </div>

          <div className="mb-3">
            <Form.Label>Nhận xét chi tiết</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Chia sẻ trải nghiệm của bạn..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="light" onClick={onHide} disabled={submitting}>
          Hủy
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RatingModal