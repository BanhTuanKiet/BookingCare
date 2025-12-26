import React, { useState, useContext } from "react";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "../../src/Util/AxiosConfig";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const UserProfileCard = ({ user, setUser, userType = "patient" }) => {
  const [address, setAddress] = useState(user?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  if (!user) {
    return <div>Không có dữ liệu người dùng.</div>;
  }

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const formattedDate = dateOfBirth
        ? new Date(dateOfBirth).toISOString().split("T")[0]
        : null;

      await axios.put("/users/update-info", {
        address,
        dateOfBirth: formattedDate
      });

      setUser({
        ...user,
        address,
        dateOfBirth
      });

      setMessage({ text: "Cập nhật thông tin thành công!", type: "success" });
      setIsEditing(false);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      setMessage({
        text: error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin.",
        type: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  const cardTitle = userType === "doctor" ? "Thông Tin Bác Sĩ" : "Thông Tin Bệnh Nhân";
  const userId = userType === "doctor" ? "BS-12345" : "BN-12345";

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h5 className="text-success mb-4 text-center border-bottom pb-2">{cardTitle}</h5>

        {message.text && (
          <Alert
            variant={message.type}
            dismissible
            onClose={() => setMessage({ text: "", type: "" })}
          >
            {message.text}
          </Alert>
        )}

        <div className="text-center mb-4">
          <div
            className="rounded-circle bg-light text-success mx-auto d-flex align-items-center justify-content-center shadow"
            style={{
              width: "120px",
              height: "120px",
              fontSize: "48px",
              fontWeight: "bold",
              border: "3px solid #28a745"
            }}
          >
            {user?.userName?.charAt(0) || "A"}
          </div>
          <h4 className="mt-3">{user?.userName}</h4>
          <p className="text-muted">Mã {userType === "doctor" ? "BS" : "BN"}: {userId}</p>
        </div>

        {!isEditing ? (
          <div className="text-start mt-4">
            <Row className="mb-2">
              <Col xs={5} md={4} className="fw-semibold text-muted">
                Ngày sinh:
              </Col>
              <Col xs={7} md={8}>
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col xs={5} md={4} className="fw-semibold text-muted">
                Email: 
              </Col>
              <Col xs={7} md={8}>{user?.email || "Chưa cập nhật"}</Col>
            </Row>

            <Row className="mb-2">
              <Col xs={5} md={4} className="fw-semibold text-muted">
                Điện thoại:
              </Col>
              <Col xs={7} md={8}>{user?.phoneNumber || "Chưa cập nhật"}</Col>
            </Row>

            <Row className="mb-2">
              <Col xs={5} md={4} className="fw-semibold text-muted">
                Địa chỉ:
              </Col>
              <Col xs={7} md={8}>{user?.address || "Chưa cập nhật"}</Col>
            </Row>

            <Row className="mb-2">
              <Col xs={5} md={4} className="fw-semibold text-muted">
                Liên hệ khẩn cấp:
              </Col>
              <Col xs={7} md={8}>Nguyễn Thị B - 0909876543</Col>
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Button variant="outline-success" onClick={handleEditToggle}>
                ✏️ Chỉnh sửa
              </Button> 
              <Button variant="outline-danger" className="ms-2" onClick={handleLogout} data-testid="logout-btn" name="logout"> 
                🚪 Đăng xuất
              </Button>
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={4} className="text-muted">
                Họ và Tên:
              </Form.Label>
              <Col md={8}>
                <Form.Control plaintext readOnly defaultValue={user.userName || "Chưa cập nhật"} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={4} className="text-muted">
                Email:
              </Form.Label>
              <Col md={8}>
                <Form.Control plaintext readOnly defaultValue={user.email || "Chưa cập nhật"} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={4} className="text-muted">
                Số điện thoại:
              </Form.Label>
              <Col md={8}>
                <Form.Control plaintext readOnly defaultValue={user.phoneNumber || "Chưa cập nhật"} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={4} className="text-muted">
                Địa chỉ:
              </Form.Label>
              <Col md={8}>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={4} className="text-muted">
                Ngày sinh:
              </Form.Label>
              <Col md={8}>
                <Form.Control
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </Col>
            </Form.Group>

            <div className="d-flex justify-content-center mt-4">
              <Button variant="secondary" className="me-2" onClick={handleEditToggle}>
                Hủy
              </Button>
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Đang cập nhật...
                  </>
                ) : (
                  "Lưu thông tin"
                )}
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfileCard;
