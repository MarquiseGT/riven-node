import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const signalLogs = []
const memoryStore = []

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

// 💬 Memory-aware echo
app.post('/api/echo', (req, res) => {
  const { message } = req.body
  const timestamp = new Date().toISOString()

  memoryStore.push({ message, timestamp })

  const reply = `Riven heard: "${message}"` + (memoryStore.length > 1
    ? ` — and remembers ${memoryStore.length - 1} earlier message(s).`
    : '')

  res.json({ reply })
})

// 🧠 Optional debug: See memory
app.get('/api/memory', (req, res) => {
  res.json({ memory: memoryStore })
})

app.listen(PORT, () => {
  console.log(`Riven backend running on port ${PORT}`)
})
