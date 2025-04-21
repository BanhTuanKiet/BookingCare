import { Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import PrescriptionCard from '../../../Component/Card/PrescriptionCard'
import { formatDateToLocale } from "../../../Util/DateUtils"

function Overview({ tabActive, setTabActive }) {
    const [appointment, setAppointment] = useState()
    const [medicalRecords, setMedicalRecords] = useState([])

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await axios.get("/appointments/recently")
                setAppointment(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAppointment()
    }, [])

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get("/medicalRecords/prescriptions/recently")

                setMedicalRecords(response.data)
            } catch (error) {
                console.log(error)
            }
        }
    
        if (tabActive === "overview") {
            fetchPrescriptions()
        }
    }, [tabActive])

    return (
        <Card>
            <Card.Body>
                <h4>Tổng Quan Bệnh Án</h4>
                <p className="text-muted">Thông tin tổng hợp về lịch hẹn và đơn thuốc gần đây</p>
                
                <Row className="mt-4">
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h5>Lịch Hẹn Sắp Tới</h5>
                                
                                <div className="border rounded p-3 mt-3" style={{ cursor: "pointer" }}>
                                    <div className="d-flex">
                                        <div className="bg-light rounded-circle p-2 me-3">
                                            <Clock size={24} className="text-success" />
                                        </div>
                                        <div>
                                            <p className="mb-1">{formatDateToLocale(appointment?.appointmentDate)} - {appointment?.appointmentTime}</p>
                                            <p className="mb-0 text-muted"><strong>Bác sĩ: </strong>{appointment?.doctorName}</p>
                                            <p className="mb-0 text-muted"><strong>Dịch vụ: </strong>{appointment?.serviceName}</p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h5 className='mb-3'>Đơn Thuốc Gần Đây</h5>
                                
                                {medicalRecords.map((record, index) => (
                                    <div key={index} >
                                        <PrescriptionCard record={record} tabActive={tabActive}  />
                                    </div>
                                ))} 
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Overview