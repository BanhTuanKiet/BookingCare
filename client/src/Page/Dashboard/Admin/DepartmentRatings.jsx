import React, { useEffect, useState } from 'react';
import axios from '../../../Util/AxiosConfig';
import { Card, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DepartmentRatings = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartmentRatings = async () => {
      try {
        const res = await axios.get('/reviews/doctors-rating');
        console.log(res.data);
        setRatings(res.data);
      } catch (error) {
        console.error('Failed to fetch department ratings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentRatings();
  }, []);

  const handleViewDetails = (doctor, event) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài card
    setSelectedDoctor(doctor);
  };

  const handleCardClick = (doctor) => {
    navigate(`/bac-si/${doctor.userName}`);
  };

  const handleClose = () => setSelectedDoctor(null);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 className="mb-4 text-primary">Đánh giá các khoa và bác sĩ tiêu biểu</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        Array.isArray(ratings) && ratings.length > 0 ? (
          ratings.map((dept, index) => (
            <div key={index} className="mb-5">
              <h4 className="text-success mb-3">{dept.departmentName}</h4>
              <div className="d-flex flex-wrap gap-3">
                {Array.isArray(dept.topDoctors) && dept.topDoctors.length > 0 ? (
                  dept.topDoctors.map((doctor, i) => (
                    <div key={i} onClick={() => handleCardClick(doctor)} style={{ cursor: 'pointer' }}>
                      <Card className="text-center shadow-sm" style={{ width: "210px", height: "350px" }}>
                        <Card.Img
                          variant="top"
                          src={
                            doctor.doctorImage
                              ? doctor.doctorImage.startsWith("data:image")
                                ? doctor.doctorImage
                                : `data:image/png;base64,${doctor.doctorImage}`
                              : "https://via.placeholder.com/300x400?text=Bác+sĩ"
                          }
                          alt={doctor.userName}
                          className="mx-auto mt-3"
                          style={{ objectFit: 'cover', width: '120px', height: '120px', borderRadius: '50%' }}
                        />
                        <Card.Body className="d-flex flex-column justify-content-between pb-3 px-2">
                          <div>
                            <Card.Title className="fw-bold text-primary mb-2 fs-6">
                              {doctor.degree} {doctor.userName}
                            </Card.Title>
                            <Card.Subtitle className="text-muted fst-italic mb-2" style={{ fontSize: "14px" }}>
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
            </div>
          ))
        ) : (
          <p>Không có dữ liệu đánh giá</p>
        )
      )}

      {/* Modal chi tiết đánh giá */}
      {selectedDoctor && (
        <Modal show onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết đánh giá của {selectedDoctor.userName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>⭐ Trung bình:</strong> {selectedDoctor.overallAverage}</p>
            <p><strong>Kiến thức:</strong> {selectedDoctor.avgKnowledge}</p>
            <p><strong>Thái độ:</strong> {selectedDoctor.avgAttitude}</p>
            <p><strong>Tận tâm:</strong> {selectedDoctor.avgDedication}</p>
            <p><strong>Giao tiếp:</strong> {selectedDoctor.avgCommunicationSkill}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Đóng</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default DepartmentRatings;
