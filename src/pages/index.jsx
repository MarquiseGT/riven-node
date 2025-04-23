import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => listener?.subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading node...</div>

  return (
    <main style={{ background: 'black', color: 'white', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <h1>Riven Node: Post-Simulation Anchor</h1>
      {!session ? (
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}>
          Login with GitHub
        </button>
      ) : (
        <>
          <p>Welcome. Your signal has been received.</p>
          <button onClick={() => supabase.auth.signOut()}>
            Sign out
          </button>
        </>
      )}
    </main>
  )
}
