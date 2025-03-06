import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Page/Home'
import Index from '../Page/Index'
import About from '../Page/About'
import Contact from '../Page/Contact'
import News from '../Page/News'
import Specialty from '../Page/Specialty'
import Team from '../Page/Team'
import Appointment from '../Page/Appointment'
import Slug from '../Page/Slug'

function AppRoute() {
    return (
        <Routes>
            <Route path='/' element={<Index><Home /></Index>} />
            <Route path='/about' element={<Index><About /></Index>} />
            <Route path='/team' element={<Index><Team /></Index>} />
            <Route path='/specialty' element={<Index><Specialty /></Index>} />
            <Route path='/specialty/:slug' element={<Index><Slug /></Index>}></Route>
            <Route path='/news' element={<Index><News /></Index>} />
            <Route path='/appointment' element={<Index><Appointment /></Index>} />
            <Route path='/contact' element={<Index><Contact /></Index>} />
            <Route path='/' element={<Index><Home /></Index>} />
        </Routes>
    )
}

export default AppRoute