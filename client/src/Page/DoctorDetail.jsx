import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "../Util/AxiosConfig"
import { Container, Row, Col, Card, Spinner, Button, Nav, Badge } from "react-bootstrap"
import { User, MapPin, Calendar, Award, Briefcase, Clock, FileText, ChevronLeft, ExternalLink } from "lucide-react"

const DoctorDetail = () => {
  const { doctorName } = useParams()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("intro")
  const navigate = useNavigate()

  const handleAppointment = () => {
    navigate("/đặt lịch khám")
  }

  useEffect(() => {
    const fetchDoctorDetail = async () => {
      try {
        const response = await axios.get(`/doctors/detail/${doctorName}`)
        setDoctor(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết bác sĩ:", error)
        setDoctor(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctorDetail()
  }, [doctorName])

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Đang tải thông tin bác sĩ...</p>
      </Container>
    )
  }

  if (!doctor) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <h4 className="mb-3">Không tìm thấy thông tin bác sĩ</h4>
          <p className="text-muted mb-4">Thông tin bác sĩ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
          <Button
            variant="outline-primary"
            onClick={() => window.history.back()}
            className="d-flex align-items-center gap-2"
          >
            <ChevronLeft size={18} />
            Quay lại
          </Button>
        </div>
      </Container>
    )
  }

  const qualificationsList = doctor.qualifications
    ? doctor.qualifications
        .split("$")
        .map((item) => item.trim())
        .filter(Boolean)
    : []

  const workExperienceList = doctor.workExperience
    ? doctor.workExperience
        .split("$")
        .map((item) => item.trim())
        .filter(Boolean)
    : []

  return (
    <Container fluid className="py-4 bg-light">
      <Container className="w-75">
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            className="p-0 text-decoration-none d-flex align-items-center text-muted"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={18} />
            <span>Quay lại danh sách bác sĩ</span>
          </Button>
        </div>

        <Card className="border-0 shadow-sm mb-4 overflow-hidden">
          <Row className="g-0">
            <Col lg={3} md={4} className="bg-white">
              <div className="h-100 d-flex align-items-center justify-content-center p-3">
                <img
                  src={
                    doctor.doctorImage
                      ? doctor.doctorImage.startsWith("data:image")
                        ? doctor.doctorImage
                        : `data:image/png;base64,${doctor.doctorImage}`
                      : "https://via.placeholder.com/300x400?text=Bác+sĩ"
                  }
                  alt={doctor.userName}
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "350px",
                    objectFit: "cover",
                    width: "100%",
                  }}
                />
              </div>
            </Col>

            <Col lg={9} md={8}>
              <Card.Body className="p-4">
                <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
                  <div>
                    <h2 className="text-primary fw-bold mb-1">
                      {doctor.degree} {doctor.userName}
                    </h2>
                    <p className="text-muted mb-2">{doctor.position || "Chức vụ đang cập nhật"}</p>

                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg="light" text="dark" className="d-flex align-items-center gap-1 py-2 px-3">
                        <Clock size={14} />
                        <span>{doctor.experienceYears || "0"} năm kinh nghiệm</span>
                      </Badge>
                      <Badge bg="light" text="dark" className="d-flex align-items-center gap-1 py-2 px-3">
                        <User size={14} />
                        <span>Đã khám: 1,234 bệnh nhân</span>
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-3 mt-md-0">
                    <Button
                      variant="primary"
                      size="lg"
                      className="d-flex align-items-center gap-2 fw-bold"
                      onClick={handleAppointment}
                    >
                      <Calendar size={18} />
                      Đặt lịch khám
                    </Button>
                  </div>
                </div>

                <hr className="my-3" />

                <Row>
                  <Col md={8}>
                    <h5 className="text-primary mb-3">Thông tin liên hệ</h5>
                    <div className="mb-3">
                      <div className="d-flex align-items-start gap-2 mb-2">
                        <MapPin size={18} className="text-primary mt-1" />
                        <div>
                          <p className="mb-1 fw-medium">Địa chỉ phòng khám:</p>
                          <p className="text-muted mb-1">475A Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh</p>
                          <Link
                            to="https://www.google.com/maps/dir//HUTECH,+7+Nguy%E1%BB%85n+Gia+Tr%C3%AD,+Ph%C6%B0%E1%BB%9Dng+25,+B%C3%ACnh+Th%E1%BA%A1nh,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8018525,106.6740191,13z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x31752953ade9f9c9:0x6ad5d15cd48a4f4e!2m2!1d106.7152576!2d10.8018439!3e0?hl=vi-VN&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D"
                            target="_blank"
                            className="d-flex align-items-center gap-1 text-primary"
                          >
                            <span>Xem bản đồ</span>
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col md={4}>
                    <h5 className="text-primary mb-3">Giờ làm việc</h5>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Thứ 2 - Thứ 6:</span>
                      <span className="fw-medium">08:00 - 17:00</span>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span>Thứ 7:</span>
                      <span className="fw-medium">08:00 - 12:00</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Chủ nhật:</span>
                      <span className="fw-medium">Nghỉ</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Col>
          </Row>
        </Card>

        <Card className="border-0 shadow-sm overflow-hidden">
          <Card.Header className="bg-white p-0 border-bottom">
            <Nav variant="tabs" className="nav-fill border-0">
              <Nav.Item>
              <Nav.Link
                  active={activeTab === "intro"}
                  onClick={() => setActiveTab("intro")}
                  className={`border-0 rounded-0 py-3 px-4 ${activeTab === "intro" ? "text-primary" : "text-dark"}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FileText size={18} />
                    <span className="fw-medium">Giới thiệu</span>
                  </div>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  active={activeTab === "specialties"}
                  onClick={() => setActiveTab("specialties")}
                  className={`border-0 rounded-0 py-3 px-4 ${activeTab === "specialtiesx" ? "text-primary" : "text-dark"}`}
                >
                  <div className="d-flex align-items-center gap-2">
                    <Award size={18} />
                    <span className="fw-medium">Chuyên môn</span>
                  </div>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body className="p-4">
            {activeTab === "intro" && (
              <div>
                <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
                  <User size={20} />
                  Tiểu sử
                </h4>
                <div className="bg-light p-4 rounded">
                  {doctor.biography ? (
                    <div dangerouslySetInnerHTML={{ __html: doctor.biography.replace(/\n/g, "<br/>") }} />
                  ) : (
                    <p className="text-muted fst-italic">Thông tin tiểu sử đang được cập nhật...</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "specialties" && (
              <div>
                <div className="mb-5">
                  <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
                    <Award size={20} />
                    Bằng cấp & Chứng chỉ
                  </h4>
                  <div className="bg-light p-4 rounded">
                    {qualificationsList.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {qualificationsList.map((qual, idx) => (
                          <li key={idx} className="list-group-item bg-transparent px-0 py-2 border-bottom">
                            <div className="d-flex">
                              <div>{qual}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted fst-italic">Thông tin bằng cấp đang được cập nhật...</p>
                    )}
                  </div>
                </div>

                <div className="mb-5">
                  <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
                    <Briefcase size={20} />
                    Kinh nghiệm làm việc
                  </h4>
                  <div className="bg-light p-4 rounded">
                    {workExperienceList.length > 0 ? (
                      <ul className="list-group list-group-flush">
                        {workExperienceList.map((exp, idx) => (
                          <li key={idx} className="list-group-item bg-transparent px-0 py-2 border-bottom">
                            <div className="d-flex">
                              <div>{exp}</div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted fst-italic">Thông tin kinh nghiệm làm việc đang được cập nhật...</p>
                    )}
                  </div>
                </div>

                {/* <div>
                  <h4 className="text-primary mb-3 d-flex align-items-center gap-2">
                    <Clock size={20} />
                    Thông tin chuyên môn
                  </h4>
                  <div className="bg-light p-4 rounded">
                    <Row>
                      <Col md={6} className="mb-3 mb-md-0">
                        <h6 className="mb-2">Chức vụ</h6>
                        <p>{doctor.position || "Đang cập nhật"}</p>
                      </Col>
                      <Col md={6}>
                        <h6 className="mb-2">Số năm kinh nghiệm</h6>
                        <p>{doctor.experienceYears || "0"} năm</p>
                      </Col>
                    </Row>
                  </div>
                </div> */}
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Container>
  )
}

export default DoctorDetail