import React, { useEffect, useState } from 'react'
import { Card, Table, Button, Row, Col, Image, Badge, Spinner } from 'react-bootstrap'
import axios from '../../../../../Util/AxiosConfig'

// Helper function to format label text from camelCase or snake_case
function formatLabel(key) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase())
}

function Profile({ userId, role, onBack }) {
    const [keys, setKeys] = useState([])
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            setError(null)
            try {
                let endpoint = `/users/detail/${userId}`
                
                // Use different endpoint if needed based on role
                if (role === "patient" && userId?.patientId) {
                    endpoint = `/patients/${userId.patientId}`
                } else if (userId?.userId) {
                    endpoint = `/users/detail/${userId.userId}`
                }
                
                const response = await axios.get(endpoint)
                setUser(response.data)
            } catch (error) {
                console.error("Error fetching user details:", error)
                setError("Không thể tải thông tin. Vui lòng thử lại sau.")
            } finally {
                setLoading(false)
            }
        }
        
        if (userId) {
            fetchUser()
        }
    }, [userId, role])

    useEffect(() => {
        if (!user) return
        
        // Get all data keys from the user object
        const fields = Object.keys(user)
        
        // Filter out keys we don't want to display
        const filteredFields = fields.filter(
            key =>
                key !== 'password' &&
                !key.toLowerCase().includes('image') &&
                !key.endsWith("Id") &&
                key !== 'role' &&
                user[key] !== null &&  // Filter out null values
                user[key] !== undefined // Filter out undefined values
        )
        
        // Sort fields to group related information together
        const sortedFields = [
            // Personal info first
            ...filteredFields.filter(key => 
                ['fullName', 'dateOfBirth', 'gender'].includes(key)
            ),
            // Contact info next
            ...filteredFields.filter(key => 
                ['email', 'phoneNumber', 'address'].includes(key)
            ),
            // Then professional info for doctors
            ...filteredFields.filter(key => 
                ['specialization', 'qualification', 'experience'].includes(key)
            ),
            // Then any other fields
            ...filteredFields.filter(key => 
                !['fullName', 'dateOfBirth', 'gender', 'email', 'phoneNumber', 'address', 
                'specialization', 'qualification', 'experience'].includes(key)
            )
        ]
        
        setKeys(sortedFields)
    }, [user])

    const getUserImage = () => {
        if (!user) return null
        
        let imageKey = 'profileImage'
        if (role === 'doctor') imageKey = 'doctorImage'
        else if (role === 'patient') imageKey = 'patientImage'
        
        return user[imageKey] || null
    }
    
    const userImage = getUserImage()
    
    const getUserTitle = () => {
        if (role === 'doctor') return 'Bác sĩ'
        else if (role === 'admin') return 'Quản trị viên'
        else if (role === 'patient') return 'Bệnh nhân'
        return 'Người dùng'
    }

    if (loading) {
        return (
            <Card className="shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Đang tải thông tin...</p>
                </Card.Body>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <p className="text-danger">{error}</p>
                    <Button variant="primary" onClick={onBack}>
                        Quay lại danh sách
                    </Button>
                </Card.Body>
            </Card>
        )
    }

    if (!user) {
        return (
            <Card className="shadow-sm mb-4">
                <Card.Body className="text-center py-5">
                    <p>Không tìm thấy thông tin người dùng</p>
                    <Button variant="primary" onClick={onBack}>
                        Quay lại danh sách
                    </Button>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Thông tin {getUserTitle()}</h5>
                <Button variant="light" size="sm" onClick={onBack}>
                    Quay lại danh sách
                </Button>
            </Card.Header>
            <Card.Body>
                <Row>
                    {userImage && (
                        <Col md={3} className="text-center mb-4">
                            <Image 
                                src={userImage} 
                                alt={user.fullName || "User profile"} 
                                roundedCircle 
                                className="mb-3"
                                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                            <h5>{user.fullName}</h5>
                            <Badge bg="primary">{getUserTitle()}</Badge>
                        </Col>
                    )}
                    
                    <Col md={userImage ? 9 : 12}>
                        <Table striped bordered hover responsive>
                            <tbody>
                                {keys.map((key, index) => (
                                    <tr key={index}>
                                        <td className="fw-bold" style={{ width: '30%' }}>
                                            {formatLabel(key)}
                                        </td>
                                        <td>{user[key]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}

export default Profile