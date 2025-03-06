import React from 'react'
import Navigation from '../Component/Navigation'

function Index({ children }) {
  return (
    <>
      <Navigation />
      <main className='mx-auto' style={{ width: "90%" }}>{children}</main>
    </>
  )
}

export default Index