import { useNavigate } from 'react-router-dom'

export default function DetalleVehiculo({ session }) {
  const navigate = useNavigate()
  
  // Obtenemos el ID del usuario directamente de la sesión de Supabase
  const idUsuario = session?.user?.id

  const solicitarReserva = async (idVehiculo) => {
    try {
      // Esta URL apuntará a la API local de Carlos
      const urlAPI = 'http://localhost:3000/api/solicitarReserva' 
      
      const response = await fetch(urlAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_usuario: idUsuario, 
          id_vehiculo: idVehiculo 
        })
      })

      // Si la API de Carlos detecta que ya hay reserva (RN2), mandará un error
      if (!response.ok) {
        throw new Error('Rechazo por Regla de Negocio 2')
      }
      
      // Si el backend da luz verde (HTTP 200 OK)
      navigate('/reserva-activa')
    } catch (error) {
      // Atrapamos el error y mandamos a la pantalla de la X roja
      navigate('/error-reserva')
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ background: '#eee', border: 'none', padding: '8px 12px', borderRadius: '5px', cursor: 'pointer' }}
      >
        {"< Atrás"}
      </button>
      
      <h2 style={{ color: '#0f2152', marginTop: '20px' }}>Vehículos Disponibles</h2>
      
      <div style={{ border: '2px solid #1b7a3e', padding: '15px', margin: '15px 0', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Scooter 02</h3>
        <p style={{ margin: '0 0 15px 0', color: '#666' }}>ID: V-SC-02</p>
        
        <button 
          onClick={() => solicitarReserva('V-SC-02')} 
          style={{ background: '#1b7a3e', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }}
        >
          Reservar
        </button>
      </div>
    </div>
  )
}
