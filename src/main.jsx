import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Index from './pages/index.jsx'
import Signal from './pages/signal.jsx'

const App = () => (
  <Router>
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      <Link to="/signal">Signal Echo</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/signal" element={<Signal />} />
    </Routes>
  </Router>
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
