import React from 'react'
import { Link, useParams } from 'react-router-dom'
import images from '../Image/Index'
import SpecialtyNav from '../Component/SpecialtyNav'
import "../Style/Specialty.css"

function Specialty() {
    const { specialty }  = useParams()
    const src = images[specialty]

    return (
        <div>
            <div className=''>
                <img className='w-100' src={images.specialty} alt="" />
            </div>
            <div className='d-flex justify-content-center mx-auto' style={{ width: "80%" }} >
                <div className='w-75 ms-3'>
                    <SpecialtyNav src={src} />
                </div>
                <div className='w-25'>
                    <div className='w-75 text-center'>
                        <div className='bg-primary text-white py-2'>Đặt lịch hẹn</div>
                        <div className='text-start p-3 pb-1 mt-2 border' style={{ backgroundColor: "#e3f1fc" }} >
                            <p><strong>Địa chỉ phòng khám</strong></p>
                            <p>475A Đ. Điện Biên Phủ, Phường 25, Bình Thạnh, Hồ Chí Minh</p>
                            <Link 
                                to="https://www.google.com/maps/dir//HUTECH,+7+Nguy%E1%BB%85n+Gia+Tr%C3%AD,+Ph%C6%B0%E1%BB%9Dng+25,+B%C3%ACnh+Th%E1%BA%A1nh,+H%E1%BB%93+Ch%C3%AD+Minh,+Vi%E1%BB%87t+Nam/@10.8018525,106.6740191,13z/data=!3m1!4b1!4m9!4m8!1m0!1m5!1m1!1s0x31752953ade9f9c9:0x6ad5d15cd48a4f4e!2m2!1d106.7152576!2d10.8018439!3e0?hl=vi-VN&entry=ttu&g_ep=EgoyMDI1MDMwNC4wIKXMDSoASAFQAw%3D%3D" 
                                target="_blank" 
                            >
                                Xem bản đồ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Specialty