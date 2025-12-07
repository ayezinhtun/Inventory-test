import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { UserProfileProvider } from './context/UserProfileContext.jsx'
import { DeviceRequestProvider } from './context/DeviceRequestContext.jsx'
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UserProfileProvider>
            <DeviceRequestProvider>
              <App />
            </DeviceRequestProvider>
        </UserProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
