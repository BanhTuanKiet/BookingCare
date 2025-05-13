import { Button, Col, Row } from 'react-bootstrap'
import axios from '../../../../Util/AxiosConfig'
import React, { useEffect, useState } from 'react'
import ReviewDetail from './ReviewDetail'

function Reviews() {
    const [specialties, setSpecialties] = useState()
    const [specialty, setSpecialty] = useState()
    const [doctors, setDoctors] = useState()
    const [doctor, setDoctor] = useState()
    const [review, setReview] = useState()
    const [reviews, setReviews] = useState()
    const [showReviewDetail, setShowReviewDetail] = useState(false)
    
    useEffect(() => {
        const fetchSpecialty = async () => {
            try {
                const response = await axios.get("specialties")  
                setSpecialties(response.data)
                setSpecialty(response.data[0])
            } catch (error) {
                console.log(error)
            }
        }

        fetchSpecialty()
    }, [])

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get(`/doctors/${specialty?.name}`)  
                setDoctors(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchDoctors()
    }, [specialty])

    useEffect(() => {
        if (doctors === null) return

        const fetchReviewDoctor = async () => {
            try {
                const response = await axios.get(`/reviews/doctors/${specialty?.name}`)  
                setReviews(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchReviewDoctor()
    }, [doctors, specialty])

    const handleSpecialty = (e) => {
        const selectedId = parseInt(e.target.value)
        const selectedSpecialty = specialties.find(s => s.specialtyId === selectedId)
        setSpecialty(selectedSpecialty)          
    }

    if (showReviewDetail) {
        return (
            <ReviewDetail specialty={specialty?.name} doctor={doctor} review={review} />
        )
    }

    return (
        <div className='container py-4'>
            <Row className='mb-4'>
                <Col>
                    <h4>Quản lý bác sĩ của {specialty?.name}</h4>
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
                    {doctors?.map((doctor, index) => {
                        const r = reviews?.find(r => r.doctorId === doctor.doctorId)

                        return (
                            <div key={index} className="mb-3 p-3 border rounded shadow-sm">
                                <Row>
                                    <Col xs={2}>
                                        <img
                                            src={doctor.doctorImage || 'https://via.placeholder.com/80'}
                                            alt={doctor.userName}
                                            className="img-fluid rounded"
                                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                        />
                                    </Col>
                                    <Col xs={10} className='d-flex'>
                                        <div>
                                            <h5 className="mb-1">{doctor?.userName}</h5>
                                            <p className="text-muted mb-1">Chuyên khoa: {specialty?.name}</p>
                                            <p className="mb-0">
                                                Đánh giá trung bình: <strong>{r?.avgScore || 'NaN'}</strong> / 5
                                                &nbsp; | &nbsp; {r?.reviewCount || 0} lượt đánh giá
                                            </p>
                                        </div>
                                        <div className='mt-auto ms-auto'>
                                            <Button 
                                                variant="outline-primary" 
                                                onClick={() => {
                                                    setDoctor(doctor)
                                                    setReview(r)
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

export default Reviews