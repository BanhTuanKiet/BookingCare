import React from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { Clock, FileText } from 'lucide-react';

function PatientMedicalRecord() {
  return (
    <Container fluid className="p-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <h5 className="text-success mb-4">Thông Tin Bệnh Nhân</h5>
              
              <div className="mb-4">
                <div 
                  className="rounded-circle bg-light text-success mx-auto d-flex align-items-center justify-content-center"
                  style={{ width: '120px', height: '120px', fontSize: '48px' }}
                >
                  A
                </div>
              </div>
              
              <h4>Nguyễn Văn A</h4>
              <p className="text-muted">Mã BN: BN-12345</p>
              
              <div className="text-start mt-4">
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Ngày sinh:</Col>
                  <Col md={7}>15/05/1985</Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Giới tính:</Col>
                  <Col md={7}>Nam</Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Nhóm máu:</Col>
                  <Col md={7}>O+</Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Dị ứng:</Col>
                  <Col md={7}>Penicillin</Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Điện thoại:</Col>
                  <Col md={7}>0901234567</Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Địa chỉ:</Col>
                  <Col md={7}>
                    123 Đường Lê Lợi, Quận 1, TP.HCM
                  </Col>
                </Row>
                
                <Row className="mb-2">
                  <Col md={5} className="text-muted">Liên hệ khẩn cấp:</Col>
                  <Col md={7}>Nguyễn Thị B - 0909876543</Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Tab.Container id="dashboard-tabs" defaultActiveKey="overview">
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="overview" className="d-flex align-items-center">
                  <span className="me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </span>
                  Tổng Quan
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="appointments" className="d-flex align-items-center">
                  <span className="me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </span>
                  Lịch Hẹn
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="prescriptions" className="d-flex align-items-center">
                  <span className="me-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </span>
                  Đơn Thuốc
                </Nav.Link>
              </Nav.Item>
            </Nav>
            
            <Tab.Content>
              <Tab.Pane eventKey="overview">
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
              </Tab.Pane>
              
              <Tab.Pane eventKey="appointments">
                <Card>
                  <Card.Body>
                    <h4>Lịch Hẹn</h4>
                    <p>Danh sách các lịch hẹn sắp tới</p>
                    
                    {/* Additional appointment content would go here */}
                  </Card.Body>
                </Card>
              </Tab.Pane>
              
              <Tab.Pane eventKey="prescriptions">
                <Card>
                  <Card.Body>
                    <h4>Đơn Thuốc</h4>
                    <p>Lịch sử đơn thuốc đã kê</p>
                    
                    {/* Additional prescription content would go here */}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>
    </Container>
  )
}

export default PatientMedicalRecord