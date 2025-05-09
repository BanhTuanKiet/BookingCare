import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from '../../../Util/AxiosConfig';
import { extractDateOnly } from '../../../Util/DateUtils';
import PatientPrescriptions from './PatientPrescription'; // đảm bảo đúng path

const PrescriptionOverView = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null); // 👈 thêm state mới

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/medicalrecords/prescriptions/patient');
      setPrescriptions(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy đơn thuốc:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatientPrescriptions = (patientId, patientName) => {
    setSelectedPatient({ id: patientId, name: patientName }); // 👈 set khi nhấn xem chi tiết
  };

  const handleBackToOverview = () => {
    setSelectedPatient(null); // 👈 quay lại danh sách tổng quan
  };

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
        </>
      )}
    </Container>
  );
};


export default PrescriptionOverView;