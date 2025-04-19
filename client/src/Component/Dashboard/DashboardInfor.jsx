import React, { useEffect, useState } from 'react'
import PersonalInfo from '../../Page/Dashboard/General/PersonalInfor'
import PatientHistory from '../../Page/Dashboard/Doctor/PatientHistory'
import DoctorSchedule from '../../Page/Dashboard/Doctor/DoctorSchedule'
import ReviewDoctor from '../../Page/Dashboard/Doctor/ReviewDoctor'
import AppointmentHistory from '../../Page/Dashboard/Patient/MedicalHistory'
import DoctorShiftDetail from '../../Page/Dashboard/Doctor/DoctorShiftDetail' // 📌 Import thêm file chi tiết
import PatientsInfor from '../../Page/Dashboard/Admin/PatientsInfor'
import axios from "../../Util/AxiosConfig"

function DashboardInfor({ role, tabActive, setTabActive }) {
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
            component: <PatientHistory />,
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
        {
            path: "chi tiết",
            component: <DoctorShiftDetail />,
            roles: ["doctor"],
        },
        {
            path: "quản lý người dùng",
            component: <PatientsInfor />,
            roles: ["admin"],
            // roles: ["doctor", "patient", "admin"],
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
                    const response = await axios.post(`appointments/by-patient`)
                    console.log(response.data)
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

                setInfor(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        if (tabActive === "lịch làm việc") {
            fetchDoctorSchedule()
        }
    }, [tabActive])

    // 📌 Update tìm tab
    const matchedTab = Tabs.find(tab => (tab.path === tabActive || tabActive.includes(tab.path)) && tab.roles.includes(role))

    if (!matchedTab) {
        return <div>Tab not found</div>
    }

    return (
        <>
            {React.cloneElement(matchedTab.component, { user, setUser, infor, setTabActive, tabActive })}
        </>
    )
}

export default DashboardInfor
