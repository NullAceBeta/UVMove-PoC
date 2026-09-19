import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ReservaActiva() {
  const navigate = useNavigate()
  
  // Recibimos el dato de la pantalla anterior
  const location = useLocation()
  const idVehiculo = location.state?.idVehiculo || 'No identificado'
  
  // Para saber si dibujar bici o scooter basado en el ID
  const iconoVehiculo = idVehiculo.includes('BI') ? '🚲' : '🛴'
  const tipoVehiculo = idVehiculo.includes('BI') ? 'Bicicleta' : 'Scooter Eléctrico'

  const [tiempoFaltante, setTiempoFaltante] = useState(600) 

  useEffect(() => {
    const timer = setInterval(() => {
      setTiempoFaltante((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutos = Math.floor(tiempoFaltante / 60)
  const segundos = tiempoFaltante % 60
  const tiempoFormateado = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`

  const cancelarReserva = () => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar tu reserva actual?")
    if (confirmar) {
      alert("Reserva cancelada exitosamente. El vehículo vuelve a estar disponible.")
      navigate('/mapa')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', alignItems: 'center', color: 'white', gap: '30px' }}>
        <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⬅ Volver al Mapa
        </button>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ flex: 1, padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <p style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px 0' }}>Tu Vehículo Asignado</p>
          <h1 style={{ color: '#0a1945', fontSize: '32px', margin: '0 0 5px 0' }}>{tipoVehiculo}</h1>
          <p style={{ color: '#666', fontSize: '18px', margin: '0 0 30px 0' }}>Código: <strong>{idVehiculo}</strong></p>
          
          <div style={{ background: '#f8f9fa', borderRadius: '15px', padding: '40px', textAlign: 'center', marginBottom: '30px', fontSize: '100px', border: '1px solid #eee' }}>
            {iconoVehiculo}
          </div>

          <div style={{ background: '#fff9e6', border: '2px solid #ffeeba', borderRadius: '15px', padding: '20px', marginBottom: '30px' }}>
            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#856404', fontSize: '18px' }}>⚠️ Tienes para escanear el QR:</p>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#d32f2f', fontFamily: 'monospace' }}>
              {tiempoFormateado}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={cancelarReserva} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '15px', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar Reserva
            </button>
            <button 
              // Le volvemos a pasar el ID a la pantalla del viaje
              onClick={() => navigate('/viaje-en-curso', { state: { idVehiculo: idVehiculo } })} 
              style={{ flex: 2, background: '#0a1945', color: 'white', padding: '15px', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(10, 25, 69, 0.3)' }}
            >
              Escanear QR
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}