import React from 'react'
import { Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'

function Slug() {
    const slug = useParams()

    return (
        <div className='d-flex ms-5'>
            <div className='w-75'>{slug.params}

            </div>
            <div className='w-25'>
                <div className='w-75 mx-auto'>
                    <div className='bg-primary text-white py-2'>Đặt lịch hẹn</div>
                </div>
            </div>
        </div>
    )
}

export default Slug