import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import axios from "../Util/AxiosConfig"
import images from "../Image/Others/Index"

function Appointment() {
  const [formData, setFormData] = useState({})
  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
  const [days, setDays] = useState(0)
  const year = new Date().getFullYear()

  const handleChange = (event) => {
    let value = event.target.value;

    if (event.target.name === "gender") {
      value = value === "true";
    }
  
    setFormData({ ...formData, [event.target.name]: value })
  }

  useEffect(() => {
    const month = formData["month"]

    if (!month) return

    if (["January", "March", "May", "July", "August", "October", "December"].includes(month)) {
      return setDays(31)
    }
    
    if (month === "February") {
      return setDays(28)
    } 
    
    return setDays(30)
  }, [formData])

  const submit = async () => {
      try {
        console.log(formData)
        const response = await axios.post("/appointments", formData)
        console.log(response)
      } catch (error) {
        console.log(error)
      }
  }

  return (
    <Container className='p-0 w-75'>
      <img data-ck-zoom="no" src={images.appointment} alt="" className="d-block mx-auto py-5" style={{ width: "98%" }} />
      <Row className='mx-auto p-0 w-100'>
          <Col className=''>
            <Form className="p-4 border" style={{ backgroundColor: "#eff8ff" }}>
              <Form.Group className='mb-3'>
                <Form.Control type='text' placeholder='Tên của bạn' name='name' onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Row>
                  {/* Phone number */}
                  <Col md={7}>
                    <Form.Control type="text" placeholder="Số điện thoại" name="phoneNumber" onChange={handleChange} />
                  </Col>
                      
                  {/* Gender */}
                  <Col md={5} className='d-flex justify-content-around my-auto'>
                    <Form.Check name="gender" type='radio' label='Nam' value={true}  onChange={handleChange} />
                    <Form.Check name="gender" type='radio' label='Nữ' value={false}  onChange={handleChange} />
                  </Col>
                </Row>
              </Form.Group>

              {/* Date of Birth */}
              <Form.Group className="mb-3">
                <Row>
                  <Col md={4}>
                    <Form.Select name="day" onChange={handleChange}>
                      <option>Ngày</option>
                      {[...Array(days)].map((_, i) => <option key={i}>{i + 1}</option>)}
                    </Form.Select>
                  </Col>

                  <Col md={4}>
                    <Form.Select name="month" onChange={handleChange}>
                      <option>Tháng</option>
                      {months.map((m, i) => <option key={i}>{m}</option>)}
                    </Form.Select>
                  </Col>

                  <Col md={4}>
                    <Form.Select name="year" onChange={handleChange}>
                      <option>Năm</option>
                      {[...Array(100)].map((_, i) => <option key={i}>{year - 99 + i}</option>)}
                    </Form.Select>
                  </Col>
                </Row>
              </Form.Group>

              <Form.Group>
                <Form.Control as="textarea" rows={3} placeholder='Vui lòng mô tả các triệu chứng anh/chị đang gặp phải' />
              </Form.Group>

              <Button onClick={submit} className="w-100">Đặt lịch</Button>
            </Form>
          </Col>
      </Row>
    </Container>
  )
}

export default Appointment