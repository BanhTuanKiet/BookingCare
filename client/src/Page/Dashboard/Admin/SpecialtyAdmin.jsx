import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Modal, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';

function SpecialtyAdmin() {
    const [specialties, setSpecialties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        const res = await axios.get('/specialties');
        setSpecialties(res.data);
    };

    const handleShowCreate = () => {
        setFormData({ name: '', description: '' });
        setEditing(false);
        setShowModal(true);
    };

    const handleEdit = (specialty) => {
        setFormData({ name: specialty.name || '', description: specialty.description || '' });
        setSelectedId(specialty.specialtyId);
        setEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa chuyên khoa này?")) {
            await axios.delete(`/specialties/${id}`);
            fetchSpecialties();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await axios.put(`/specialties/${selectedId}`, formData);
        } else {
            await axios.post("/specialties", formData);
        }
        setShowModal(false);
        fetchSpecialties();
    };

    return (
        <Container fluid>
            <Row className="align-items-center mb-3">
                <Col xs={12} md={6}>
                    <h5 className="mb-0 text-nowrap">Quản lý chuyên khoa</h5>
                </Col>
                <Col xs={12} md={6} className="text-md-end mt-2 mt-md-0">
                    <Button variant="primary" onClick={handleShowCreate}>
                        + Thêm chuyên khoa
                    </Button>
                </Col>
            </Row>

            <Table responsive bordered hover>
                <thead className="table-light">
                    <tr>
                        <th className="text-nowrap">ID</th>
                        <th className="text-nowrap">Tên chuyên khoa</th>
                        <th className="text-nowrap">Mô tả</th>
                        <th className="text-nowrap text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {specialties.map((s) => (
                        <tr key={s.specialtyId}>
                            <td>{s.specialtyId}</td>
                            <td>{s.name}</td>
                            <td>{s.description}</td>
                            <td className="text-center">
                                <ButtonGroup>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(s)}>
                                        Sửa
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(s.specialtyId)}>
                                        Xóa
                                    </Button>
                                </ButtonGroup>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editing ? "Cập nhật chuyên khoa" : "Thêm chuyên khoa"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tên chuyên khoa</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Mô tả</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <div className="text-end">
                            <Button type="submit" variant="success">
                                {editing ? "Cập nhật" : "Thêm mới"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}

export default SpecialtyAdmin;
