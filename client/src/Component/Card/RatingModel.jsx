import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Star } from "lucide-react";

function RatingModal({ show, onHide, recordId, onRatingSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [ratingType, setRatingType] = useState("doctor"); // "doctor" or "clinic"
  const [submitting, setSubmitting] = useState(false);

  // Additional ratings for the form
  const [waitTimeRating, setWaitTimeRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [facilityRating, setFacilityRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create the rating object
      const ratingData = {
        recordId,
        type: ratingType,
        doctorName: ratingType === "doctor" ? doctorName : null,
        clinicName: ratingType === "clinic" ? clinicName : null,
        appointmentDate,
        overallRating: rating,
        waitTimeRating: ratingType === "clinic" ? waitTimeRating : null,
        staffRating: ratingType === "clinic" ? staffRating : null,
        facilityRating: ratingType === "clinic" ? facilityRating : null,
        communicationRating: ratingType === "doctor" ? communicationRating : null,
        comment
      };

      // Call the provided onRatingSubmit function
      await onRatingSubmit(ratingData);
      
      // Reset form
      resetForm();
      // Close modal
      onHide();
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setDoctorName("");
    setClinicName("");
    setAppointmentDate("");
    setWaitTimeRating(0);
    setStaffRating(0);
    setFacilityRating(0);
    setCommunicationRating(0);
  };

  const StarRating = ({ value, hoverValue, onChange, onHover }) => {
    return (
      <div className="d-flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={24}
            fill={star <= (hoverValue || value) ? "#FFD700" : "none"}
            color={star <= (hoverValue || value) ? "#FFD700" : "#D3D3D3"}
            style={{ cursor: "pointer", marginRight: "4px" }}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Đánh giá Bác sĩ & Phòng khám</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <p className="text-muted">
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
                id="clinic-rating"
                label="Đánh giá Phòng khám"
                name="ratingType"
                checked={ratingType === "clinic"}
                onChange={() => setRatingType("clinic")}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <Form.Label>
                {ratingType === "doctor" ? "Tên Bác sĩ" : "Tên Phòng khám"}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  ratingType === "doctor" ? "Nhập tên bác sĩ" : "Nhập tên phòng khám"
                }
                value={ratingType === "doctor" ? doctorName : clinicName}
                onChange={(e) =>
                  ratingType === "doctor"
                    ? setDoctorName(e.target.value)
                    : setClinicName(e.target.value)
                }
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <Form.Label>Ngày khám</Form.Label>
              <Form.Control
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <Form.Label>Đánh giá tổng thể</Form.Label>
            <div>
              <StarRating
                value={rating}
                hoverValue={hoverRating}
                onChange={setRating}
                onHover={setHoverRating}
              />
            </div>
          </div>

          <div className="row">
            {ratingType === "clinic" && (
              <>
                <div className="col-md-6 mb-3">
                  <Form.Label>Thời gian chờ đợi</Form.Label>
                  <div>
                    <StarRating
                      value={waitTimeRating}
                      hoverValue={hoverRating}
                      onChange={setWaitTimeRating}
                      onHover={setHoverRating}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label>Thái độ nhân viên</Form.Label>
                  <div>
                    <StarRating
                      value={staffRating}
                      hoverValue={hoverRating}
                      onChange={setStaffRating}
                      onHover={setHoverRating}
                    />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <Form.Label>Cơ sở vật chất</Form.Label>
                  <div>
                    <StarRating
                      value={facilityRating}
                      hoverValue={hoverRating}
                      onChange={setFacilityRating}
                      onHover={setHoverRating}
                    />
                  </div>
                </div>
              </>
            )}
            
            {ratingType === "doctor" && (
              <div className="col-md-6 mb-3">
                <Form.Label>Kỹ năng giao tiếp</Form.Label>
                <div>
                  <StarRating
                    value={communicationRating}
                    hoverValue={hoverRating}
                    onChange={setCommunicationRating}
                    onHover={setHoverRating}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <Form.Label>Nhận xét chi tiết</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
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
  );
}

export default RatingModal;