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

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/register', element: <Register /> },
  { path: '/payment', element: <Payment /> },
  { path: '/lucky-draw', element: <LuckyDraw /> },
  { path: '/due-list', element: <DueList /> },
  { path: '/monthwise-due', element: <MonthwiseDue /> },
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


