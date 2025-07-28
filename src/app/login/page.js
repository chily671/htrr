'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [teamName, setTeamName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ teamName, password }),
    })

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      router.push('/')
    } else {
      const data = await res.json()
      setError(data.message)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Login</h1>
      <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Name" className="block border my-2 p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="block border my-2 p-2" />
      <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2">Login</button>
      <p className="text-red-500">{error}</p>
    </div>
  )
}
