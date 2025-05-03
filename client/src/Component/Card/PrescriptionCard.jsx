import { ChevronDown, ChevronUp, FileText, Printer, MessageSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { Button, Card, Col, Collapse, Row } from "react-bootstrap"
import { formatDateToLocale } from "../../Util/DateUtils"
import axios from "../../Util/AxiosConfig"
import RatingModal from "./RatingModel"

function PrescriptionCard({ record, tabActive, setTabActive, isSelected }) {
  const [openRecords, setOpenRecords] = useState({})
  const [medicines, setMedicines] = useState()
  const [showRatingModal, setShowRatingModal] = useState(false)

  // Handle card click to navigate from overview to prescriptions
  const handleCardClick = () => {
    if (tabActive === "overview" && setTabActive) {
      // Store the selected prescription ID in sessionStorage
      sessionStorage.setItem("selectedPrescriptionId", record.recordId)
      // Change tab to prescriptions
      setTabActive("prescriptions")
    }
  }

  // Auto-expand effect - fetch and expand the record whenever isSelected is true
  useEffect(() => {
    const autoExpandSelectedRecord = async () => {
      
      if (isSelected && tabActive === "prescriptions") {
        console.log("Auto expanding record:", record.recordId);
        // Auto-expand this record
        setOpenRecords((prev) => ({
          ...prev,
          [record.recordId]: true,
        }))

        // Fetch details automatically
        try {
          const response = await axios.get(`/medicalRecords/detail/${record.recordId}`)
          setMedicines(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }

    autoExpandSelectedRecord()
  }, [isSelected, tabActive, record.recordId])

  const toggleRecord = async (recordId) => {
    const isOpen = openRecords[recordId]

    setOpenRecords((prev) => ({
      ...prev,
      [recordId]: !isOpen,
    }))

    if (isOpen) return

    try {
      const response = await axios.get(`/medicalRecords/detail/${recordId}`)
      console.log(response.data)
      setMedicines(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRatingSubmit = async (ratingData) => {
    try {
      // Send rating data to backend
      await axios.post('/ratings/submit', ratingData);
      // Show success message or update UI
      alert('Đánh giá của bạn đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <Card
        key={record.recordId}
        className={`mb-3 border ${isSelected ? "border-primary" : ""}`}
        style={{ cursor: tabActive === "overview" ? "pointer" : "default" }}
        onClick={tabActive === "overview" ? handleCardClick : undefined}
      >
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={2} sm={1} className={`text-center ${tabActive === "overview" ? "me-4" : ""}`}>
              <div className="bg-light rounded-circle p-2 d-inline-flex">
                <FileText size={24} className="text-primary" />
              </div>
            </Col>
            <Col xs={8} sm={9}>
              <Row>
                <Col>
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center">
                      <div className="mb-0 me-2">
                        <strong>Mã toa thuốc:</strong> {record.recordId}
                        <small className="ms-2">
                          {record.appointmentDate ? formatDateToLocale(record.appointmentDate) : "Không có ngày"}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div>{record.specialtyName || "Khoa không xác định"}</div>
                  <div>
                    <strong>Bác sĩ: </strong>
                    {record.doctorName || "Bác sĩ không xác định"}
                  </div>
                </Col>

                {tabActive === "prescriptions" && (
                  <Col xs={6}>
                    <div className="text-muted">
                      <strong>Triệu chứng:</strong> {record.treatment || "Không có"}
                    </div>
                    <div className="text-muted">
                      <strong>Chẩn đoán:</strong> {record.diagnosis || "Không có"}
                    </div>
                    <div className="text-muted">
                      <strong>Lưu ý:</strong> {record.notes || "Không có"}
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            {tabActive === "prescriptions" && !isSelected && (
              <Col xs={2} className="text-end">
                <Button
                  variant="light"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRecord(record.recordId)
                  }}
                  aria-expanded={openRecords[record.recordId]}
                  className="border"
                >
                  {openRecords[record.recordId] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
              </Col>
            )}
          </Row>

          {tabActive === "prescriptions" && (
            <Collapse in={openRecords[record.recordId]}>
              <div className="mt-3">
                <hr />
                <h6 className="mb-3">Chi tiết đơn thuốc:</h6>

                {medicines && medicines.length > 0 ? (
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Tên thuốc</th>
                        <th>Liều lượng</th>
                        <th>Tần suất</th>
                        <th>Thời gian</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((med, idx) => (
                        <tr key={idx}>
                          <td>
                            <strong>{med.medicineName}</strong>
                            <div className="small text-muted">{med.form}</div>
                          </td>
                          <td>{med.dosage} Lần / Ngày</td>
                          <td>
                            {med.frequencyPerDay} Lần / {med.unit}
                          </td>
                          <td>{med.durationInDays} Ngày</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>Không có thuốc được kê trong đơn này</p>
                )}

                <div className="mt-3 d-flex justify-content-between">
                  <div className="text-muted">
                    <strong>Hướng dẫn điều trị:</strong> {record.treatment || "Không có"}
                    <br />
                    <strong>Ghi chú:</strong> {record.notes || "Không có"}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="d-flex align-items-center"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRatingModal(true)
                      }}
                    >
                      <MessageSquare size={16} className="me-1" /> Đánh giá
                    </Button>
                    <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                      <Printer size={16} className="me-1" /> In đơn thuốc
                    </Button>
                  </div>
                </div>
              </div>
            </Collapse>
          )}
        </Card.Body>
      </Card>
      
      {/* Rating Modal */}
      <RatingModal 
        show={showRatingModal}
        onHide={() => setShowRatingModal(false)}
        recordId={record.recordId}
        onRatingSubmit={handleRatingSubmit}
      />
    </>
  )
}

export default PrescriptionCard