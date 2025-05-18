import React from 'react'
import { Table, Button, Badge, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

function List({ users, role, setSelected }) {
    const navigate = useNavigate()

    if (!users || users.length === 0) {
        return (
            <Card className="shadow-sm">
                <Card.Body className="text-center py-5">
                    <p className="text-muted">Không có dữ liệu để hiển thị</p>
                </Card.Body>
            </Card>
        )
    }
    
    const handleSelect = (user) => {
        if (role === "patient" && user?.patientId) {
            // Thay vì cập nhật state, chuyển hướng đến trang PatientPrescriptions
            navigate(`/patient-prescriptions/${user.patientId}`, { 
                state: { 
                    patientId: user.patientId, 
                    patientName: user.fullName 
                } 
            })
        } else {
            setSelected({ userId: user.userId })
        }
    }
    
    const getUserBadge = () => {
        if (role === 'doctor') return 'primary'
        else if (role === 'admin') return 'danger'
        else if (role === 'patient') return 'success'
        return 'secondary'
    }
    
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.getFullYear();
    }
    
    return (
        <Card className="shadow-sm">
            <Card.Body>
                <Table hover responsive className="align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '70px' }} className="text-center">ID</th>
                            <th>Tên</th>
                            <th>Năm sinh</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th style={{ width: '100px' }} className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.userId || user.patientId}>
                                <td className="text-center">
                                    <Badge bg={getUserBadge()}>
                                        {user.userId || user.patientId}
                                    </Badge>
                                </td>
                                <td className="fw-medium">{user.fullName}</td>
                                <td>{formatDate(user.dateOfBirth)}</td>
                                <td>{user.email}</td>
                                <td>{user.address || <span className="text-muted fst-italic">Chưa cập nhật</span>}</td>
                                <td>{user.phoneNumber || <span className="text-muted fst-italic">Chưa cập nhật</span>}</td>
                                <td className="text-center">
                                    <Button 
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleSelect(user)}
                                    >
                                        {role === "patient" ? "Toa thuốc" : "Chi tiết"}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    )
}

export default List