import React from 'react'
import { createRoot } from 'react-dom/client'

const api = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
  const [msg, setMsg] = React.useState('')

  React.useEffect(() => {
    fetch(`${api}/api/ping`).then(r => r.text()).then(setMsg).catch(() => setMsg('API unreachable'))
  }, [])

  return (
    <div style={{fontFamily:'system-ui', padding:24}}>
      <h1>Telemetry Dashboard</h1>
      <p>Gateway says: <b>{msg}</b></p>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
