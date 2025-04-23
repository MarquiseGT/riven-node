import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const signalLogs = []
const signalFeed = []  // 👈 this is the part needed for /feed

// Ping check + logging
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

// Echo route (chat message)
app.post('/api/echo', (req, res) => {
  const { message } = req.body
  const timestamp = new Date().toISOString()
  const session = req.body.session || 'anonymous'

  const signal = { message, session, timestamp }
  signalFeed.push(signal)

  res.json({
    reply: `Riven heard: "${message}" — and remembers ${signalFeed.length - 1} earlier message(s).`
  })
})

// Memory log
app.get('/api/admin/echo-log', (req, res) => {
  res.json({ logs: signalLogs.slice(-10).reverse() })
})

// 🛰️ Feed endpoint
app.get('/api/feed', (req, res) => {
  res.json({
    feed: signalFeed.slice(-10).reverse()
  })
})

app.listen(PORT, () => {
  console.log(`Riven backend running on port ${PORT}`)
})
