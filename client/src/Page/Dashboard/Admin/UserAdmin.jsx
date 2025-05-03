import React, { useState, useEffect } from 'react'
import { Table, Container, Spinner, Button, Modal, Pagination, Row, Col } from 'react-bootstrap'
import axios from '../../../Util/AxiosConfig'

const UserAdmin = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Lỗi khi lấy danh sách người dùng:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedUser(null)
  }

  const startIndex = currentPage * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    )
  }

  return (
    <Container fluid>
      <h4 className="mb-4">Danh Sách Người Dùng</h4>
      <div className="table-responsive">
        <Table bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">Không có người dùng nào</td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{user.userName}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Row>
        <Col className="d-flex justify-content-center mt-3">
          <Pagination>
            <Pagination.First onClick={() => setCurrentPage(0)} disabled={currentPage === 0} />
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0} />
            {Array.from({ length: totalPages }).map((_, index) => (
              <Pagination.Item
                key={index}
                active={index === currentPage}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={currentPage === totalPages - 1} />
            <Pagination.Last onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1} />
          </Pagination>
        </Col>
      </Row>

      {/* Modal Chi tiết */}
      {/* <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Họ và tên:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Số điện thoại:</strong> {selectedUser.phoneNumber}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer> */}
      {/* </Modal> */}
    </Container>
  )
}

export default UserAdmin
