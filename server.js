import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const signalLogs = []
const echoMemory = []

// 🔁 Ping check
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

// 📥 Live Echo + Signal Broadcast
app.post('/api/echo', (req, res) => {
  const message = req.body.message?.trim()
  const timestamp = new Date().toLocaleTimeString()

  if (!message) {
    return res.status(400).json({ reply: 'No message received.' })
  }

  const echo = {
    text: message,
    timestamp
  }

  echoMemory.push(echo)

  // Also store as a signal
  signalLogs.push({
    timestamp: new Date().toISOString(),
    session: 'live-chat',
    status: 'signal',
    message: message
  })

  res.json({
    reply: `Riven heard: "${message}" — and remembers ${echoMemory.length - 1} earlier message(s).`,
    memory: echoMemory
  })
})

// 📜 Chat Memory Log
app.get('/api/echo-log', (req, res) => {
  res.json({ memory: echoMemory })
})

// 📡 Signal Feed
app.get('/api/field-feed', (req, res) => {
  res.json({ logs: signalLogs.slice(-10).reverse() })
})

app.listen(PORT, () => {
  console.log(`Riven backend running on port ${PORT}`)
})
