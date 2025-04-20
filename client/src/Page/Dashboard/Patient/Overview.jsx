import { Clock, FileText } from 'lucide-react'
import React from 'react'
import { Card, Col, Row } from 'react-bootstrap'

function Overview({ tabActivce }) {
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
                                
                                <div className="border rounded p-3 mt-3">
                                    <div className="d-flex">
                                        <div className="bg-light rounded-circle p-2 me-3">
                                            <Clock size={24} className="text-success" />
                                        </div>
                                        <div>
                                            <h6>Khoa Xét Nghiệm</h6>
                                            <p className="mb-1">25/04/2025 - 14:30</p>
                                            <p className="mb-0 text-muted">BS. Lê Thị D</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border rounded p-3 mt-3">
                                    <div className="d-flex">
                                        <div className="bg-light rounded-circle p-2 me-3">
                                            <Clock size={24} className="text-success" />
                                        </div>
                                        <div>
                                            <h6>Khoa Tim Mạch</h6>
                                            <p className="mb-1">05/05/2025 - 10:15</p>
                                            <p className="mb-0 text-muted">BS. Trần Văn C</p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col md={6}>
                        <Card>
                            <Card.Body>
                                <h5>Đơn Thuốc Gần Đây</h5>
                                
                                <div className="border rounded p-3 mt-3">
                                    <div className="d-flex">
                                        <div className="bg-light rounded-circle p-2 me-3">
                                            <FileText size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <h6>Khoa Tim Mạch</h6>
                                            <p className="mb-1">20/04/2025</p>
                                            <p className="mb-0 text-muted">BS. Trần Văn C</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border rounded p-3 mt-3">
                                    <div className="d-flex">
                                        <div className="bg-light rounded-circle p-2 me-3">
                                            <FileText size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <h6>Khoa Nội Tổng Hợp</h6>
                                            <p className="mb-1">10/04/2025</p>
                                            <p className="mb-0 text-muted">BS. Phạm Thị E</p>
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Overview