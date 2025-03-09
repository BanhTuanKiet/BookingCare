import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-4 mt-5 text-start">
      <Container>
        <Row>
          {/* Giới thiệu */}
          <Col md={4} className="mb-3">
            <h5 className="text-primary fw-bold">Phòng Khám Đa Khoa XYZ</h5>
            <p className="small w-75">
              Chúng tôi cam kết cung cấp dịch vụ y tế chất lượng cao với đội ngũ bác sĩ tận tâm và giàu kinh nghiệm.
            </p>
          </Col>

          {/* Liên kết nhanh */}
          <Col md={4} className="mb-3">
            <h5 className="text-primary fw-bold">Liên kết nhanh</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-dark text-decoration-none hover:text-primary">Trang chủ</Link></li>
              <li><Link to="/about" className="text-dark text-decoration-none hover:text-primary">Giới thiệu</Link></li>
              <li><Link to="/team" className="text-dark text-decoration-none hover:text-primary">Đội ngũ bác sĩ</Link></li>
              <li><Link to="/specialty" className="text-dark text-decoration-none hover:text-primary">Chuyên khoa</Link></li>
              <li><Link to="/news" className="text-dark text-decoration-none hover:text-primary">Tin tức</Link></li>
              <li><Link to="/appointment" className="text-dark text-decoration-none hover:text-primary">Đặt lịch khám</Link></li>
              <li><Link to="/contact" className="text-dark text-decoration-none hover:text-primary">Liên hệ</Link></li>
            </ul>
          </Col>

          {/* Liên hệ */}
          <Col md={4} className="mb-3">
            <h5 className="text-primary fw-bold">Liên hệ</h5>
            <p><FaMapMarkerAlt className="text-primary me-2" /> 123 Đường ABC, Quận 1, TP.HCM</p>
            <p><FaPhoneAlt className="text-primary me-2" /> 0123 456 789</p>
            <p><FaEnvelope className="text-primary me-2" /> contact@clinicxyz.com</p>
          </Col>
        </Row>

        <hr />

        {/* Bản quyền */}
        <div className="small">
          &copy; 2025 Phòng Khám Đa Khoa XYZ. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
