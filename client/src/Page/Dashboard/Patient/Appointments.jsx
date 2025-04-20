import React, { useEffect, useState } from 'react'
import { Badge, Card, Table } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'

function Appointments({ tabActive }) {
    const [appointments, setAppointments] = useState()

    useEffect(() => {
        const fetchAppointmentInfo = async () => {
            try {
                const response = await axios.post(`appointments/by-patient`)
                setAppointments(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (tabActive === "overview") {
            fetchAppointmentInfo()
        }
    }, [tabActive])

    const handleCancelAppointment = async (appointmentId) => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")
        if (!isConfirmed) return
    
        try {
            await axios.put(`/appointments/cancel/${appointmentId}`)
            // Refresh appointments after cancellation
            const response = await axios.post(`appointments/by-patient`)
            setAppointments(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card>
            <Card.Body>
                <h4>Lịch Hẹn</h4>
                <p>Danh sách các lịch hẹn sắp tới</p>
                <div className="table-responsive">
                    <Table bordered hover>
                        <thead className="table-light">
                            <tr className="text-center">
                                <th>Ngày hẹn</th>
                                <th>Bác sĩ</th>
                                <th>Dịch vụ</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments?.map((appointment) => (
                                <tr key={appointment.appointmentId} className="align-middle text-center">
                                    <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.serviceName}</td>
                                    <td>
                                        <Badge bg={
                                            appointment.status === "Chờ xác nhận" ? "warning"
                                            : appointment.status === "Đã xác nhận" ? "primary"
                                            : appointment.status === "Đã hủy" ? "danger"
                                            : appointment.status === "Đã hoàn thành" ? "success"
                                            : "secondary"
                                        }>
                                            {appointment.status}
                                        </Badge>
                                    </td>
                                    <td>
                                        {(appointment.status !== "Đã hủy" && appointment.status !== "Đã hoàn thành") && (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleCancelAppointment(appointment.appointmentId)}
                                            >
                                                Hủy
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Card.Body>
        </Card>
    )
}

export default Appointments