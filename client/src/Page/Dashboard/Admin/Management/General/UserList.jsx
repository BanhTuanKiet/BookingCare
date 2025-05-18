import React, { useState, useEffect } from 'react'
import { Container, Card, Button, Spinner, Form, Row, Col, InputGroup, Badge, Alert } from 'react-bootstrap'
import { Search, XCircle, ArrowClockwise } from 'react-bootstrap-icons'
import axios from '../../../../../Util/AxiosConfig'
import List from '../General/List'
import Profile from '../General/Profile'

const UserList = ({ tabActive, userRole }) => {
    const [users, setUsers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    // Format role name for display and API endpoints
    const getRoleTitle = () => {
        switch(userRole) {
            case 'doctor': return 'Bác sĩ'
            case 'admin': return 'Quản trị viên' 
            case 'patient': return 'Bệnh nhân'
            default: return 'Người dùng'
        }
    }

    useEffect(() => {
        if (tabActive !== userRole + "s") return
        fetchUsers()
    }, [tabActive, userRole])

    useEffect(() => {
        const results = users.filter(user => 
            (user.fullName && user.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.phoneNumber && user.phoneNumber.includes(searchTerm))
        )
        setFilteredUsers(results)
    }, [searchTerm, users])

    const fetchUsers = async () => {
        setLoading(true)
        setError(null)

        try {
            let endpoint = `/users/${userRole}`
            
            // Use different endpoint if needed based on role
            if (userRole === "patient") {
                endpoint = '/patients'
            }
            
            const response = await axios.get(endpoint)
            setUsers(response.data)
            setFilteredUsers(response.data)
        } catch (error) {
            console.error(`Failed to fetch ${userRole}s:`, error)
            setError(`Không thể tải danh sách ${getRoleTitle().toLowerCase()}. Vui lòng thử lại sau.`)
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        setSelectedUser(null)
    }

    return (
        <Container fluid className="py-4">
            {selectedUser ? (
                <Profile 
                    userId={selectedUser} 
                    role={userRole}
                    onBack={handleBack}
                />
            ) : (
                <>
                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col xs={12} md={6} className="mb-3 mb-md-0">
                                    <h4 className="mb-0">
                                        <Badge bg="primary" className="me-2">
                                            {filteredUsers.length}
                                        </Badge>
                                        Danh sách {getRoleTitle().toLowerCase()}
                                    </h4>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="d-flex gap-2 justify-content-md-end">
                                        <Button 
                                            variant="outline-secondary" 
                                            onClick={fetchUsers}
                                            disabled={loading}
                                            title="Làm mới dữ liệu"
                                        >
                                            <ArrowClockwise />
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Body>
                            <Row>
                                <Col>
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <Search />
                                        </InputGroup.Text>
                                        <Form.Control
                                            placeholder={`Tìm kiếm ${getRoleTitle().toLowerCase()}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <Button 
                                                variant="outline-secondary" 
                                                onClick={() => setSearchTerm('')}
                                            >
                                                <XCircle />
                                            </Button>
                                        )}
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {error && (
                        <Alert variant="danger" onClose={() => setError(null)} dismissible>
                            {error}
                        </Alert>
                    )}

                    {loading ? (
                        <Card className="shadow-sm">
                            <Card.Body className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Đang tải dữ liệu...</p>
                            </Card.Body>
                        </Card>
                    ) : filteredUsers.length === 0 ? (
                        <Card className="shadow-sm">
                            <Card.Body className="text-center py-5">
                                <p className="text-muted">
                                    {searchTerm 
                                        ? `Không tìm thấy ${getRoleTitle().toLowerCase()} nào phù hợp` 
                                        : `Chưa có ${getRoleTitle().toLowerCase()} nào trong hệ thống`}
                                </p>
                            </Card.Body>
                        </Card>
                    ) : (
                        <List 
                            users={filteredUsers}
                            role={userRole}
                            setSelected={setSelectedUser}
                        />
                    )}
                </>
            )}
        </Container>
    )
}

export default UserList