import React, { useEffect, useState } from 'react'
import PersonalInfo from './General/PersonalInfor'
import DoctorSchedule from './Doctor/DoctorSchedule'
import ReviewDoctor from './Doctor/ReviewDoctor'
import AppointmentHistory from './Patient/MedicalHistory'
import axios from "../../Util/AxiosConfig"

function DashboardInfor({ role, tabActive }) {
    const [user, setUser] = useState(null)
    const [infor, setInfor] = useState()
    
    const Tabs = [
        {
          path: "hồ sơ",
          component: <PersonalInfo />,
          roles: ["doctor", "patient", "admin"],
        },
        {
          path: "danh sách bệnh nhân",
          component: <PersonalInfo />,
          roles: ["doctor"],
        },
        {
          path: "lịch làm việc",
          component: <DoctorSchedule />,
          roles: ["doctor"],
        },
        {
          path: "đánh giá",
          component: <ReviewDoctor />,
          roles: ["doctor"],
        },
        {
          path: "lịch sử hẹn",
          component: <AppointmentHistory />,
          roles: ["patient"],
        },
        {
          path: "lịch sử thanh toán",
          component: <PersonalInfo />,
          roles: ["patient"],
        },
    ]

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const response = await axios.get("/users/profile")
                setUser(response.data)
            } catch (error) {
                console.error("Error fetching patient information:", error)
            }
        }
    
        fetchPatientInfo()
    }, [])
    
    useEffect(() => {
        if (role === 'patient') {
            const fetchAppointmentInfo = async () => {
                try {
                    const response = await axios.post(`/appointments/by-patient`)
                    setInfor(response.data)
                } catch (error) {
                    console.log(error)
                }
            }
    
            fetchAppointmentInfo()
        }
    }, [role])

    useEffect(() => {
        const fetchDoctorSchedule = async () => {
            try {
                const response = await axios.get("/appointments/schedule")
                console.log(response.data)
                setInfor(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (tabActive === "lịch làm việc") {
            fetchDoctorSchedule()
        }
    }, [tabActive])
    
    const matchedTab = Tabs.find(tab => tab.path === tabActive && tab.roles.includes(role))
    
    if (!matchedTab) {
        return <div>Tab not found</div>
    }
    
    return (
        <div>
            {React.cloneElement(matchedTab.component, { user, infor })}
        </div>
    )
}

export default DashboardInfor
