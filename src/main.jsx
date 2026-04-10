/**
 * Point d'entree de l'application.
 *
 * - Charge les styles globaux
 * - Enregistre le service worker (PWA)
 * - Monte le composant racine `App` dans `#root`
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

const updateSW = registerSW({
  onNeedRefresh: () => {
    console.log('Nouvelle version disponible')
  },
  onOfflineReady: () => {
    console.log('Application prête en offline')
  }
})
void updateSW

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)