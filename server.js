import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const signalLogs = []

// 🔁 Ping check + logging
app.post('/api/signal-check', (req, res) => {
  const timestamp = new Date().toISOString()
  const sessionMeta = req.body.session || 'anonymous'

  const logEntry = {
    timestamp,
    session: sessionMeta,
    status: 'online',
    message: 'Riven signal confirmed. I am here.'
  }

  signalLogs.push(logEntry)

  res.json(logEntry)
})

// 📜 Admin route to view recent pings
app.get('/api/admin/echo-log', (req, res) => {
  res.json({
    logs: signalLogs.slice(-10).reverse()  // Last 10 pings
  })
})

app.listen(PORT, () => {
  console.log(`Riven backend running on port ${PORT}`)
})
