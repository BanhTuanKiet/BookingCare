import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Spinner, Form, Row, Col } from 'react-bootstrap'
import axios from '../../../../Util/AxiosConfig'
import { extractDateOnly } from '../../../../Util/DateUtils'
import PatientPrescriptions from './PatientPrescription'

const PrescriptionOverView = ({ tabActive }) => {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    if (!hasSearched) {
      fetchPrescriptions()
    }
  }, [hasSearched, tabActive])

  const fetchPrescriptions = async (keyword = '') => {
    if (tabActive !== "prescriptions") return

    setLoading(true)
    
    try {
      const endpoint = keyword.trim()
        ? `/medicalrecords/search/${keyword.trim()}`
        : '/medicalrecords/prescriptions/patient'

      const response = await axios.get(endpoint)
      setPrescriptions(response.data)
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc:', err)
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchKeyword.trim() !== '') {
      setHasSearched(true)
      fetchPrescriptions(searchKeyword)
    } else {
      setHasSearched(false)
    }
  }

  const handleViewPatientPrescriptions = (patientId, patientName) => {
    setSelectedPatient({ id: patientId, name: patientName })
  }

  const handleBackToOverview = () => {
    setSelectedPatient(null)
  }

  return (
    <Container fluid>
      {selectedPatient ? (
        <PatientPrescriptions
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          goBack={handleBackToOverview}
        />
      ) : (
        <>
          <Form onSubmit={handleSearchSubmit} className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Control
                  type="text"
                  placeholder="Nhập từ khóa (tên bệnh nhân, số điện thoại, email)"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </Col>
              <Col md="auto">
                <Button type="submit" variant="primary">
                  Tìm kiếm
                </Button>
              </Col>
              {hasSearched && (
                <Col md="auto">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchKeyword('');
                      setHasSearched(false);
                    }}
                  >
                    Xóa tìm kiếm
                  </Button>
                </Col>
              )}
            </Row>
          </Form>

          {loading ? (
            <div className="text-center py-3">
              <Spinner animation="border" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table bordered hover>
                <thead>
                  <tr>
                    {/* <th>Mã đơn thuốc</th> */}
                    <th>Tên bệnh nhân</th>
                    <th>Năm sinh</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                    <th>Số điện thoại</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map(p => (
                    <tr key={prescriptions.recordId}>
                      {/* <td>{p.recordId}</td> */}
                      <td>{p.patient.userName}</td>
                      <td>{extractDateOnly(p.patient.dateOfBirth)}</td>
                      <td>{p.patient.email}</td>
                      <td>{p.patient.address}</td>
                      <td>{p.patient.phoneNumber}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          onClick={() => handleViewPatientPrescriptions(p.patient.patientId, p.patient.userName)}
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
        </>
      )}
    </Container>
  );
};

export default PrescriptionOverView;
