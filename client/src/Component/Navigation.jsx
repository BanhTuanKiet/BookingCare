import React from "react"
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { useLocation } from "react-router-dom"

const Navigation = () => {
  const location = useLocation()

  const pages = [
    { name: "Trang chủ", link: "/" },
    { name: "Giới thiệu", link: "/about" },
    { name: "Đội ngũ bác sĩ", link: "/team" },
    { name: "Chuyên khoa", link: "/specialty" },
    { name: "Tin tức", link: "/news" },
    { name: "Đặt lịch khám", link: "/appointment" },
    { name: "Liên hệ", link: "/contact" },
  ]

  const specialities = [
    { name: "Khoa Nội tổng quát", link: "/specialty/internal-medicine" },
    { name: "Khoa Nhi", link: "/specialty/pediatrics" },
    { name: "Khoa Tai - Mũi - Họng", link: "/specialty/ent" },
    { name: "Khoa Mắt (Nhãn khoa)", link: "/specialty/ophthalmology" },
    { name: "Khoa Gây Mê", link: "/specialty/dermatology" },
    { name: "Khoa Răng - Hàm - Mặt", link: "/specialty/dentistry" },
  ]

  const RenderNav = () => {
    return pages.map((page, index) => {
      const isActive = location.pathname === page.link 

      if (index === 3) {
        console.log(index)
        return (
          <NavDropdown title={page.name} key={index} id="basic-nav-dropdown" className={isActive ? "text-primary" : "text-dark"}>
            {RenderSpecialities()}
          </NavDropdown>
        )
      }

      if (index === 4) {
        console.log(index)
        return (
          <NavDropdown title={page.name} key={index} id="basic-nav-dropdown" className={isActive ? "text-primary" : "text-dark"}>
            <NavDropdown.Item href="">Action</NavDropdown.Item>
            <NavDropdown.Item href="">Another action</NavDropdown.Item>
            <NavDropdown.Item href="">Something</NavDropdown.Item>
          </NavDropdown>
        )
      }
      console.log(index)
      return (
        <Nav.Link href={page.link} key={index} className={isActive ? "text-primary fw-bold" : "text-dark"} >{page.name}</Nav.Link>
      )
    })
  }

  const RenderSpecialities = () => {
    return specialities.map((speciality, index) => (
      <NavDropdown.Item href={speciality.link} key={index} >{speciality.name}</NavDropdown.Item>
    ))
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {RenderNav()}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation