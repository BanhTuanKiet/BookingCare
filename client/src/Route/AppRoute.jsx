import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Page/Home'
import Index from '../Page/Index'
import About from '../Page/About'
import Contact from '../Page/Contact'
import News from '../Page/News'
import Doctor from '../Page/Doctor'
import DoctorDetail from '../Page/DoctorDetail'
import Appointment from '../Page/Appointment'
import Specialty from '../Page/Specialty'
import UploadDoctorImage from '../Page/UploadDoctorImage'
import Login from '../Page/Login'
import Signin from '../Page/Signin'
import ServiceDetail from '../Page/ServiceDetail'
import Profile from '../Page/Profile'

function AppRoute() {
    return (
        <Routes>
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/về chúng tôi' element={<Index><About /></Index>} />
            <Route path='/thông tin cá nhân' element={<Index><Profile /></Index>} />
            {/* Trang chi tiết bác sĩ */}
            <Route path='/bác sĩ' element={<Index><Doctor /></Index>} />
            <Route path='/bac-si/:doctorName' element={<Index><DoctorDetail /></Index>} />
            <Route path='/bác sĩ/:doctorName' element={<Index></Index>} />
            <Route path='/chuyên khoa/:specialty' element={<Index><Specialty /></Index>}></Route>
            <Route path='/dịch vụ/:serviceName' element={<Index><ServiceDetail/></Index>}></Route>
            <Route path='/tin tức' element={<Index><News /></Index>} />
            <Route path='/login' element={<Login /> } />
            <Route path='/Đăng nhập' element={<Signin/>} />
            <Route path='/đặt lịch khám' element={<Index><Appointment /></Index>} />
            <Route path='/liên hệ' element={<Index><Contact /></Index>} />
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/upload' element={<UploadDoctorImage></UploadDoctorImage>} />
        </Routes>
    )
}

export default AppRoute