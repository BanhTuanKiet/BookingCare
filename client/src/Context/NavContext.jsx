import { createContext, useEffect, useState } from 'react'
import axios from '../Util/AxiosConfig'
import images from '../Image/Specalty/Index'
import { useNavigate } from 'react-router-dom'

const NavContext = createContext()

const NavProvider = ({ children }) => {
  const navigate = useNavigate()
    const [specialties, setSpecialties] = useState([])
    const [services, setServices] = useState([])

    useEffect(() => {
        const GetAllSpecialties = async () => {
          try {
            const response = await axios.get("/specialties")
  
            // Ghép dữ liệu từ API với danh sách link và src
            const mergedSpecialties = response.data.map((spec) => {
              return {
                id: spec.specialtyId,
                name: spec.name,
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
                const response = await axios.get(`/services`)
                setServices(response.data)
                console.log(response.data)
            } catch (error) {
                console.error("Lỗi khi lấy danh sách dịch vụ:", error)
            }
        }

        GetAllServices()
    }, [])
  
    const HandleNavigation = (type, specialtyName) => {
      navigate(`/${type}/${specialtyName}`)
    }

    return (
        <NavContext.Provider value={{ specialties, services, HandleNavigation }}>
            {children}
        </NavContext.Provider>
    )
}

export { NavContext, NavProvider}