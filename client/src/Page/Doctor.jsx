import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Nav } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import DoctorCard from '../Component/DoctorCard';
import axios from '../Util/AxiosConfig';
import '../Style/DoctorPage.css';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy danh sách bác sĩ
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/doctors');
         console.log('Dữ liệu nhận về:', response.data);  // <-- thêm log ở đây
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bác sĩ:', error);
        setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await axios.get('/specialties');
        setSpecialties(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách chuyên khoa:', error);
      }
    };

    fetchDoctors();
    fetchSpecialties();
  }, []);

  // Lọc bác sĩ theo chuyên khoa và từ khóa tìm kiếm
  useEffect(() => {
    let filtered = [...doctors];
    
    // Lọc theo chuyên khoa
    if (activeSpecialty !== 'all') {
      filtered = filtered.filter(doctor => 
        doctor.specialty === activeSpecialty || 
        (doctor.specialties && doctor.specialties.includes(activeSpecialty))
      );
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(doctor => 
        doctor.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doctor.position && doctor.position.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doctor.degree && doctor.degree.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredDoctors(filtered);
  }, [doctors, activeSpecialty, searchTerm]);

  // Xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault();
    // Xử lý tìm kiếm đã được thực hiện trong useEffect
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
            onClick={() => setActiveSpecialty('all')}
          >
            Tất cả
          </Nav.Link>
        </Nav.Item>
        
        {specialties.map((specialty) => (
          <Nav.Item key={specialty.id}>
            <Nav.Link
              className={activeSpecialty === specialty.name ? 'active' : ''}
              onClick={() => setActiveSpecialty(specialty.name)}
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
      ) : error ? (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      ) : (
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Col key={doctor.doctorId} lg={3} md={4} sm={6} className="mb-4">
                <DoctorCard doctor={doctor} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center my-5">
              <h4>Không tìm thấy bác sĩ phù hợp.</h4>
              <p>Vui lòng thử lại với từ khóa hoặc chuyên khoa khác.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Doctor;