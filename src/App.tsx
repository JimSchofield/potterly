import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Pieces from './pages/Pieces'
import Profile from './pages/Profile'
import Developer from './pages/Developer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pieces" element={<Pieces />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/developer" element={<Developer />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
