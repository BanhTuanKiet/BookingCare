import { useContext, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap"
import { NavContext } from "../Context/NavContext"
import axios from "../Util/AxiosConfig"
import { ValideFormContext } from "../Context/ValideFormContext"
import debounce from "../Util/Debounce"

function Appointment() {
  const [formData, setFormData] = useState({
    department: "",
    doctor: "",
    service: "",
    appointmentDate: "",
    appointmentTime: ""
  })
  const { specialties } = useContext(NavContext)
  const [specialty, setSpecialty] = useState()
  const [doctors, setDoctors] = useState()
  const [services, setServices] = useState()
  const { validateForm, formErrors, validateField } = useContext(ValideFormContext)

  const [minDate, setMinDate] = useState("")
  const [maxDate, setMaxDate] = useState("")
  const [suggestedAppointments, setSuggestedAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)

  const handleCloseModal = () => setShowModal(false)

  useEffect(() => {
    const today = new Date()
    const maxDay = new Date()
    const minDay = new Date()
    minDay.setDate(today.getDate() + 1)
    maxDay.setDate(today.getDate() + 15)
    setMinDate(minDay.toISOString().split('T')[0])
    setMaxDate(maxDay.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`/doctors/${specialty}`)
        setDoctors(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (specialty) fetchDoctors()
  }, [specialty])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`/services/${specialty}/services`)
        setServices(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    if (specialty) fetchServices()
  }, [specialty])

  const handleChange = (event) => {
    const { name, value } = event.target
    let newValue = value
    if (name === "department") setSpecialty(newValue)
    if (name === "gender") newValue = newValue === "true"
    setFormData({ ...formData, [name]: newValue })
    validateField(name, newValue)
  }

  const submit = async (e) => {
    try {
      e.preventDefault()
      const errors = validateForm(formData)
      if (errors > 0) return

      const response = await axios.post("/appointments", formData)

      if (response.data.availableAppointments) {
        setSuggestedAppointments(response.data.availableAppointments)
        setShowModal(true)
      } else {
        setSuggestedAppointments([])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const debouncedSubmit = debounce(submit)

  return (
    <Container className="p-0 w-75 my-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{ color: "#0056b3" }}>ĐĂNG KÝ KHÁM</h1>
        <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
          <div style={{ height: "1px", width: "100px", backgroundColor: "#dee2e6" }}></div>
          <span style={{ color: "#4dabf7", fontSize: "24px" }}>✚</span>
          <div style={{ height: "1px", width: "100px", backgroundColor: "#dee2e6" }}></div>
        </div>
      </div>

      <div className="border rounded overflow-hidden">
        <Row className="m-0 p-0">
          <Col md={4} className="p-4 text-white" style={{ backgroundColor: "#0091ea" }}>
            <h5>Lưu ý:</h5>
            <div>
              <p className="text-white">Lịch hẹn có hiệu lực sau khi có xác nhận từ Phòng khám.</p>
              <p className="text-white">Vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất.</p>
              <p className="text-white">Hãy đặt trước ít nhất 24 giờ.</p>
              <p className="text-white">Trường hợp khẩn cấp hãy đến trực tiếp cơ sở y tế gần nhất.</p>
            </div>
          </Col>

          <Col md={8} className="p-4 bg-white">
            <p className="text-muted mb-4">Vui lòng điền thông tin để đăng ký khám</p>

            <Form>
              <Form.Group className="mb-3">
                <Form.Select name="department" onChange={handleChange} isInvalid={!!formErrors.department}>
                  <option>Chọn chuyên khoa</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty.name}>{specialty.name}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.department}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Select name="doctor" onChange={handleChange} isInvalid={!!formErrors.doctor}>
                  <option>Chọn bác sĩ</option>
                  {doctors?.map((doctor, index) => (
                    <option key={index}>{doctor.userName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.doctor}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Select name="service" onChange={handleChange} isInvalid={!!formErrors.service}>
                  <option>Chọn dịch vụ</option>
                  {services?.map((service, index) => (
                    <option key={index} value={service.serviceName}>{service.serviceName}</option>
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
                      min={minDate}
                      max={maxDate}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.appointmentDate}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Select name="appointmentTime" onChange={handleChange} isInvalid={!!formErrors.appointmentTime}>
                      <option>Buổi khám</option>
                      <option>Sáng</option>
                      <option>Chiều</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formErrors.appointmentTime}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Control as="textarea" rows={4} placeholder="Triệu chứng" name="symptoms" onChange={handleChange} spellCheck={false}/>
              </Form.Group>

              <div className="text-end">
                <Button onClick={debouncedSubmit} className="px-5 py-2 border-0 rounded-5" style={{ backgroundColor: "#4dabf7" }}>
                  GỬI
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>

      {/* Modal hiển thị lịch hẹn gợi ý */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <h4 className="text-danger">Khung giờ bạn chọn đã đầy!</h4>
        </Modal.Header>
        <Modal.Body>
          <p>Vui lòng chọn lịch hẹn khác:</p>
          <ul>
            {suggestedAppointments.map((appointment, index) => (
              <li key={index}>
                {new Date(appointment.date).toLocaleDateString("vi-VN")}: {appointment.time}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default Appointment