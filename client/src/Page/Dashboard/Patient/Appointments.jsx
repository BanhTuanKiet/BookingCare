import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Table, Modal } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';
import { toast } from 'react-toastify'; // nếu bạn có cài react-toastify

function Appointments({ tabActive }) {
    const [appointments, setAppointments] = useState([]);
    const [quantity, setQuantity] = useState(10);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axios.post(`appointments/by-patient/${quantity}`);
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (tabActive === "appointments") {
            fetchAppointments();
        }
    }, [tabActive, quantity]);

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
            try {
                await axios.put(`/appointments/cancel/${appointmentId}`);
                const response = await axios.post(`appointments/by-patient`);
                setAppointments(response.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handlePaymentClick = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPaymentModal(true);
    };

    const handleCloseModal = () => {
        setShowPaymentModal(false);
        setSelectedAppointment(null);
    };

    const handleSelectVnpay = async (appointmentId) => {
        try {
            const response = await axios.post(`/vnpaypayment/create/${appointmentId}`);
    
            if (response.status === 200 && response.data.paymentUrl) {
                window.location.href = response.data.paymentUrl;
            } else {
                toast.error("Không lấy được URL thanh toán.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi khi tạo thanh toán.");
        }
    };
    

    const handleSelectMomo = async () => {
        if (!selectedAppointment) return;
        try {
            const orderId = new Date().getTime().toString();
            const response = await axios.post('momopayment/create-payment', { orderInfo: "Thanh toán lịch hẹn",});
    
            console.log('Momo payment response:', response.data);  // Log API response
            if (response.data.payUrl) {
                window.location.href = response.data.payUrl;   // Sửa ở đây
            } else {
                alert('Không nhận được URL thanh toán từ Momo.');
            }
        } catch (error) {
            console.error(error, 'Có lỗi khi tạo yêu cầu thanh toán MoMo.');
        }
    };
    

    return (
        <Card>
            <Card.Body>
                <h4>Lịch Hẹn</h4>
                <p>Danh sách các lịch hẹn sắp tới</p>
                <div className="table-responsive">
                    <Table bordered hover>
                        <thead className="table-light text-center">
                            <tr>
                                <th>Ngày hẹn</th>
                                <th>Bác sĩ</th>
                                <th>Dịch vụ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.appointmentId} className="align-middle text-center">
                                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.serviceName}</td>
                                    <td>
                                        <Badge bg={
                                            appointment.status === "Chờ xác nhận" ? "warning" :
                                            appointment.status === "Đã xác nhận" ? "primary" :
                                            appointment.status === "Đã hủy" ? "danger" :
                                            appointment.status === "Đã hoàn thành" ? "success" : "secondary"
                                        }>
                                            {appointment.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {(appointment.status !== "Đã hủy" && appointment.status !== "Đã hoàn thành") && (
                                            <div className="d-flex gap-2 justify-content-center">
                                                <Button size="sm" variant="danger" onClick={() => handleCancelAppointment(appointment.appointmentId)}>
                                                    Hủy
                                                </Button>
                                                <Button size="sm" variant="primary" onClick={() => handlePaymentClick(appointment)}>
                                                    Thanh toán
                                                </Button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
                <div className="text-end mt-3">
                    {appointments.length % 10 === 0 ? (
                        <Button onClick={() => setQuantity(quantity + 10)} variant="outline-primary">Xem thêm</Button>
                    ) : (
                        <Button onClick={() => setQuantity(10)} variant="outline-primary">Thu gọn</Button>
                    )}
                </div>

                {/* Modal chọn phương thức thanh toán */}
                <Modal show={showPaymentModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="text-center">
                    <Button variant="success" className="m-2" onClick={() => handleSelectVnpay(selectedAppointment.appointmentId)}>
                        Thanh toán VNPay
                    </Button>
                        <Button variant="warning" className="m-2" onClick={handleSelectMomo}>
                            Thanh toán MoMo
                        </Button>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    );
}

export default Appointments;
