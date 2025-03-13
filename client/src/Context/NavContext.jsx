import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import images from '../Image/Specalty/Index'

const NavContext = createContext()

const NavProvider = ({ children }) => {
    const [specialties, setSpecialties] = useState([])

    useEffect(() => {
        const specialitiesRoute = [
            { name: "Khoa Nội tổng quát", link: "/chuyên khoa/Khoa Nội tổng quát" },
            { name: "Khoa Nhi", link: "/chuyên khoa/Khoa Nhi" },
            { name: "Khoa Tai - Mũi - Họng", link: "/chuyên khoa/Khoa Tai - Mũi - Họng" },
            { name: "Khoa Mắt (Nhãn khoa)", link: "/chuyên khoa/Khoa Mắt (Nhãn khoa)" },
            { name: "Khoa Gây Mê", link: "/chuyên khoa/Khoa Gây Mê" },
            { name: "Khoa Răng - Hàm - Mặt", link: "/chuyên khoa/Khoa Răng - Hàm - Mặt" },
          ]

        const GetAllSpecialties = async () => {
          try {
            const response = await axios.get("http://127.0.0.1:5140/api/specialties")
  
            // Ghép dữ liệu từ API với danh sách link và src
            const mergedSpecialties = response.data.map((spec) => {
              const matchedSpec = specialitiesRoute.find((s) => s.name === spec.name)
  
              return {
                id: spec.specialtyId,
                name: spec.name,
                link: matchedSpec?.link,
                src: images[spec.name]
              }
            })        
  
            setSpecialties(mergedSpecialties)
          } catch (error) {
            console.error("Lỗi khi lấy danh sách chuyên khoa:", error)
          }
        }
  
        GetAllSpecialties()
    }, [])

    useEffect(() => {
        const GetAllServices = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5140/api/services")
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error)
            }
        }
    })
  

    return (
        <NavContext.Provider value={{ specialties }}>
            {children}
        </NavContext.Provider>
    )
}

export { NavContext, NavProvider}