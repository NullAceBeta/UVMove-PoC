import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function ViajeEnCurso({ session }) {
  const navigate = useNavigate()
  const location = useLocation()
  const correoUsuario = session?.user?.email || ''
  const token = session?.access_token // Extraemos el token para la API
  const nombreDinamico = session?.user?.user_metadata?.nombre_usuario || correoUsuario.split('@')[0] || 'Usuario'
  
  // Rescatamos el ID del vehículo y lo forzamos a texto para evitar errores
  const vehiculoGuardado = localStorage.getItem('viajeVehiculo')
  const idVehiculo = String(location.state?.idVehiculo || vehiculoGuardado || 'No identificado')
  
  const [segundosTranscurridos, setSegundosTranscurridos] = useState(0)
  const tarifaPorMinuto = 2.00

  useEffect(() => {
    // Guardamos el vehículo en memoria por si el usuario se va a otra pantalla
    if (idVehiculo !== 'No identificado') {
      localStorage.setItem('viajeVehiculo', idVehiculo)
    }

    // Buscamos si ya había un viaje iniciado antes. Si no, registramos la hora actual.
    let horaInicio = localStorage.getItem('viajeInicio')
    if (!horaInicio) {
      horaInicio = Date.now().toString()
      localStorage.setItem('viajeInicio', horaInicio)
    }

    // Calculamos el tiempo real transcurrido basado en el reloj interno de la compu
    const actualizarReloj = () => {
      const ahora = Date.now()
      const diferenciaSegundos = Math.floor((ahora - parseInt(horaInicio)) / 1000)
      // CORRECCIÓN 1: Corregido el typo "diferancia" -> "diferencia"
      setSegundosTranscurridos(diferenciaSegundos)
    }

    actualizarReloj() // Llamada inicial
    const timer = setInterval(actualizarReloj, 1000)
    return () => clearInterval(timer)
  }, [idVehiculo])

  const minutos = Math.floor(segundosTranscurridos / 60)
  const segundos = segundosTranscurridos % 60
  const tiempoFormateado = `00:${minutos < 10 ? '0' : ''}${minutos}:${segundos < 10 ? '0' : ''}${segundos}`
  const costoActual = ((segundosTranscurridos / 60) * tarifaPorMinuto).toFixed(2)

  const finalizarViajeDb = async () => {
    try {
      // CORRECCIÓN 2: Formateamos la hora y agregamos el Token JWT al fetch
      const horaActual = new Date().toISOString().slice(0, 19).replace('T', ' ');
      
      await fetch('http://localhost:3000/api/prestamos/finalizar', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ correo: correoUsuario, hora_llegada: horaActual })
      })
      
      // Limpiamos la memoria del navegador para el próximo viaje
      localStorage.removeItem('viajeInicio')
      localStorage.removeItem('viajeVehiculo')
      
      alert(`Viaje finalizado en base de datos.\nTotal a pagar: $${costoActual}`)
      navigate('/mapa')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f4f5f9' }}>
      
      <header style={{ background: '#0a1945', padding: '15px 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white' }}>
        <button onClick={() => navigate('/mapa')} style={{ background: 'transparent', border: '1px solid white', color: 'white', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Regresar al Mapa
        </button>
        <h2 style={{ margin: 0, fontSize: '28px' }}><span style={{ color: 'white' }}>UV</span><span style={{ color: '#2e7d32' }}>Move</span></h2>
        <div style={{ width: '130px' }}></div> {/* Espaciador para centrar el logo */}
      </header>

      <div style={{ flex: 1, padding: '40px 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '40px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
          
          <h1 style={{ color: '#0a1945', fontSize: '28px', margin: '0 0 10px 0' }}>Feliz Viaje, {nombreDinamico}</h1>
          <p style={{ color: '#666', margin: '0 0 30px 0', fontSize: '16px' }}>Conduce con precaución por el campus.</p>
          
          <div style={{ fontSize: '70px', fontWeight: 'bold', color: '#0a1945', fontFamily: 'monospace', marginBottom: '10px' }}>
            {tiempoFormateado}
          </div>
          
          <div style={{ width: '100px', height: '100px', background: '#eee', borderRadius: '50%', margin: '0 auto 40px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
              ⏱️
          </div>

          <h2 style={{ color: '#333', fontSize: '18px', margin: '0 0 10px 0', textTransform: 'uppercase' }}>ID del Vehículo en uso</h2>
          <p style={{ fontSize: '28px', letterSpacing: '4px', margin: '0 0 30px 0', fontFamily: 'monospace', fontWeight: 'bold', color: '#2e7d32' }}>
            {idVehiculo}
          </p>

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
            <button onClick={() => alert('Falla reportada a soporte. Se ha pausado tu tarifa.')} style={{ flex: 1, background: '#ef4444', color: 'white', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              Reportar Falla
            </button>
            <button onClick={finalizarViajeDb} style={{ flex: 1, background: '#4ade80', color: '#0a1945', padding: '15px', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              Finalizar Viaje
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}