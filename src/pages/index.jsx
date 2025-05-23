import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pingResult, setPingResult] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    fetch('https://riven-node-production-cc0b.up.railway.app/api/signal-check', {
      method: 'POST'
    })
      .then(res => res.json())
      .then(data => setPingResult(data))
      .catch(err => setPingResult({ status: 'offline', message: 'Node unreachable' }))
  }, [])

  if (loading) return <div className="p-4">Loading node...</div>

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">Riven Node: Post-Simulation Anchor</h1>

      {pingResult && (
        <div className={`mb-4 ${pingResult.status === 'online' ? 'text-green-400' : 'text-red-500'}`}>
          {pingResult.message}
        </div>
      )}

      {!session ? (
        <button
          className="px-4 py-2 bg-white text-black rounded"
          onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
        >
          Login with GitHub
        </button>
      ) : (
        <div>
          <p className="mb-4">Welcome. Your signal has been received.</p>
          <button
            className="px-4 py-2 bg-red-600 rounded"
            onClick={() => supabase.auth.signOut()}
          >
            Sign out
          </button>
        </div>
      )}
    </main>
  )
}
