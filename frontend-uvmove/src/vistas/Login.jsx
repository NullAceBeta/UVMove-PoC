import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert('Error: ' + error.message)
    } else {
      // 1. Extraemos 'data' además de 'error' para obtener la sesión
      const { data, error } = await supabase.auth.signUp({
         email,
         password,
        options: { data: { nombre_usuario: nombre } }
      })

      if (error) {
          alert('Error: ' + error.message)
      } else {
          // 2. Extraemos el JWT recién creado por Supabase
          const token = data?.session?.access_token;

          // 3. Disparamos la sincronización con tu API local
          try {
              const res = await fetch('http://localhost:3000/api/usuarios/sync', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}` // Pasamos el candado verificarToken
                  },
                  // Enviamos exactamente los campos que tu req.body espera
                  body: JSON.stringify({
                      correoUsuario: email,
                      nombre: nombre
                  })
              });

              if(res.ok) {
                  alert('¡Registro y sincronización exitosos! Ya puedes iniciar sesión.')
              } else {
                  console.error('La API rebotó la sincronización');
              }
              
          } catch (err) {
              console.error('Error de red al intentar sincronizar con Db2:', err);
          }
      }
    }
  }

  return (
    <div style={{ background: '#f4f5f9', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '450px', overflow: 'hidden' }}>
        
        <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
          <button onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '20px', border: 'none', background: isLogin ? 'white' : '#f9f9f9', color: isLogin ? '#2e7d32' : '#888', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderBottom: isLogin ? '3px solid #2e7d32' : '3px solid transparent' }}>
            Iniciar Sesión
          </button>
          <button onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '20px', border: 'none', background: !isLogin ? 'white' : '#f9f9f9', color: !isLogin ? '#2e7d32' : '#888', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', borderBottom: !isLogin ? '3px solid #2e7d32' : '3px solid transparent' }}>
            Registrarse
          </button>
        </div>

        <div style={{ padding: '40px' }}>
          <h1 style={{ margin: '0 0 30px 0', fontSize: '38px', textAlign: 'center' }}>
            <span style={{ color: '#0a1945' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span>
          </h1>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <input type="text" placeholder="Nombre de usuario" onChange={(e) => setNombre(e.target.value)} required style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' }} />
            )}
            <input type="email" placeholder="Correo Universitario" onChange={(e) => setEmail(e.target.value)} required style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' }} />
            <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} required style={{ padding: '15px', borderRadius: '10px', border: '1px solid #ddd', outline: 'none', fontSize: '16px' }} />
            <button type="submit" style={{ background: '#2e7d32', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '18px', marginTop: '10px', cursor: 'pointer' }}>
              {isLogin ? 'Ingresar al Sistema' : 'Crear Cuenta'}
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}