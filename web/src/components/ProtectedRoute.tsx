import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography, Paper, Alert } from '@mui/material'
import { authManager } from '../utils/auth'
import type { AuthState } from '../utils/auth'
import { Lock as LockIcon } from '@mui/icons-material'
import { isSupabaseConfigured } from '../utils/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState())
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  // If Supabase is not configured, show a configuration message
  if (!isSupabaseConfigured) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 3
          }}
        >
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'warning.main' }}>
            Configuration Required
          </Typography>
          <Alert severity="warning" sx={{ mb: 3 }}>
            Supabase authentication is not configured. Please set up your environment variables.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To enable authentication features:
          </Typography>
          <Typography variant="body2" component="div" sx={{ textAlign: 'left', mb: 2 }}>
            1. Run: <code>node setup-env.js</code><br/>
            2. Edit the .env file with your Supabase credentials<br/>
            3. Restart the development server
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For now, you can access the public homepage.
          </Typography>
        </Paper>
      </Box>
    )
  }

  // Show loading state
  if (authState.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          gap: 3
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    )
  }

  // Redirect to login if not authenticated (must have both user and session, and no errors)
  if (!authState.user || !authState.session || authState.error) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Show error state if there's an authentication error
  if (authState.error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: 'background.default',
          p: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 3
          }}
        >
          <LockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
            Authentication Error
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {authState.error}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            Please try logging in again or contact support if the problem persists.
          </Typography>
        </Paper>
      </Box>
    )
  }

  // Render protected content
  return <>{children}</>
}
