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
  Grid,
  Avatar,
  IconButton,
} from '@mui/material'
import {
  Computer as ComputerIcon,
  LaptopMac as LaptopMacIcon,
  CameraAlt as CameraIcon,
  BatteryChargingFull as InverterIcon,
  Call as CallIcon,
  Place as PlaceIcon,
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  AccountCircle as AccountIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'

// Rotating Balls Component
function RotatingBalls() {
  return (
    <div className="rotating-balls">
      <div className="ball"></div>
      <div className="ball"></div>
      <div className="ball"></div>
      <div className="ball"></div>
      <div className="ball"></div>
    </div>
  )
}

// Service Card Component
function ServiceCard({ 
  icon, 
  title, 
  description, 
  image, 
  features 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  image: string;
  features: string[];
}) {
  return (
    <Card 
      className="service-card"
      elevation={3} 
      sx={{ 
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)',
        border: '2px solid #EEDC82',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          borderColor: '#D4AF37',
        }
      }}
    >
      <Box
        sx={{
          height: { xs: 150, sm: 180, md: 200 },
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          flexShrink: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(128, 0, 0, 0.1), rgba(212, 175, 55, 0.1))',
          }
        }}
      />
      <CardContent sx={{ p: { xs: 2, sm: 2.5, md: 3 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: '#800000', color: 'white', width: { xs: 32, sm: 36, md: 40 }, height: { xs: 32, sm: 36, md: 40 } }}>
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#3A3A3A', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}>
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" color="#3A3A3A" sx={{ mb: 2, lineHeight: 1.6, fontSize: { xs: '0.8rem', sm: '0.9rem', md: '0.875rem' } }}>
          {description}
        </Typography>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          {features.map((feature, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
              <CheckIcon sx={{ color: '#800000', fontSize: { xs: 14, sm: 15, md: 16 }, mt: 0.2, flexShrink: 0 }} />
              <Typography variant="body2" color="#3A3A3A" sx={{ fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' }, lineHeight: 1.4 }}>
                {feature}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#800000',
          boxShadow: '0 4px 20px rgba(128, 0, 0, 0.3)',
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#FDF6E3' }}>
            S K Enterprises
          </Typography>
          <Button 
            component={RouterLink} 
            to="/login" 
            sx={{ 
              color: '#FDF6E3',
              '&:hover': {
                bgcolor: 'rgba(253, 246, 227, 0.1)',
              }
            }} 
            startIcon={<AccountIcon />}
          >
            Admin Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 50%, #FFF8E7 100%)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(128, 0, 0, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                className="hero-title gradient-text"
                variant="h1" 
                sx={{ 
                  fontWeight: 900,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  mb: 2,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.15)',
                  letterSpacing: '0.05em',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-10px',
                    left: 0,
                    width: '100px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #D4AF37, #EEDC82)',
                    borderRadius: '2px',
                    animation: 'shimmer 2s infinite',
                  }
                }}
              >
                S K ENTERPRISES
              </Typography>
              <Typography 
                className="hero-subtitle"
                variant="h4" 
                sx={{ 
                  fontWeight: 600,
                  color: '#D4AF37',
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                }}
              >
                One Stop IT Accessories Shop
              </Typography>
              <Typography 
                className="hero-description"
                variant="h6" 
                sx={{ 
                  color: '#3A3A3A',
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                }}
              >
                Your trusted partner for Desktop, Laptop, CCTV, Networking & More
              </Typography>
              <Stack 
                className="hero-buttons"
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 2 }} 
                sx={{ mb: 4 }}
              >
                <Button 
                  variant="contained" 
                  size="large" 
                  className="btn-primary"
                  component="a" 
                  href="tel:9972749555" 
                  startIcon={<CallIcon />}
                  sx={{
                    bgcolor: '#800000',
                    color: '#FDF6E3',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      bgcolor: '#5B0000',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(128, 0, 0, 0.3)',
                    }
                  }}
                >
                  Call Now: 9972749555
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  component="a" 
                  href="#services"
                  sx={{
                    borderColor: '#800000',
                    color: '#800000',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#5B0000',
                      bgcolor: 'rgba(128, 0, 0, 0.05)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Explore Services
                </Button>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<PlaceIcon />} 
                  label="Aland, Chakrikata" 
                  sx={{ 
                    bgcolor: '#EEDC82',
                    color: '#3A3A3A',
                    fontWeight: 500,
                  }} 
                />
                <Chip 
                  icon={<StarIcon />} 
                  label="Quality & Reliability" 
                  sx={{ 
                    bgcolor: '#D4AF37',
                    color: '#3A3A3A',
                    fontWeight: 500,
                  }} 
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: 300, sm: 400, md: 500 },
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <RotatingBalls />
                <Box
                  className="glass-effect"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                    textAlign: 'center',
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '2px solid #D4AF37',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15), 0 0 30px rgba(212, 175, 55, 0.2)',
                    animation: 'pulse 3s ease-in-out infinite',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                      animation: 'shimmer 3s infinite',
                    }
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#800000', mb: 1, fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.5rem' } }}>
                    Quality • Reliability • Service
                  </Typography>
                  <Typography variant="body1" color="#3A3A3A" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' } }}>
                    Desktops • Laptops • Printers • CCTV • Networking
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Services Section */}
      <Box 
        id="services" 
        sx={{ 
          py: { xs: 8, md: 12 }, 
          background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 50%, #FFF8E7 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 70% 30%, rgba(128, 0, 0, 0.03) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box className="section-fade-in" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              className="gradient-text"
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #D4AF37, #EEDC82)',
                  borderRadius: '2px',
                  animation: 'shimmer 2s infinite',
                }
              }}
            >
            Our Services
          </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#3A3A3A',
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              We provide comprehensive IT solutions with quality products and reliable service
            </Typography>
          </Box>
          
          <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
            <Grid item xs={12} sm={6} lg={4}>
              <ServiceCard 
                icon={<LaptopMacIcon />} 
                title="Laptops & Computers" 
                description="Complete laptop and desktop solutions with the latest technology and reliable performance."
                image="/laptop.jpg"
                features={[
                  "New & Refurbished Laptops",
                  "Desktop Assembly & Configuration", 
                  "Hardware Upgrades & Repairs",
                  "Battery & Keyboard Replacement",
                  "Software Installation & Support"
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={4}>
              <ServiceCard 
                icon={<CameraIcon />} 
                title="CCTV & Security" 
                description="Professional CCTV installation and security solutions for homes and businesses."
                image="/camera.jpg"
                features={[
                  "HD & 4K CCTV Cameras",
                  "DVR/NVR Setup & Configuration",
                  "Remote Monitoring Solutions",
                  "Night Vision & Weatherproof",
                  "Mobile App Integration"
                ]}
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={4}>
              <ServiceCard 
                icon={<InverterIcon />} 
                title="Battery & Inverter" 
                description="Reliable power backup solutions with quality batteries and inverter systems."
                image="/battery.jpg"
                features={[
                  "Home & Office Inverters",
                  "UPS & Battery Systems",
                  "Solar Power Solutions",
                  "Installation & Maintenance",
                  "24/7 Support Service"
                ]}
              />
            </Grid>
            </Grid>

          {/* Additional Services */}
          <Box sx={{ mt: 8 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                textAlign: 'center', 
                mb: 4,
                color: '#800000',
              }}
            >
              More Services
            </Typography>
            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
              {[
                { icon: <ComputerIcon />, title: "Printers & Accessories", desc: "Printer sales, cartridges, and maintenance" },
                { icon: <CallIcon />, title: "Networking Solutions", desc: "LAN/Wi-Fi setup and router configuration" },
                { icon: <PlaceIcon />, title: "Fiber Optic Work", desc: "High-precision fiber laying and splicing" },
                { icon: <EmailIcon />, title: "EPABX Systems", desc: "Office intercom and PBX solutions" },
                { icon: <StarIcon />, title: "GPS Tracking", desc: "Vehicle tracking devices with app integration" },
                { icon: <CheckIcon />, title: "Biometric Systems", desc: "Attendance and access control systems" },
              ].map((service, index) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index}>
                  <Card 
                    elevation={2}
                    sx={{ 
                      p: 3,
                      textAlign: 'center',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #FFF8E7 0%, #FDF6E3 100%)',
                      border: '1px solid #EEDC82',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent)',
                        transition: 'left 0.5s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 40px rgba(128, 0, 0, 0.15)',
                        borderColor: '#D4AF37',
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#800000', color: 'white', mx: 'auto', mb: 2 }}>
                      {service.icon}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#3A3A3A', mb: 1 }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="#3A3A3A">
                      {service.desc}
                    </Typography>
                  </Card>
            </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box 
        sx={{ 
          py: { xs: 8, md: 10 }, 
          background: 'linear-gradient(135deg, #800000 0%, #5B0000 50%, #800000 100%)',
          color: '#FDF6E3',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } }}>
                Need Professional IT Solutions?
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 3, fontSize: { xs: '1rem', sm: '1.2rem', md: '1.25rem' } }}>
                Talk to our expert team for quick assistance and the best recommendations. 
                We're here to help you choose the right products and services.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Chip 
                  icon={<CallIcon />} 
                  label="9972749555" 
                  sx={{ 
                    bgcolor: '#D4AF37',
                    color: '#3A3A3A',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }} 
                />
                <Chip 
                  icon={<PlaceIcon />} 
                  label="Aland, Chakrikata" 
                  sx={{ 
                    bgcolor: '#EEDC82',
                    color: '#3A3A3A',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }} 
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction={{ xs: 'column', sm: 'row', md: 'column' }} spacing={2}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  component="a" 
                  href="tel:9972749555" 
                  startIcon={<CallIcon />}
                  sx={{
                    bgcolor: '#D4AF37',
                    color: '#3A3A3A',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      bgcolor: '#EEDC82',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(212, 175, 55, 0.3)',
                    }
                  }}
                >
                  Call Now
                </Button>
                <Button 
                  fullWidth 
                  variant="outlined" 
                  component="a" 
                  href="https://google.com/maps?q=17.5657074,76.5688519&z=17&hl=en" 
                  target="_blank" 
                  rel="noreferrer" 
                  startIcon={<PlaceIcon />}
                  sx={{
                    borderColor: '#FDF6E3',
                    color: '#FDF6E3',
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: '#D4AF37',
                      bgcolor: 'rgba(212, 175, 55, 0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Get Directions
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 6, 
          bgcolor: '#5B0000',
          color: '#FDF6E3',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#D4AF37' }}>
                S K Enterprises
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                Your trusted partner for all IT needs. Quality products, reliable service, 
                and expert support for over a decade.
              </Typography>
              <Stack direction="row" spacing={1}>
                <IconButton sx={{ color: '#D4AF37' }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: '#D4AF37' }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton sx={{ color: '#D4AF37' }}>
                  <TwitterIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#D4AF37' }}>
                Contact Info
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CallIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
                  <Typography variant="body2">9972749555</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PlaceIcon sx={{ fontSize: 20, color: '#D4AF37' }} />
                  <Typography variant="body2">
                    Aland chakrikata, Near Devi Temple,<br />
                    Syndicate Bank opposite main road,<br />
                    Road Aland - 585302, Dist. Kalburagi
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#D4AF37' }}>
                Our Services
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">• Desktop & Laptop Sales</Typography>
                <Typography variant="body2">• CCTV Installation</Typography>
                <Typography variant="body2">• Battery & Inverter</Typography>
                <Typography variant="body2">• Networking Solutions</Typography>
                <Typography variant="body2">• Printer Services</Typography>
                <Typography variant="body2">• GPS Tracking</Typography>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #800000', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              © {new Date().getFullYear()} S K Enterprises • One Stop IT Accessories Shop • 
              Quality • Reliability • Service
          </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}