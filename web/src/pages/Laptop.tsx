import { type MouseEvent, useEffect } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Paper,
  Chip,
  Divider,
  Avatar,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Receipt as DueListIcon,
  CalendarMonth as MonthwiseIcon,
  Laptop as LaptopIcon,
} from '@mui/icons-material'

export default function Laptop() {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])

  async function logout(e?: MouseEvent) {
    e?.preventDefault()
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: 'background.default' }}>
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
          <LaptopIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            Laptop Services
          </Typography>
          <Button onClick={logout} startIcon={<LogoutIcon />} sx={{ color: '#FDF6E3' }}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, rgba(128,0,0,0.95) 0%, rgba(128,0,0,0.85) 60%, rgba(91,0,0,0.9) 100%)', color: '#FDF6E3' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 0.4 }}>Laptop Category</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Register customers, collect payments and view dues</Typography>
            </Stack>
            <Chip label="Category" sx={{ bgcolor: '#FDF6E3', color: '#800000', fontWeight: 700 }} />
          </Stack>
        </Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: '#800000' }}><RegisterIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>Laptop Registration</Typography>
                      <Typography color="text.secondary">Add and manage laptop customer registrations.</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth component={RouterLink} to="/laptop/register" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }} startIcon={<RegisterIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: '#800000' }}><PaymentIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>Laptop Payment</Typography>
                      <Typography color="text.secondary">Record and track laptop customer payments.</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth component={RouterLink} to="/laptop/payment" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }} startIcon={<PaymentIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: '#800000' }}><DueListIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>Laptop Due List</Typography>
                      <Typography color="text.secondary">View laptop customer dues and payment history.</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth component={RouterLink} to="/laptop/due-list" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }} startIcon={<DueListIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: '#800000' }}><MonthwiseIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>Laptop Monthwise Due</Typography>
                      <Typography color="text.secondary">View paid and unpaid laptop customers for specific months.</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth component={RouterLink} to="/laptop/monthwise-due" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }} startIcon={<MonthwiseIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={3} sx={{ p: 2.5, textAlign: 'center', borderRadius: 3, border: '2px solid #EEDC82', background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: '#800000' }}><HistoryIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 800 }}>Laptop Lucky Draw</Typography>
                      <Typography color="text.secondary">Enter winners and view history.</Typography>
                    </Stack>
                  </CardContent>
                  <CardActions>
                    <Button fullWidth component={RouterLink} to="/laptop/lucky-draw" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }} startIcon={<HistoryIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2.5, borderRadius: 3 }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Avatar sx={{ bgcolor: '#800000' }}><LaptopIcon sx={{ color: '#FDF6E3' }} /></Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>Laptop Services</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive laptop sales, service, and support — from high-performance gaming laptops to business workstations, repairs, upgrades, and maintenance services.
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Laptop Sales" sx={{ bgcolor: '#EEDC82' }} />
                  <Chip label="Repairs & Service" variant="outlined" />
                  <Chip label="Upgrades" variant="outlined" />
                  <Chip label="Warranty Support" variant="outlined" />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button fullWidth href="tel:9972749555" variant="contained" sx={{ bgcolor: '#800000', color: '#FDF6E3', '&:hover': { bgcolor: '#5B0000' } }}>Call 9972749555</Button>
                  <Button fullWidth href="https://google.com/maps?q=17.5657074,76.5688519&z=17&hl=en" target="_blank" rel="noreferrer" variant="outlined">Directions</Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
