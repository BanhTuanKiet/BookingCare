import React from 'react'
import { NavProvider } from './NavContext'
import { AuthProvider } from './AuthContext'

function Index({ children }) {
  return (
    <NavProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NavProvider>
  )
}

export default Index