import React, { useContext, useState } from "react"
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap"
import { useLocation } from "react-router-dom"
import "../Style/Nav.css"
import { NavContext } from "../Context/NavContext"

const Navigation = () => {
  const location = useLocation()
  const { specialties, services, HandleNavigation } = useContext(NavContext)
  const pages = [
    { name: "Trang chủ", link: "/" },
    { name: "Giới thiệu", link: "/về chúng tôi" },
    { name: "Đội ngũ bác sĩ", link: "/bác sĩ" },
    { name: "Chuyên khoa", link: "/chuyên khoa" },
    { name: "Dịch vụ", link: "/dịch vụ" },
    { name: "Tin tức", link: "/tin tức" },
    { name: "Đặt lịch khám", link: "/đặt lịch khám" },
    { name: "Liên hệ", link: "/liên hệ" },
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
            {index === 3 ? RenderSpecialties() : RenderServices()}
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

  const RenderSpecialties = () => {
    return specialties.map((speciality, index) => (
      <NavDropdown.Item key={index} className="nav-item" onClick={() => HandleNavigation("chuyên khoa", speciality.name)}>
        {speciality.name}
      </NavDropdown.Item>
    ))
  }

  const RenderServices = () => {
    return services.map((service, index) => (
      <NavDropdown.Item key={index} className="nav-item" onClick={() => HandleNavigation("dịch vụ", service.serviceName)}>
        {service.serviceName}
      </NavDropdown.Item>
    ))
  }

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#f8f9fa"}}>
      <Container className="w-75 px-0">
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