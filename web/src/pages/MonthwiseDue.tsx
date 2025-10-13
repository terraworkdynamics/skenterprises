import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../utils/supabase';
import { useParams } from 'react-router-dom'
import Grid from '@mui/material/GridLegacy'
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';

import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material'

type Registration = {
  id: string
  name: string
  phone: string
  address: string
  card_no?: string
  created_at: string
}

type Payment = {
  id: string
  amount: number
  created_at: string
  method?: string
  transaction_id?: string
  card_no?: string
}

type CustomerDue = {
  customer: Registration
  totalDue: number
  paidAmount: number
  remainingDue: number
  dueDetails: Array<{
    month: string
    dueDate: string
    amount: number
    status: 'paid' | 'pending' | 'overdue'
  }>
}

// Monthly due schedule based on the image (16 months from Oct 2025 to Jan 2027)
const DUE_SCHEDULE = [
  { month: 'Oct 2025', dueDate: '02-10-2025', amount: 2500 },
  { month: 'Nov 2025', dueDate: '02-11-2025', amount: 2500 },
  { month: 'Dec 2025', dueDate: '02-12-2025', amount: 2500 },
  { month: 'Jan 2026', dueDate: '02-01-2026', amount: 2500 },
  { month: 'Feb 2026', dueDate: '02-02-2026', amount: 2500 },
  { month: 'Mar 2026', dueDate: '02-03-2026', amount: 2500 },
  { month: 'Apr 2026', dueDate: '02-04-2026', amount: 2500 },
  { month: 'May 2026', dueDate: '02-05-2026', amount: 2500 },
  { month: 'Jun 2026', dueDate: '02-06-2026', amount: 2500 },
  { month: 'Jul 2026', dueDate: '02-07-2026', amount: 2500 },
  { month: 'Aug 2026', dueDate: '02-08-2026', amount: 2500 },
  { month: 'Sep 2026', dueDate: '02-09-2026', amount: 2500 },
  { month: 'Oct 2026', dueDate: '02-10-2026', amount: 2500 },
  { month: 'Nov 2026', dueDate: '02-11-2026', amount: 2500 },
  { month: 'Dec 2026', dueDate: '02-12-2026', amount: 2500 },
  { month: 'Jan 2027', dueDate: '02-01-2027', amount: 2500 },
]

export default function MonthwiseDue() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const { category } = useParams()
  const resolvedCategory = useMemo(() => {
    const c = (category || '').toLowerCase()
    return c === 'laptop' || c === 'camera' || c === 'inverter' ? c : null
  }, [category])
  const [customers, setCustomers] = useState<Registration[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDue | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all customers and payments
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) {
        setError('Missing Supabase configuration')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        
        // Fetch all customers
        const registrationsTable = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
        const { data: customersData, error: customersError } = await supabase
          .from(registrationsTable)
          .select('*')
          .order('created_at', { ascending: false })

        if (customersError) {
          setError(customersError.message)
          return
        }

        // Fetch all payments
        const paymentsTable = resolvedCategory ? `${resolvedCategory}_payments` : 'payments'
        const { data: paymentsData, error: paymentsError } = await supabase
          .from(paymentsTable)
          .select('*')
          .order('created_at', { ascending: true })

        if (paymentsError) {
          setError(paymentsError.message)
          return
        }

        setCustomers(customersData || [])
        setPayments(paymentsData || [])
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedCategory])

  // Calculate customer dues for the selected month
  const monthwiseData = useMemo(() => {
    if (!selectedMonth) return { paidCustomers: [], unpaidCustomers: [] }

    const selectedSchedule = DUE_SCHEDULE.find(schedule => schedule.month === selectedMonth)
    if (!selectedSchedule) return { paidCustomers: [], unpaidCustomers: [] }

    const paidCustomers: CustomerDue[] = []
    const unpaidCustomers: CustomerDue[] = []

    customers.forEach(customer => {
      const customerPayments = payments.filter(
        p => p.card_no && p.card_no === customer.card_no
      )
      const totalPaid = customerPayments.reduce((sum, payment) => sum + payment.amount, 0)
      const totalDue = DUE_SCHEDULE.reduce((sum, due) => sum + due.amount, 0)
      const remainingDue = totalDue - totalPaid

      // Calculate due details for each month
      const dueDetails = DUE_SCHEDULE.map(schedule => {
        const dueDate = new Date(schedule.dueDate.split('-').reverse().join('-'))
        const today = new Date()
        const isOverdue = dueDate < today
        const isPaid = totalPaid >= schedule.amount

        let status: 'paid' | 'pending' | 'overdue' = 'pending'
        if (isPaid) {
          status = 'paid'
        } else if (isOverdue) {
          status = 'overdue'
        }

        return {
          month: schedule.month,
          dueDate: schedule.dueDate,
          amount: schedule.amount,
          status
        }
      })

      const customerDue: CustomerDue = {
        customer,
        totalDue,
        paidAmount: totalPaid,
        remainingDue,
        dueDetails
      }

      // Check if customer has paid for the selected month
      const selectedMonthDetail = dueDetails.find(detail => detail.month === selectedMonth)
      if (selectedMonthDetail && selectedMonthDetail.status === 'paid') {
        paidCustomers.push(customerDue)
      } else {
        unpaidCustomers.push(customerDue)
      }
    })

    return { paidCustomers, unpaidCustomers }
  }, [customers, payments, selectedMonth])

  // Filter customers based on search term
  const filteredPaidCustomers = useMemo(() => {
    if (!searchTerm.trim()) return monthwiseData.paidCustomers

    const term = searchTerm.toLowerCase()
    return monthwiseData.paidCustomers.filter(due => 
      due.customer.name.toLowerCase().includes(term) ||
      due.customer.card_no?.toLowerCase().includes(term) ||
      due.customer.phone.includes(term)
    )
  }, [monthwiseData.paidCustomers, searchTerm])

  const filteredUnpaidCustomers = useMemo(() => {
    if (!searchTerm.trim()) return monthwiseData.unpaidCustomers

    const term = searchTerm.toLowerCase()
    return monthwiseData.unpaidCustomers.filter(due => 
      due.customer.name.toLowerCase().includes(term) ||
      due.customer.card_no?.toLowerCase().includes(term) ||
      due.customer.phone.includes(term)
    )
  }, [monthwiseData.unpaidCustomers, searchTerm])

  const handleViewDetails = (due: CustomerDue) => {
    setSelectedCustomer(due)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedCustomer(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success'
      case 'overdue': return 'error'
      default: return 'warning'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'overdue': return 'Overdue'
      default: return 'Pending'
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
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
          opacity: 0.05,
          pointerEvents: 'none',
        }}
      />
      <Container sx={{ py: { xs: 4, md: 6 }, position: 'relative' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
          {resolvedCategory ? `${resolvedCategory.charAt(0).toUpperCase()}${resolvedCategory.slice(1)} ` : ''}Monthwise Due
        </Typography>

        {error && (
          <Alert sx={{ mb: 3 }} severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Month Selection and Search */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Select Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Select Month"
                startAdornment={
                  <InputAdornment position="start">
                    <CalendarIcon />
                  </InputAdornment>
                }
              >
                {DUE_SCHEDULE.map((schedule) => (
                  <MenuItem key={schedule.month} value={schedule.month}>
                    {schedule.month} (Due: {schedule.dueDate})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              placeholder="Search by customer name, card number, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Paper>

        {selectedMonth && (
          <>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Card elevation={2} sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Paid Customers
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {filteredPaidCustomers.length}
                    </Typography>
                    <Typography variant="body2">
                      Customers who have paid for {selectedMonth}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card elevation={2} sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Unpaid Customers
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {filteredUnpaidCustomers.length}
                    </Typography>
                    <Typography variant="body2">
                      Customers who haven't paid for {selectedMonth}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Paid Customers Table */}
            <Paper elevation={2} sx={{ mb: 3, overflowX: 'auto' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: 'success.main', color: 'white', fontWeight: 700 }}>
                ✅ Paid Customers for {selectedMonth}
              </Typography>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'success.light' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Card No</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Paid</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Remaining Due</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPaidCustomers.map((due) => (
                    <TableRow key={due.customer.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {due.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {due.customer.address}
                        </Typography>
                      </TableCell>
                      <TableCell>{due.customer.card_no || '—'}</TableCell>
                      <TableCell>{due.customer.phone}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                          ₹{due.paidAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="subtitle2" 
                          color={due.remainingDue > 0 ? 'error.main' : 'success.main'}
                          sx={{ fontWeight: 600 }}
                        >
                          ₹{due.remainingDue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Paid"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(due)}
                          variant="outlined"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredPaidCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                          {searchTerm ? 'No paid customers found matching your search.' : 'No paid customers found for this month.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>

            {/* Unpaid Customers Table */}
            <Paper elevation={2} sx={{ overflowX: 'auto' }}>
              <Typography variant="h6" sx={{ p: 2, bgcolor: 'error.main', color: 'white', fontWeight: 700 }}>
                ❌ Unpaid Customers for {selectedMonth}
              </Typography>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'error.light' }}>
                    <TableCell sx={{ fontWeight: 700 }}>Customer Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Card No</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Due</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Paid Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Remaining Due</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUnpaidCustomers.map((due) => (
                    <TableRow key={due.customer.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {due.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {due.customer.address}
                        </Typography>
                      </TableCell>
                      <TableCell>{due.customer.card_no || '—'}</TableCell>
                      <TableCell>{due.customer.phone}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          ₹{due.totalDue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                          ₹{due.paidAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="subtitle2" 
                          color={due.remainingDue > 0 ? 'error.main' : 'success.main'}
                          sx={{ fontWeight: 600 }}
                        >
                          ₹{due.remainingDue.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="Unpaid"
                          color="error"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewDetails(due)}
                          variant="outlined"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredUnpaidCustomers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
                          {searchTerm ? 'No unpaid customers found matching your search.' : 'No unpaid customers found for this month.'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}

        {!selectedMonth && (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
            <CalendarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Please select a month to view monthwise dues
            </Typography>
          </Paper>
        )}

        {/* Payment History Dialog */}
        <Dialog 
          open={dialogOpen} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Payment History - {selectedCustomer?.customer.name}
              </Typography>
              <IconButton onClick={handleCloseDialog}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent>
            {selectedCustomer && (
              <Stack spacing={3}>
                {/* Customer Info */}
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Stack direction="row" spacing={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Name</Typography>
                      <Typography variant="subtitle1">{selectedCustomer.customer.name}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Card No</Typography>
                      <Typography variant="subtitle1">{selectedCustomer.customer.card_no || '—'}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="subtitle1">{selectedCustomer.customer.phone}</Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Due Summary */}
                <Paper elevation={1} sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="h6" gutterBottom>
                    Due Summary
                  </Typography>
                  <Stack direction="row" spacing={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Due</Typography>
                      <Typography variant="h6">₹{selectedCustomer.totalDue.toFixed(2)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Paid Amount</Typography>
                      <Typography variant="h6" color="success.main">₹{selectedCustomer.paidAmount.toFixed(2)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Remaining Due</Typography>
                      <Typography 
                        variant="h6" 
                        color={selectedCustomer.remainingDue > 0 ? 'error.main' : 'success.main'}
                      >
                        ₹{selectedCustomer.remainingDue.toFixed(2)}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Monthly Due Details */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Monthly Due Details
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Month</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCustomer.dueDetails.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.month}</TableCell>
                          <TableCell>{detail.dueDate}</TableCell>
                          <TableCell>₹{detail.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={getStatusLabel(detail.status)}
                              color={getStatusColor(detail.status) as any}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>

                {/* Payment History */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Payment History
                  </Typography>
                  {payments.filter(p => p.card_no === selectedCustomer.customer.card_no).length > 0 ? (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {payments
                          .filter(p => p.card_no === selectedCustomer.customer.card_no)
                          .map((payment, index) => (
                            <TableRow key={payment.id || index}>
                              <TableCell>
                                {new Date(payment.created_at).toLocaleDateString('en-IN')}
                              </TableCell>
                              <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                              <TableCell>{payment.method || 'Cash'}</TableCell>
                              <TableCell>{payment.transaction_id || '—'}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <Typography color="text.secondary" sx={{ py: 2 }}>
                      No payment history available.
                    </Typography>
                  )}
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}
