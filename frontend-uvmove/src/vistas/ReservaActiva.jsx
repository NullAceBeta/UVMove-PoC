import { useNavigate } from 'react-router-dom'

export default function ReservaActiva() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#0f2152' }}>UV Move</h2>
      <h3 style={{ color: '#1b7a3e' }}>Scooter 02</h3>
      
      <div style={{ border: '2px solid #ccc', height: '150px', margin: '15px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        🛴 [Imagen del Scooter]
      </div>

      <div style={{ textAlign: 'left', marginBottom: '20px' }}>
        <p><strong>Tarifa:</strong> $2.00 / Min</p>
        <p><strong>Ubicación:</strong> Estación USBI</p>
      </div>

      {/* Alerta del temporizador que pidieron en la rúbrica */}
      <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', border: '1px solid #ffeeba', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>⚠️ ¡Tienes 10 min para iniciar!</strong>
      </div>

      <button style={{ background: '#1b7a3e', color: 'white', padding: '15px', width: '100%', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold' }}>
        🔳 QR Iniciar
      </button>

      <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', color: '#0f2152', marginTop: '15px', border: 'none', textDecoration: 'underline' }}>
        Volver al Mapa
      </button>
    </div>
  )
}
