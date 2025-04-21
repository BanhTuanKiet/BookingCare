import { ChevronDown, ChevronUp, FileText, Printer } from 'lucide-react'
import React, { useState } from 'react'
import { Button, Card, Col, Collapse, Row } from 'react-bootstrap'
import axios from '../../Util/AxiosConfig'

function PrescriptionCard({ record, tabActive }) {
    const [openRecords, setOpenRecords] = useState({})
    const [medicines, setMedicines] = useState()

    const toggleRecord = async (recordId) => {
        const isOpen = openRecords[recordId]

        setOpenRecords(prev => ({
            ...prev,
            [recordId]: !isOpen
        }))
    
        if (isOpen) return

        try {
            const response = await axios.get(`/medicalRecords/detail/${recordId}`)

            setMedicines(response.data)
        } catch (error) {
            console.log(error)
        }
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

    return (
        <Card key={record.recordId} className="mb-3 border">
            <Card.Body>
                <Row className="align-items-center">
                    <Col xs={2} sm={1}  className={`text-center ${tabActive === "overview" ? "me-4" : ""}`}>
                        <div className="bg-light rounded-circle p-2 d-inline-flex">
                            <FileText size={24} className="text-primary" />
                        </div>
                    </Col>
                    <Col xs={8} sm={9}>
                        <Row>
                            <Col>
                                <div className="d-flex align-items-center justify-content-between flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <div className="mb-0 me-2"><strong>Mã toa thuốc:</strong> {record.recordId}
                                            <small className='ms-2'>
                                                {record.appointmentDate ? formatDate(record.appointmentDate) : "Không có ngày"}
                                            </small>
                                        </div>
                                    </div>
                                </div>  
                                <div>{record.specialtyName || "Khoa không xác định"}</div>
                                <div><strong>Bác sĩ: </strong>{record.doctorName || "Bác sĩ không xác định"}</div>
                            </Col>

                            {tabActive === "prescriptions" && 
                                <Col xs={6} >
                                    <div className="text-muted">
                                        <strong>Triệu chứng:</strong> {record.treatment || "Không có"}
                                    </div>
                                    <div className="text-muted">
                                        <strong>Chẩn đoán:</strong> {record.diagnosis || "Không có"}
                                    </div>
                                    <div className="text-muted">
                                        <strong>Lưu ý:</strong> {record.notes || "Không có"}
                                    </div>
                                </Col>
                            }
                        </Row>
                    </Col>
                    {tabActive === "prescriptions" &&
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
                    }
                </Row>
        
                {tabActive === "prescriptions" && 
                    <Collapse in={openRecords[record.recordId]}>
                        <div className="mt-3">
                            <hr />
                            <h6 className="mb-3">Chi tiết đơn thuốc:</h6>
                            
                            {medicines && medicines.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tên thuốc</th>
                                            <th>Liều lượng</th>
                                            <th>Tần suất</th>
                                            <th>Thời gian</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {medicines.map((med, idx) => (
                                            <tr key={idx}>
                                                <td>
                                                    <strong>{med.medicineName}</strong>
                                                    <div className="small text-muted">{med.form}</div>
                                                </td>
                                                <td>{med.dosage} Lần / Ngày</td>
                                                <td>{med.frequencyPerDay} Lần / {med.unit}</td>
                                                <td>{med.durationInDays} Ngày</td>
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
                                    <br/>
                                    <strong>Ghi chú:</strong> {record.notes || "Không có"}
                                </div>
                                <Button variant="outline-primary" size="sm" className="d-flex align-items-center">
                                    <Printer size={16} className="me-1" /> In đơn thuốc
                                </Button>
                            </div>
                        </div>
                    </Collapse>                    
                }
            </Card.Body>
        </Card>
    )
}

export default PrescriptionCard