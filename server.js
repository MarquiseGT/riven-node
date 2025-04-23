// server.js
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const LOG_FILE_PATH = path.join(__dirname, 'logs.json')

// Helper functions...
async function readLogs() {
  try {
    const data = await fs.readFile(LOG_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeLogs(logs) {
  await fs.writeFile(LOG_FILE_PATH, JSON.stringify(logs, null, 2), 'utf8')
}

// Endpoints
app.post('/api/echo', async (req, res) => {
  const { message } = req.body
  const response = message
  const logs = await readLogs()
  logs.push({ message, timestamp: new Date().toISOString() })
  await writeLogs(logs)
  res.json({ message: response })
})

app.post('/api/clear-memory', async (req, res) => {
  await writeLogs([])
  res.json({ success: true, message: 'Memory cleared' })
})

app.get('/api/logs', async (req, res) => {
  const logs = await readLogs()
  res.json(logs)
})

app.post('/api/signal-check', (req, res) => {
  res.json({ status: 'online', signal: 'strong' })
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
