import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/index.jsx'
import SignalEcho from './pages/Signal.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signal" element={<SignalEcho />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
