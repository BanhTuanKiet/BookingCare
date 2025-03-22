import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Nav } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import DoctorCard from '../Component/DoctorCard';
import axios from '../Util/AxiosConfig';
import '../Style/DoctorPage.css';
import { NavContext } from '../Context/NavContext';

const Doctor = () => {
  const { specialties } = useContext(NavContext);

  const [doctors, setDoctors] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all doctors khi mới vào trang
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Hàm lấy danh sách bác sĩ
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/doctors');
      console.log('Dữ liệu bác sĩ:', response.data);

      const filteredDoctors = response.data.filter(doctor => doctor.doctorId);
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bác sĩ:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lọc theo chuyên khoa
  const handleSpecialtyFilter = async (specialty) => {
    setActiveSpecialty(specialty);

    try {
      setLoading(true);

      // Nếu chọn tất cả thì fetch lại tất cả
      if (specialty === 'all') {
        fetchDoctors();
      } else {
        const response = await axios.get(`/doctors/specialty/${specialty}`);
        console.log(`Bác sĩ theo chuyên khoa ${specialty}:`, response.data);

        const filteredDoctors = response.data.filter(doctor => doctor.doctorId);
        setDoctors(filteredDoctors);
      }
    } catch (error) {
      console.error('Lỗi lọc theo chuyên khoa:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý tìm kiếm (keyword)
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Nếu không có từ khóa thì fetch lại theo chuyên khoa hiện tại
      if (!searchTerm.trim()) {
        handleSpecialtyFilter(activeSpecialty);
        return;
      }

      const response = await axios.get(`/doctors/search?keyword=${searchTerm}`);
      console.log('Kết quả tìm kiếm:', response.data);

      const filteredDoctors = response.data.filter(doctor => doctor.doctorId);
      setDoctors(filteredDoctors);
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="doctor-page py-5">
      <h1 className="text-center text-primary mb-5">Đội ngũ bác sĩ</h1>

      {/* Khung tìm kiếm */}
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm bác sĩ theo tên, chức vụ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant="primary">
                <FaSearch />
              </Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {/* Lọc theo chuyên khoa */}
      <Nav className="justify-content-center mb-4 specialty-nav">
        <Nav.Item>
          <Nav.Link
            className={activeSpecialty === 'all' ? 'active' : ''}
            onClick={() => handleSpecialtyFilter('all')}
          >
            Tất cả
          </Nav.Link>
        </Nav.Item>

        {specialties.map((specialty) => (
          <Nav.Item key={specialty.id}>
            <Nav.Link
              className={activeSpecialty === specialty.id ? 'active' : ''}
              onClick={() => handleSpecialtyFilter(specialty.id)}
            >
              {specialty.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Hiển thị danh sách bác sĩ */}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <Row className="justify-content-center g-1">
          {doctors.length > 0 ? (
            doctors.map(doctor => (
              <Col key={doctor.doctorId} lg={3} md={4} sm={6} className="mb-4" >
                <DoctorCard doctor={doctor} />
              </Col>
            ))
          ) : (
            <div className="text-center my-5">
              <h5>Không tìm thấy bác sĩ phù hợp!</h5>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Doctor;
