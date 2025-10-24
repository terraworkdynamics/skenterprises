import { type MouseEvent, useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'
import { authManager } from '../utils/auth'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  Paper,
  Stack,
  Avatar,
  Chip,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Logout as LogoutIcon,
  Laptop as LaptopIcon,
  Videocam as CameraIcon,
  BatteryChargingFull as InverterIcon,
  Group as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material'

export default function Dashboard() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const [counts, setCounts] = useState<{ laptop: number; camera: number; inverter: number }>({ laptop: 0, camera: 0, inverter: 0 })
  const [totals, setTotals] = useState<{ laptop: number; camera: number; inverter: number }>({ laptop: 0, camera: 0, inverter: 0 })
  const [loading, setLoading] = useState(false)

  async function logout(e?: MouseEvent) {
    e?.preventDefault()
    await authManager.signOut()
    navigate('/')
  }

  useEffect(() => {
    if (!supabase) return
    ;(async () => {
      try {
        setLoading(true)
        // Counts
        const [lr, cr, ir] = await Promise.all([
          supabase.from('laptop_registrations').select('*', { count: 'exact', head: true }),
          supabase.from('camera_registrations').select('*', { count: 'exact', head: true }),
          supabase.from('inverter_registrations').select('*', { count: 'exact', head: true }),
        ])
        setCounts({
          laptop: lr.count ?? 0,
          camera: cr.count ?? 0,
          inverter: ir.count ?? 0,
        })

        // Totals
        const [lp, cp, ip] = await Promise.all([
          supabase.from('laptop_payments').select('amount'),
          supabase.from('camera_payments').select('amount'),
          supabase.from('inverter_payments').select('amount'),
        ])
        const sum = (rows?: any[] | null) => (rows || []).reduce((s, r) => s + Number(r.amount || 0), 0)
        setTotals({
          laptop: sum(lp.data as any[]),
          camera: sum(cp.data as any[]),
          inverter: sum(ip.data as any[]),
        })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Background transparent logo */}
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
      <AppBar position="sticky" enableColorOnDark sx={{ bgcolor: '#800000', color: '#FDF6E3', boxShadow: '0 4px 20px rgba(128,0,0,0.25)' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 800, 
              letterSpacing: 0.3,
              fontSize: isMobile ? '1rem' : '1.25rem'
            }}
          >
            Admin Dashboard
          </Typography>
          <Button 
            onClick={logout} 
            startIcon={<LogoutIcon />} 
            sx={{ 
              color: '#FDF6E3',
              fontSize: isMobile ? '0.875rem' : '1rem'
            }}
          >
            {isMobile ? 'Logout' : 'Logout'}
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="inherit" />}
      </AppBar>

      <Container sx={{ py: { xs: 6, md: 10 }, position: 'relative' }}>
        {/* Hero header */}
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(128,0,0,0.95) 0%, rgba(128,0,0,0.85) 60%, rgba(91,0,0,0.9) 100%)', color: '#FDF6E3', overflow: 'hidden', position: 'relative' }}>
          <Box sx={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'url(/vite.svg)', backgroundRepeat: 'no-repeat', backgroundPosition: 'right -40px bottom -40px', backgroundSize: '300px' }} />
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0.4 }}>Welcome back</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Overview of your categories at a glance</Typography>
            </Stack>
            <Chip icon={<TrendingUpIcon sx={{ color: '#800000' }} />} label="Live Overview" sx={{ bgcolor: '#FDF6E3', color: '#800000', fontWeight: 700 }} />
          </Stack>
        </Paper>

        {/* Stats row */}
        <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 2.5 }, 
              textAlign: 'center', 
              borderRadius: 3, 
              border: '2px solid #EEDC82', 
              background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' 
            }}>
              <Stack spacing={1} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#800000',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}>
                  <PeopleIcon sx={{ color: '#FDF6E3', fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Typography variant="overline" sx={{ letterSpacing: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Laptop Customers
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 900 }}>
                  {counts.laptop.toLocaleString('en-IN')}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 2.5 }, 
              textAlign: 'center', 
              borderRadius: 3, 
              border: '2px solid #EEDC82', 
              background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' 
            }}>
              <Stack spacing={1} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#800000',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}>
                  <PeopleIcon sx={{ color: '#FDF6E3', fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Typography variant="overline" sx={{ letterSpacing: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Camera Customers
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 900 }}>
                  {counts.camera.toLocaleString('en-IN')}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 2.5 }, 
              textAlign: 'center', 
              borderRadius: 3, 
              border: '2px solid #EEDC82', 
              background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' 
            }}>
              <Stack spacing={1} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: '#800000',
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 }
                }}>
                  <PeopleIcon sx={{ color: '#FDF6E3', fontSize: { xs: 20, sm: 24 } }} />
                </Avatar>
                <Typography variant="overline" sx={{ letterSpacing: 1, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                  Inverter Customers
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 900 }}>
                  {counts.inverter.toLocaleString('en-IN')}
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Money collected big numbers */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' }}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }}>Laptop Collected</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#800000' }}>₹{Math.round(totals.laptop).toLocaleString('en-IN')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' }}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }}>Camera Collected</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#800000' }}>₹{Math.round(totals.camera).toLocaleString('en-IN')}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)' }}>
              <Typography variant="overline" sx={{ letterSpacing: 1 }}>Inverter Collected</Typography>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#800000' }}>₹{Math.round(totals.inverter).toLocaleString('en-IN')}</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#800000' }}><LaptopIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Laptop</Typography>
                    <Button fullWidth component={RouterLink} to="/laptop" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }}>Open</Button>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#800000' }}><CameraIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Camera</Typography>
                    <Button fullWidth component={RouterLink} to="/camera" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }}>Open</Button>
                  </Stack>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <Stack spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#800000' }}><InverterIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Inverter</Typography>
                    <Button fullWidth component={RouterLink} to="/inverter" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }}>Open</Button>
                  </Stack>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}