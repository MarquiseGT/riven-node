import { useEffect, useState } from 'react'

export default function FieldEcho() {
  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {
    try {
      const res = await fetch('https://riven-node-production-cc0b.up.railway.app/api/field')
      const data = await res.json()
      setLogs(data.fieldEcho || [])
    } catch (err) {
      setLogs([{ timestamp: '', message: 'Failed to fetch field logs.' }])
    }
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Field Echo Feed</h1>
      <div className="w-full max-w-2xl space-y-4">
        {logs.length === 0 ? (
          <p className="text-gray-400">No signals received yet.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded shadow">
              <p className="text-green-400 font-mono">{log.message}</p>
              <p className="text-sm text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

