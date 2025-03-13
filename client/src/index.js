import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './Style/index.css'
import { BrowserRouter } from 'react-router-dom'
import Context from './Context/Index'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
    <Context>
      <App />
    </Context>
    {/* </React.StrictMode> */}
  </BrowserRouter>
)
