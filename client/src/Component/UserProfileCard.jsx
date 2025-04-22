import React, { useState } from "react";
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "../../src/Util/AxiosConfig";

const UserProfileCard = ({ user, setUser, userType = "patient" }) => {
  const [address, setAddress] = useState(user?.address || "");
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split("T")[0] : ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  if (!user) {
    return <div>Không có dữ liệu người dùng.</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
        address: address,
        dateOfBirth: dateOfBirth
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
    <Card className="mb-4">
      <Card.Body>
        <h5 className="text-success mb-4">{cardTitle}</h5>

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
            className="rounded-circle bg-light text-success mx-auto d-flex align-items-center justify-content-center"
            style={{ width: "120px", height: "120px", fontSize: "48px" }}
          >
            {user?.userName?.charAt(0) || "A"}
          </div>
          <h4 className="mt-3">{user?.userName}</h4>
          <p className="text-muted">Mã {userType === "doctor" ? "BS" : "BN"}: {userId}</p>
        </div>

        {!isEditing ? (
          <div className="text-start mt-4">
            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Ngày sinh:
              </Col>
              <Col md={7}>
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN")
                  : "15/05/1985"}
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Giới tính:
              </Col>
              <Col md={7}>{user?.sex || "Nam"}</Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Nhóm máu:
              </Col>
              <Col md={7}>O+</Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Dị ứng:
              </Col>
              <Col md={7}>Penicillin</Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Điện thoại:
              </Col>
              <Col md={7}>{user?.phoneNumber || "Chưa cập nhật"}</Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Địa chỉ:
              </Col>
              <Col md={7}>{user?.address || "123 Đường Lê Lợi, Quận 1, TP.HCM"}</Col>
            </Row>

            <Row className="mb-2">
              <Col md={5} className="text-muted">
                Liên hệ khẩn cấp:
              </Col>
              <Col md={7}>Nguyễn Thị B - 0909876543</Col>
            </Row>
            
            {/* Nút chỉnh sửa đã chuyển xuống đây */}
            <div className="d-flex justify-content-center mt-4">
              <Button variant="outline-success" onClick={handleEditToggle}>
                Chỉnh sửa
              </Button>
              {/* Sau này bạn có thể thêm nút đăng xuất ở đây */}
              {/* <Button variant="outline-danger" className="ms-2">
                Đăng xuất
              </Button> */}
            </div>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={5} className="text-muted">
                Họ và Tên:
              </Form.Label>
              <Col md={7}>
                <Form.Control plaintext readOnly defaultValue={user.userName || "Chưa cập nhật"} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={5} className="text-muted">
                Email:
              </Form.Label>
              <Col md={7}>
                <Form.Control plaintext readOnly defaultValue={user.email || "Chưa cập nhật"} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={5} className="text-muted">
                Số điện thoại:
              </Form.Label>
              <Col md={7}>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={user.phoneNumber || "Chưa cập nhật"}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={5} className="text-muted">
                Địa chỉ:
              </Form.Label>
              <Col md={7}>
                <Form.Control
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ của bạn"
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
              <Form.Label column md={5} className="text-muted">
                Ngày sinh:
              </Form.Label>
              <Col md={7}>
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
                {loading ? "Đang cập nhật..." : "Lưu thông tin"}
              </Button>
            </div>
          </Form>
        )}
      </Card.Body>
    </Card>
  );
};

export default UserProfileCard;