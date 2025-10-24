import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './style.css'

// Material UI theme setup
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
// Roboto font (recommended by MUI)
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Register from './pages/Register'
import Payment from './pages/Payment'
import LuckyDraw from './pages/LuckyDraw'
import DueList from './pages/DueList'
import MonthwiseDue from './pages/MonthwiseDue'
import Laptop from './pages/Laptop'
import Inverter from './pages/Inverter'
import Camera from './pages/Camera'
import TestAuth from './pages/TestAuth'
import ProtectedRoute from './components/ProtectedRoute'
import AuthGuard from './components/AuthGuard'

const router = createBrowserRouter([
  { 
    path: '/', 
    element: (
      <AuthGuard>
        <Home />
      </AuthGuard>
    ) 
  },
  { 
    path: '/login', 
    element: (
      <AuthGuard>
        <Login />
      </AuthGuard>
    ) 
  },
  { 
    path: '/dashboard', 
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/register', 
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/payment', 
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/lucky-draw', 
    element: (
      <ProtectedRoute>
        <LuckyDraw />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/due-list', 
    element: (
      <ProtectedRoute>
        <DueList />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/monthwise-due', 
    element: (
      <ProtectedRoute>
        <MonthwiseDue />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/laptop', 
    element: (
      <ProtectedRoute>
        <Laptop />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/inverter', 
    element: (
      <ProtectedRoute>
        <Inverter />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/camera', 
    element: (
      <ProtectedRoute>
        <Camera />
      </ProtectedRoute>
    ) 
  },
  // Category-scoped routes
  { 
    path: '/:category/register', 
    element: (
      <ProtectedRoute>
        <Register />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/:category/payment', 
    element: (
      <ProtectedRoute>
        <Payment />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/:category/due-list', 
    element: (
      <ProtectedRoute>
        <DueList />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/:category/monthwise-due', 
    element: (
      <ProtectedRoute>
        <MonthwiseDue />
      </ProtectedRoute>
    ) 
  },
  { 
    path: '/:category/lucky-draw', 
    element: (
      <ProtectedRoute>
        <LuckyDraw />
      </ProtectedRoute>
    ) 
  },
  // Test route (remove in production)
  { 
    path: '/test-auth', 
    element: <TestAuth />
  },
])

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#ffb74d', contrastText: '#000000' }, // light orange AppBar with black text
    secondary: { main: '#ff6d00' },
    background: { default: '#f5f5dc', paper: '#ffffff' }, // beige background
  },
  shape: { borderRadius: 10 },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)


