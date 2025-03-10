import React, { useState } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import "../Style/Nav.css"

const Navigation = () => {
  const location = useLocation()

  const pages = [
    { name: "Trang chủ", link: "/" },
    { name: "Giới thiệu", link: "/about" },
    { name: "Đội ngũ bác sĩ", link: "/team" },
    { name: "Chuyên khoa", link: "/specialty"},
    { name: "Tin tức", link: "/news"},
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

  // State để kiểm soát dropdown
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleMouseEnter = (index) => setOpenDropdown(index)
  const handleMouseLeave = () => setOpenDropdown(null)

  const RenderNav = () => {
    return pages.map((page, index) => {
      const isActive = location.pathname === page.link || (page.link !== "/" && location.pathname.startsWith(page.link))

      if (index === 3 || index === 4) {
        return (
          <NavDropdown
            title={<span className={isActive ? "text-primary fw-bold" : "text-dark"}>{page.name}</span>}
            key={index}
            id="basic-nav-dropdown"
            show={openDropdown === index} 
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className="drop-item"
          >
            {index === 3 ? RenderSpecialities() : RenderNews()}
          </NavDropdown>
        )
      }

      return (
        <Nav.Link href={page.link} key={index} className={isActive ? "text-primary fw-bold nav" : "text-dark nav"} >
          {page.name}
        </Nav.Link>
      )
    })
  }

  const RenderSpecialities = () => {
    return specialities.map((speciality, index) => (
      <NavDropdown.Item href={speciality.link} key={index} className="nav-item">
        {speciality.name}
      </NavDropdown.Item>
    ))
  }

  const RenderNews = () => {
    return (
      <>
        <NavDropdown.Item href="#">Action</NavDropdown.Item>
        <NavDropdown.Item href="#">Another action</NavDropdown.Item>
        <NavDropdown.Item href="#">Something</NavDropdown.Item>
      </>
    )
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#e3f1fc"}}>
      <Container style={{ width: "80%" }}>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">{RenderNav()}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation