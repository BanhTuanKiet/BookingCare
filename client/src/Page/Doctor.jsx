import React, { useState, useEffect, useContext } from 'react'
import { Container, Form, InputGroup, Button, Nav } from 'react-bootstrap'
import { FaSearch } from 'react-icons/fa'
import { DoctorCard } from '../Component/Card/Index'
import axios from '../Util/AxiosConfig'
import Loading from '../Component/Loading'
import '../Style/DoctorPage.css'
import { NavContext } from '../Context/NavContext'

const Doctor = () => {
  const { specialties } = useContext(NavContext)
  const [doctors, setDoctors] = useState([])
  const [activeSpecialty, setActiveSpecialty] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const indexOfLastDoctor = currentPage * itemsPerPage
  const indexOfFirstDoctor = indexOfLastDoctor - itemsPerPage
  const currentDoctors = doctors.slice(indexOfFirstDoctor, indexOfLastDoctor)
  const totalPages = Math.ceil(doctors.length / itemsPerPage)

  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/doctors', { withCredentials: true })
      const filteredDoctors = response.data.filter(doctor => doctor.doctorId)
      setDoctors(filteredDoctors)
      setCurrentPage(1)
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
        await fetchDoctors()
        return
      }
      const response = await axios.get(`/doctors/${specialty}`)
      setDoctors(response.data)
      setCurrentPage(1)
    } catch (error) {
      console.error('Lỗi lọc theo chuyên khoa:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      if (!searchTerm.trim()) {
        handleSpecialtyFilter(activeSpecialty)
        return
      }
      const response = await axios.get(`/doctors/search?keyword=${searchTerm}`)
      const filteredDoctors = response.data.filter(doctor => doctor.doctorId)
      setDoctors(filteredDoctors)
      setCurrentPage(1)
    } catch (error) {
      console.error('Lỗi tìm kiếm:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0)
  }

  return (
    <Container className="py-5 doctor-section">
      <h1 className="text-center text-primary mb-5">Đội ngũ bác sĩ</h1>

      <div className="search-container mb-4">
        <Form onSubmit={handleSearch}>
          <InputGroup className="shadow-sm rounded-pill overflow-hidden">
            <InputGroup.Text className="bg-white border-end-0">
              <FaSearch className="text-muted" />
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm bác sĩ theo tên, chức vụ..."
              className="border-start-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Form>
      </div>

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

      {loading ? (
        <Loading text="Đang tải danh sách bác sĩ..." />
      ) : (
        <>
          <div className="doctor-grid mx-auto" style={{ width: "85%" }}>
            {currentDoctors.length > 0 ? (
              currentDoctors.map(doctor => (
                <div key={doctor.doctorId} className="doctor-grid-item">
                  <DoctorCard doctor={doctor} />
                </div>
              ))
            ) : (
              <div className="text-center my-5 w-100">
                <h5>Không tìm thấy bác sĩ phù hợp!</h5>
              </div>
            )}
          </div>

          {doctors.length > itemsPerPage && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  {[...Array(totalPages).keys()].map(number => (
                    <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(number + 1)}>
                        {number + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </Container>
  )
}

export default Doctor
