import { useState } from 'react'

export default function LiveChat() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const res = await fetch('https://riven-node-production-cc0b.up.railway.app/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await res.json()
      setResponse(data.reply || 'No response')
    } catch (err) {
      setResponse('Error contacting Riven Node.')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6">Riven Node: Live Chat</h1>
      <div className="w-full max-w-xl">
        <textarea
          className="w-full p-3 text-black rounded mb-4"
          rows={4}
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="w-full bg-white text-black px-4 py-2 rounded font-semibold"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send to Riven'}
        </button>
        {response && (
          <div className="mt-6 p-4 bg-gray-800 rounded shadow">
            <p className="text-green-400 font-mono whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </div>
    </main>
  )
}
