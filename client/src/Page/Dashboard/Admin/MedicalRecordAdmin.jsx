import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Spinner, Row, Col, Pagination, Modal } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';
import PrescriptionCard from '../../../Component/Card/PrescriptionCard';

const MedicalRecordAdmin = () => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(medicalRecords.length / itemsPerPage);
  const currentRecords = medicalRecords.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách đơn thuốc
      const response = await axios.get('/medicalRecords/all');
      console.log(response)
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách đơn thuốc:', error);
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const searchMedicalRecords = async (keyword) => {
    setLoading(true);
    try {
      const response = await axios.get(`/medicalRecords/search?keyword=${keyword}`);
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Lỗi tìm kiếm đơn thuốc:', error);
      setMedicalRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/medicalRecords/patient/${patientId}`);
      setPatientRecords(response.data);
      setSelectedPatient({
        id: patientId,
        name: currentRecords.find(record => record.patientId === patientId)?.patientName || 'Bệnh nhân'
      });
    } catch (error) {
      console.error('Lỗi lấy đơn thuốc của bệnh nhân:', error);
      setPatientRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecordDetail = async (recordId) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`/medicalRecords/detail/${recordId}`);
      setMedicineDetails(response.data);
      setSelectedRecordId(recordId);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Lỗi lấy chi tiết đơn thuốc:', error);
      setMedicineDetails([]);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchText('');
    setCurrentPage(0);
    
    if (searchVisible) {
      fetchMedicalRecords();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    
    if (searchText.trim()) {
      searchMedicalRecords(searchText);
    } else {
      fetchMedicalRecords();
    }
  };

  const handleViewPatientRecords = (patientId) => {
    fetchPatientRecords(patientId);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  const handleViewDetail = (recordId) => {
    fetchRecordDetail(recordId);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (selectedPatient) {
    return (
      <Container fluid>
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <div>
              <h4>Đơn thuốc của bệnh nhân: {selectedPatient.name}</h4>
              <p className="text-muted">Danh sách đơn thuốc đã kê cho bệnh nhân</p>
            </div>
            <Button variant="outline-secondary" onClick={handleBackToList}>
              &larr; Quay lại danh sách
            </Button>
          </Col>
        </Row>

        <Row>
          {patientRecords.length === 0 ? (
            <Col className="text-center py-5">
              <p>Không có đơn thuốc nào trong hồ sơ</p>
            </Col>
          ) : (
            patientRecords.map((record) => (
              <Col md={6} lg={4} key={record.id} className="mb-4">
                <PrescriptionCard 
                  prescription={record} 
                  onClick={() => handleViewDetail(record.id)} 
                />
              </Col>
            ))
          )}
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col className="d-flex justify-content-between">
          <h4>Danh sách đơn thuốc</h4>
          <Button variant="outline-primary" onClick={handleSearchToggle}>
            {searchVisible ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
          </Button>
        </Col>
      </Row>

      {searchVisible && (
        <Row className="mb-3">
          <Col md={6}>
            <Form onSubmit={handleSearch} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nhập tên bệnh nhân hoặc bác sĩ..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" variant="primary">Tìm</Button>
            </Form>
          </Col>
        </Row>
      )}

      <div className="table-responsive">
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Mã đơn</th>
              <th>Bệnh nhân</th>
              <th>Bác sĩ</th>
              <th>Ngày kê</th>
              <th>Chẩn đoán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">Không tìm thấy đơn thuốc nào</td>
              </tr>
            ) : (
              currentRecords.map((record, index) => (
                <tr key={record.recordId}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>ĐT-{record.recordId}</td>
                  <td>{record.patientName || 'N/A'}</td>
                  <td>{record.doctorName || 'N/A'}</td>
                  <td>{new Date(record.appointmentDate).toLocaleDateString('vi-VN')}</td>
                  <td>{record.diagnosis || 'N/A'}</td>
                  <td>
                    <Button 
                      variant="outline-info" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleViewDetail(record.recordId)}
                    >
                      Chi tiết
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => handleViewPatientRecords(record.patientId)}
                    >
                      Xem tất cả
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Row>
          <Col className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
              <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0} />
              {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index === currentPage}
                  onClick={() => setCurrentPage(index)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} />
              <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
            </Pagination>
          </Col>
        </Row>
      )}

      {/* Modal chi tiết đơn thuốc */}
      <Modal show={showDetailModal} onHide={handleCloseDetailModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn thuốc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetails ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </Spinner>
            </div>
          ) : (
            <>
              <h5 className="mb-3">Danh sách thuốc</h5>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên thuốc</th>
                    <th>Liều lượng</th>
                    <th>Số lượng</th>
                    <th>Tần suất/ngày</th>
                    <th>Thời gian (ngày)</th>
                    <th>Cách dùng</th>
                  </tr>
                </thead>
                <tbody>
                  {medicineDetails.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    medicineDetails.map((medicine, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{medicine.medicineName}</td>
                        <td>{medicine.dosage}</td>
                        <td>{medicine.quantity}</td>
                        <td>{medicine.frequencyPerDay}</td>
                        <td>{medicine.durationInDays}</td>
                        <td>{medicine.usage}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MedicalRecordAdmin;