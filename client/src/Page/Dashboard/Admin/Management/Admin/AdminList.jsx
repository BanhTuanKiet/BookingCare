import React from 'react'
import UserList from '../General/UserList'

const AdminList = ({ tabActive }) => {
    return (
        <UserList tabActive={tabActive} userRole="admin" />
    )
}

export default AdminList