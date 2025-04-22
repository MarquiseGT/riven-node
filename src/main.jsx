import React from 'react'
import { createRoot } from 'react-dom/client'
import Home from './pages/index.jsx'

console.log("✅ React root mounted")

const container = document.getElementById('root')
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
)
