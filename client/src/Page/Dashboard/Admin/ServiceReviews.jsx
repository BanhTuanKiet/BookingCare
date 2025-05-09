import { Button, Col, Row } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import React, { useEffect, useState } from 'react'
import ServiceReviewDetail from './ServiceReviewDetail'

function ServiceReviews() {
    const [services, setServices] = useState()
    const [service, setService] = useState()
    const [reviews, setReviews] = useState()
    const [review, setReview] = useState()
    const [showReviewDetail, setShowReviewDetail] = useState(false)

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`/services`)
                console.log("dich vu", response)
                setServices(response.data)
                setService(response.data[0])
            } catch (error) {
                console.log(error)
            }
        }

        fetchServices()
    }, [])

    useEffect(() => {
        const fetchReviews = async () => {
            if (!service) return
            try {
                const response = await axios.get(`/reviews/services/${service?.serviceId}`)
                setReviews(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchReviews()
    }, [service])

    const handleService = (e) => {
        const selectedId = parseInt(e.target.value)
        const selectedService = services.find(s => s.serviceId === selectedId)
        setService(selectedService)
    }

    if (showReviewDetail) {
        return (
            <ServiceReviewDetail service={service} review={review} />
        )
    }

    return (
        <div className='container py-4'>
            <Row className='mb-4'>
                <Col>
                    <h4>Thống kê đánh giá dịch vụ: {service?.serviceName}</h4>
                    <select value={service?.serviceId} onChange={handleService}>
                        {services?.map((s, idx) => (
                            <option key={idx} value={s.serviceId}>
                                {s.serviceName}
                            </option>
                        ))}
                    </select>
                </Col>
            </Row>

            <Row>
                <Col>
                    {service && reviews && (
                        <div className="mb-3 p-3 border rounded shadow-sm">
                            <Row>
                                <Col xs={2}>
                                    <img
                                        src={service.image || 'https://via.placeholder.com/80'}
                                        alt={service.serviceName}
                                        className="img-fluid rounded"
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                </Col>
                                <Col xs={10} className='d-flex'>
                                    <div>
                                        <h5 className="mb-1">{service.name}</h5>
                                        <p className="mb-0">
                                            Đánh giá trung bình: <strong>{reviews?.avgScore || 'NaN'}</strong> / 5
                                            &nbsp; | &nbsp; {reviews?.reviewCount || 0} lượt đánh giá
                                        </p>
                                    </div>
                                    <div className='mt-auto ms-auto'>
                                        <Button 
                                            variant="outline-primary" 
                                            onClick={() => {
                                                setReview(reviews)
                                                setShowReviewDetail(true)
                                            }}
                                        >
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Col>
            </Row>
        </div>
    )
}

export default ServiceReviews
