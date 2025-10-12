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
} from '@mui/icons-material'

export default function Dashboard() {
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
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Dashboard
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
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Registration</Typography>
                    <Typography color="text.secondary">Add and manage customer registrations.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/register" variant="contained" startIcon={<RegisterIcon />}>Open</Button>
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
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Payment</Typography>
                    <Typography color="text.secondary">Record and track customer payments.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/payment" variant="contained" color="secondary" startIcon={<PaymentIcon />}>Open</Button>
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
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Due List</Typography>
                    <Typography color="text.secondary">View customer dues and payment history.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/due-list" variant="contained" color="primary" startIcon={<DueListIcon />}>Open</Button>
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
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Monthwise Due</Typography>
                    <Typography color="text.secondary">View paid and unpaid customers for specific months.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/monthwise-due" variant="contained" color="secondary" startIcon={<MonthwiseIcon />}>Open</Button>
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
                    <Typography variant="h6" gutterBottom sx={{ minHeight: '1.5em' }}>Lucky Draw History</Typography>
                    <Typography color="text.secondary">View previous winners and draw activity.</Typography>
                  </CardContent>
                  <CardActions>
                    <Button component={RouterLink} to="/lucky-draw" variant="outlined" startIcon={<HistoryIcon />}>Open</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <InfoIcon color="primary" />
                  <Typography variant="h6">About S K Enterprises</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  One Stop IT Accessories Shop — desktops, laptops, printers, CCTV, networking, fiber optics, EPABX intercom, GPS vehicle tracker, biometrics, and inverter services.
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label="Sales & Service" color="primary" variant="outlined" />
                  <Chip label="Aland" variant="outlined" />
                  <Chip label="Satyam Complex" variant="outlined" />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button fullWidth href="tel:9972749555" variant="contained">Call 9972749555</Button>
                  <Button fullWidth href="https://maps.google.com?q=Satyam+Complex+Aland" target="_blank" rel="noreferrer" variant="outlined">Directions</Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}