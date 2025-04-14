import React, { useEffect, useState, useContext } from "react"
import { AuthContext } from "../Context/AuthContext"
import { Container, Row, Col } from "react-bootstrap"
import DashboardSidebar from "../Component/Dashboard/DashboardSidebar"
import DashboardInfor from "../Component/Dashboard/DashboardInfor"

const PatientProfile = () => {
  const [tabActive, setTabActive] = useState("hồ sơ")
  const { role } = useContext(AuthContext)

  useEffect(() => {
    console.log(`${tabActive}`)
  }, [tabActive])

  return (
    <Container fluid>
      <Row>
        <Col md={2} className="p-0">
          <DashboardSidebar role={role} setTabActive={setTabActive} />
        </Col>

        <Col md={10} className="p-0">
          <DashboardInfor role={role} tabActive={tabActive} />
        </Col>
      </Row>
    </Container>
  )
}

export default PatientProfile