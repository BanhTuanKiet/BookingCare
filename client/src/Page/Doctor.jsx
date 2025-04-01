import React, { useState, useEffect, useContext } from 'react'
import { Container, Row, Col, Form, InputGroup, Button, Nav } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import DoctorCard from '../Component/DoctorCard'
import axios from '../Util/AxiosConfig'
import Loading from '../Component/Loading'
import { NavContext } from '../Context/NavContext'
import '../Style/DoctorPage.css'

const Doctor = () => {
  const { specialties } = useContext(NavContext)
  const [doctors, setDoctors] = useState([])
  const [activeSpecialty, setActiveSpecialty] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
    setActiveSpecialty('all')
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/doctors')
      setDoctors(response.data)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bác sĩ:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSpecialtyFilter = async (specialty) => {
    setActiveSpecialty(specialty)
    setLoading(true)
    try {
      if (specialty === 'all') {
        fetchDoctors()
        return
      }
      const response = await axios.get(`/doctors/${specialty}`)
      setDoctors(response.data)
    } catch (error) {
      console.error('Lỗi lọc theo chuyên khoa:', error)
    } finally {
      setLoading(false)
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!searchTerm.trim()) {
        handleSpecialtyFilter(activeSpecialty)
        return;
      }
      const response = await axios.get(`/doctors/search?keyword=${searchTerm}`)
      setDoctors(response.data)
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="doctor-page py-5">
      <Container className='w-75'>
        <Row>
          {/* Cột bên phải: Bộ lọc và tìm kiếm */}
          <Col md={3} className="mb-4">
            <Form onSubmit={handleSearch} className="mb-3">
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
            <Nav className="flex-column specialty-nav">
              <Nav.Link
                className={activeSpecialty === 'all' ? 'active' : ''}
                onClick={() => handleSpecialtyFilter('all')}
              >
                Tất cả
              </Nav.Link>
              {specialties.map((specialty) => (
                <Nav.Link
                  key={specialty.id}
                  className={activeSpecialty === specialty.name ? 'active' : ''}
                  onClick={() => handleSpecialtyFilter(specialty.name)}
                >
                  {specialty.name}
                </Nav.Link>
              ))}
            </Nav>
          </Col>

          {/* Cột bên trái: Danh sách bác sĩ */}
          <Col md={9}>
            {loading ? (
              <Loading text="Đang tải danh sách bác sĩ..." />
            ) : (
              <Row className="d-flex flex-wrap g-1">
                <h1 className="text-center text-primary mb-4">Đội ngũ bác sĩ</h1>
                {doctors.length > 0 ? (
                  doctors.map(doctor => (
                    <Col key={doctor.doctorId} lg={6} className="mb-4 d-flex justify-content-center">
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
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Doctor
