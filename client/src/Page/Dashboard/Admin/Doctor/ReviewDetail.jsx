import { useEffect, useState } from "react"
import { Container, Row, Col, Card, Badge, Tab, Nav, Button } from "react-bootstrap"
import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import axios from "../../../../Util/AxiosConfig"
import { Star, StarHalf, User, Award } from "lucide-react"
import ReviewDetailCard from "../../../../Component/Card/ReviewDetailCard"
import { useNavigate } from "react-router-dom"
import BarChart from "../../../../Component/Chart/BarChart"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

const ReviewDetail = ({ specialty, doctor, review }) => {
  const [reviews, setReviews] = useState()
  const [reviewRating, setReviewRating] = useState()
  const [monthlyRating, setMonthlyRating] = useState()
  const [total, setTotal] = useState()
  const [monthlyTolal, setMonthlyTotal] = useState()
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [tabActive, setTabActive] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/reviews/detail/${tabActive}/${"doctor"}/${doctor?.doctorId}`)
        setReviews(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchReview()
  }, [tabActive, doctor])
  
  useEffect(() => {
    const fetchRatingReview = async () => {
      try {
        const response = await axios.get(`/reviews/rating/${doctor?.doctorId}`)
        setReviewRating(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRatingReview()
  }, [doctor])

  useEffect(() => {
    const fetchMonthlyRatingReview = async () => {
      try {
        const response = await axios.get(`/reviews/rating/${month}/${year}/${doctor?.doctorId}`)
        setMonthlyRating(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchMonthlyRatingReview()
  }, [doctor, month, year])

  useEffect(() => {
    if (reviewRating === null) return
    setTotal(reviewRating?.reduce((sum, review) => sum + (review?.reviewCount || 0), 0))

    if (monthlyRating === null) return
    setMonthlyTotal(monthlyRating?.reduce((sum, review) => sum + (review?.reviewCount || 0, 0)))
  }, [reviewRating, monthlyRating])

  const monthlyRatingsData = {
    labels: ["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"],
    datasets: [
      {
        label: "Số lượt đánh giá",
        data: monthlyRating
          ? [
              monthlyRating[0]?.reviewCount || 0,
              monthlyRating[1]?.reviewCount || 0,
              monthlyRating[2]?.reviewCount || 0,
              monthlyRating[3]?.reviewCount || 0,
              monthlyRating[4]?.reviewCount || 0,
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

  const monthlyBarOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Phân bố đánh giá theo tháng",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: monthlyTolal, 
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
          <h4 className="mb-0">Thông tin bác sĩ</h4>
        </Card.Header>
        <Card.Body className="p-3">
          <Row className="align-items-center">
            <Col lg={7} xs={12} className="mb-4 mb-lg-0">
              <Row className="align-items-center">
                <Col md={4} className="text-center text-md-start pe-0">
                  <Card.Img
                    src={doctor?.doctorImage || "/placeholder.svg?height=150&width=150"}
                    alt={doctor?.userName}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </Col>

                <Col md={8} className="ps-0">
                  <div className="mt-3 mt-md-0">
                    <h3 className="fw-bold text-primary mb-2">{doctor?.userName || "Tên bác sĩ"}</h3>
                    <div className="d-flex align-items-center mb-2">
                      <Award size={18} className="text-primary me-2" />
                      <span className="fw-semibold">{specialty || "Chuyên khoa"}</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <User size={18} className="text-primary me-2" />
                      <span>{doctor?.position || "Vị trí"}</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <Button onClick={() => navigate(`/bac-si/${doctor?.userName}`)}>Chi tiết</Button>
                    </div>
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

      <Row className="g-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4 pb-1 flex-wrap">
                <h5 className="mb-5 text-center w-100">Phân bố đánh giá tổng quát</h5>
              </div>
              <BarChart data={reviewRating} total={total} label={"Phân bố đánh giá tổng quát"} labels={["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"]} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <h5 className="mb-2 text-center w-100">Phân bố đánh giá theo tháng</h5>
                <div className="d-flex gap-2 justify-content-center w-100 mb-3">
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="form-select w-auto"
                  >
                    {[...Array(12)].map((_, idx) => (
                      <option key={idx} value={idx + 1}>
                        Tháng {idx + 1}
                      </option>
                    ))}
                  </select>

                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="form-select w-auto"
                  >
                    {[...Array(5)].map((_, idx) => {
                      const y = new Date().getFullYear() - idx
                      return (
                        <option key={y} value={y}>
                          Năm {y}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <Bar data={monthlyRatingsData} options={monthlyBarOptions} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-primary text-white py-3">
          <h4 className="mb-0">Đánh giá từ bệnh nhân</h4>
        </Card.Header>
        <Card.Body>
          <Tab.Container variant="tabs" className="mb-3" activeKey={tabActive} onSelect={(k) => setTabActive(k)} defaultActiveKey={"all"}>
            <Nav className="py-0">
              <Nav.Item>
                <Nav.Link eventKey="all" className={`d-flex align-items-center ${tabActive === "all" ? "fw-bold" : "text-dark"}`}>
                  Tất cả
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="positive" className={`d-flex align-items-center ${tabActive === "positive" ? "fw-bold" : "text-dark"}`}>
                  Tích cực
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="negative" className={`d-flex align-items-center ${tabActive === "negative" ? "fw-bold" : "text-dark"}`}>
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

export default ReviewDetail