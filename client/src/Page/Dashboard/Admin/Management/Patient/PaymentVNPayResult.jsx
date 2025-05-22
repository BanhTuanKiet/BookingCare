import { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Card, Alert, Badge } from 'react-bootstrap';
import { CheckCircle, AlertTriangle, Phone, Mail } from 'lucide-react';
import axios from '../../../../../Util/AxiosConfig'; // Thay bằng import thực tế

const PaymentVNPayResult = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const query = window.location.search;
        const res = await axios.get(`/medicalrecords/callback${query}`);
        console.log(res.data);
        setStatus(res.data);
      } catch (error) {
        setStatus("fail_fetch");
      }
    };

    fetchResult();
  }, []);

  const renderTransactionDetails = () => (
    <div className="mb-3">
      <Row className="mb-1">
        <Col xs={6} className="text-muted">Mã tra cứu:</Col>
        <Col xs={6} className="text-end"><strong>{Math.random().toString(36).substring(2, 10).toUpperCase()}</strong></Col>
      </Row>
      <Row>
        <Col xs={6} className="text-muted">Thời gian:</Col>
        <Col xs={6} className="text-end">
          {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN')}
        </Col>
      </Row>
    </div>
  );

  const renderSupportInfo = () => (
    <div className="text-center">
      <div className="mb-2 d-flex justify-content-center gap-4">
        <div className="d-flex align-items-center gap-1 text-primary">
          <Phone size={16} />
          <span>1900.5555.77</span>
        </div>
        <div className="d-flex align-items-center gap-1 text-primary">
          <Mail size={16} />
          <span>hotrovnpay@vnpay.vn</span>
        </div>
      </div>
      <div className="mb-2">
        <Badge bg="primary" className="me-1">Secure</Badge>
        <Badge bg="warning" text="white">SSL</Badge>
      </div>
      <div className="text-muted small">Phát triển bởi VNPAY © 2025</div>
    </div>
  );

  const renderLogo = () => (
    <div className="text-center mb-3">
      <h4>
        <span style={{ color: 'red' }}>VN</span><span style={{ color: '#0d6efd' }}>PAY</span>
      </h4>
    </div>
  );

  const renderContent = () => {
    if (status === "loading") {
      return (
        <Card body className="text-center">
          {renderLogo()}
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Đang xử lý giao dịch...</h5>
          <p className="text-muted small">Vui lòng chờ trong giây lát</p>
        </Card>
      );
    }

    if (status === "success") {
      return (
        <Card body>
          {renderLogo()}
          <div className="text-center mb-3">
            <CheckCircle size={48} color="green" />
            <h5 className="text-success mt-2">Giao dịch thành công</h5>
            <p className="text-muted">Đơn hàng đã được xử lý thành công</p>
          </div>
          {renderTransactionDetails()}
          <hr />
          {renderSupportInfo()}
        </Card>
      );
    }

    if (status === "fail" || status === "fail_fetch") {
      return (
        <Card body>
          {renderLogo()}
          <div className="text-center mb-3">
            <AlertTriangle size={48} color="red" />
            <h5 className="text-danger mt-2">Giao dịch thất bại</h5>
            <p className="text-muted">
              {status === "fail" ? "Đơn hàng không tồn tại hoặc đã được xử lý" : "Không thể kết nối đến máy chủ"}
            </p>
          </div>
          {renderTransactionDetails()}
          <hr />
          {renderSupportInfo()}
        </Card>
      );
    }

    return (
      <Card body>
        {renderLogo()}
        <div className="text-center mb-3">
          <AlertTriangle size={48} color="orange" />
          <h5 className="text-warning mt-2">Kết quả không xác định</h5>
          <p className="text-muted">Trạng thái trả về: <code>{status}</code></p>
        </div>
        {renderTransactionDetails()}
        <hr />
        {renderSupportInfo()}
      </Card>
    );
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentVNPayResult;
