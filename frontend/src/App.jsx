import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import AddItem from './pages/AddItem.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Lost from './pages/Lost.jsx'
import Found from './pages/Found.jsx'
import Report from './pages/Report.jsx'


function App() {
  return (
    <div className="appRoot">
      <Navbar />

      <main className="appMain" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lost" element={<Lost />} />
          <Route path="/found" element={<Found />} />
          <Route path="/report" element={<Report />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/item/:id" element={<ItemDetail />} />

          {/* backwards compatible routes */}
          <Route path="/add" element={<AddItem />} />
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>


      </main>

      <Footer />
    </div>
  )
}

export default App

