import { useState } from "react";
import { Row, Col, Pagination } from "react-bootstrap";
import ServiceCard from "./ServiceCard";

const itemsPerPage = 6; // Số lượng service mỗi trang

const ServiceList = ({ services }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  // Lấy dữ liệu dịch vụ cho trang hiện tại
  const indexOfLastService = currentPage * itemsPerPage;
  const indexOfFirstService = indexOfLastService - itemsPerPage;
  const currentServices = services.slice(indexOfFirstService, indexOfLastService);

  return (
    <div>
      <Row className="service-list justify-content-between0">
        {currentServices.map((service) => (
          <Col key={service.id} xs={12} sm={6} md={4} className="mb-4">
            <ServiceCard service={service} />
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item 
            key={index + 1} 
            active={index + 1 === currentPage} 
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default ServiceList