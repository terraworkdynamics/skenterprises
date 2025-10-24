import { type FormEvent, useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { authManager } from '../utils/auth'

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
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  Home as HomeIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Get redirect path from location state
  const from = (location.state as any)?.from || '/dashboard'

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const result = await authManager.signIn(email, password)
      
      if (result.success) {
        if (remember) {
          localStorage.setItem('rememberEmail', email)
        } else {
          localStorage.removeItem('rememberEmail')
        }
        navigate(from, { replace: true })
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err: any) {
      setError(err?.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', backgroundColor: 'background.default' }}>
      {/* Top wave decoration (maroon) */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ position: 'absolute', top: 0 }}>
          <path fill="#800000" fillOpacity="0.06" d="M0,192L80,170.7C160,149,320,107,480,96C640,85,800,107,960,133.3C1120,160,1280,192,1360,208L1440,224L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
        </svg>
      </Box>

      {/* Transparent logo background overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/logo.jpeg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'min(60vw, 420px)',
          opacity: 0.06,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="sm" sx={{ py: { xs: 2, sm: 4 }, position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ position: 'absolute', top: { xs: 10, sm: 20 }, left: { xs: 10, sm: 20 }, zIndex: 1000 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.9)',
              fontSize: isMobile ? '0.75rem' : '0.875rem'
            }}
          >
            Back
          </Button>
        </Box>
        <Fade in timeout={700}>
          <Paper elevation={8} sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 3, 
            maxWidth: 520, 
            mx: 'auto', 
            width: '100%',
            background: 'rgba(255,255,255,0.95)', 
            border: '1px solid rgba(128,0,0,0.2)', 
            boxShadow: '0 10px 30px rgba(128,0,0,0.08)' 
          }}>
            <Slide in timeout={700} direction="up">
              <Box>
                <Stack spacing={2} alignItems="center">
                  <Avatar 
                    src="/logo.jpeg" 
                    alt="SK Enterprises" 
                    sx={{ 
                      width: { xs: 48, sm: 58 }, 
                      height: { xs: 48, sm: 58 }, 
                      boxShadow: 1 
                    }} 
                  />
                  <Typography 
                    variant={isMobile ? "h6" : "h5"} 
                    sx={{ 
                      fontWeight: 800, 
                      color: '#800000', 
                      letterSpacing: 0.3,
                      fontSize: isMobile ? '1.25rem' : '1.5rem'
                    }}
                  >
                    Admin Login
                  </Typography>
                  <Typography 
                    color="text.secondary" 
                    align="center"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
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
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '16px', // Prevents zoom on iOS
                        },
                      }}
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
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '16px', // Prevents zoom on iOS
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton 
                              aria-label={showPassword ? 'Hide password' : 'Show password'} 
                              onClick={() => setShowPassword((v) => !v)} 
                              edge="end"
                              sx={{ 
                                minHeight: 44, 
                                minWidth: 44,
                                touchAction: 'manipulation'
                              }}
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={remember} 
                          onChange={(e) => setRemember(e.target.checked)}
                          sx={{ 
                            '& .MuiSvgIcon-root': { fontSize: { xs: 20, sm: 24 } }
                          }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          Remember my email on this device
                        </Typography>
                      }
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button
                        type="submit"
                        size={isMobile ? "medium" : "large"}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LoginIcon />}
                        disabled={loading}
                        sx={{
                          px: { xs: 3, sm: 4 },
                          py: { xs: 1.5, sm: 1.2 },
                          color: '#fff',
                          fontWeight: 700,
                          letterSpacing: 0.6,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          minHeight: 44,
                          background: 'linear-gradient(90deg,#800000 0%, #5B0000 100%)',
                          '&:hover': { background: 'linear-gradient(90deg,#5B0000 0%, #440000 100%)' },
                          boxShadow: '0 8px 20px rgba(128,0,0,0.25)',
                          touchAction: 'manipulation'
                        }}
                      >
                        {loading ? 'SIGNING IN' : 'SIGN IN'}
                      </Button>
                      <Button 
                        component={RouterLink} 
                        to="/" 
                        variant="text" 
                        startIcon={<HomeIcon />}
                        size={isMobile ? "medium" : "large"}
                        sx={{
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                          minHeight: 44,
                          touchAction: 'manipulation'
                        }}
                      >
                        Back to Home
                      </Button>
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


