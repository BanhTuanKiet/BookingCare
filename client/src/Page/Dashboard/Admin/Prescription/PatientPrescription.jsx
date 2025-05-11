import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Card, Row, Col, Modal } from 'react-bootstrap';
import axios from '../../../../Util/AxiosConfig';
import { extractDateOnly } from '../../../../Util/DateUtils';
import PrescriptionCard from '../../../../Component/Card/PrescriptionCard';
import PrescriptionDetail from './PrescriptionDetail';

const PatientPrescriptions = ({ patientId, patientName, goBack }) => {
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  // const [quantity, setQuantity] = useState(10);
  // const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (patientId) {
      fetchPatientPrescriptions();
    }
  }, [patientId]);

  // Check for a selected prescription from sessionStorage
  useEffect(() => {
    const savedPrescriptionId = sessionStorage.getItem("selectedPrescriptionId");
    if (savedPrescriptionId) {
      setSelectedPrescriptionId(savedPrescriptionId);
      // Clear the session storage after retrieving the ID
      sessionStorage.removeItem("selectedPrescriptionId");
    }
  }, []);

  const fetchPatientPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/medicalrecords/prescriptions/patient/${patientId}`);
      console.log(response)
      setPatientPrescriptions(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc bệnh nhân:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrescription = (recordId) => {
    console.log("===> Chọn recordId:", recordId);
    setSelectedPrescriptionId(recordId);
  };

  const handleBackToList = () => {
    setSelectedPrescriptionId(null);
  };

  const handlePaymentClick = (record) => {
    setSelectedRecord(record);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedRecord(null);
  };

  const handleMomoPayment = async () => {
    try {
      const response = await axios.post('/momopayment/create-payment', {
        orderInfo: "Thanh toán đơn thuốc",
        recordId: selectedRecord.recordId,
      });
  
      if (response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        alert("Không nhận được URL thanh toán từ MoMo.");
      }
    } catch (error) {
      console.error('Lỗi khi tạo yêu cầu thanh toán MoMo:', error);
      alert("Có lỗi xảy ra khi tạo thanh toán.");
    }
  };

  const handleVnpayPayment = async () => {
    try {
      const response = await axios.post('/vnpaypayment/create', {
        orderType: "other",
        amount: 10000, // TODO: lấy từ đơn thuốc thực tế
        orderDescription: `Thanh toán đơn thuốc #${selectedRecord.recordId}`,
        name: `Đơn thuốc #${selectedRecord.recordId}`
      });

      if (response.status === 200 && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Không lấy được URL thanh toán.");
      }
    } catch (error) {
      console.error('Lỗi khi tạo yêu cầu thanh toán VNPay:', error);
      alert("Có lỗi xảy ra khi tạo thanh toán.");
    }
  };

  return (
    <Container fluid>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>
          {selectedPrescriptionId
            ? `Chi tiết toa thuốc #${selectedPrescriptionId}`
            : `Toa thuốc của ${patientName}`}
        </h4>
        <div>
          <Button
            variant="outline-secondary"
            size="sm"
            className="me-2"
            onClick={selectedPrescriptionId ? handleBackToList : goBack}
          >
            {selectedPrescriptionId ? 'Quay lại danh sách' : 'Quay lại'}
          </Button>
          {!selectedPrescriptionId && (
            <>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'outline-primary'}
                size="sm"
                className="me-2"
                onClick={() => setViewMode('table')}
              >
                Dạng bảng
              </Button>
              <Button
                variant={viewMode === 'card' ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setViewMode('card')}
              >
                Dạng thẻ
              </Button>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-3">
          <Spinner animation="border" />
        </div>
      ) : selectedPrescriptionId ? (
        <PrescriptionDetail recordId={selectedPrescriptionId} goBack={handleBackToList} />
      ) : patientPrescriptions.length > 0 ? (
        viewMode === 'table' ? (
          <div className="table-responsive">
            <Table bordered hover>
              <thead>
                <tr>
                  <th>Mã toa thuốc</th>
                  <th>Bác sĩ phụ trách</th>
                  <th>Dịch vụ khám</th>
                  <th>Chẩn đoán</th>
                  <th>Ngày tạo</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {patientPrescriptions.map(p => (
                  <tr key={p.recordId}>
                    <td>{p.recordId}</td>
                    <td>{p.doctorName}</td>
                    <td>{p.serviceName}</td>
                    <td>{p.diagnosis}</td>
                    <td>{extractDateOnly(p.appointmentDate)}</td>
                    <td>{p.status}</td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="d-inline-flex align-items-center"
                          onClick={() => handleSelectPrescription(p.recordId)}
                        >
                          Chi tiết
                        </Button>
                        <Button 
                          size="sm" 
                          variant={p.status === "Đã hoàn thành" ? "secondary" : "success"}
                          className="d-inline-flex align-items-center"
                          onClick={() => handlePaymentClick(p)}
                          disabled={p.status === "Đã hoàn thành"}
                        >
                          {p.status === "Đã hoàn thành" ? "Đã thanh toán" : "Thanh toán"}
                        </Button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
            {/* <div className="text-end mt-3">
                                {appointments.length % 10 === 0 ? (
                                    <Button onClick={() => setQuantity(quantity + 10)} variant="outline-primary">Xem thêm</Button>
                                ) : (
                                    <Button onClick={() => setQuantity(10)} variant="outline-primary">Thu gọn</Button>
                                )}
            </div> */}
          </div>
        ) : (
        //   <Row xs={1} md={2} lg={3} className="g-4">
        //     {patientPrescriptions.map(record => (
        //       <Col key={record.recordId}>
        //         <PrescriptionCard
        //           record={record}
        //           tabActive="prescriptions"
        //           isSelected={record.recordId === selectedPrescriptionId}
        //           onSelect={() => handleSelectPrescription(record.recordId)}
        //           onPayment={() => handlePaymentClick(record)}
        //         />
        //       </Col>
        //     ))}
        //   </Row>
        <Card.Body>
            <h4>Đơn Thuốc</h4>
            <p>Lịch sử đơn thuốc đã kê</p>
            
            {patientPrescriptions.map(record => (
                    <PrescriptionCard
                        record={record}
                        tabActive="prescriptions"
                        isSelected={record.recordId === selectedPrescriptionId}
                    />
                ))
            }
        </Card.Body>
        )
      ) : (
        <Card className="text-center p-4">
          <Card.Body>
            <p className="mb-0">Không có đơn thuốc nào trong hồ sơ</p>
          </Card.Body>
        </Card>
      )}

      {/* Modal thanh toán */}
      <Modal show={showPaymentModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-grid gap-3">
            <Button 
              variant="warning" 
              size="lg" 
              onClick={handleMomoPayment}
              className="d-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#ae2070', borderColor: '#ae2070' }}
            >
              <img 
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png" 
                alt="MoMo" 
                style={{ height: '30px', marginRight: '10px' }} 
              />
              Thanh toán qua MoMo
            </Button>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleVnpayPayment}
              className="d-flex align-items-center justify-content-center"
              style={{ backgroundColor: '#0072bc', borderColor: '#0072bc' }}
            >
              <img 
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" 
                alt="VNPay" 
                style={{ height: '30px', marginRight: '10px' }} 
              />
              Thanh toán qua VNPay
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PatientPrescriptions;