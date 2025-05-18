import React from 'react'
import UserList from '../General/UserList'

const DoctorList = ({ tabActive }) => {
    return (
        <UserList tabActive={tabActive} userRole="doctor" />
    )
}

export default DoctorList