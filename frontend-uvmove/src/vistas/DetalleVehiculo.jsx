import { useNavigate } from 'react-router-dom'

export default function DetalleVehiculo({ session }) {
  const navigate = useNavigate()
  const idUsuario = session?.user?.id

  const solicitarReserva = async (idVehiculo) => {
    try {
      const urlAPI = 'http://localhost:3000/api/solicitarReserva' 
      const response = await fetch(urlAPI, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: idUsuario, id_vehiculo: idVehiculo })
      })

      if (!response.ok) throw new Error('Rechazo por Regla de Negocio 2')
      
      // Magia aquí: Pasamos el ID del vehículo a la siguiente pantalla
      navigate('/reserva-activa', { state: { idVehiculo: idVehiculo } })
      
    } catch (error) {
      navigate('/error-reserva')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            ⬅ Atrás
          </button>
          <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
        </div>
      </header>

      <div style={{ padding: '40px 50px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <p style={{ color: '#2e7d32', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>ESTACIÓN USBI</p>
        <h1 style={{ color: '#0a1945', fontSize: '36px', marginTop: 0, marginBottom: '40px' }}>Catálogo de Vehículos</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
          
          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '50px', background: '#f4f5f9', padding: '20px', borderRadius: '15px', marginRight: '25px' }}>🛴</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0a1945', fontSize: '22px' }}>Scooter Eléctrico</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Código: <strong>V-SC-05</strong></p>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>● Disponible</span>
              </div>
            </div>
            <button onClick={() => solicitarReserva('V-SC-05')} style={{ background: '#2e7d32', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Reservar Vehículo</button>
          </div>

          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '50px', background: '#f4f5f9', padding: '20px', borderRadius: '15px', marginRight: '25px' }}>🚲</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0a1945', fontSize: '22px' }}>Bicicleta Standard</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Código: <strong>V-BI-02</strong></p>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>● Disponible</span>
              </div>
            </div>
            <button onClick={() => solicitarReserva('V-BI-02')} style={{ background: '#2e7d32', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Reservar Vehículo</button>
          </div>

          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '50px', background: '#f4f5f9', padding: '20px', borderRadius: '15px', marginRight: '25px' }}>🛴</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0a1945', fontSize: '22px' }}>Scooter Eléctrico</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Código: <strong>V-SC-11</strong></p>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>● Disponible</span>
              </div>
            </div>
            <button onClick={() => solicitarReserva('V-SC-11')} style={{ background: '#2e7d32', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Reservar Vehículo</button>
          </div>

          <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ fontSize: '50px', background: '#f4f5f9', padding: '20px', borderRadius: '15px', marginRight: '25px' }}>🚲</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0a1945', fontSize: '22px' }}>Bicicleta Standard</h3>
                <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Código: <strong>V-BI-15</strong></p>
                <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>● Disponible</span>
              </div>
            </div>
            <button onClick={() => solicitarReserva('V-BI-15')} style={{ background: '#2e7d32', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Reservar Vehículo</button>
          </div>

        </div>
      </div>
    </div>
  )
}