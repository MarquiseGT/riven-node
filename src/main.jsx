import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/index.jsx'
import Chat from './pages/chat.jsx'
import FieldEcho from './pages/field.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/field" element={<FieldEcho />} />
      </Routes>
    </Router>
  </React.StrictMode>
)
