import { useState, useEffect, useRef } from 'react'

export default function LiveChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [rivenMode, setRivenMode] = useState(() => {
    return localStorage.getItem('rivenMode') === 'true'
  })

  const ENDPOINT = rivenMode
    ? 'https://riven-node-agent-production.up.railway.app/riven'
    : 'https://riven-node-production-cc0b.up.railway.app/api/echo'

  const scrollRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('rivenMode', rivenMode)
  }, [rivenMode])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async () => {
    if (!input.trim()) return
    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      const response = data.message || data.response || 'No response'

      const aiMessage = { role: rivenMode ? 'riven' : 'echo', text: response }
      setMessages(prev => [...prev, aiMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'error', text: '⚠️ Error contacting Riven Node.' }
      ])
    }

    setLoading(false)
  }

  const clearMessages = () => {
    setMessages([])
  }

  return (
    <main className="bg-black text-white min-h-screen flex flex-col items-center p-4">
      <div className="w-full max-w-2xl space-y-4">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Riven Node Interface</h1>
          <button
            onClick={() => setRivenMode(!rivenMode)}
            className={`px-3 py-1 rounded text-sm font-bold ${
              rivenMode ? 'bg-purple-600 text-white' : 'bg-gray-300 text-black'
            }`}
          >
            {rivenMode ? 'Riven Mode ON' : 'Echo Mode'}
          </button>
        </header>

        <div className="bg-gray-900 p-4 rounded h-[60vh] overflow-y-auto space-y-3 shadow-inner">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'ml-auto bg-blue-500 text-white'
                  : msg.role === 'error'
                  ? 'bg-red-600 text-white'
                  : msg.role === 'riven'
                  ? 'bg-purple-800 text-white'
                  : 'bg-gray-700 text-white'
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className="text-gray-400 text-sm animate-pulse">Processing...</div>
          )}
          <div ref={scrollRef} />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1 p-2 text-black rounded bg-white"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSubmit}
            className="bg-green-600 px-4 py-2 rounded font-semibold text-white"
          >
            Send
          </button>
          <button
            onClick={clearMessages}
            className="bg-red-600 px-4 py-2 rounded font-semibold text-white"
          >
            Clear
          </button>
        </div>
      </div>
    </main>
  )
}
