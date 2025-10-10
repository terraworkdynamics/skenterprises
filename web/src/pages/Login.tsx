import { type FormEvent, useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  Stack,
  CircularProgress,
  Link,
  Divider,
  Avatar,
  Fade,
  Slide,
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Home as HomeIcon,
} from '@mui/icons-material'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('rememberEmail')
    if (saved) {
      setEmail(saved)
      setRemember(true)
    }
  }, [])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (!supabase) {
        throw new Error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw error
      }
      if (data.session) {
        if (remember) {
          localStorage.setItem('rememberEmail', email)
        } else {
          localStorage.removeItem('rememberEmail')
        }
        navigate('/dashboard')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', backgroundColor: 'background.default' }}>
      {/* Top wave decoration */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', top: 0 }}>
          <path fill="#7c3aed" fillOpacity="0.08" d="M0,192L80,170.7C160,149,320,107,480,96C640,85,800,107,960,133.3C1120,160,1280,192,1360,208L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </Box>

      <Container maxWidth="sm" sx={{ py: 4, position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Fade in timeout={700}>
          <Paper elevation={8} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, maxWidth: 520, mx: 'auto' }}>
            <Slide in timeout={700} direction="up">
              <Box>
                <Stack spacing={2} alignItems="center">
                  <Avatar src="/logo.jpeg" alt="SK Enterprises" sx={{ width: 58, height: 58, boxShadow: 1 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#6d28d9', letterSpacing: 0.3 }}>Admin Login</Typography>
                  <Typography color="text.secondary" align="center">
                    Welcome! Please sign in to access the admin dashboard.
                  </Typography>
                  {error && <Alert severity="error" onClose={() => setError(null)} sx={{ alignSelf: 'stretch' }}>{error}</Alert>}
                </Stack>

                <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    <TextField
                      label="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      fullWidth
                      required
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      label="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      required
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)} edge="end">
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FormControlLabel
                      control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
                      label="Remember my email on this device"
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button
                        type="submit"
                        size="large"
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
                        disabled={loading}
                        sx={{
                          px: 4,
                          py: 1.2,
                          color: '#fff',
                          fontWeight: 700,
                          letterSpacing: 0.6,
                          background: 'linear-gradient(90deg,#7c3aed 0%, #6d28d9 100%)',
                          '&:hover': { background: 'linear-gradient(90deg,#6d28d9 0%, #5b21b6 100%)' },
                          boxShadow: '0 8px 20px rgba(109,40,217,0.25)'
                        }}
                      >
                        {loading ? 'SIGNING IN' : 'SIGN IN'}
                      </Button>
                      <Button component={RouterLink} to="/" variant="text" startIcon={<HomeIcon />}>Back to Home</Button>
                    </Stack>
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  Forgot password? Contact the administrator at <Link href="tel:9972749555">9972749555</Link>
                </Typography>
              </Box>
            </Slide>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}


