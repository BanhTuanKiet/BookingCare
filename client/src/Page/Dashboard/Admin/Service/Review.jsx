import { useEffect, useState } from 'react'
import { Button, Container, Form, ListGroup } from 'react-bootstrap'
import axios from '../../../../Util/AxiosConfig'
import ReviewDetail from './ReviewDetail'

function Review() {
    const [specialties, setSpecialties] = useState([])
    const [specialty, setSpecialty] = useState('')
    const [services, setServices] = useState([])
    const [service, setService] = useState()
    const [reviews, setReviews] = useState()
    const [review, setReview] = useState()
    const [showReviewDetail, setShowReviewDetail] = useState(false)

    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const response = await axios.get('/specialties')

                setSpecialties(response.data)
                setSpecialty(response.data[0])
            } catch (error) {
                console.error(error)
            }
        }

        fetchSpecialty()
    }, [])

    useEffect(() => {
        if (!specialty) return

        const fetchServices = async () => {
            try {
                const response = await axios.get(`/services/${specialty?.name}/services`)

                setServices(response.data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchServices()
    }, [specialty])

    useEffect(() => {
        if (services === null) return

        const fetchReviewDoctor = async () => {
            try {
                const response = await axios.get(`/reviews/services/${specialty?.name}`)  
                setReviews(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchReviewDoctor()
    }, [services, specialty])

    const handleSpecialty = (e) => {
        const selectedId = parseInt(e.target.value)
        const selectedSpecialty = specialties.find(s => s.specialtyId === selectedId)
        setSpecialty(selectedSpecialty)         
    }

    if (showReviewDetail) {
        return (
            <ReviewDetail specialty={specialty?.name} service={service} review={review} />
        )
    }

    return (
        <Container className="mt-4 w-75">
            <h5 className="mb-3">Chọn Khoa và Dịch vụ</h5>

            <Form.Group className="mb-3">
                <Form.Select value={specialty} onChange={handleSpecialty}>
                    {specialties.map((spec) => (
                        <option key={spec.specialtyId} value={spec.specialtyId}>
                            {spec.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            {services.length > 0 ? (
                <Container className="mt-4">
                    <div>
                        <h6 className="mb-2">Danh sách Dịch vụ</h6>
                        <ListGroup>
                            {services.map((service) => {
                                const r = reviews?.find(r => r.serviceId === service.serviceId)

                                return (
                                    <ListGroup.Item key={service?.serviceId} className='my-2 border-2 rounded d-flex'>
                                        <div>
                                            <strong>{service?.serviceName}</strong>
                                            <p className="text-muted mb-0">{service?.description}</p>
                                            <p className="text-muted mb-0">Giá: {service?.price?.toLocaleString('vi-VN')} VND</p>
                                            <p className="mb-0">
                                                Đánh giá trung bình: <strong>{r?.avgScore || 'NaN'}</strong> / 5
                                                &nbsp; | &nbsp; {r?.reviewCount || 0} lượt đánh giá
                                            </p>
                                        </div>

                                        <div className='my-auto ms-auto'>
                                            <Button
                                                onClick={() => {
                                                    setService(service)
                                                    setShowReviewDetail(true)
                                                    setReview(r)
                                                }}
                                            >
                                                Chi tiết
                                                </Button>
                                        </div>
                                    </ListGroup.Item>
                                )
                            })}
                        </ListGroup>
                    </div>
                </Container>
            ) : (
                <p className="text-muted">Không có dịch vụ nào cho khoa đã chọn.</p>
            )}
        </Container>
    )
}

export default Review