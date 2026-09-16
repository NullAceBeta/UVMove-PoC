import { useNavigate } from 'react-router-dom'

export default function ErrorReserva() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px', textAlign: 'center', marginTop: '40px' }}>
      <h2 style={{ color: '#0f2152' }}>UV Move</h2>
      
      {/* Icono de la X roja gigante */}
      <div style={{ fontSize: '100px', margin: '20px 0' }}>
        ❌
      </div>
      
      <p style={{ color: '#333', fontSize: '18px', marginBottom: '40px' }}>
        No puedes reservar este vehículo porque <strong>ya tienes un viaje o reserva activa.</strong>
      </p>
      
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: '#0f2152', color: 'white', padding: '15px 30px', border: 'none', borderRadius: '5px', fontWeight: 'bold', width: '100%', cursor: 'pointer' }}
      >
        REGRESAR
      </button>
    </div>
  )
}
