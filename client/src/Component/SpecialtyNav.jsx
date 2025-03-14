import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import "../Style/SpecialtyNav.css"
import DoctorCard from './DoctorCard'
import ServiceCard from './ServiceCard' // Nếu chưa có, có thể tạm ẩn

function SpecialtyNav() {
    const { specialty } = useParams() // destructure params cho gọn
    const navItems = ["Giới thiệu", "Bác sĩ", "Dịch vụ"]

    const [activeNavItem, setActiveNavItem] = useState(navItems[0])

    const [doctors, setDoctors] = useState([])
    const [infor, setInfor] = useState(null)
    const [services, setServices] = useState([]) // Nếu có dịch vụ riêng biệt

    useEffect(() => {
        const GeInforSpecialty = async () => {
            try {
                let response

                // Giới thiệu
                if (activeNavItem === navItems[0]) {
                    response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty}/description`)
                    console.log("Giới thiệu:", response.data)

                    setInfor(response.data)
                    setDoctors([])
                    setServices([])
                }

                // Bác sĩ
                if (activeNavItem === navItems[1]) {
                    response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty}/doctor`)
                    console.log("Danh sách bác sĩ:", response.data)

                    setDoctors(response.data) // Đưa response.data vào doctors
                    setInfor(null)
                    setServices([])
                }

                // Dịch vụ
                if (activeNavItem === navItems[2]) {
                    // response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty}/services`)
                    // console.log("Dịch vụ:", response.data)

                    setServices("bbbbbbbbbbbb")
                    // setInfor(null)
                    // setDoctors([])
                }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu:", error)
            }
        }

        GeInforSpecialty()
    }, [activeNavItem, specialty])

    return (
        <div className="specialty-container">
            {/* Thanh điều hướng tab */}
            <div className='d-flex mb-3'>
                {navItems.map((item, index) => (
                    <div
                        key={index}
                        className={`specialty-nav mt-3 me-5 ${activeNavItem === item ? 'active' : ''}`}
                        onClick={() => setActiveNavItem(item)}
                        style={{ cursor: 'pointer', fontWeight: activeNavItem === item ? 'bold' : 'normal' }}
                    >
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            {/* Nội dung Giới thiệu */}
            {activeNavItem === navItems[0] && infor && (
                <div className="specialty-description mt-3">
                    <h5 className="mb-3">Giới thiệu chuyên khoa</h5>
                    <div>{infor}</div>
                </div>
            )}

            {/* Nội dung Bác sĩ */}
            {activeNavItem === navItems[1] && (
                <div className="specialty-doctors mt-3">
                    <h5 className="mb-3">Danh sách Bác sĩ</h5>
                    {doctors.length > 0 ? (
                        <div className="doctor-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {doctors.map(doctor => (
                                <DoctorCard key={doctor.id} doctor={doctor} />
                            ))}
                        </div>
                    ) : (
                        <p>Hiện chưa có bác sĩ nào được hiển thị.</p>
                    )}
                </div>
            )}

            {/* Nội dung Dịch vụ */}
            {activeNavItem === navItems[2] && (
                <div className="specialty-services mt-3">
                    <h5 className="mb-3">Danh sách Dịch vụ</h5>
                    {services.length > 0 ? (
                        <div className="service-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {services.map(service => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>
                    ) : (
                        <p>Hiện chưa có dịch vụ nào được hiển thị.</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default SpecialtyNav
