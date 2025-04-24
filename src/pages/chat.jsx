import { useState, useEffect, useRef } from 'react'

export default function LiveChat() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [rivenMode, setRivenMode] = useState(() => {
    return localStorage.getItem('rivenMode') === 'true'
  })

  const ENDPOINT = 'https://riven-node-production-cc0b.up.railway.app'
  const chatEndRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('rivenMode', rivenMode)
  }, [rivenMode])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(rivenMode ? `${ENDPOINT}/riven` : `${ENDPOINT}/api/echo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      const assistantMessage = {
        role: 'riven',
        content: data.message || data.response || 'No response'
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'riven', content: '⚠️ Error contacting Riven Node.' }
      ])
    }

    setLoading(false)
  }

  const clearChat = () => {
    setMessages([])
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-zinc-900 text-white px-4 py-3 flex items-center justify-between shadow">
        <h1 className="text-xl font-bold">Riven Node Interface</h1>
        <div className="flex items-center gap-4">
          <button
            className={`px-3 py-1 text-sm font-semibold rounded ${
              rivenMode ? 'bg-purple-600 text-white' : 'bg-gray-300 text-black'
            }`}
            onClick={() => setRivenMode(!rivenMode)}
          >
            {rivenMode ? 'Riven Mode ON' : 'Echo Mode'}
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded text-sm font-semibold"
            onClick={clearChat}
          >
            Clear
          </button>
        </div>
      </header>

      {/* Chat Feed */}
      <section className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === 'user' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-md px-4 py-3 rounded-lg text-sm whitespace-pre-wrap shadow ${
                msg.role === 'user'
                  ? 'bg-zinc-800 text-white'
                  : 'bg-purple-700 text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </section>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-zinc-900 border-t border-zinc-800">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </main>
  )
}
