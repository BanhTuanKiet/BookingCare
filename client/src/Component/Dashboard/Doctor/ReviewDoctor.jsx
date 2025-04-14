import React from 'react'
import { Col, Row } from 'react-bootstrap'
import ReviewCard from './ReviewCard'

function ReviewDoctor() {
    const patients = [
        {
            patientName: "John Doe",
            rating: 4.5,
            date: "March 15, 2023",
            review: "The doctor was very professional and caring. I felt comfortable during the entire appointment. The staff was friendly and the waiting time was minimal. Highly recommend for anyone looking for a reliable medical service.",
            verified: true,
            treatmentType: "General Checkup",
        },
        {
            patientName: "Jane Smith",
            rating: 5.0,
            date: "April 2, 2023",
            review: "Amazing experience! The doctor explained everything clearly and the procedure was smooth.",
            verified: true,
            treatmentType: "Dental Cleaning",
        },
        {
            patientName: "Alice Johnson",
            rating: 4.0,
            date: "April 10, 2023",
            review: "Good service overall, but the waiting time was a bit long.",
            verified: false,
            treatmentType: "Eyes Checkup",
        }
    ]

    return (
        <Row>
            <Col md={6} >
                {patients.map((patient, index) => (
                    <ReviewCard key={index} patient={patient} />
                ))}
            </Col>
        </Row>
    )
}

export default ReviewDoctor
