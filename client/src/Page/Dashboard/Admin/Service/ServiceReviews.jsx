import { Button, Col, Row } from 'react-bootstrap'
import axios from '../../../../Util/AxiosConfig'
import React, { useEffect, useState } from 'react'
import ServiceReviewDetail from './ServiceReviewDetail'

function ServiceReviews() {
    const [specialties, setSpecialties] = useState()
    const [specialty, setSpecialty] = useState()
    const [services, setServices] = useState()
    const [Service, setService] = useState()
    const [review, setReview] = useState()
    const [reviews, setReviews] = useState()
    const [showReviewDetail, setShowReviewDetail] = useState(false)
    
    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const response = await axios.get(`specialties`)  
                setSpecialties(response.data)
                setSpecialty(response.data[0])
            } catch (error) {
                console.log(error)
            }
        }

        fetchSpecialty()
    }, [])

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(`/services/${specialty?.name}/services`)  
                setServices(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchService()
    }, [specialty])

    useEffect(() => {
        if (services === null) return

        const fetchReviewService = async () => {
            try {
                const response = await axios.get(`/reviews/services/${specialty?.name}`)  
                console.log("review dịch vụ theo tên khoa: ", response.data)
                setReviews(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchReviewService()
    }, [services, specialty])

    const handleSpecialty = (e) => {
        const selectedId = parseInt(e.target.value)
        const selectedSpecialty = specialties.find(s => s.specialtyId === selectedId)
        setSpecialty(selectedSpecialty)          
    }

    if (showReviewDetail) {
        return (
            <ServiceReviewDetail specialty={specialty?.name} service={Service} review={review} />
        )
    }

    return (
        <div className='container py-4'>
            <Row className='mb-4'>
                <Col>
                    <h4>Thống kê đánh giá dịch vụ của {specialty?.name}</h4>
                    <select value={specialty?.specialtyId} onChange={(e) => handleSpecialty(e)}>
                        {specialties?.map((s, idx) => (
                            <option key={idx} value={s.specialtyId}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </Col>
            </Row>

            <Row>
                <Col>
                    {services?.map((service, index) => {
                        const review = reviews?.find(r => r.serviceId === service.serviceId)

                        return (
                            <div key={index} className="mb-3 p-3 border rounded shadow-sm">
                                <Row>
                                    <Col xs={2}>
                                        {/* <img
                                            src={service.serviceImage || 'https://via.placeholder.com/80'}
                                            alt={service.serviceName}
                                            className="img-fluid rounded"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        /> */}
                                    </Col>
                                    <Col xs={10} className='d-flex'>
                                        <div>
                                            <h5 className="mb-1">{service?.serviceName}</h5>
                                            <p className="text-muted mb-1">Chuyên khoa: {specialty?.name}</p>
                                            <p className="mb-0">
                                                Đánh giá trung bình: <strong>{review?.avgScore || 'NaN'}</strong> / 5
                                                &nbsp; | &nbsp; {review?.reviewCount || 0} lượt đánh giá
                                            </p>
                                        </div>
                                        <div className='mt-auto ms-auto'>
                                            <Button 
                                                variant="outline-primary" 
                                                onClick={() => {
                                                    setService(service)
                                                    setReview(review)
                                                    setShowReviewDetail(true)
                                                }}
                                            >
                                                Chi tiết
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        )})
                    }
                </Col>
            </Row>
        </div>
    )
}

export default ServiceReviews