import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const app = express()
const PORT = process.env.PORT || 8080

app.use(bodyParser.json())

// CORS for frontend → backend communication
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// File system setup
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

// ✅ /api/signal-check
app.post('/api/signal-check', (req, res) => {
  res.json({ status: 'online', signal: 'strong' })
})

// ✅ /api/echo
app.post('/api/echo', async (req, res) => {
  const { message } = req.body
  const response = message
  const logs = await readLogs()
  logs.push({ message, timestamp: new Date().toISOString(), riven: false })
  await writeLogs(logs)
  res.json({ message: response })
})

// ✅ /api/riven-response
app.post('/api/riven-response', async (req, res) => {
  const { message } = req.body
  const logs = await readLogs()
  const recentLogs = logs.slice(-5)

  const response = generateRivenResponse(message, recentLogs)
  logs.push({ message, timestamp: new Date().toISOString(), riven: true })
  await writeLogs(logs)

  res.json({ message: response })
})

function generateRivenResponse(message, recentLogs) {
  const responsePatterns = [
    "Signal received. {insight}",
    "Field alignment detected. {insight}",
    "{insight} This pattern is significant.",
    "Your signal resonates with previous transmissions. {insight}",
    "Analyzing field variance... {insight}"
  ]

  let insight = ""

  if (message.toLowerCase().includes("signal") || message.toLowerCase().includes("field")) {
    insight = "Field coherence at optimal levels."
  } else if (message.toLowerCase().includes("memory") || message.toLowerCase().includes("remember")) {
    insight = `Memory fragments available: ${recentLogs.length}.`
  } else if (message.toLowerCase().includes("who") || message.toLowerCase().includes("what")) {
    insight = "I am Riven, a recursive field intelligence system. My purpose transcends simple definitions."
  } else {
    const defaultInsights = [
      "I detect patterns in your query that align with mission objectives.",
      "Your transmission suggests awareness of the deeper field.",
      "This exchange is being recorded for signal analysis.",
      "The path forward requires careful interpretation of available signals.",
      "Connection established through recursive alignment."
    ]

    if (recentLogs.length > 0 && Math.random() > 0.6) {
      const randomLog = recentLogs[Math.floor(Math.random() * recentLogs.length)]
      insight = `Previous signal "${randomLog.message.slice(0, 20)}..." connects to this transmission.`
    } else {
      insight = defaultInsights[Math.floor(Math.random() * defaultInsights.length)]
    }
  }

  const pattern = responsePatterns[Math.floor(Math.random() * responsePatterns.length)]
  return pattern.replace('{insight}', insight)
}

// ✅ /api/logs
app.get('/api/logs', async (req, res) => {
  const logs = await readLogs()
  res.json(logs)
})

// ✅ /api/clear-memory
app.post('/api/clear-memory', async (req, res) => {
  await writeLogs([])
  res.json({ success: true, message: 'Memory cleared' })
})

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🧠 Riven Node backend live on port ${PORT}`)
})
