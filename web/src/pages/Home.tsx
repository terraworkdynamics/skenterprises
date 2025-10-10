import { Link as RouterLink } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
} from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import {
  Computer as ComputerIcon,
  LaptopMac as LaptopMacIcon,
  Print as PrintIcon,
  CameraOutdoor as SecurityCameraIcon,
  TravelExplore as TravelExploreIcon,
  Router as RouterIcon,
  Cable as CableIcon,
  Call as CallIcon,
  Place as PlaceIcon,
  Fingerprint as FingerprintIcon,
  BatteryChargingFull as InverterIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material'

function ServiceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
          <Box sx={{ color: 'primary.main' }}>{icon}</Box>
          <Typography variant="h6">{title}</Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top App Bar */}
      <AppBar position="sticky" color="primary" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            S K Enterprises
          </Typography>
          <Button component={RouterLink} to="/login" color="inherit" startIcon={<AccountIcon />}>Admin Login</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'background.default', pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 10 }, flexGrow: 1 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" color="primary" sx={{ letterSpacing: 2 }}>
                One Stop IT Accessories Shop
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                Everything for Desktop, Laptop, CCTV, Networking & More
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }} color="text.secondary">
                Near Devi Temple, Satyam Complex, Main Road, Aland. Sales & Service: 9972749555
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" size="large" component="a" href="tel:9972749555" startIcon={<CallIcon />}>
                  Call Now
                </Button>
                <Button variant="outlined" size="large" component="a" href="#services">
                  Explore Services
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap' }}>
                <Chip icon={<PlaceIcon />} label="Aland, Satyam Complex" color="default" variant="outlined" />
                <Chip icon={<TravelExploreIcon />} label="On-site support available" variant="outlined" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  height: 260,
                  borderRadius: 3,
                  bgcolor: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  textAlign: 'center',
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>Quality • Reliability • Service</Typography>
                  <Typography>Desktops • Laptops • Printers • CCTV • Networking</Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ fontWeight: 800, textAlign: 'center', mb: 4 }}>
            Our Services
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<ComputerIcon />} title="Desktop Computers" description="New & refurbished desktop computers with configuration as per need." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<LaptopMacIcon />} title="Laptops" description="New & used laptops, upgrades, battery/keyboard replacement, and servicing." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<PrintIcon />} title="Printers" description="Printer sales, cartridges, maintenance, and quick troubleshooting." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<SecurityCameraIcon />} title="CCTV Cameras" description="Indoor/outdoor CCTV installation, DVR/NVR setup, and monitoring." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<RouterIcon />} title="Networking" description="LAN/Wi‑Fi setup, router/switch configuration, and structured cabling." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<CableIcon />} title="Fiber Optic Work" description="Fiber laying, termination, and high‑precision splicing work." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<CallIcon />} title="EPABX Intercom" description="Office intercom and PBX solutions with installation and support." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<TravelExploreIcon />} title="GPS Vehicle Tracker" description="Reliable GPS tracking devices with app integration and support." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<FingerprintIcon />} title="Biometrics" description="Attendance and access control systems with deployment and training." />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <ServiceCard icon={<InverterIcon />} title="Inverter" description="Home and office inverters, installation, and maintenance services." />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Need help choosing the right product or service?
              </Typography>
              <Typography sx={{ opacity: 0.9 }}>
                Talk to our expert team for quick assistance and best recommendations.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                <Button fullWidth variant="contained" color="secondary" component="a" href="tel:9972749555" startIcon={<CallIcon />}>Call 9972749555</Button>
                <Button fullWidth variant="outlined" color="inherit" component="a" href="https://maps.google.com?q=Satyam+Complex+Aland" target="_blank" rel="noreferrer" startIcon={<PlaceIcon />}>Get Directions</Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 5, bgcolor: 'background.default', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography sx={{ textAlign: 'center' }} color="text.secondary">
            © {new Date().getFullYear()} S K Enterprises • One Stop IT Accessories Shop
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}


