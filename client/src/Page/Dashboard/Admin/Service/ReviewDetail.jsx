import { Card, Col, Container, Row } from 'react-bootstrap'
import DoctorServiceCard from '../../../../Component/Card/DoctorServiceCard'
import { useEffect, useState } from 'react'
import axios from '../../../../Util/AxiosConfig'
import Barchart from "../../../../Component/Chart/BarChart"

function ReviewDetail({ specialty, service, review }) {
    const [reviews, setReviews] = useState()
    const [reviewRating, setReviewRating] = useState()
    const [monthlyRating, setMonthlyRating] = useState()
    const [total, setTotal] = useState()
    const [monthlyTolal, setMonthlyTotal] = useState()
    const [month, setMonth] = useState(new Date().getMonth() + 1)
    const [year, setYear] = useState(new Date().getFullYear())

    useEffect(() => {
        const fetchRatingReview = async () => {
            try {
                const response = await axios.get(`/reviews/rating/service/${service?.serviceId}`)
                console.log(response.data)
                setReviewRating(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchRatingReview()
    }, [service])

    return (
        <Container className='mt-4 mb-5'>
            <DoctorServiceCard specialty={specialty} item={service} review={review} type={"dịch vụ"} />

            <Row className="g-4">
                <Col md={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-1 flex-wrap">
                            <h5 className="mb-5 text-center w-100">Phân bố đánh giá tổng quát</h5>
                        </div>
                        <Barchart data={reviewRating} total={total} label={"Phân bố đánh giá tổng quát"} labels={["1⭐", "2⭐", "3⭐", "4⭐", "5⭐"]} />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )

}

export default ReviewDetail