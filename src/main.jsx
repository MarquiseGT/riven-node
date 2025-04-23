import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function Home() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pingResult, setPingResult] = useState(null)

  // Check Supabase session
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

  // Ping backend
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
      <h

