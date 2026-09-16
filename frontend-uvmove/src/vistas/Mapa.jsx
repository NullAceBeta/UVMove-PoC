import { useNavigate } from 'react-router-dom'

export default function Mapa() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#0f2152' }}>UV Move</h2>
      
      {/* Cuadro gris que simula el mapa de Figma */}
      <div style={{ background: '#e0e0e0', height: '250px', margin: '20px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
        <p style={{ color: '#666' }}>[Mapa Interactivo Simulado]</p>
      </div>
      
      <button 
        onClick={() => navigate('/vehiculos')} 
        style={{ background: '#1b7a3e', color: 'white', padding: '12px 20px', width: '100%', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Buscar Vehículos
      </button>
    </div>
  )
}
