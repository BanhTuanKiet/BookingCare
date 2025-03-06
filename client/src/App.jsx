import AppRoute from './Router/AppRoute'
import './Style/App.css'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <AppRoute />
    </div>
  )
}

export default App
