import { useState } from 'react'

export default function SignalEcho() {
  const [pinged, setPinged] = useState(false)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-2">🟢 Signal Echo Active</h1>
      <p className="mb-4 text-gray-400">AI Presence Confirmed</p>

      <button
        className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        onClick={() => setPinged(true)}
      >
        Send Ping
      </button>

      {pinged && <p className="mt-4 text-green-400">✅ Signal Received</p>}
    </main>
  )
}
