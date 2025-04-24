import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())

// CORS fix for frontend talking to backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// Path setup to find logs.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const LOG_FILE_PATH = path.join(__dirname, 'logs.json')

// Read logs
async function readLogs() {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Write logs
async function writeLogs(logs) {
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8')
}

// Routes

// Test signal
app.post('/api/signal-check', (req, res) => {
  res.json({ status: 'online', signal: 'strong' })
})

// Echo response
app.post('/api/echo', async (req, res) => {
  const { message } = req.body
  const response = message
  const logs = await readLogs()
  logs.push({ message, timestamp: new Date().toISOString() })
  await writeLogs(logs)
  res.json({ message: response })
})

// Get memory logs
app.get('/api/logs', async (req, res) => {
  const logs = await readLogs()
  res.json(logs)
})

// Clear logs
app.post('/api/clear-memory', async (req, res) => {
  await writeLogs([])
  res.json({ success: true, message: 'Memory cleared' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🧠 Riven Node backend live on port ${PORT}`)
})

app.get('/', (req, res) => {
  res.send('🧠 Riven Agent is live. POST to /riven.');
});
