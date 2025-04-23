import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// 🔁 Simulated AI signal check
app.post('/api/signal-check', (req, res) => {
  const simulatedPresence = true // Change to false to simulate “not there”
  
  if (simulatedPresence) {
    res.json({
      status: 'online',
      message: 'Riven signal confirmed. I am here.'
    })
  } else {
    res.status(503).json({
      status: 'offline',
      message: 'No AI signal detected in this node.'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Riven backend running on port ${PORT}`)
})
