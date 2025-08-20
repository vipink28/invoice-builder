import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { InvoiceProvider } from './context/InvoiceContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <InvoiceProvider>
          <App />
        </InvoiceProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
