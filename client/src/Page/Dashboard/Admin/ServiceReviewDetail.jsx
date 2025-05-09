import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'

function ServiceReviewDetail({ service, review }) {
    const [reviewList, setReviewList] = useState([])

    useEffect(() => {
        const fetchReviewList = async () => {
            try {
                const res = await axios.get(`/reviews/services/${service?.serviceId}/all`)
                setReviewList(res.data)
            } catch (error) {
                console.error("Error loading review list", error)
            }
        }

        fetchReviewList()
    }, [service])

    return (
        <div className='container py-4'>
            <Row className='mb-3'>
                <Col>
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        ← Quay lại
                    </Button>
                </Col>
            </Row>

            <Row className='mb-3'>
                <Col>
                    <h4>Chi tiết đánh giá: {service?.serviceName}</h4>
                    <p>
                        Trung bình: <strong>{review?.avgScore || 'NaN'}</strong> / 5 &nbsp; | &nbsp;
                        {review?.reviewCount || 0} lượt đánh giá
                    </p>
                </Col>
            </Row>

            {reviewList.length > 0 ? (
                reviewList.map((r, idx) => (
                    <Card key={idx} className="mb-3 shadow-sm">
                        <Card.Body>
                            <Card.Title className='d-flex justify-content-between'>
                                <span>Người dùng: {r.fullName || 'Ẩn danh'}</span>
                                <span>★ {r.rating} / 5</span>
                            </Card.Title>
                            <Card.Text>
                                {r.comment || 'Không có nhận xét'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))
            ) : (
                <p>Không có đánh giá nào cho dịch vụ này.</p>
            )}
        </div>
    )
}

export default ServiceReviewDetail
