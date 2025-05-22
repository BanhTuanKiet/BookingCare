import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Table, Spinner } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';
import { formatDateToLocale } from '../../../Util/DateUtils';
import CustomPagination from '../../../Component/CustomPagination';

function Appointments({ tabActive }) {
const [appointments, setAppointments] = useState([]);
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [loading, setLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const pageSize = 10;

useEffect(() => {
    const fetchAppointments = async () => {
        if (tabActive !== "appointments") return;
        setLoading(true);
        try {
            const response = await axios.post(`appointments/by-patient?page=${currentPage}&pageSize=${pageSize}`);
            setAppointments(response.data.appointments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchAppointments();
}, [tabActive, currentPage]);

const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) {
        try {
            setErrorMessage("");
            await axios.put(`/appointments/cancel/${appointmentId}`);
            const response = await axios.post(`appointments/by-patient?page=${currentPage}&pageSize=${pageSize}`);
            setAppointments(response.data.appointments);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.message || "Đã xảy ra lỗi khi hủy lịch hẹn.");
        }
    }
};

return (
    <Card className="mt-4">
        <Card.Header>Lịch hẹn của bạn</Card.Header>
        <Card.Body>
            {loading ? (
                <div className="d-flex justify-content-center"><Spinner animation="border" /></div>
            ) : appointments.length === 0 ? (
                <p className="text-center">Không có lịch hẹn nào.</p>
            ) : (
                <>
                    <Table responsive bordered>
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
                            {appointments.length > 0 ? (
                                appointments.map((appointment) => (
                                    <tr key={appointment.appointmentId} className="align-middle text-center">
                                        <td>{formatDateToLocale(appointment.appointmentDate.toString())  }</td>
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
                                                {(appointment.status !== "Đã hủy" && appointment.status !== "Đã hoàn thành"&& appointment.status !== "Đã khám") && (
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Button size="sm" variant="danger" onClick={() => handleCancelAppointment(appointment.appointmentId)}>
                                                            Hủy
                                                        </Button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-3">
                                            Không có lịch hẹn nào
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                </Table>

                <div className="d-flex justify-content-center">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        loading={loading}
                    />
                </div>
                </>
            )}
            {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </Card.Body>
        </Card>
    );
}

export default Appointments;
