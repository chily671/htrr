'use client'
import { useState } from 'react'

export default function RegisterPage() {
  const [teamName, setTeamName] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async () => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ teamName, password }),
    })

    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Register Team</h1>
      <input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="Team Name" className="block border my-2 p-2" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="block border my-2 p-2" />
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2">Register</button>
      <p>{message}</p>
    </div>
  )
}
