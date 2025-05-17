import React, { useState, useEffect } from 'react'
import { Container, Table, Button, Spinner, Form, Row, Col } from 'react-bootstrap'
import axios from '../../../../../Util/AxiosConfig'
import PatientPrescriptions from './PatientPrescription'
import List from '../General/List'

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
        : `/users/${"patient"}`

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

  const handleBackToOverview = () => {
    setSelectedPatient(null)
  }

  return (
    <Container fluid className='py-4'>
      {selectedPatient ? (
        <PatientPrescriptions
          patientId={selectedPatient.patientId}
          patientName={selectedPatient.fullName}
          goBack={handleBackToOverview}
        />
      ) : (
        <>
          <Form onSubmit={handleSearchSubmit} className="mb-3">
            <Row >
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
            <List users={prescriptions} role={"patient"} setselected={setSelectedPatient} />
          )}
        </>
      )}
    </Container>
  );
};

export default PrescriptionOverView;