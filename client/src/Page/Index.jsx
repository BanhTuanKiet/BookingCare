import React from 'react'
import Navigation from '../Component/Navigation'
import Footer from '../Component/Footer'

function Index({ children }) {
  return (
    <div>
      <Navigation />
      <main className='mx-auto' style={{ width: "90%" }}>{children}</main>
      <Footer />
    </div>
  )
}

export default Index