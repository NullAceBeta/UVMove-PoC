import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

export default function Mapa({ session }) {
  const navigate = useNavigate()
  const correoUsuario = session?.user?.email
  const nombreDinamico = session?.user?.user_metadata?.nombre_usuario || correoUsuario?.split('@')[0] || 'Estudiante'
  
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState(0)

  useEffect(() => {
    // 1. Validar si Db2 dice que este usuario ya tiene un viaje pendiente
    const validarViajeDb2 = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/Usuarios/${correoUsuario}/viaje-activo`)
        if (res.ok) {
          const data = await res.json()
          if (data.tieneViaje) {
            navigate('/viaje-en-curso', { state: { idVehiculo: data.id_vehiculo } })
          }
        }
      } catch (error) {
        console.error("Esperando conexión con backend...", error)
      }
    }

    // 2. Contar cuántos vehículos hay realmente en la tabla de Db2
    const cargarConteoVehiculos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/vehiculos')
        if (res.ok) {
          const data = await res.json()
          setVehiculosDisponibles(data.filter(v => v.estado === 'Disponible').length)
        }
      } catch (error) {
        console.error("Esperando conexión con backend...", error)
      }
    }

    if (correoUsuario) {
      validarViajeDb2()
      cargarConteoVehiculos()
    }
  }, [correoUsuario, navigate])

  const handleCerrarSesion = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', zIndex: 10 }}>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>{nombreDinamico}</p>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#2e7d32', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '22px' }}>👤</div>
          <button onClick={handleCerrarSesion} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}>Salir</button>
        </div>
      </header>

      <div style={{ padding: '30px 50px', flex: 1, display: 'flex', gap: '30px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ flex: 2, background: '#c8e6c9', borderRadius: '20px', position: 'relative', minHeight: '600px', border: '4px solid white' }}>
          <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'white', padding: '10px 15px', borderRadius: '20px', fontWeight: 'bold', color: '#0a1945' }}>
            🟢 {vehiculosDisponibles} Vehículos Disponibles
          </div>
          <div style={{ position: 'absolute', top: '45%', left: '45%', fontSize: '50px' }}>📍</div>
        </div>

        <div style={{ flex: 1, background: 'white', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '36px', color: '#0a1945', margin: '0 0 10px 0' }}>Estación USBI</h3>
          <button onClick={() => navigate('/vehiculos')} style={{ background: '#2e7d32', color: 'white', padding: '20px', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
            Consultar vehículos
          </button>
        </div>
      </div>
    </div>
  )
}