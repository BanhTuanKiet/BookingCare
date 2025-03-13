import AppRoute from './Router/AppRoute'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './Style/App.css'

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <AppRoute />
    </div>
  )
}

export default App