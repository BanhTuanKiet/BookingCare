import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Modal, Spinner } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'
import { extractDateOnly } from '../../../Util/DateUtils'

const PrescriptionAdmin = () => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)

  const [patientPrescriptions, setPatientPrescriptions] = useState([])
  const [selectedPatientName, setSelectedPatientName] = useState('')
  const [showPatientModal, setShowPatientModal] = useState(false)

  const [showDetailModal, setShowDetailModal] = useState(false)
  const [prescriptionDetail, setPrescriptionDetail] = useState('')

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/medicalrecords/prescriptions/patient')
      setPrescriptions(response.data)
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewPatientPrescriptions = async (patientId, patientName) => {
    try {
      const response = await axios.get(`/medicalrecords/prescriptions/patient/${patientId}`)
      setPatientPrescriptions(response.data)
      setSelectedPatientName(patientName)
      setShowPatientModal(true)
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc bệnh nhân:', err)
    }
  }

  const handleViewDetail = async (recordId) => {
    try {
      const response = await axios.get(`/medicalrecords/details/${recordId}`)
      setPrescriptionDetail(response.data)
      setShowDetailModal(true)
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết đơn thuốc:', err)
    }
  }

  return (
    <Container fluid>
      <h4 className="mb-3">Quản lý đơn thuốc</h4>
      {loading ? (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover>
            <thead>
              <tr>
                <th>Mã đơn thuốc</th>
                <th>Tên bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Chẩn đoán</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map(p => (
                <tr key={p.recordId}>
                  <td>{p.recordId}</td>
                  <td>{p.patientName}</td>
                  <td>{p.doctorName}</td>
                  <td>{p.diagnosis}</td>
                  <td>{extractDateOnly(p.appointmentDate)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleViewPatientPrescriptions(p.patientId, p.patientName)}
                    >
                      Danh sách đơn thuốc của bệnh nhân
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal danh sách đơn thuốc của bệnh nhân */}
      <Modal show={showPatientModal} onHide={() => setShowPatientModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Toa thuốc của {selectedPatientName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table bordered hover>
            <thead>
              <tr>
                <th>Mã toa thuốc</th>
                <th>Chẩn đoán</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {patientPrescriptions.map(p => (
                <tr key={p.recordId}>
                  <td>{p.recordId}</td>
                  <td>{p.diagnosis}</td>
                  <td>{extractDateOnly(p.appointmentDate)}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => handleViewDetail(p.recordId)}>
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      {/* Modal chi tiết đơn thuốc */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: prescriptionDetail }} />
      </Modal>
    </Container>
  )
}

export default PrescriptionAdmin
