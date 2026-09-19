import { useNavigate } from 'react-router-dom'

export default function ErrorReserva() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', alignItems: 'center', color: 'white', gap: '30px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          ⬅ Atrás
        </button>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ flex: 1, padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '25px', padding: '60px 50px', maxWidth: '550px', width: '100%', boxShadow: '0 15px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '6px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', margin: '0 auto 30px auto', background: '#fef2f2' }}>
            ❌
          </div>
          
          <h2 style={{ color: '#0a1945', marginBottom: '20px', fontSize: '32px' }}>Reserva Denegada</h2>
          <p style={{ color: '#666', fontSize: '18px', marginBottom: '50px', lineHeight: '1.6' }}>
            El sistema detectó que <strong>ya cuentas con un viaje activo o una reserva pendiente</strong>.
          </p>
          
          <button onClick={() => navigate('/mapa')} style={{ background: '#2e7d32', color: 'white', padding: '18px 40px', border: 'none', borderRadius: '15px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
            Aceptar y Volver al Mapa
          </button>
        </div>
      </div>
    </div>
  )
}