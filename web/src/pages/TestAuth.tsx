import { useEffect, useState } from 'react'
import { Box, Typography, Paper, Button, Alert } from '@mui/material'
import { authManager } from '../utils/auth'
import type { AuthState } from '../utils/auth'

export default function TestAuth() {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState())

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState)
    return unsubscribe
  }, [])

  const handleTestLogin = async () => {
    const result = await authManager.signIn('test@example.com', 'password123')
    console.log('Login result:', result)
  }

  const handleTestLogout = async () => {
    await authManager.signOut()
  }

  const handleValidateSession = async () => {
    const isValid = await authManager.validateSession()
    console.log('Session valid:', isValid)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Authentication Test Page
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current Auth State:
        </Typography>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(authState, null, 2)}
        </pre>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Authentication Status:
        </Typography>
        <Alert severity={authManager.isAuthenticated() ? 'success' : 'error'}>
          {authManager.isAuthenticated() ? 'Authenticated' : 'Not Authenticated'}
        </Alert>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test Actions:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleTestLogin}>
            Test Login
          </Button>
          <Button variant="contained" onClick={handleTestLogout}>
            Test Logout
          </Button>
          <Button variant="contained" onClick={handleValidateSession}>
            Validate Session
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
