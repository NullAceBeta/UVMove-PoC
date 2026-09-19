import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ViajeEnCurso({ session }) {
  const navigate = useNavigate()
  const nombreDinamico = session?.user?.user_metadata?.nombre_usuario || session?.user?.email?.split('@')[0] || 'Estudiante'
  
  // Cronómetro que avanza hacia arriba
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0)
  const tarifaPorMinuto = 2.00

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundosTranscurridos((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const minutos = Math.floor(segundosTranscurridos / 60)
  const segundos = segundosTranscurridos % 60
  const tiempoFormateado = `00:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`
  
  // Calcula el costo en tiempo real (te cobra el minuto desde que empieza)
  const costoActual = ((minutos + (segundos > 0 ? 1 : 0)) * tarifaPorMinuto).toFixed(2)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
        {/* Quitamos el botón de regresar para bloquear al usuario aquí */}
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
      </header>

      <div style={{ flex: 1, padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <h1 style={{ color: '#0a1945', fontSize: '28px', margin: '0 0 10px 0' }}>Feliz Viaje, {nombreDinamico}</h1>
          <p style={{ color: '#666', margin: '0 0 30px 0', fontSize: '16px' }}>Conduce con precaución por el campus.</p>
          
          <div style={{ fontSize: '70px', fontWeight: 'bold', color: '#0a1945', fontFamily: 'monospace', marginBottom: '10px' }}>
            {tiempoFormateado}
          </div>
          
          <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '50%', margin: '0 auto 40px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#666', fontWeight: 'bold' }}>
            ⏱ Reloj
          </div>

          <h2 style={{ color: '#333', fontSize: '18px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>ID del Vehículo en uso</h2>
          <p style={{ fontSize: '24px', letterSpacing: '4px', margin: '0 0 30px 0', fontFamily: 'monospace', fontWeight: 'bold' }}>
            V-SC-05
          </p>

          {/* Tarifa en Tiempo Real */}
          <div style={{ background: '#e8f5e9', borderRadius: '15px', padding: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Tarifa aplicada</p>
              <p style={{ margin: 0, color: '#2e7d32', fontWeight: 'bold', fontSize: '18px' }}>${tarifaPorMinuto.toFixed(2)} / min</p>
            </div>
            <div style={{ borderLeft: '2px solid #c8e6c9', paddingLeft: '20px' }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Costo actual</p>
              <p style={{ margin: 0, color: '#0a1945', fontWeight: 'bold', fontSize: '28px' }}>${costoActual}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={() => { 
    alert('Falla reportada. Tu viaje ha sido cancelado sin costo y el vehículo se marcó en mantenimiento.'); 
    navigate('/mapa'); 
  }} 
  style={{ flex: 1, background: '#ef4444', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
>
  Reportar Falla
</button>
            <button onClick={() => { alert(`Viaje finalizado. Total a pagar: $${costoActual}`); navigate('/mapa'); }} style={{ flex: 1, background: '#4ade80', color: '#0a1945', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              Finalizar Viaje
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}