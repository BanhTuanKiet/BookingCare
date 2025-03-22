import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../Util/AxiosConfig';
import { Container, Row, Col, Card, Spinner, Accordion, Button, Nav } from 'react-bootstrap';

const DoctorDetail = () => {
    const { doctorName } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('intro');
    const navigate = useNavigate();

    const HandleAppointment = () => {
        navigate("/đặt lịch khám");
    };

    useEffect(() => {
        const fetchDoctorDetail = async () => {
            try {
                const response = await axios.get(`/doctors/detail/${doctorName}`);
                setDoctor(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết bác sĩ:", error);
                // Xử lý lỗi trực tiếp tại đây nếu cần thiết
                // Ví dụ: có thể thiết lập doctor thành một đối tượng với thông tin mặc định
                setDoctor(null);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorDetail();
    }, [doctorName]);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="primary" />
                <p>Đang tải thông tin bác sĩ...</p>
            </Container>
        );
    }

    // Kiểm tra tình trạng doctor trực tiếp thay vì sử dụng state error
    if (!doctor) {
        return (
            <Container className="mt-5 text-center">
                <h4>Không tìm thấy thông tin bác sĩ.</h4>
                <Button variant="primary" onClick={() => window.history.back()} className="mt-3">
                    Quay lại
                </Button>
            </Container>
        );
    }

    const qualificationsList = doctor.qualifications
        ? doctor.qualifications.split('$').map(item => item.trim()).filter(Boolean)
        : [];

    const workExperienceList = doctor.workExperience
        ? doctor.workExperience.split('$').map(item => item.trim()).filter(Boolean)
        : [];

    return (
        <Container fluid>
            {/* Top Card with Doctor Info */}
            <Row className="justify-content-center mb-4" style={{ marginTop: '60px' }}>
                <Col md={10}>
                    <Card className="border-0">
                        <Row>
                            <Col md={6}>
                                <h3 className="text-primary fw-bold">{doctor.userName}</h3>
                                <p className="mb-1">{doctor.position || 'Chức vụ đang cập nhật'}</p>

                                <Nav className="flex-column">
                                    <Nav.Link
                                        className={`text-primary border-0 ps-0 ${activeTab === 'intro' ? 'fw-bold' : ''}`}
                                        onClick={() => setActiveTab('intro')}
                                    >
                                    <span className="me-2">—</span>GIỚI THIỆU
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`text-primary border-0 ps-0 ${activeTab === 'specialties' ? 'fw-bold' : ''}`}
                                        onClick={() => setActiveTab('specialties')}
                                    >
                                    <span className="me-2">—</span>CHUYÊN MÔN
                                    </Nav.Link>
                                </Nav>
                            </Col>
                            <Col md={4} className="d-flex justify-content-center">
                                <img
                                    src={doctor.doctorImage 
                                        ? doctor.doctorImage.startsWith('data:image')
                                        ? doctor.doctorImage 
                                        : `data:image/png;base64,${doctor.doctorImage}`
                                        : 'https://via.placeholder.com/200'}
                                    alt={doctor.userName}
                                    style={{ maxHeight: '350px', objectFit: 'cover', borderRadius: '10px' }}
                                    className="img-fluid"
                                />
                            </Col>
                            <Col md={2}>
                                <div className="w-100 text-center">
                                    {/* Nút đặt lịch hẹn */}
                                    <div 
                                        className="appointment bg-primary text-white py-2 fw-bold rounded shadow-sm"
                                        style={{ cursor: "pointer", transition: "0.3s" }} 
                                        onClick={HandleAppointment}
                                    >
                                        Đặt lịch hẹn
                                    </div>

                                    {/* Thông tin phòng khám */}
                                    <div 
                                        className="text-start p-3 mt-3 border rounded shadow-sm" 
                                        style={{ backgroundColor: "#f8f9fa" }}
                                    >
                                        <p className="fw-bold mb-1">📍 Địa chỉ phòng khám</p>
                                        <p className="small text-muted">475A Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh</p>
                                        
                                        {/* Link Google Maps */}
                                        <Link 
                                            to="https://www.google.com/maps/dir//HUTECH,+7+Nguy%E1%BB%85n+Gia+Tr%C3%AD,+Ph%C6%B0%E1%BB%9Dng+25,+B%C3%ACnh+Th%E1%BA%A1nh,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8018525,106.6740191,13z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x31752953ade9f9c9:0x6ad5d15cd48a4f4e!2m2!1d106.7152576!2d10.8018439!3e0?hl=vi-VN&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D" 
                                            target="_blank" 
                                            className="btn btn-link p-0 text-primary fw-bold"
                                        >
                                            Xem bản đồ
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>


            {/* Navigation Tabs */}
            <Row className="justify-content-center">
                <Col md={10}>
                  <Nav className="bg-primary text-center">
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        className={`text-white py-3 ${activeTab === 'intro' ? 'bg-info' : ''}`}
                        onClick={() => setActiveTab('intro')}
                      >
                        GIỚI THIỆU
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="flex-fill">
                      <Nav.Link 
                        className={`text-white py-3 ${activeTab === 'specialties' ? 'bg-info' : ''}`}
                        onClick={() => setActiveTab('specialties')}
                      >
                        CHUYÊN MÔN
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
            </Row>
        
            {/* Content Area with Accordions */}
            <Row className="justify-content-center mt-4">
                <Col md={10}>
                  {activeTab === 'intro' && (
                    <Accordion defaultActiveKey="0" flush>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <span className="bg-primary text-white p-2 rounded me-2">
                              <i className="bi bi-person"></i>
                            </span>
                            <h5 className="text-primary m-0">TIỂU SỬ</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {doctor.biography || 'Đang cập nhật'}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
        
                  {activeTab === 'specialties' && (
                    <Accordion defaultActiveKey="0" flush>
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <span className="bg-primary text-white p-2 rounded me-2">
                              <i className="bi bi-mortarboard"></i>
                            </span>
                            <h5 className="text-primary m-0">BẰNG CẤP</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {qualificationsList.length > 0 ? (
                            <ul>
                              {qualificationsList.map((qual, idx) => (
                                <li key={idx}>{qual}</li>
                              ))}
                            </ul>
                          ) : 'Đang cập nhật'}
                        </Accordion.Body>
                      </Accordion.Item>
                      
                      <Accordion.Item eventKey="1">
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <span className="bg-primary text-white p-2 rounded me-2">
                              <i className="bi bi-briefcase"></i>
                            </span>
                            <h5 className="text-primary m-0">KINH NGHIỆM LÀM VIỆC</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {workExperienceList.length > 0 ? (
                            <ul>
                              {workExperienceList.map((exp, idx) => (
                                <li key={idx}>{exp}</li>
                              ))}
                            </ul>
                          ) : 'Đang cập nhật'}
                        </Accordion.Body>
                      </Accordion.Item>
                      
                      <Accordion.Item eventKey="2">
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <span className="bg-primary text-white p-2 rounded me-2">
                              <i className="bi bi-clock-history"></i>
                            </span>
                            <h5 className="text-primary m-0">KINH NGHIỆM</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {doctor.experienceYears || '0'} năm
                        </Accordion.Body>
                      </Accordion.Item>
                      
                      <Accordion.Item eventKey="3">
                        <Accordion.Header>
                          <div className="d-flex align-items-center">
                            <span className="bg-primary text-white p-2 rounded me-2">
                              <i className="bi bi-person-badge"></i>
                            </span>
                            <h5 className="text-primary m-0">CHỨC VỤ</h5>
                          </div>
                        </Accordion.Header>
                        <Accordion.Body>
                          {doctor.position || 'Đang cập nhật'}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  )}
                </Col>
            </Row>
        
            {/* Back Button */}
            <Row className="justify-content-center mt-4">
                <Col md={10} className="text-end">
                  <Button variant="secondary" onClick={() => window.history.back()}>
                    Quay lại
                  </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default DoctorDetail;