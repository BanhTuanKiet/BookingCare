import React, { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'

function Appointment() {
  const [formData, setFormData] = useState({})
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  const [days, setDays] = useState(0)
  const year = new Date().getFullYear()

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  useEffect(() => {
    const month = formData["dob.month"]
    if (!month) return

    if (["January", "March", "May", "July", "August", "October", "December"].includes(month)) {
      setDays(31)
    } else if (month === "February") {
      setDays(28) // Cần thêm logic kiểm tra năm nhuận nếu cần
    } else {
      setDays(30)
    }
  }, [formData["dob.month"]])

  return (
    <Row className="">
      <Col lg={6} md={12}>
        <Form>
          <div className='d-flex'>
            {/* Name */}
            <Form.Group className="mb-3 d-flex flex-column w-75 me-5">
              <Form.Label className="text-start">Họ tên</Form.Label>
              <Form.Control type="text" placeholder="Enter name" className="w-100" onChange={handleChange} />
            </Form.Group>

            {/* Gender */}
            <Form.Group className="ms-5 mb-3 d-flex flex-column w-25">
              <Form.Label className="text-start">Giới tính</Form.Label>
              <Form.Select name="dob.day" onChange={handleChange}>
                    <option>Giới tính</option>
                    <option key={0}>Nam</option>
                    <option key={1}>Nữ</option>
                  </Form.Select>
            </Form.Group>
          </div>

          {/* Date of Birth */}
          <Form.Group className="d-flex flex-column">
            <Form.Label className="text-start">Ngày sinh</Form.Label>
            <Row>
              <Col>
                <Form.Select name="dob.day" onChange={handleChange}>
                  <option>Ngày</option>
                  {[...Array(days)].map((_, i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select name="dob.month" onChange={handleChange}>
                  <option>Tháng</option>
                  {months.map((m, i) => (
                    <option key={i}>{m}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col>
                <Form.Select name="dob.year" onChange={handleChange}>
                  <option>Năm</option>
                  {[...Array(100)].map((_, i) => (
                    <option key={i}>{year - 99 + i}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  )
}

export default Appointment
