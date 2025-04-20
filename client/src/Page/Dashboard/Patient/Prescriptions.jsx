import { ChevronDown, ChevronUp, FileText, Printer } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Badge, Button, Card, Col, Collapse, Row } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'

function Prescriptions({ tabActive }) {
    const [medicalRecords, setMedicalRecords] = useState([])
    const [openRecords, setOpenRecords] = useState({})

    const toggleRecord = (recordId) => {
        setOpenRecords(prev => ({
            ...prev,
            [recordId]: !prev[recordId]
        }))
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString('vi-VN')
        } catch (error) {
            return dateString
        }
    }

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get("/medicalRecords/prescriptions")
                console.log(response.data)
                setMedicalRecords(response.data)
            } catch (error) {
                console.log(error)
            }
        }
    
        if (tabActive === "prescriptions") {
            fetchPrescriptions()
        }
    }, [tabActive])
    
    return (
        <Card>
            <Card.Body>
                <h4>Đơn Thuốc</h4>
                <p>Lịch sử đơn thuốc đã kê</p>
                
                {medicalRecords && medicalRecords.length > 0 ? (
                    medicalRecords.map((record) => (
                        <Card key={record.recordId} className="mb-3 border">
                            <Card.Body>
                                <Row className="align-items-center">
                                    <Col xs={2} sm={1} className="text-center">
                                        <div className="bg-light rounded-circle p-2 d-inline-flex">
                                            <FileText size={24} className="text-primary" />
                                        </div>
                                    </Col>
                                    <Col xs={8} sm={9}>
                                        <div className="d-flex align-items-center mb-1">
                                            <h5 className="mb-0 me-2">RX-{record.recordId}</h5>
                                            <Badge bg="light" text="dark" className="me-2">
                                                {record.date ? formatDate(record.date) : "Không có ngày"}
                                            </Badge>
                                        </div>
                                        <div>{record.department || "Khoa không xác định"}</div>
                                        <div className="text-muted">{record.doctor || "Bác sĩ không xác định"}</div>
                                        <div className="text-muted">
                                            <strong>Chuẩn đoán:</strong> {record.diagnosis || "Không có"}
                                        </div>
                                    </Col>
                                    <Col xs={2} className="text-end">
                                        <Button
                                            variant="light" 
                                            onClick={() => toggleRecord(record.recordId)}
                                            aria-expanded={openRecords[record.recordId]}
                                            className="border"
                                        >
                                            {openRecords[record.recordId] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </Button>
                                    </Col>
                                </Row>
                        
                                <Collapse in={openRecords[record.recordId]}>
                                    <div className="mt-3">
                                        <hr />
                                        <h6 className="mb-3">Chi tiết đơn thuốc:</h6>
                                        
                                        {record.prescriptions && record.prescriptions.length > 0 ? (
                                            <table className="table table-bordered">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Tên thuốc</th>
                                                        <th>Liều lượng</th>
                                                        <th>Tần suất</th>
                                                        <th>Thời gian</th>
                                                        <th>Ghi chú</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {record.prescriptions.map((med, idx) => (
                                                        <tr key={idx}>
                                                            <td>
                                                                <strong>{med.name}</strong>
                                                                <div className="small text-muted">{med.form}</div>
                                                            </td>
                                                            <td>{med.dosage}</td>
                                                            <td>{med.frequency}</td>
                                                            <td>{med.duration}</td>
                                                            <td>{med.notes}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>Không có thuốc được kê trong đơn này</p>
                                        )}
                                        
                                        <div className="mt-3 d-flex justify-content-between">
                                            <div className="text-muted">
                                                <strong>Hướng dẫn điều trị:</strong> {record.treatment || "Không có"}
                                            </div>
                                            <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                                <Printer size={16} className="me-1" /> In đơn thuốc
                                            </Button>
                                        </div>
                                    </div>
                                </Collapse>
                            </Card.Body>
                        </Card>
                    ))
                ) : (
                    <div className="text-center p-4">
                        <p>Không có đơn thuốc nào trong hồ sơ</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    )
}

export default Prescriptions