import React, { useContext, useState, useRef, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/Nav.css";
import { NavContext } from "../Context/NavContext";
import { AuthContext } from "../Context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, UserName, logout, role} = useContext(AuthContext);
  const { specialties, services, HandleNavigation } = useContext(NavContext);
  const indicatorRef = useRef(null);
  const navRefs = useRef([]);
  
  const pages = [
    { name: "Trang chủ", link: "/" },
    { name: "Giới Thiệu", link: "/về chúng tôi" },
    { name: "Đội ngũ bác sĩ", link: "/bác sĩ" },
    { name: "Chuyên khoa", link: "/chuyên khoa" },
    { name: "Dịch vụ", link: "/dịch vụ" },
    { name: "Tin tức", link: "/tin tức" },
    { name: "Đặt lịch khám", link: "/đặt lịch khám" },
    { name: "Liên hệ", link: "/liên hệ" },
  ];

  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const savedIndexRef = useRef(null);

  // CHỈ THAY ĐỔI HÀM NÀY:
  const normalizePath = (path) => {
    // decode để chuyển /v%E1%BB%81%20ch%C3%BAng%20t%C3%B4i -> /về chúng tôi
    // xóa dấu "/" ở cuối nếu có
    return decodeURIComponent(path).replace(/\/$/, "");
  };

  const isPageActive = (pageLink) => {
    const currentPath = normalizePath(location.pathname);
    const targetPath = normalizePath(pageLink);
    return currentPath === targetPath ;
  };

  const moveIndicatorTo = (index) => {
    if (indicatorRef.current && navRefs.current[index]) {
      const navItem = navRefs.current[index];
      const indicator = indicatorRef.current;
      indicator.style.width = `${navItem.offsetWidth}px`;
      indicator.style.left = `${navItem.offsetLeft}px`;
      indicator.style.opacity = "1";
    }
  };

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
    moveIndicatorTo(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
    if (savedIndexRef.current !== null) {
      moveIndicatorTo(savedIndexRef.current);
    }
  };

  const handleClick = (index, link) => {
    savedIndexRef.current = index;
    setActiveIndex(index);
    navigate(link);
  };

  useEffect(() => {
    const currentIndex = pages.findIndex((page) => isPageActive(page.link));
    if (currentIndex !== -1) {
      savedIndexRef.current = currentIndex;
      setActiveIndex(currentIndex);
      setTimeout(() => {
        moveIndicatorTo(currentIndex);
      }, 300);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const RenderNav = () => {
    return pages.map((page, index) => {
      const isActive = isPageActive(page.link);

      if (index === 3 || index === 4) {
        return (
          <NavDropdown
            title={page.name}
            key={index}
            id="basic-nav-dropdown"
            show={openDropdown === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`drop-item nav-item ${isActive ? "active" : ""}`}
            ref={(el) => (navRefs.current[index] = el)}
          >
            {index === 3 ? RenderSpecialties() : RenderServices()}
          </NavDropdown>
        );
      }

      return (
        <Nav.Link
          key={index}
          className={`nav ${isActive ? "active" : ""}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index, page.link)}
          ref={(el) => (navRefs.current[index] = el)}
        >
          {page.name}
        </Nav.Link>
      );
    });
  };

  const RenderSpecialties = () => {
    return specialties.map((speciality, index) => (
      <NavDropdown.Item
        key={index}
        onClick={() => {
          HandleNavigation("chuyên khoa", speciality.name);
          savedIndexRef.current = 3;
        }}
      >
        {speciality.name}
      </NavDropdown.Item>
    ));
  };

  const RenderServices = () => {
    return services.map((service, index) => (
      <NavDropdown.Item
        key={index}
        onClick={() => {
          HandleNavigation("dịch vụ", service.serviceName);
          savedIndexRef.current = 4;
        }}
      >
        {service.serviceName}
      </NavDropdown.Item>
    ));
  };

  return (
    <Navbar expand="lg" className="bg-info-subtle py-2">
      <Container className="w-75 mx-auto">
        <Navbar.Brand href="/">{/* Logo */}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto position-relative">
            {RenderNav()}
            <div className="nav-indicator" ref={indicatorRef}></div>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <NavDropdown
                className="btn-login"
                title={`Xin chào, ${UserName}`}
                id="user-dropdown"
                style={{ zIndex: 1,}}
              >
                <NavDropdown.Item onClick={() => navigate("/thông tin cá nhân")}>
                  Hồ sơ
                </NavDropdown.Item>
                {role === 'admin' && 
                  <NavDropdown.Item onClick={() => navigate("/admin")}>
                    Quản lý
                  </NavDropdown.Item>
                }
                <NavDropdown.Item onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link
                onClick={() => navigate("/Đăng nhập")}
                className="btn-login"
              >
                Đăng nhập / Đăng ký
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
