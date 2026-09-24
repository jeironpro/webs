import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource/jetbrains-mono/500.css'
import '@/styles/tokens.css'
import '@/styles/globals.css'
import App from './App'

const root = document.getElementById('root')

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
)
