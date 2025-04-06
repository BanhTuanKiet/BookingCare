import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();
  
  const HandleAppointment = () => {
    navigate("/đặt lịch khám");
  };

  return (
    <Container className="py-5">
      <Card className="border-0 shadow">
        {/* Header */}
        <Card.Header className="bg-primary text-white text-center py-4">
          <h2 className="fw-bold mb-1">Phòng Khám Đa Khoa X</h2>
          <p className="mb-0">Địa Chỉ Tin Cậy Cho Sức Khỏe Của Bạn</p>
        </Card.Header>
        
        <Card.Body className="px-md-5 py-4">
          {/* Giới thiệu chung */}
          <div className="border-start border-4 border-primary ps-3 mb-4">
            <p className="text-justify">
              Phòng Khám Đa Khoa X là một cơ sở y tế tư nhân, chính thức đi vào hoạt động từ năm 2025, với sứ mệnh mang đến
              dịch vụ khám chữa bệnh chất lượng cao, đáp ứng nhu cầu chăm sóc sức khỏe cho mọi đối tượng.
            </p>
          </div>
          
          {/* Cơ sở vật chất */}
          <div className="mb-4">
            <h4 className="text-primary mb-3">
              <i className="bi bi-building me-2"></i>Cơ Sở Hiện Đại
            </h4>
            <p className="text-justify">
              Phòng khám được thiết kế hiện đại, không gian rộng rãi, thoáng mát với nhiều cây xanh, tạo cảm giác thoải mái
              cho người bệnh. Chúng tôi đầu tư vào hệ thống trang thiết bị y tế tiên tiến, đồng bộ nhằm hỗ trợ tối ưu cho
              quá trình chẩn đoán và điều trị. Mục tiêu của chúng tôi là xây dựng Phòng Khám Đa Khoa X trở thành một địa chỉ
              uy tín, chất lượng, nằm trong top các phòng khám tư nhân hàng đầu tại TP.HCM.
            </p>
          </div>
          
          {/* Quy trình khám bệnh */}
          <div className="mb-4">
            <h4 className="text-primary mb-3">
              <i className="bi bi-check-circle me-2"></i>Tiêu Chuẩn Chất Lượng
            </h4>
            <p className="text-justify">
              Chúng tôi luôn tuân thủ nghiêm ngặt các tiêu chuẩn về vệ sinh môi trường, kiểm soát nhiễm khuẩn chặt chẽ và
              không ngừng cập nhật, ứng dụng các kỹ thuật y khoa tiên tiến nhằm nâng cao hiệu quả điều trị. Đặc biệt, quy
              trình khám bệnh được thực hiện cẩn trọng, khoa học để đảm bảo tính chính xác, hạn chế tối đa sai sót trong chẩn
              đoán.
            </p>
          </div>
          
          {/* Đội ngũ y bác sĩ */}
          <div className="mb-4">
            <h4 className="text-primary mb-3">
              <i className="bi bi-people me-2"></i>Đội Ngũ Chuyên Gia
            </h4>
            <p className="text-justify">
              Đội ngũ y bác sĩ tại Phòng Khám Đa Khoa X là những chuyên gia tận tâm, giàu kinh nghiệm, được đào tạo bài bản.
              Bên cạnh đó, chúng tôi còn hợp tác chặt chẽ với các bác sĩ đầu ngành đến từ những bệnh viện lớn tại TP.HCM như
              Bệnh viện Chợ Rẫy, Bệnh viện Đại học Y Dược TP.HCM... để mang đến chất lượng khám chữa bệnh tốt nhất cho khách
              hàng.
            </p>
          </div>
          
          {/* Sứ mệnh */}
          <div className="mb-4">
            <h4 className="text-primary mb-3">
              <i className="bi bi-heart-pulse me-2"></i>Sứ Mệnh
            </h4>
            <p className="text-justify">
              Sứ mệnh của chúng tôi là cung cấp dịch vụ y tế phù hợp cho tất cả mọi người, kể cả những đối tượng có thu nhập
              trung bình và thấp, giúp mọi người tiếp cận được dịch vụ chăm sóc sức khỏe chất lượng cao.
            </p>
          </div>
          
          {/* Khẩu hiệu */}
          <Card className="bg-light border-0 text-center mb-4 py-3">
            <Card.Body>
              <h4 className="text-primary fw-bold">Tận tâm vì sức khỏe cộng đồng!</h4>
            </Card.Body>
          </Card>
          
          {/* Cam kết */}
          <div>
            <p className="text-justify">
              Chúng tôi hiểu rằng chất lượng khám chữa bệnh chính là yếu tố quyết định sự phát triển của phòng khám. Vì vậy,
              toàn thể nhân viên y tế tại Phòng Khám Đa Khoa X luôn đặt người bệnh lên hàng đầu, làm việc với tinh thần trách
              nhiệm cao, cùng nhau xây dựng một thương hiệu uy tín, đáng tin cậy trong lòng khách hàng.
            </p>
          </div>
          
          {/* Đặt lịch khám */}
          <div className="text-center mt-5 pt-4 border-top">
            <div 
              className="appointment bg-primary text-white py-2 fw-bold rounded shadow-sm d-inline-block px-4"
              style={{ cursor: "pointer", transition: "0.3s" }}
              onClick={HandleAppointment}
            >
              Đặt lịch hẹn
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;