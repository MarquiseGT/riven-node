import { useState, useEffect } from 'react'

export default function LiveChat() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [memory, setMemory] = useState([])
  const [rivenMode, setRivenMode] = useState(() => {
    return localStorage.getItem('rivenMode') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('rivenMode', rivenMode)
  }, [rivenMode])

  const BACKEND = 'https://riven-node-production-cc0b.up.railway.app'

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const endpoint = rivenMode ? `${BACKEND}/riven` : `${BACKEND}/api/echo`

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      const result = data.message || data.response || 'No response'
      setResponse(result)
      setInput('')

      setMemory(prev => [
        ...prev,
        { message: input, timestamp: Date.now(), riven: rivenMode }
      ])
    } catch {
      setResponse('⚠️ Error contacting Riven Node.')
    }

    setLoading(false)
  }

  const clearMemory = () => {
    setMemory([])
    setResponse('🧹 Local memory cleared.')
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Riven Node: Live Chat</h1>

      <div className="w-full max-w-xl">
        {/* Mode Toggle */}
        <div className="flex justify-end mb-2">
          <button
            className={`px-3 py-1 rounded text-sm font-bold ${
              rivenMode ? 'bg-purple-600 text-white' : 'bg-gray-300 text-black'
            }`}
            onClick={() => setRivenMode(!rivenMode)}
          >
            {rivenMode ? 'Riven Mode ON' : 'Echo Mode'}
          </button>
        </div>

        <textarea
          className="w-full p-3 text-black rounded mb-4"
          rows={4}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-2 mb-4">
          <button
            className="flex-1 bg-white text-black px-4 py-2 rounded font-semibold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Send to Riven'}
          </button>

          <button
            className="flex-1 bg-red-600 text-white px-4 py-2 rounded font-semibold"
            onClick={clearMemory}
          >
            Clear Memory
          </button>
        </div>

        {response && (
          <div className="mt-4 p-4 bg-gray-800 rounded shadow">
            <p className="text-green-400 font-mono whitespace-pre-wrap">{response}</p>
          </div>
        )}

        {memory.length > 0 && (
          <div className="mt-6 p-4 bg-gray-900 rounded shadow text-sm">
            <p className="text-yellow-400 font-semibold mb-2">🧠 Memory Log:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              {memory.map((entry, idx) => (
                <li key={idx}>
                  <span className="text-white">"{entry.message}"</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({new Date(entry.timestamp).toLocaleTimeString()} — {entry.riven ? 'Riven' : 'Echo'})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  )
}
