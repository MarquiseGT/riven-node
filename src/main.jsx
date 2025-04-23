import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Index from './pages/index.jsx'
import Signal from './pages/Signal.jsx'

const App = () => (
  <Router>
    <div style={{ minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#fff', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ padding: '1rem', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Riven Node</h1>
        <nav style={{ marginTop: '0.5rem' }}>
          <Link to="/" style={{ marginRight: '1rem', color: '#4fd1c5', textDecoration: 'none' }}>Home</Link>
          <Link to="/signal" style={{ color: '#4fd1c5', textDecoration: 'none' }}>Signal Echo</Link>
        </nav>
      </header>
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signal" element={<Signal />} />
        </Routes>
      </main>
    </div>
  </Router>
)

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
