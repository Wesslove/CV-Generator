import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import './index.css'
import App from './App.jsx'

// Enregistrement du Service Worker
const updateSW = registerSW({
  onNeedRefresh: () => {
    console.log('Nouvelle version disponible')
  },
  onOfflineReady: () => {
    console.log('Application prête en offline')
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)