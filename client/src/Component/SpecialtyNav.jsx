import React from 'react'
import SpecialtyLogo from './SpecialtyLogo'

function SpecialtyNav({ src }) {
    const items = ["Giới thiệu", "Bác sĩ", "Dịch vụ"]
    
    return (
        <div>
            <SpecialtyLogo src={src} />
            <div className='d-flex'>
                {items.map((item, index) => (
                    <div className='specialty-nav mt-3 me-5  p-1'>
                        <span>{item}</span>
                    </div>    
                ))}
            </div>
        </div>
    )
}

export default SpecialtyNav