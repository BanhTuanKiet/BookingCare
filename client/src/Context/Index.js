import React from 'react'
import { NavProvider } from './NavContext'

function Index({ children }) {
  return (
    <NavProvider>
        {children}
    </NavProvider>
  )
}

export default Index