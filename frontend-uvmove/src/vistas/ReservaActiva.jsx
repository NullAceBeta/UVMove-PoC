import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ReservaActiva({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const correoUsuario = session?.user?.email
  const idVehiculo = location.state?.idVehiculo || 'No identificado'

  const [tiempoFaltante, setTiempoFaltante] = useState(600) 

  useEffect(() => {
    const timer = setInterval(() => setTiempoFaltante((prev) => (prev > 0 ? prev - 1 : 0)), 1000)
    return () => clearInterval(timer)
  }, [])

  // Ahora sí llama a la API de Carlos para liberar en Db2
  const cancelarReserva = async () => {
    const confirmar = window.confirm("¿Cancelar tu reserva?")
    if (confirmar) {
      try {
        await fetch('http://localhost:3000/api/prestamos/finalizar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: correoUsuario, id_vehiculo: idVehiculo })
        })
        alert("Reserva cancelada en Db2.")
        navigate('/mapa')
      } catch (error) {
        console.error("Error al cancelar en Db2", error)
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', alignItems: 'center', color: 'white' }}>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ flex: 1, padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          
          <p style={{ color: '#2e7d32', fontWeight: 'bold' }}>Tu Vehículo Asignado</p>
          <h1 style={{ color: '#0a1945', fontSize: '32px' }}>Unidad Confirmada</h1>
          <p style={{ color: '#666', fontSize: '18px' }}>Código: <strong>{idVehiculo}</strong></p>
          
          <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#d32f2f', margin: '30px 0' }}>
            {Math.floor(tiempoFaltante / 60)}:{tiempoFaltante % 60}
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={cancelarReserva} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
              Cancelar Reserva
            </button>
            <button onClick={() => navigate('/viaje-en-curso', { state: { idVehiculo: idVehiculo } })} style={{ flex: 2, background: '#0a1945', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
              Escanear QR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}