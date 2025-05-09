import React, { useEffect, useState } from 'react';
import axios from '../../../Util/AxiosConfig';
import { Card, Modal, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../../Component/Card/ServiceCard';

const DepartmentRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ratingsRes, specialtiesRes, doctorsRes] = await Promise.all([
          axios.get('/reviews/doctors-rating'),
          axios.get('/specialties'),
          axios.get('/doctors'),
        ]);

        setRatings(ratingsRes.data);
        setSpecialties(specialtiesRes.data);
        setDoctors(doctorsRes.data);

        if (specialtiesRes.data.length > 0) {
          setSelectedSpecialtyId(specialtiesRes.data[0].specialtyId);
        }
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const selected = specialties.find(s => s.specialtyId === selectedSpecialtyId);
        if (selected) {
          const res = await axios.get(`/services/${selected.name}/services`);
          setServices(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
        setServices([]);
      }
    };

    if (selectedSpecialtyId !== null) {
      fetchServices();
    }
  }, [selectedSpecialtyId, specialties]);

  const getDoctorsByDepartment = (specialtyId) => {
    return doctors.filter(doc => doc.specialtyId === specialtyId);
  };

  const findHeadDoctor = (doctorsInDept) => {
    return doctorsInDept.find((doc) => {
      const position = doc?.position?.toLowerCase() || '';
      return /trưởng khoa|trưởng đơn vị|trưởng/i.test(position);
    });
  };

  const handleViewDetails = (doctor, event) => {
    event.stopPropagation();
    setSelectedDoctor(doctor);
  };

  const handleCardClick = (doctor) => {
    navigate(`/bac-si/${doctor.userName}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="mb-3 text-primary">Đánh giá các khoa và bác sĩ tiêu biểu</h2>

      <div className="mb-4">
        <select
          className="form-select w-auto"
          value={selectedSpecialtyId || ''}
          onChange={(e) => setSelectedSpecialtyId(parseInt(e.target.value))}
        >
          {specialties.map((s) => {
            const doctorCount = doctors.filter(d => d.specialtyId === s.specialtyId).length;
            return (
              <option key={s.specialtyId} value={s.specialtyId}>
                {s.name} ({doctorCount})
              </option>
            );
          })}
        </select>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        specialties
          .filter(s => s.specialtyId === selectedSpecialtyId)
          .map((specialty) => {
            const deptDoctors = getDoctorsByDepartment(specialty.specialtyId);
            const headDoctor = findHeadDoctor(deptDoctors);
            const topDoctors =
              ratings.find(r => r.departmentName === specialty.name)?.topDoctors || [];

            return (
              <div key={specialty.specialtyId} className="mb-5">
                <h4 className="text-success mb-3">{specialty.name}</h4>

                {headDoctor && (
                  <div className="mb-3">
                    <h5 className="text-info">👨‍⚕️ Trưởng khoa</h5>
                    <Card
                          className="text-center shadow-sm"
                          style={{ width: '210px', height: '350px' }}
                        >
                          <Card.Img
                            variant="top"
                            src={
                              headDoctor.doctorImage
                                ? headDoctor.doctorImage.startsWith('data:image')
                                  ? headDoctor.doctorImage
                                  : `data:image/png;base64,${headDoctor.doctorImage}`
                                : 'https://via.placeholder.com/300x400?text=Bác+sĩ'
                            }
                            alt={headDoctor.userName}
                            className="mx-auto mt-3"
                            style={{
                              objectFit: 'cover',
                              width: '120px',
                              height: '120px',
                              borderRadius: '50%',
                            }}
                          />
                          <Card.Body className="d-flex flex-column justify-content-between pb-3 px-2">
                            <div>
                              <Card.Title className="fw-bold text-primary mb-2 fs-6">
                                {headDoctor.degree} {headDoctor.userName}
                              </Card.Title>
                              <Card.Subtitle
                                className="text-muted fst-italic mb-2"
                                style={{ fontSize: '14px' }}
                              >
                                {headDoctor.position}
                              </Card.Subtitle>
                              <Card.Text className="small text-dark mb-2">
                                {headDoctor.experienceYears} năm kinh nghiệm
                              </Card.Text>
                              <Card.Text className="fw-semibold text-warning mb-2">
                                ⭐ {headDoctor.overallAverage}
                              </Card.Text>
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={(e) => handleViewDetails(headDoctor, e)}
                              className="mt-auto"
                            >
                              Xem chi tiết
                            </Button>
                          </Card.Body>
                        </Card>
                  </div>
                )}

                <h5 className="text-secondary mb-3">⭐ Bác sĩ tiêu biểu</h5>
                <div className="d-flex flex-wrap gap-3">
                  {topDoctors.length > 0 ? (
                    topDoctors.map((doctor, i) => (
                      <div
                        key={i}
                        onClick={() => handleCardClick(doctor)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Card
                          className="text-center shadow-sm"
                          style={{ width: '210px', height: '350px' }}
                        >
                          <Card.Img
                            variant="top"
                            src={
                              doctor.doctorImage
                                ? doctor.doctorImage.startsWith('data:image')
                                  ? doctor.doctorImage
                                  : `data:image/png;base64,${doctor.doctorImage}`
                                : 'https://via.placeholder.com/300x400?text=Bác+sĩ'
                            }
                            alt={doctor.userName}
                            className="mx-auto mt-3"
                            style={{
                              objectFit: 'cover',
                              width: '120px',
                              height: '120px',
                              borderRadius: '50%',
                            }}
                          />
                          <Card.Body className="d-flex flex-column justify-content-between pb-3 px-2">
                            <div>
                              <Card.Title className="fw-bold text-primary mb-2 fs-6">
                                {doctor.degree} {doctor.userName}
                              </Card.Title>
                              <Card.Subtitle
                                className="text-muted fst-italic mb-2"
                                style={{ fontSize: '14px' }}
                              >
                                {doctor.position}
                              </Card.Subtitle>
                              <Card.Text className="small text-dark mb-2">
                                {doctor.experienceYears} năm kinh nghiệm
                              </Card.Text>
                              <Card.Text className="fw-semibold text-warning mb-2">
                                ⭐ {doctor.overallAverage}
                              </Card.Text>
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={(e) => handleViewDetails(doctor, e)}
                              className="mt-auto"
                            >
                              Xem chi tiết
                            </Button>
                          </Card.Body>
                        </Card>
                      </div>
                    ))
                  ) : (
                    <p>Không có bác sĩ nào</p>
                  )}
                </div>

                {services.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-secondary mb-3">🛠️ Dịch vụ</h5>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                      {services.map((service) => (
                        <Col key={service.id}>
                          <ServiceCard service={service} />
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            );
          })
      )}

      {selectedDoctor && (
        <Modal show onHide={() => setSelectedDoctor(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Chi tiết đánh giá của {selectedDoctor.userName}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>⭐ Trung bình:</strong> {selectedDoctor.overallAverage}</p>
            <p><strong>Kiến thức:</strong> {selectedDoctor.avgKnowledge}</p>
            <p><strong>Thái độ:</strong> {selectedDoctor.avgAttitude}</p>
            <p><strong>Tận tâm:</strong> {selectedDoctor.avgDedication}</p>
            <p><strong>Giao tiếp:</strong> {selectedDoctor.avgCommunicationSkill}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedDoctor(null)}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentRatings;
