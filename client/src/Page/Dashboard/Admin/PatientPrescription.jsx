import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Card, Row, Col } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';
import { extractDateOnly } from '../../../Util/DateUtils';
import PrescriptionCard from '../../../Component/Card/PrescriptionCard';
import PrescriptionDetail from './PrescriptionDetail';

const PatientPrescriptions = ({ patientId, patientName, goBack }) => {
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table');
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

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
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleSelectPrescription(p.recordId)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
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
    </Container>
  );
};

export default PatientPrescriptions;