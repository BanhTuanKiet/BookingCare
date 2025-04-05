import React, { useContext, useState, useRef, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import "../Style/Nav.css";
import { NavContext } from "../Context/NavContext";
import { AuthContext } from "../Context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, UserName, logout } = useContext(AuthContext);
  const { specialties, services, HandleNavigation } = useContext(NavContext);
  
  // Reference for the underline indicator
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

  const [triggerHoverEffect, setTriggerHoverEffect] = useState(false);


  // State to control dropdown
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
    
    // Position the indicator under the hovered item
    if (indicatorRef.current && navRefs.current[index]) {
      const navItem = navRefs.current[index];
      const indicator = indicatorRef.current;
      
      indicator.style.width = `${navItem.offsetWidth}px`;
      indicator.style.left = `${navItem.offsetLeft}px`;
      indicator.style.opacity = '1';
    }
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
    
    // Reset indicator based on current active page
    const currentIndex = pages.findIndex(page => 
      location.pathname === page.link || 
      (page.link !== "/" && location.pathname.startsWith(page.link))
    );
    
    if (indicatorRef.current && currentIndex !== -1 && navRefs.current[currentIndex]) {
      // Keep indicator under current active page
      const navItem = navRefs.current[currentIndex];
      const indicator = indicatorRef.current;
      
      indicator.style.width = `${navItem.offsetWidth}px`;
      indicator.style.left = `${navItem.offsetLeft}px`;
      indicator.style.opacity = '1';
    }
  };

  // Initialize active item based on current location
  useEffect(() => {
    const currentIndex = pages.findIndex(page =>
      location.pathname === page.link ||
      (page.link !== "/" && location.pathname.startsWith(page.link))
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
      requestAnimationFrame(() => {
        if (indicatorRef.current && navRefs.current[currentIndex]) {
          const navItem = navRefs.current[currentIndex];
          const indicator = indicatorRef.current;
  
          indicator.style.width = `${navItem.offsetWidth}px`;
          indicator.style.left = `${navItem.offsetLeft}px`;
          indicator.style.opacity = '1';
        }
      });
    }
  }, [location.pathname]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (isAuthenticated) {
      const index = pages.length; // vì login nằm ngoài danh sách pages
      setTriggerHoverEffect(true);
  
      // Position indicator under login button
      setTimeout(() => {
        if (indicatorRef.current && navRefs.current[index]) {
          const navItem = navRefs.current[index];
          const indicator = indicatorRef.current;
  
          indicator.style.width = `${navItem.offsetWidth}px`;
          indicator.style.left = `${navItem.offsetLeft}px`;
          indicator.style.opacity = '1';
        }
      }, 200); // delay nhỏ để đảm bảo ref sẵn sàng
  
      // Remove effect after 3s
      const timer = setTimeout(() => {
        setTriggerHoverEffect(false);
        indicatorRef.current.style.opacity = '0';
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);
  

  const isPageActive = (pageLink) => {
    return location.pathname === pageLink || 
           (pageLink !== "/" && location.pathname.startsWith(pageLink));
  }

  const RenderNav = () => {
    return pages.map((page, index) => {
      const isActive = isPageActive(page.link)

      if (index === 3 || index === 4) {
        return (
          <NavDropdown
            title={page.name}
            key={index}
            id="basic-nav-dropdown"
            show={openDropdown === index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            className={`drop-item nav-item ${isActive ? 'active' : ''}`}
            ref={el => navRefs.current[index] = el}
          >
            {index === 3 ? RenderSpecialties() : RenderServices()}
          </NavDropdown>
        );
      }

      return (
        <Nav.Link
          key={index}
          href={page.link}
          className={`nav ${isActive ? 'active' : ''}`}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
          ref={el => navRefs.current[index] = el}
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
        onClick={() => HandleNavigation("chuyên khoa", speciality.name)}
      >
        {speciality.name}
      </NavDropdown.Item>
    ));
  };

  const RenderServices = () => {
    return services.map((service, index) => (
      <NavDropdown.Item 
        key={index} 
        onClick={() => HandleNavigation("dịch vụ", service.serviceName)}
      >
        {service.serviceName}
      </NavDropdown.Item>
    ));
  };

  return (
    <Navbar expand="lg" className="bg-info-subtle py-2">
      <Container className="w-75 mx-auto">
        <Navbar.Brand href="/" className="">
          {/* <div className="logo-container">
            <div className="heart-logo">
              <span className="text-primary fw-bold">DBK</span>
            </div>
          </div> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto position-relative">
            {RenderNav()}
            <div className="nav-indicator" ref={indicatorRef}></div>
          </Nav>
          <Nav>
          {isAuthenticated ? (
            <NavDropdown
              className={`btn-login ${triggerHoverEffect ? 'hovered' : ''}`}
              title={`Xin chào, ${UserName}`}
              id="user-dropdown"
              ref={(el) => (navRefs.current[pages.length] = el)}
            >

              <NavDropdown.Item onClick={() => navigate("/hồ sơ")}>Hồ sơ</NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Nav.Link onClick={() => navigate("/Đăng nhập")} className="btn-login">
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