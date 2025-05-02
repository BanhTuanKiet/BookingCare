import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Spinner, Row, Col, Pagination } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 10;
  
  // Không cần lọc trên client nữa vì chúng ta sẽ dùng API để tìm kiếm
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/users');
        console.log(response)
      setUsers(response.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách người dùng:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (keyword) => {
    setLoading(true);
    try {
      // Gọi API search với keyword
      const response = await axios.get(`/users/search?keyword=${keyword}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Lỗi tìm kiếm người dùng:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchText('');
    setCurrentPage(0);
    
    // Nếu đóng tìm kiếm, load lại tất cả users
    if (searchVisible) {
      fetchUsers();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    
    // Nếu có text tìm kiếm thì gọi API search
    if (searchText.trim()) {
      searchUsers(searchText);
    } else {
      // Nếu không có text thì load lại toàn bộ danh sách
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-3">
        <Col className="d-flex justify-content-between">
          <h4>Danh sách người dùng</h4>
          <Button variant="outline-primary" onClick={handleSearchToggle}>
            {searchVisible ? 'Ẩn tìm kiếm' : 'Tìm kiếm'}
          </Button>
        </Col>
      </Row>

      {searchVisible && (
        <Row className="mb-3">
          <Col md={6}>
            <Form onSubmit={handleSearch} className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Nhập tên hoặc email..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button type="submit" variant="primary">Tìm</Button>
            </Form>
          </Col>
        </Row>
      )}

      <div className="table-responsive">
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">Không tìm thấy người dùng nào</td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{user.userName || 'N/A'}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.phoneNumber || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}
    </Container>
  );
};

export default UserAdmin;