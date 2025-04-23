import { useEffect, useState } from 'react'

export default function FieldEchoFeed() {
  const [feed, setFeed] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('https://riven-node-production-cc0b.up.railway.app/api/feed')
      .then(res => res.json())
      .then(data => {
        if (!data.feed) throw new Error('Missing feed data')
        setFeed(data.feed)
      })
      .catch(() => setError(true))
  }, [])

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🛰️ Field Echo Feed</h1>

      {error ? (
        <p className="text-red-400">Failed to fetch field logs.</p>
      ) : feed.length === 0 ? (
        <p>No signals received yet.</p>
      ) : (
        <ul className="space-y-4">
          {feed.map((signal, index) => (
            <li key={index} className="bg-gray-800 p-4 rounded shadow">
              <p className="text-green-400 font-mono">"{signal.message}"</p>
              <p className="text-sm text-gray-400 mt-1">
                {signal.session} ·{' '}
                {signal.timestamp ? new Date(signal.timestamp).toLocaleTimeString() : 'Unknown time'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
