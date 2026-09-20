import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function DetalleVehiculo({ session }) {
  const navigate = useNavigate()
  const correoUsuario = session?.user?.email
  const token = session?.access_token 

  const [catalogo, setCatalogo] = useState([])

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/vehiculos', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setCatalogo(data)
        }
      } catch (error) {
        console.error("Error de conexión:", error)
      }
    }
    if(token) fetchVehiculos()
  }, [token])

  const solicitarReserva = async (idVehiculoParams) => {
    const horaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');

    try {
      const response = await fetch('http://localhost:3000/api/prestamos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          correo: correoUsuario, 
          idVehiculo: idVehiculoParams, 
          hora_salida: horaActual 
        })
      })

      if (!response.ok) throw new Error('Bloqueado por Regla de Negocio 2')
      
      navigate('/reserva-activa', { state: { idVehiculo: idVehiculoParams }, replace: true })
      
    } catch (error) {
      navigate('/error-reserva')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', alignItems: 'center', gap: '30px', color: 'white' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>⬅ Atrás</button>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ padding: '40px 50px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <p style={{ color: '#2e7d32', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '5px' }}>ESTACIÓN USBI</p>
        <h1 style={{ color: '#0a1945', fontSize: '36px', marginTop: 0, marginBottom: '40px' }}>Catálogo de Vehículos</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
          
          {catalogo.length === 0 && <p style={{ fontSize: '18px', color: '#666' }}>Cargando vehículos desde el sistema...</p>}

          {catalogo.map((vehiculo) => (
            <div key={vehiculo.IDVEHICULO} style={{ background: vehiculo.ESTADO === 'Libre' ? 'white' : '#f9f9f9', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', opacity: vehiculo.ESTADO === 'Libre' ? 1 : 0.6, border: vehiculo.ESTADO === 'Libre' ? 'none' : '1px dashed #ccc' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '50px', background: vehiculo.ESTADO === 'Libre' ? '#f4f5f9' : '#eee', padding: '20px', borderRadius: '15px', marginRight: '25px', filter: vehiculo.ESTADO === 'Libre' ? 'none' : 'grayscale(100%)' }}>
                  {vehiculo.TIPO === 'Bicicleta' ? '🚲' : '🛴'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: vehiculo.ESTADO === 'Libre' ? '#0a1945' : '#999', fontSize: '22px' }}>{vehiculo.TIPO}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#999', fontSize: '14px' }}>Código: <strong>{vehiculo.IDVEHICULO}</strong></p>
                  
                  {vehiculo.ESTADO === 'Libre' && <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>✅ Disponible</span>}
                  {vehiculo.ESTADO === 'En uso' && <span style={{ background: '#ffebee', color: '#c62828', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>⛔ En Uso</span>}
                  {vehiculo.ESTADO === 'Mantenimiento' && <span style={{ background: '#fff3cd', color: '#856404', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>🔧 Mantenimiento</span>}
                </div>
              </div>
              
              <button 
                onClick={() => solicitarReserva(vehiculo.IDVEHICULO)} 
                disabled={vehiculo.ESTADO !== 'Libre'}
                style={{ background: vehiculo.ESTADO === 'Libre' ? '#2e7d32' : '#ccc', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: vehiculo.ESTADO === 'Libre' ? 'pointer' : 'not-allowed' }}
              >
                {vehiculo.ESTADO === 'Libre' ? 'Reservar Vehículo' : 'No Disponible'}
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}