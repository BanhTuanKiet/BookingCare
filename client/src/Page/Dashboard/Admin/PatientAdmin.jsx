import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Spinner, Pagination } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import { extractDateOnly } from '../../../Util/DateUtils'

const PatientAdmin = () => {
  const [patients, setPatients] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [prescriptions, setPrescriptions] = useState([])
  const [prescriptionLoading, setPrescriptionLoading] = useState(false)

  useEffect(() => {
    fetchPatients(currentPage)
  }, [currentPage])

  const fetchPatients = async (page) => {
    setLoading(true)
    try {
      const response = await axios.get(`/patients`)
      setPatients(response.data.data)
      setTotalPages(response.data.totalPages)
    } catch (err) {
      console.error('Lỗi khi lấy danh sách bệnh nhân:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPrescriptions = async (patient) => {
    setSelectedPatient(patient)
    setPrescriptionLoading(true)
    try {
      const response = await axios.get(`/prescriptions/patient/${patient.id}`)
      setPrescriptions(response.data)
      setShowModal(true)
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc:', err)
    } finally {
      setPrescriptionLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedPatient(null)
    setPrescriptions([])
  }

  const renderPagination = () => {
    const items = []
    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
          {page}
        </Pagination.Item>
      )
    }
    return <Pagination>{items}</Pagination>
  }

  return (
    <Container fluid>
      <h4 className="mb-3">Quản lý bệnh nhân</h4>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Mã BN</th>
                  <th>Tên bệnh nhân</th>
                  <th>Email</th>
                  <th>SĐT</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">Không có bệnh nhân nào</td>
                  </tr>
                ) : (
                  patients.map(patient => (
                    <tr key={patient.patientId}>
                      <td>{patient.patientId}</td>
                      <td>{patient.UserName}</td>
                      <td>{patient.email}</td>
                      <td>{patient.phoneNumber}</td>
                      <td>
                        <Button size="sm" variant="info" onClick={() => handleViewPrescriptions(patient)}>
                          Xem tất cả đơn thuốc
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          {renderPagination()}
        </>
      )}

      {/* Modal hiển thị đơn thuốc */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đơn thuốc của {selectedPatient?.fullName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prescriptionLoading ? (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Bác sĩ</th>
                    <th>Bệnh nhân</th>
                    <th>Ngày lập</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Không có đơn thuốc nào</td>
                    </tr>
                  ) : (
                    prescriptions.map(p => (
                      <tr key={p.prescriptionId}>
                        <td>{p.prescriptionId}</td>
                        <td>{p.doctorName}</td>
                        <td>{p.patientName}</td>
                        <td>{extractDateOnly(p.createdAt)}</td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            Xem chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default PatientAdmin
