import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function DetalleVehiculo({ session }) {
  const navigate = useNavigate()
  const correoUsuario = session?.user?.email
  const [catalogo, setCatalogo] = useState([])

  // Descargamos los 4 vehículos insertados en la semilla SQL de Db2
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/vehiculos')
        if (res.ok) {
          const data = await res.json()
          setCatalogo(data)
        }
      } catch (error) {
        console.error("Esperando la API de Carlos...", error)
      }
    }
    fetchVehiculos()
  }, [])

  const solicitarReserva = async (idVehiculo) => {
    try {
      const response = await fetch('http://localhost:3000/api/solicitarReserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: correoUsuario, id_vehiculo: idVehiculo })
      })

      if (!response.ok) throw new Error('Bloqueado por Regla de Negocio 2')
      navigate('/reserva-activa', { state: { idVehiculo: idVehiculo } })
      
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
        <h1 style={{ color: '#0a1945', fontSize: '36px', marginTop: 0, marginBottom: '40px' }}>Catálogo Db2</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '30px' }}>
          
          {catalogo.length === 0 && <p>Cargando vehículos desde IBM Db2...</p>}

          {catalogo.map((vehiculo) => (
            <div key={vehiculo.id_vehiculo} style={{ background: vehiculo.estado === 'Disponible' ? 'white' : '#f9f9f9', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', opacity: vehiculo.estado === 'Disponible' ? 1 : 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '50px', background: '#f4f5f9', padding: '20px', borderRadius: '15px', marginRight: '25px' }}>
                  {vehiculo.tipo === 'Bicicleta' ? '🚲' : '🛴'}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#0a1945', fontSize: '22px' }}>{vehiculo.tipo}</h3>
                  <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>Código: <strong>{vehiculo.id_vehiculo}</strong></p>
                  <span style={{ background: vehiculo.estado === 'Disponible' ? '#e8f5e9' : '#ffebee', color: vehiculo.estado === 'Disponible' ? '#2e7d32' : '#c62828', padding: '5px 12px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' }}>
                    {vehiculo.estado}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => solicitarReserva(vehiculo.id_vehiculo)} 
                disabled={vehiculo.estado !== 'Disponible'}
                style={{ background: vehiculo.estado === 'Disponible' ? '#2e7d32' : '#ccc', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: vehiculo.estado === 'Disponible' ? 'pointer' : 'not-allowed' }}
              >
                {vehiculo.estado === 'Disponible' ? 'Reservar' : 'Ocupado'}
              </button>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}