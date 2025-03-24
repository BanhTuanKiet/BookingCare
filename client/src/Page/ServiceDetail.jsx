import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../Util/AxiosConfig";
import {Container,Row,Col,Card,Spinner,} from "react-bootstrap";
import { BsCircleFill } from "react-icons/bs";
import { BsJournalCheck } from "react-icons/bs";
import { BsFillBuildingsFill } from "react-icons/bs";

const ServiceDetail = () => {
  const { serviceName } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const HandleAppointment = () => {
    navigate("/đặt lịch khám");
  };

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await axios.get(`/services/detail/${serviceName}`);
        console.log("Data của response data là:", response.data)
          setService(response.data);

      } catch (error) {
        console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [serviceName]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Đang tải thông tin dịch vụ...</p>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Thông tin dịch vụ */}
      <Row className="mx-auto py-3 w-75">
        <Col md={12} >
          <Card className="border-0" >
            <Row>
              <Col md={8}>
                <h3 className="text-primary fw-bold">{service.serviceName}</h3>
                <h5 className="text-primary fw-bold pt-3 pb-1"><BsFillBuildingsFill /> Giới thiệu</h5>
                <p className="mb-1">
                  {service.description || "Mô tả đang được cập nhật"}
                </p>
                <h5 className="text-primary fw-bold pt-3 pb-1"><BsJournalCheck /> Thủ tục</h5>
                <div>
                  <p className="mb-1"><BsCircleFill style={{fontSize:"40%", color:"black"}}/> Bước 1: Khách hàng đăng ký dịch vụ tại 
                  Phòng Khám Đa khoa XYZ bằng cách đến trực tiếp phòng khám, hoặc đặt lịch hẹn qua 
                  website http://bookingcare.vn, fanpage Phòng Khám Đa Khoa XYZ.
                </p>
                </div>
                
                <p className="mb-1"><BsCircleFill style={{fontSize:"40%", color:"black"}}/> Bước 2: Bác sĩ hàng đầu sẽ tư vấn và hướng dẫn dịch vụ phù hợp với quý khách hàng.</p>
                <p className="mb-1"><BsCircleFill style={{fontSize:"40%", color:"black"}}/> Bước 3: Khách hàng thực hiện theo hướng dẫn của các chuyên gia hàng đầu tại Phòng Khám Đa Khoa XYZ.
                </p>
                <p className="mb-1"><BsCircleFill style={{fontSize:"40%", color:"black"}}/> Bước 4: Khách hàng nhận kết quả, gặp bác sĩ để được tư vấn và hướng dẫn bước tiếp theo (nếu có).</p>
              </Col>

              <Col md = {2}>
                  <div className="w-10 text-center">
                    {/* Giá dịch vụ */}
                      <div
                        className="text-center p-3 mt-3 border rounded shadow-sm m-2"
                        style={{ backgroundColor: "#f8f9fa" }}
                      >
                        <p className="fw-bold mb-1">💰 Giá dịch vụ</p>
                        <p className="small text-muted">
                          {service.price = `${service.price.toLocaleString()} VNĐ`}
                        </p>
                      </div>

                      <div
                        className="appointment bg-primary text-white py-2 fw-bold rounded shadow-sm m-1"
                        style={{ cursor: "pointer", transition: "0.3s" }}
                        onClick={HandleAppointment}
                      >
                        Đặt lịch hẹn
                      </div>
                  </div>
              </Col>

              {/* Giá và đặt lịch */}
              <Col xs={2}>
                <div className="w-100 text-end">
                  {/* Thông tin phòng khám */}
                    <div 
                      className="text-start p-3 mt-3 border rounded shadow-sm" 
                      style={{ backgroundColor: "#f8f9fa" }}
                    >
                      <p className="fw-bold mb-1">📍 Địa chỉ phòng khám</p>
                      <p className="small text-muted">475A Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh</p>
                                                  
                      {/* Link Google Maps */}
                      <Link 
                        to="https://www.google.com/maps/dir//HUTECH,+7+Nguy%E1%BB%85n+Gia+Tr%C3%AD,+Ph%C6%B0%E1%BB%9Dng+25,+B%C3%ACnh+Th%E1%BA%A1nh,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8018525,106.6740191,13z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x31752953ade9f9c9:0x6ad5d15cd48a4f4e!2m2!1d106.7152576!2d10.8018439!3e0?hl=vi-VN&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D" 
                        target="_blank" 
                        className="btn btn-link p-0 text-primary fw-bold"
                      >
                        Xem bản đồ
                      </Link>
                    </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ServiceDetail;
