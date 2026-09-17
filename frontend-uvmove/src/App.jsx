import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Login from './vistas/Login.jsx'
import Mapa from './vistas/Mapa.jsx'
import DetalleVehiculo from './vistas/DetalleVehiculo.jsx'
import ReservaActiva from './vistas/ReservaActiva.jsx'
import ViajeEnCurso from './vistas/ViajeEnCurso.jsx'
import ErrorReserva from './vistas/ErrorReserva.jsx'

export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  return (
    <Router>
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f4f5f9' }}>
        <Routes>
          <Route path="/" element={!session ? <Login /> : <Navigate to="/mapa" />} />
          <Route path="/mapa" element={session ? <Mapa session={session} /> : <Navigate to="/" />} />
          <Route path="/vehiculos" element={session ? <DetalleVehiculo session={session} /> : <Navigate to="/" />} />
          <Route path="/reserva-activa" element={session ? <ReservaActiva /> : <Navigate to="/" />} />
          <Route path="/viaje-en-curso" element={session ? <ViajeEnCurso session={session} /> : <Navigate to="/" />} />
          <Route path="/error-reserva" element={session ? <ErrorReserva /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  )
}