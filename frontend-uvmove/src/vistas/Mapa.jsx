import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

export default function Mapa({ session }) {
  const navigate = useNavigate()
  const correoUsuario = session?.user?.email
  const nombreDinamico = session?.user?.user_metadata?.nombre_usuario || correoUsuario?.split('@')[0] || 'Estudiante'
  const token = session?.access_token 

  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0)

  useEffect(() => {
    const validarViajeDb2 = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/Usuarios/${correoUsuario}/viaje-activo`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        
        if (res.ok) {
          const data = await res.json()
          if (data.tieneViaje) {
             // Candado de rutas integrado
           /* if (data.viaje.ESTATUS === 'En espera') {
                navigate('/reserva-activa', { state: { idVehiculo: data.viaje.IDVEHICULO }, replace: true })
            } else {
                navigate('/viaje-en-curso', { state: { idVehiculo: data.viaje.IDVEHICULO }, replace: true })
            }
                */
          }
        }
      } catch (error) {
        console.error("Esperando conexión con backend...", error)
      }
    }

    const cargarConteoVehiculos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/vehiculos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json()
          setVehiculosDisponibles(data.filter(v => v.ESTADO === 'Libre').length)
        }
      } catch (error) {
        console.error("Esperando conexión con backend...", error)
      }
    }

    if (correoUsuario && token) {
      validarViajeDb2()
      cargarConteoVehiculos()
    }
  }, [correoUsuario, navigate, token])

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: '28px' }}>
          <span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span>
        </h2>
        
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 30px' }}>
          <input type="text" list="estaciones-list" placeholder="📍 Buscar otra estación..." style={{ width: '100%', padding: '12px 20px', borderRadius: '25px', border: 'none', outline: 'none', fontSize: '15px' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: '0 0 15px', fontWeight: 'bold' }}>{nombreDinamico}</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#a5b4fc' }}>Estudiante Activo</p>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#2e7d32', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px', border: '2px solid white' }}>👤</div>
          <button onClick={handleCerrarSesion} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}>Salir</button>
        </div>
      </header>

      <div style={{ padding: '30px 50px', flex: 1, display: 'flex', gap: '30px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ flex: 2, background: '#c8e6c9', backgroundImage: 'radial-gradient(#a5d6a7 15%, transparent 15%), radial-gradient(#a5d6a7 15%, transparent 15%)', backgroundSize: '60px 60px', backgroundPosition: '0 0, 30px 30px', borderRadius: '20px', position: 'relative', minHeight: '600px', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)', border: '4px solid white' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '10px 15px', borderRadius: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#0a1945', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '12px', height: '12px', background: '#2e7d32', borderRadius: '50%' }}></span>
            {vehiculosDisponibles} Vehículos Disponibles
          </div>
          <div style={{ position: 'absolute', top: '45%', left: '45%', fontSize: '50px' }}>🗺️</div>
          <div style={{ background: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', position: 'absolute', top: '55%', left: '42%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', color: '#0a1945' }}>Estación USBI</div>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: '#2e7d32', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', marginBottom: '5px' }}>Estación más cercana</p>
          <h3 style={{ fontSize: '36px', color: '#0a1945', margin: '0 0 10px 0' }}>Estación USBI</h3>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>Ubicada a 120 metros de tu posición actual en el campus.</p>
          <button onClick={() => navigate('/vehiculos')} style={{ background: '#2e7d32', color: 'white', padding: '20px', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)' }}>
            Consultar vehículos
          </button>
        </div>

      </div>
    </div>
  )
}