import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "../Util/AxiosConfig"
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap"
import { MapPin, Calendar, ChevronLeft, ExternalLink, Info, CheckCircle, DollarSign } from "lucide-react"
import serviceImage from "../Image/ServiceImage/Index"

const ServiceDetail = () => {
  const images = serviceImage
  const { serviceName } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleAppointment = () => {
    navigate("/đặt lịch khám")
  }

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await axios.get(`/services/detail/${serviceName}`)
        console.log("Data của response data là:", response.data)
        setService(response.data)
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceDetail()
  }, [serviceName])

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted">Đang tải thông tin dịch vụ...</p>
      </Container>
    )
  }

  if (!service) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
        <div className="text-center">
          <h4 className="mb-3">Không tìm thấy thông tin dịch vụ</h4>
          <p className="text-muted mb-4">Thông tin dịch vụ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa</p>
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

  const formattedPrice = typeof service.price === "number" ? service.price.toLocaleString() + " VNĐ" : service.price

  return (
    <Container fluid className="py-5 bg-light">
      <Container className="w-75">
        {/* Breadcrumb */}
        <div className="d-flex align-items-center mb-4">
          <Button
            variant="link"
            className="p-0 text-decoration-none d-flex align-items-center text-muted"
            onClick={() => window.history.back()}
          >
            <ChevronLeft size={18} />
            <span>Quay lại danh sách dịch vụ</span>
          </Button>
        </div>

        <Row>
          <Col lg={8} className="mb-4 mb-lg-0">
            {/* Service Header */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <Card.Body className="p-4">
                <h2 className="text-primary fw-bold mb-3">{service.serviceName}</h2>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Badge bg="light" text="dark" className="d-flex align-items-center gap-1 py-2 px-3">
                    <DollarSign size={14} />
                    <span>{formattedPrice}</span>
                  </Badge>
                  <Badge bg="light" text="dark" className="d-flex align-items-center gap-1 py-2 px-3">
                    <Calendar size={14} />
                    <span>Thời gian: 30-60 phút</span>
                  </Badge>
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
              <Card.Img
                variant="top"
                src={images[service.serviceName]}
                alt={`Hình ảnh của ${service.serviceName}`}
                className="img-fluid"
                style={{ objectFit: "cover", maxHeight: "400px", width: "100%" }}
              />
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white p-4 border-bottom">
                <h4 className="text-primary mb-0 d-flex align-items-center gap-2">
                  <Info size={20} />
                  Giới thiệu dịch vụ
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="bg-light p-4 rounded">
                  {service.description ? (
                    <div dangerouslySetInnerHTML={{ __html: service.description.replace(/\n/g, "<br/>") }} />
                  ) : (
                    <p className="text-muted fst-italic">Mô tả dịch vụ đang được cập nhật...</p>
                  )}
                </div>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white p-4 border-bottom">
                <h4 className="text-primary mb-0 d-flex align-items-center gap-2">
                  <CheckCircle size={20} />
                  Quy trình thực hiện
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="bg-light p-4 rounded">
                  <div className="position-relative">
                    <div
                      className="position-absolute h-100"
                      style={{ width: "2px", backgroundColor: "#e9ecef", left: "10px", top: 0 }}
                    ></div>

                    <div className="d-flex mb-4 position-relative">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "22px", height: "22px", zIndex: 1 }}
                      >
                        <span className="text-white fw-bold" style={{ fontSize: "12px" }}>
                          1
                        </span>
                      </div>
                      <div className="ms-4">
                        <h6 className="fw-bold mb-2">Đăng ký dịch vụ</h6>
                        <p className="mb-0">
                          Khách hàng đăng ký dịch vụ tại Phòng Khám Đa khoa XYZ bằng cách đến trực tiếp phòng khám, hoặc
                          đặt lịch hẹn qua website http://bookingcare.vn, fanpage Phòng Khám Đa Khoa XYZ.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex mb-4 position-relative">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "22px", height: "22px", zIndex: 1 }}
                      >
                        <span className="text-white fw-bold" style={{ fontSize: "12px" }}>
                          2
                        </span>
                      </div>
                      <div className="ms-4">
                        <h6 className="fw-bold mb-2">Tư vấn dịch vụ</h6>
                        <p className="mb-0">
                          Bác sĩ hàng đầu sẽ tư vấn và hướng dẫn dịch vụ phù hợp với quý khách hàng.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex mb-4 position-relative">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "22px", height: "22px", zIndex: 1 }}
                      >
                        <span className="text-white fw-bold" style={{ fontSize: "12px" }}>
                          3
                        </span>
                      </div>
                      <div className="ms-4">
                        <h6 className="fw-bold mb-2">Thực hiện dịch vụ</h6>
                        <p className="mb-0">
                          Khách hàng thực hiện theo hướng dẫn của các chuyên gia hàng đầu tại Phòng Khám Đa Khoa XYZ.
                        </p>
                      </div>
                    </div>

                    <div className="d-flex position-relative">
                      <div
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "22px", height: "22px", zIndex: 1 }}
                      >
                        <span className="text-white fw-bold" style={{ fontSize: "12px" }}>
                          4
                        </span>
                      </div>
                      <div className="ms-4">
                        <h6 className="fw-bold mb-2">Nhận kết quả và tư vấn</h6>
                        <p className="mb-0">
                          Khách hàng nhận kết quả, gặp bác sĩ để được tư vấn và hướng dẫn bước tiếp theo (nếu có).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white p-3 border-bottom">
                <h5 className="mb-0 fw-bold">Thông tin dịch vụ</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Giá dịch vụ:</span>
                    <span className="fw-medium text-primary">{formattedPrice}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Thời gian thực hiện:</span>
                    <span className="fw-medium">30-60 phút</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  onClick={handleAppointment}
                >
                  <Calendar size={18} />
                  Đặt lịch ngay
                </Button>
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white p-3 border-bottom">
                <h5 className="mb-0 fw-bold">Thông tin phòng khám</h5>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex align-items-start gap-2 mb-3">
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

                <hr className="my-3" />

                <h6 className="fw-bold mb-2">Giờ làm việc</h6>
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
              </Card.Body>
            </Card>

            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white p-4 border-bottom">
                <h5 className="mb-0 fw-bold">Dịch vụ liên quan</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex flex-column gap-3">
                  <Link to="#" className="text-decoration-none">
                    <div className="d-flex gap-3 p-2 rounded hover-bg-light">
                      <div style={{ width: "80px", height: "60px", overflow: "hidden" }}>
                        <img
                          src="/placeholder.svg?height=60&width=80"
                          alt="Dịch vụ liên quan"
                          className="img-fluid rounded"
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-primary">Khám tổng quát</h6>
                        <p className="small text-muted mb-0">500,000 VNĐ</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="#" className="text-decoration-none">
                    <div className="d-flex gap-3 p-2 rounded hover-bg-light">
                      <div style={{ width: "80px", height: "60px", overflow: "hidden" }}>
                        <img
                          src="/placeholder.svg?height=60&width=80"
                          alt="Dịch vụ liên quan"
                          className="img-fluid rounded"
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-primary">Xét nghiệm máu</h6>
                        <p className="small text-muted mb-0">300,000 VNĐ</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="#" className="text-decoration-none">
                    <div className="d-flex gap-3 p-2 rounded hover-bg-light">
                      <div style={{ width: "80px", height: "60px", overflow: "hidden" }}>
                        <img
                          src="/placeholder.svg?height=60&width=80"
                          alt="Dịch vụ liên quan"
                          className="img-fluid rounded"
                          style={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 text-primary">Siêu âm</h6>
                        <p className="small text-muted mb-0">400,000 VNĐ</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  )
}

export default ServiceDetail