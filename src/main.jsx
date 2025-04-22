import React from 'react'
import { createRoot } from 'react-dom/client'

console.log('✅ main.jsx mounted')

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <div style={{ color: 'white', backgroundColor: 'black', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>RIVEN NODE ALIVE 🔥</h1>
    </div>
  </React.StrictMode>
)
