import React, { useContext, useState } from "react"
import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button } from "react-bootstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa" // icon tìm kiếm
import "../Style/Nav.css"
import { NavContext } from "../Context/NavContext"

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { specialties, HandleNavigation } = useContext(NavContext)

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

  const [openDropdown, setOpenDropdown] = useState(null)
  const [searchInput, setSearchInput] = useState("")
  const [showSearch, setShowSearch] = useState(false)

  const handleMouseEnter = (index) => setOpenDropdown(index)
  const handleMouseLeave = () => setOpenDropdown(null)

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (!searchInput.trim()) return

    const foundSpecialty = specialties.find((specialty) =>
      specialty.name.toLowerCase() === searchInput.trim().toLowerCase()
    )

    if (foundSpecialty) {
      HandleNavigation("chuyên khoa", foundSpecialty.name)
      setShowSearch(false) // ẩn thanh tìm kiếm sau khi tìm
      setSearchInput("")   // reset input sau tìm kiếm
    } else {
      alert("Không tìm thấy chuyên khoa phù hợp!")
    }
  }

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
            {index === 3 ? RenderSpecialties() : RenderNews()}
          </NavDropdown>
        )
      }

      return (
        <Nav.Link href={page.link} key={index} className={isActive ? "text-primary fw-bold nav" : "text-dark nav"}>
          {page.name}
        </Nav.Link>
      )
    })
  }

  const RenderSpecialties = () => {
    return specialties.map((speciality, index) => (
      <NavDropdown.Item
        key={index}
        className="nav-item"
        onClick={() => HandleNavigation("chuyên khoa", speciality.name)}
      >
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
    <Navbar expand="lg" style={{ backgroundColor: "#e3f1fc" }}>
      <Container style={{ width: "80%" }}>
        <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">{RenderNav()}</Nav>

          <div className="d-flex align-items-center ms-3">
            <Button variant="outline-primary" onClick={toggleSearch} className="d-flex align-items-center">
              <FaSearch />
            </Button>

            {showSearch && (
              <Form className="d-flex ms-2" onSubmit={handleSearch}>
                <FormControl
                  type="search"
                  placeholder="Tìm chuyên khoa..."
                  className="me-2"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                />
                <Button type="submit" variant="primary">
                  Tìm
                </Button>
              </Form>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
