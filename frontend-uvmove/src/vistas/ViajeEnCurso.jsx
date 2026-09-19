import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ViajeEnCurso({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const correoUsuario = session?.user?.email
  const nombreDinamico = session?.user?.user_metadata?.nombre_usuario || 'Estudiante'
  const idVehiculo = location.state?.idVehiculo || 'No identificado'

  const [segundos, setSegundos] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSegundos((prev) => prev + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const costoActual = ((Math.floor(segundos / 60) + (segundos % 60 > 0 ? 1 : 0)) * 2.00).toFixed(2)

  // Desvincular de Db2
  const finalizarViajeDb = async () => {
    try {
      await fetch('http://localhost:3000/api/prestamos/finalizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoUsuario, id_vehiculo: idVehiculo })
      })
      alert(`Viaje finalizado en base de datos. Total: $${costoActual}`)
      navigate('/mapa')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', justifyContent: 'center', color: 'white' }}>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ flex: 1, padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
          
          <h1 style={{ color: '#0a1945' }}>Viaje Activo, {nombreDinamico}</h1>
          <p style={{ fontSize: '28px', fontFamily: 'monospace', color: '#2e7d32' }}>{idVehiculo}</p>

          <p style={{ fontSize: '28px' }}>Costo actual: <strong>${costoActual}</strong></p>

          <button onClick={finalizarViajeDb} style={{ background: '#4ade80', color: '#0a1945', padding: '15px 40px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
            Finalizar Viaje
          </button>
        </div>
      </div>
    </div>
  )
}