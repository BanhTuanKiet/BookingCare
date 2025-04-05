import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, InputGroup, Button, Nav } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import DoctorCard from '../Component/DoctorCard';
import axios from '../Util/AxiosConfig';
import Loading from '../Component/Loading';
import '../Style/DoctorPage.css';
import { NavContext } from '../Context/NavContext';

const Doctor = () => {
  const { specialties } = useContext(NavContext);
  const [doctors, setDoctors] = useState([]);
  const [activeSpecialty, setActiveSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
// cái phần hiển thị loading được thì viết ở componets luôn, không viết thì file nào cũng phải làm -> MỆT LẮM
  // Load all doctors khi mới vào trang
  useEffect(() => {
    fetchDoctors()
  }, [])

  // Hàm lấy danh sách bác sĩ
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/doctors', { withCredentials: true })

      const filteredDoctors = response.data.filter(doctor => doctor.doctorId)
      setDoctors(filteredDoctors)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bác sĩ:', error)
    } finally {
      setLoading(false)
    }
  }

  // Hàm lọc theo chuyên khoa
  const handleSpecialtyFilter = async (specialty) => {
    setActiveSpecialty(specialty)
    setLoading(true)
    try {
// hạn chế if else m có thể return cái fetchDoctors() luôn còn bên dưới không cần lồng else vào
      // Nếu chọn tất cả thì fetch lại tất cả
      if (specialty === 'all') {
        await fetchDoctors() // Gọi luôn, khỏi cần else
        return
      }
        const response = await axios.get(`/doctors/${specialty}`)
//lọc object có id để làm gì trong khi ở server đẫ lấy ra (id là khóa chính nên không thể null)
        setDoctors(response.data)
    } catch (error) {
      console.error('Lỗi lọc theo chuyên khoa:', error)
    } finally {
      setLoading(false)
    }
  }

  // Xử lý tìm kiếm (keyword)
  // dùng settimeout
  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Nếu không có từ khóa thì fetch lại theo chuyên khoa hiện tại
      if (!searchTerm.trim()) {
        handleSpecialtyFilter(activeSpecialty)
        return
      }

      const response = await axios.get(`/doctors/search?keyword=${searchTerm}`)
      console.log(searchTerm)
      console.log('Kết quả tìm kiếm:', response.data)

      const filteredDoctors = response.data.filter(doctor => doctor.doctorId)
      setDoctors(filteredDoctors)
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
    } finally {
      setLoading(false)
    }
  }

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
              onClick={() => handleSpecialtyFilter(specialty.name)}
            >
              {specialty.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      {/* Hiển thị danh sách bác sĩ */}
      {loading ? (
          <Loading text="Đang tải danh sách bác sĩ..." />
      ) : (
        <Row className="d-flex justify-conte g-1">
          {doctors.length > 0 ? (
            doctors.map(doctor => (
              <Col
                key={doctor.doctorId}
                lg={3} md={4} sm={6}
                className="mb-4 d-flex justify-content-center"
                style={{ minHeight: '300px' }} // tuỳ chỉnh thêm để thấy rõ vertical center
              >
                <DoctorCard doctor={doctor} />
              </Col>
            ))
          ) : (
            <div className="text-center my-5 w-100">
              <h5>Không tìm thấy bác sĩ phù hợp!</h5>
            </div>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Doctor;