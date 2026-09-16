import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('¡Listo! Revisa si entró directo (si quitaste la confirmación de correo).')
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ color: '#0f2152' }}>UV Move</h1>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="email" placeholder="Correo (ej. test@uv.mx)" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ background: '#1b7a3e', color: 'white', padding: '10px' }}>Entrar / Registrarse</button>
      </form>
    </div>
  )
}
