/**
 * main
 * Rôle : initialise l'application React et enregistre les hooks de mise a jour PWA.
 * Entrées : element racine du DOM navigateur (#root).
 * Sorties : monte <App /> dans le DOM.
 * Responsabilités :
 * - importer la feuille de style globale
 * - initialiser l'enregistrement du service worker
 * - rendre la racine React en StrictMode
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