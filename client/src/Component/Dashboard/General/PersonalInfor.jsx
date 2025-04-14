import React from "react"
import { Card, Row, Col } from "react-bootstrap"

const PersonalInfo = ({ user }) => {
  if (!user) {
    return <div>Không có dữ liệu người dùng.</div>
  }

  return (
    <Card>
      <Card.Header>
        <h5>🧑‍💼 Thông tin cá nhân</h5>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={3}><strong>Họ và Tên:</strong></Col>
          <Col md={9}>{user.userName || "Chưa cập nhật"}</Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}><strong>Email:</strong></Col>
          <Col md={9}>{user.email || "Chưa cập nhật"}</Col>
        </Row>
        <Row className="mb-3">
          <Col md={3}><strong>Số điện thoại:</strong></Col>
          <Col md={9}>{user.phoneNumber || "Chưa cập nhật"}</Col>
        </Row>
      </Card.Body>
    </Card>
  )
}

export default PersonalInfo
