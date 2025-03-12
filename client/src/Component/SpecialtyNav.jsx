import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function SpecialtyNav() {
    const specialty = useParams()
    const navItems = ["Giới thiệu", "Bác sĩ", "Dịch vụ"]
    const [activeNavItem, setActiveNavItem] = useState(navItems[0])
    const [infor, setInfor] = useState()

    useEffect(() => {
        const GeInforSpecialty = async () => {
            try {
                let response
                if (activeNavItem === navItems[0]) {
                    response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty.specialty}/description`)

                    setInfor(response.data)
                } 

                if (activeNavItem === navItems[1]) {
                    // response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty}/doctors`)

                    setInfor("AAAAAAAAAa")
                }

                if (activeNavItem === navItems[2]) {
                    // response = await axios.get(`http://127.0.0.1:5140/api/specialties/${specialty}/services`)

                    setInfor("BBBBBBBBBb")
                }
            } catch (error) {
                
            }
        }

        GeInforSpecialty()
    }, [activeNavItem, navItems, specialty])

    return (
        <div>
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
            <div>{infor}</div>
        </div>
    )
}

export default SpecialtyNav
