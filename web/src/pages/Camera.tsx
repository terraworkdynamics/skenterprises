import { type MouseEvent } from 'react'
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
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Logout as LogoutIcon,
  PersonAdd as RegisterIcon,
  Payment as PaymentIcon,
  History as HistoryIcon,
  Info as InfoIcon,
  Receipt as DueListIcon,
  CalendarMonth as MonthwiseIcon,
  Videocam as CameraIcon,
} from '@mui/icons-material'

export default function Camera() {
  const navigate = useNavigate()

  async function logout(e?: MouseEvent) {
    e?.preventDefault()
    if (supabase) {
      await supabase.auth.signOut()
    }
    navigate('/')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <CameraIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Camera Services
          </Typography>
          <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      bgcolor: '#f5f5dc',
                      '& .MuiTypography-root': {
                        color: '#8b4513',
                      },
                      '& .MuiButton-root': {
                        color: '#8b4513',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Camera Registration</Typography>
                    <Typography color="text.secondary">Add and manage camera customer registrations.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/camera/register" variant="contained" startIcon={<RegisterIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      bgcolor: '#f5f5dc',
                      '& .MuiTypography-root': {
                        color: '#8b4513',
                      },
                      '& .MuiButton-root': {
                        color: '#8b4513',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Camera Payment</Typography>
                    <Typography color="text.secondary">Record and track camera customer payments.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/camera/payment" variant="contained" color="secondary" startIcon={<PaymentIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      bgcolor: '#f5f5dc',
                      '& .MuiTypography-root': {
                        color: '#8b4513',
                      },
                      '& .MuiButton-root': {
                        color: '#8b4513',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Camera Due List</Typography>
                    <Typography color="text.secondary">View camera customer dues and payment history.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/camera/due-list" variant="contained" color="primary" startIcon={<DueListIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      bgcolor: '#f5f5dc',
                      '& .MuiTypography-root': {
                        color: '#8b4513',
                      },
                      '& .MuiButton-root': {
                        color: '#8b4513',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Camera Monthwise Due</Typography>
                    <Typography color="text.secondary">View paid and unpaid camera customers for specific months.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/camera/monthwise-due" variant="contained" color="secondary" startIcon={<MonthwiseIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card 
                  elevation={2}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      bgcolor: '#f5f5dc',
                      '& .MuiTypography-root': {
                        color: '#8b4513',
                      },
                      '& .MuiButton-root': {
                        color: '#8b4513',
                      }
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Camera Lucky Draw History</Typography>
                    <Typography color="text.secondary">View previous camera winners and draw activity.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/camera/lucky-draw" variant="outlined" startIcon={<HistoryIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <CameraIcon color="primary" />
                  <Typography variant="h6">Camera Services</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Complete CCTV and camera solutions — security cameras, surveillance systems, IP cameras, DVR/NVR systems, installation, and maintenance services.
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="CCTV Systems" color="primary" variant="outlined" />
                  <Chip label="IP Cameras" variant="outlined" />
                  <Chip label="DVR/NVR" variant="outlined" />
                  <Chip label="Installation" variant="outlined" />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button fullWidth href="tel:9972749555" variant="contained">Call 9972749555</Button>
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
