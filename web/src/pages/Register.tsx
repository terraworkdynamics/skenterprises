import { type FormEvent, useState } from 'react'
import { supabase } from '../utils/supabase'
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Fade,
  Slide,
  Zoom,
  Avatar,
} from '@mui/material'
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  CreditCard as CardIcon,
  Home as AddressIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material'

export default function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    if (!supabase) { 
      setError('Missing Supabase configuration')
      setLoading(false)
      return 
    }
    
    // Add SKPC prefix to card number if not already present
    const cardNumberWithPrefix = cardNo.toUpperCase().startsWith('SKPC') 
      ? cardNo.toUpperCase() 
      : `SKPC${cardNo.toUpperCase()}`
    
    const { error } = await supabase.from('registrations').insert({ 
      name, 
      phone, 
      address, 
      card_no: cardNumberWithPrefix 
    })
    
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSuccessDialogOpen(true)
      setName('')
      setPhone('')
      setAddress('')
      setCardNo('')
    }
  }

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false)
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh', 
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      {/* Beautiful Background with Logo */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/logo.jpeg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'min(80vw, 600px)',
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      />
      
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />

      <Container sx={{ py: { xs: 4, md: 6 }, position: 'relative' }}>
        <Fade in timeout={800}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Slide in timeout={800} direction="up">
              <Paper 
                elevation={8} 
                sx={{ 
                  p: { xs: 3, md: 4 }, 
                  borderRadius: 3, 
                  maxWidth: 600, 
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Stack spacing={3} alignItems="center">
                  <Avatar 
                    src="/logo.jpeg" 
                    alt="SK Enterprises" 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      boxShadow: 3,
                      border: '3px solid rgba(255, 255, 255, 0.3)'
                    }} 
                  />
                  <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main', textAlign: 'center' }}>
                    Customer Registration
                  </Typography>
                  <Typography color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                    Register new customers for our services and payment tracking system.
                  </Typography>
                </Stack>

                <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
                  <Stack spacing={3}>
                    <TextField
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      fullWidth
                      type="tel"
                      InputProps={{
                        startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      label="Card Number"
                      value={cardNo}
                      onChange={(e) => setCardNo(e.target.value)}
                      required
                      fullWidth
                      placeholder="Enter card number (SKPC prefix will be added automatically)"
                      InputProps={{
                        startAdornment: <CardIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    <TextField
                      label="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      fullWidth
                      multiline
                      rows={3}
                      InputProps={{
                        startAdornment: <AddressIcon color="action" sx={{ mr: 1, mt: 1 }} />,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    {error && (
                      <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                          boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
                        }
                      }}
                    >
                      {loading ? (
                        <Stack direction="row" spacing={2} alignItems="center">
                          <CircularProgress size={20} color="inherit" />
                          <Typography>Registering...</Typography>
                        </Stack>
                      ) : (
                        'Register Customer'
                      )}
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Fade>
      </Container>

      {/* Success Dialog with Animation */}
      <Dialog
        open={successDialogOpen}
        onClose={handleCloseSuccessDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          }
        }}
      >
        <Zoom in={successDialogOpen} timeout={500}>
          <Box>
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
              <Stack spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)',
                  }}
                >
                  <SuccessIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                  Registration Successful!
                </Typography>
              </Stack>
            </DialogTitle>
            
            <DialogContent sx={{ textAlign: 'center', pt: 1 }}>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Customer has been successfully registered in the system.
              </Typography>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2, 
                  bgcolor: 'success.light', 
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}
              >
                <Stack spacing={1}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Customer Details:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {phone}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Card No:</strong> {cardNo.toUpperCase().startsWith('SKPC') ? cardNo.toUpperCase() : `SKPC${cardNo.toUpperCase()}`}
                  </Typography>
                </Stack>
              </Paper>
            </DialogContent>
            
            <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
              <Button
                onClick={handleCloseSuccessDialog}
                variant="contained"
                color="success"
                size="large"
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Continue
              </Button>
            </DialogActions>
          </Box>
        </Zoom>
      </Dialog>
    </Box>
  )
}