import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge, Tab, Nav, Button } from "react-bootstrap"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import axios from "../../../../Util/AxiosConfig"
import { Star, StarHalf, User, Award } from "lucide-react"
import ReviewDetailCard from "../../../../Component/Card/ReviewDetailCard"
import { useNavigate } from "react-router-dom"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const ServiceReviewDetail = ({ specialty, service, review }) => {
  const [reviews, setReviews] = useState()
  const [reviewRating, setReviewRating] = useState()
  const [total, setTotal] = useState()
  const [tabActive, setTabActive] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/detail/${tabActive}/${"service"}/${service?.serviceId}`)
        console.log("chi tiết đánh giá dịch vụ theo khoa", response)
        setReviews(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReview()
  }, [tabActive, service])
  
  useEffect(() => {
    const fetchRatingReview = async () => {
      try {
        const response = await axios.get(`/reviews/rating/${service?.serviceId}`)
        console.log("chi tiết đánh giá dịch vụ", response)
        setReviewRating(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRatingReview()
  }, [service])

  useEffect(() => {
    if (reviewRating === null) return
    setTotal(reviewRating?.reduce((sum, review) => sum + (review?.reviewCount || 0), 0))
  }, [reviewRating])

  const ratingsData = {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        label: "Số lượt đánh giá",
        data: reviewRating
          ? [
              reviewRating[0]?.reviewCount || 0,
              reviewRating[1]?.reviewCount || 0,
              reviewRating[2]?.reviewCount || 0,
              reviewRating[3]?.reviewCount || 0,
              reviewRating[4]?.reviewCount || 0,
            ]
          : [0, 0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(54, 162, 235, 0.7)",
        ],
      },
    ],
  }


  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Phân bố đánh giá theo số sao",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: total, 
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="text-warning" fill="#ffc107" size={18} />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="text-warning" fill="#ffc107" size={18} />)
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="text-muted" size={18} />)
    }

    return stars
  }

  return (
    <Container className="mt-4 mb-5">
      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0">Thông tin dịch vụ</h4>
        </Card.Header>
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col lg={7} xs={12} className="mb-4 mb-lg-0">
              <Row className="align-items-center">
                {/* <Col md={4} className="text-center text-md-start pe-0">
                  <Card.Img
                    src={service?.serviceImage || "/placeholder.svg?height=150&width=150"}
                    alt={service?.serviceName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Col> */}

                <Col md={8} className="ps-0">
                  <div className="mt-3 mt-md-0">
                    <h3 className="fw-bold text-primary mb-2">{service?.serviceName || "Tên dịch vụ"}</h3>
                    <div className="d-flex align-items-center mb-2">
                      <Award size={18} className="text-primary me-2" />
                      <span className="fw-semibold">{specialty || "Chuyên khoa"}</span>
                    </div>
                    {/* <div className="d-flex align-items-center mb-3">
                      <User size={18} className="text-primary me-2" />
                      <span>{doctor?.position || "Vị trí"}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Button onClick={() => navigate(`/bac-si/${doctor?.userName}`)}>Chi tiết</Button>
                    </div> */}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col lg={5} xs={12}>
              <Card className="border-0 bg-light shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <h4 className="mb-0 me-2">Đánh giá trung bình:</h4>
                    <span className="fs-4 fw-bold text-primary">{review?.avgScore || "N/A"}</span>
                    <span className="ms-2 text-muted">/5</span>
                  </div>

                  <div className="mb-3 d-flex align-items-center">{renderStars(review?.avgScore || 0)}</div>
                  <Badge bg="primary" className="px-3 py-2 rounded-pill">
                      {review?.reviewCount || 0} lượt đánh giá
                    </Badge>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        <Col md={7}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <Bar data={ratingsData} options={barOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0">Đánh giá từ bệnh nhân</h4>
        </Card.Header>
        <Card.Body>
          <Tab.Container>
            <Nav variant="tabs" className="mb-3" activeKey={tabActive} onSelect={(k) => setTabActive(k)}>
              <Nav.Item>
                <Nav.Link eventKey="all" className="d-flex align-items-center">
                  Tất cả
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="positive" className="d-flex align-items-center">
                  Tích cực
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="negative" className="d-flex align-items-center">
                  Cần cải thiện
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="all">
                <Card.Body>
                  {reviews?.map((review, index) => (
                    <ReviewDetailCard
                      review={review}
                    />
                  ))}
                </Card.Body>
              </Tab.Pane>

              <Tab.Pane eventKey="positive" >
                <Card.Body>
                  {reviews?.map((review, index) => (
                    <ReviewDetailCard
                      review={review}
                    />
                  ))}
                </Card.Body>
              </Tab.Pane>
                    
              <Tab.Pane eventKey="negative" >
                <Card.Body>
                  {reviews?.map((review, index) => (
                    <ReviewDetailCard
                      review={review}
                    />
                  ))}
                </Card.Body>
              </Tab.Pane> 
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ServiceReviewDetail