import React, { useEffect, useState, useContext } from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import axios from '../../../Util/AxiosConfig';
import { ValideFormContext } from '../../../Context/ValideFormContext';
import { NavContext } from '../../../Context/NavContext'; // Giả định bạn có NavContext

function Appointments({ tabActive }) {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    service: '',
    appointmentDate: '',
    appointmentTime: '',
  });

  const { specialties } = useContext(NavContext);
  const { validateForm, formErrors } = useContext(ValideFormContext);

  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);

  // Load doctors và services khi specialty thay đổi
  useEffect(() => {
    if (!specialty) return;

    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/doctors/${specialty}`);
        setDoctors(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await axios.get(`/services/${specialty}/services`);
        setServices(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDoctors();
    fetchServices();
  }, [specialty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'department') setSpecialty(value);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) return;

    try {
      await axios.post('/appointments', formData);
      // Optional: Reset form hoặc hiển thị thông báo
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="p-4">
      <h4 className="mb-4">Đăng Ký Lịch Khám</h4>
      <p className="text-muted mb-4">
        Vui lòng điền thông tin vào form bên dưới để đăng ký khám bệnh theo yêu cầu.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Select
            name="department"
            onChange={handleChange}
            isInvalid={!!formErrors.specialty}
          >
            <option>Chọn chuyên khoa</option>
            {specialties.map((spec, index) => (
              <option key={index} value={spec.name}>
                {spec.name}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{formErrors.specialty}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select name="doctor" onChange={handleChange} isInvalid={!!formErrors.doctor}>
            <option>Chọn bác sĩ</option>
            {doctors.map((doctor, index) => (
              <option key={index} value={doctor.userName}>
                {doctor.userName}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{formErrors.doctor}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select name="service" onChange={handleChange} isInvalid={!!formErrors.service}>
            <option>Chọn dịch vụ</option>
            {services.map((service, index) => (
              <option key={index} value={service.serviceName}>
                {service.serviceName}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">{formErrors.service}</Form.Control.Feedback>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="date"
                name="appointmentDate"
                onChange={handleChange}
                isInvalid={!!formErrors.appointmentDate}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.appointmentDate}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Select
                name="appointmentTime"
                onChange={handleChange}
                isInvalid={!!formErrors.appointmentTime}
              >
                <option>Buổi khám</option>
                <option>Sáng</option>
                <option>Chiều</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {formErrors.appointmentTime}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit">Đặt lịch</Button>
      </Form>
    </Card>
  );
}

export default Appointments;
