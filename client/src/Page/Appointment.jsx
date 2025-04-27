import { useContext, useEffect, useState } from "react"
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { NavContext } from "../Context/NavContext"
import axios from "../Util/AxiosConfig"
import { ValideFormContext } from "../Context/ValideFormContext"

function Appointment() {
  const [formData, setFormData] = useState({
    specialty: "",
    doctor: "",
    service: "",
    appointmentDate: "",
    appointmentTime: ""
  })
  const { specialties } = useContext(NavContext)
  const [specialty, setSpecialty] = useState()
  const [doctors, setDoctors] = useState()
  const [services, setServices] = useState()
  const { validateForm, formErrors } = useContext(ValideFormContext)

  useEffect(() => {
    const fetchDoctors =  async () => {
      const response = await axios.get(`/doctors/${specialty}`)
      setDoctors(response.data)
    }

    fetchDoctors()
  }, [specialty])

  useEffect(() => {
    const fetchServices =  async () => {
      try {
      const response = await axios.get(`/services/${specialty}/services`)
      setServices(response.data)
    } catch (error) {
      console.log(error)
    }
    }

    fetchServices()
  }, [specialty])
  
  const handleChange = (event) => {
    let value = event.target.value

    if (event.target.name === "department") {
      setSpecialty(value)
    }

    if (event.target.name === "gender") {
      value = value === "true"
    }

    setFormData({ ...formData, [event.target.name]: value })
  }

  const submit = async (e) => {
    try {
      e.preventDefault()
      const errors = validateForm(formData)   
      if (errors > 0) return

      await axios.post("/appointments", formData)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container className="p-0 w-75 my-4">
      <div className="text-center mb-4">
        <h1 className="fw-bold" style={{ color: "#0056b3" }}>
          ĐĂNG KÝ KHÁM
        </h1>
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
              <p className="text-white">Lịch hẹn có hiệu lực sau khi có xác nhận chính thức từ Phòng khám Bệnh viện Đại học Y Dược 1</p>
              <p className="text-white">
                Quý khách hàng vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất. Trong trường hợp cung cấp
                sai thông tin email & điện thoại, việc xác nhận cuộc hẹn sẽ không hiệu lực.
              </p>
              <p className="text-white">
                Quý khách sử dụng dịch vụ đặt hẹn trực tuyến, xin vui lòng đặt trước ít nhất là 24 giờ trước khi đến khám.
              </p>
              <p className="text-white">
                Trong trường hợp khẩn cấp hoặc nghi ngờ có các triệu chứng nguy hiểm, quý khách vui lòng ĐẾN TRỰC TIẾP
                Phòng khám hoặc các trung tâm y tế gần nhất để kịp thời xử lý.
              </p>
            </div>
          </Col>

          <Col md={8} className="p-4 bg-white">
            <p className="text-muted mb-4">
              Vui lòng điền thông tin vào form bên dưới để đã đăng ký khám bệnh theo yêu cầu
            </p>

            <Form>
              {/* <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Họ và tên" name="name" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Email" name="email" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row> */}

              {/* <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="date"
                      placeholder="Ngày sinh"
                      name="dateOfBirth"
                      onChange={handleChange}
                      className="position-relative"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control type="tel" placeholder="Số điện thoại" name="phoneNumber" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row> */}

              {/* <Form.Group className="mb-3">
                <Form.Select name="gender" onChange={handleChange}>
                  <option>Giới tính</option>
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </Form.Select>
              </Form.Group> */}

              {/* <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Địa chỉ" name="address" onChange={handleChange} />
              </Form.Group> */}

              <Form.Group className="mb-3">
                <Form.Select name="specialty" onChange={handleChange} isInvalid={!!formErrors.specialty} >
                  <option>Chọn chuyên khoa</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty.name}>
                      {specialty.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.specialty}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Select name="doctor" onChange={handleChange} isInvalid={!!formErrors.doctor} >
                  <option>Chọn bác sĩ</option>
                  {doctors?.map((doctor, index) => (
                    <option key={index}>{doctor.userName}</option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.doctor}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Select name="service" onChange={handleChange} isInvalid={!!formErrors.service} >
                   <option>Chọn dịch vụ</option>
                   {services?.map((service, index) => (
                    <option key={index} value={service.serviceName}>
                      {service.serviceName}
                    </option>
                   ))} 
                </Form.Select>
                <Form.Control.Feedback type="invalid">{formErrors.service}</Form.Control.Feedback>
              </Form.Group>


              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="date"
                      placeholder="Ngày khám"
                      name="appointmentDate"
                      onChange={handleChange}
                      className="position-relative"
                      isInvalid={!!formErrors.appointmentDate}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.appointmentDate}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
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
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Triệu chứng"
                  name="symptoms"
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="text-end">
                <Button
                  onClick={submit}
                  className="px-5 py-2 border-0 rounded-5" style={{backgroundColor: "#4dabf7"}}
                >
                  GỬI
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    </Container>
  )
}

export default Appointment