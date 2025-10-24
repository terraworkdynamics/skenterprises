import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Autocomplete,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { sendWhatsAppMessage, validateWhatsAppData, formatPhoneNumber } from '../utils/whatsapp'

type Registration = {
  id: string
  name: string
  phone: string
  address: string
  card_no?: string
}

type PaymentRow = {
  id: string
  amount: number
  created_at?: string
  date?: string
  paid_at?: string
  method?: string | null
  transaction_id?: string | null
}

export default function Payment() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const navigate = useNavigate()
  const { category } = useParams()
  const resolvedCategory = useMemo(() => {
    const c = (category || '').toLowerCase()
    return c === 'laptop' || c === 'camera' || c === 'inverter' ? c : null
  }, [category])
  const [queryName, setQueryName] = useState('')
  const [queryCard, setQueryCard] = useState('')
  const [queryPhone, setQueryPhone] = useState('')
  const [result, setResult] = useState<Registration | null>(null)
  const [nameResults, setNameResults] = useState<Registration[]>([])
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | ''>('')
  const [method, setMethod] = useState<'Cash' | 'UPI'>('Cash')
  const [transactionId, setTransactionId] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [payments, setPayments] = useState<PaymentRow[]>([])
  
  // Auto-suggestion states
  const [nameSuggestions, setNameSuggestions] = useState<Registration[]>([])
  const [cardSuggestions, setCardSuggestions] = useState<Registration[]>([])
  const [phoneSuggestions, setPhoneSuggestions] = useState<Registration[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState({ name: false, card: false, phone: false })

  // Auto-suggestion functions
  const fetchSuggestions = async (type: 'name' | 'card_no' | 'phone', query: string) => {
    if (!query.trim() || query.length < 2) {
      if (type === 'name') setNameSuggestions([])
      else if (type === 'card_no') setCardSuggestions([])
      else if (type === 'phone') setPhoneSuggestions([])
      return
    }

    setLoadingSuggestions(prev => ({ ...prev, [type]: true }))
    
    if (!supabase) {
      setLoadingSuggestions(prev => ({ ...prev, [type]: false }))
      return
    }

    const registrationsTable = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
    
    try {
      let queryBuilder = supabase.from(registrationsTable).select('*').limit(10)
      
      if (type === 'name') {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`)
      } else if (type === 'card_no') {
        queryBuilder = queryBuilder.ilike('card_no', `%${query}%`)
      } else if (type === 'phone') {
        queryBuilder = queryBuilder.ilike('phone', `%${query}%`)
      }
      
      const { data, error } = await queryBuilder
      
      if (error) {
        console.error('Error fetching suggestions:', error)
      } else {
        const suggestions = (data || []) as Registration[]
        if (type === 'name') setNameSuggestions(suggestions)
        else if (type === 'card_no') setCardSuggestions(suggestions)
        else if (type === 'phone') setPhoneSuggestions(suggestions)
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    } finally {
      setLoadingSuggestions(prev => ({ ...prev, [type]: false }))
    }
  }

  // Debounced search functions
  const debouncedNameSearch = useMemo(() => {
    let timeoutId: number
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fetchSuggestions('name', query), 300)
    }
  }, [resolvedCategory])

  const debouncedCardSearch = useMemo(() => {
    let timeoutId: number
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fetchSuggestions('card_no', query), 300)
    }
  }, [resolvedCategory])

  const debouncedPhoneSearch = useMemo(() => {
    let timeoutId: number
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fetchSuggestions('phone', query), 300)
    }
  }, [resolvedCategory])

  async function searchBy(type: 'name' | 'card_no' | 'phone') {
    setError(null)
    setResult(null)
    setNameResults([])
    setPayments([])
    if (!supabase) {
      setError('Missing Supabase configuration')
      return
    }

    const registrationsTable = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
    if (type === 'name') {
      const { data, error } = await supabase
        .from(registrationsTable)
        .select('*')
        .ilike('name', `%${queryName}%`)
        .limit(50)
      if (error) {
        setError(error.message)
      } else {
        const list = (data || []) as Registration[]
        if (list.length === 1) {
          setResult(list[0])
        } else {
          setNameResults(list)
        }
      }
    } else if (type === 'card_no') {
      const { data, error } = await supabase
        .from(registrationsTable)
        .select('*')
        .eq('card_no', queryCard)
        .maybeSingle()
      if (error) setError(error.message)
      else setResult(data as Registration | null)
    } else {
      const { data, error } = await supabase
        .from(registrationsTable)
        .select('*')
        .eq('phone', queryPhone)
        .maybeSingle()
      if (error) setError(error.message)
      else setResult(data as Registration | null)
    }
  }

  useEffect(() => {
    if (!result) return
    ;(async () => {
      const paymentsTable = resolvedCategory ? `${resolvedCategory}_payments` : 'payments'
      const { data, error } = await supabase
        .from(paymentsTable)
        .select('*')
        .eq('registration_id', result.id)
        .order('created_at', { ascending: true })
      if (!error && data) setPayments(data as PaymentRow[])
    })()
  }, [result])

  const formattedPayments = useMemo(() => {
    return payments.map((p) => {
      const iso = p.created_at || p.date || p.paid_at
      const d = iso ? new Date(iso) : null
      const displayDate = d
        ? `${String(d.getDate()).padStart(2, '0')}-${String(
            d.getMonth() + 1
          ).padStart(2, '0')}-${d.getFullYear()}`
        : '—'
      return {
        ...p,
        displayDate,
        displayMode: p.method ?? '—',
        displayTxn: p.transaction_id ?? '—',
      }
    })
  }, [payments])

  // Function to send WhatsApp message
  async function handleWhatsAppMessage(customerData: Registration, paymentData: PaymentRow, category: string) {
    const messageData = {
      phone: formatPhoneNumber(customerData.phone),
      customer_name: customerData.name,
      amount: paymentData.amount,
      payment_method: paymentData.method || 'Cash',
      transaction_id: paymentData.transaction_id || undefined,
      category: category
    };

    // Validate the data
    const validationError = validateWhatsAppData(messageData);
    if (validationError) {
      console.error('WhatsApp message validation failed:', validationError);
      return;
    }

    // Send the message
    await sendWhatsAppMessage(messageData);
  }

  async function recordPayment() {
    setWarning(null)
    if (!result || amount === '' || Number(amount) <= 0) {
      setError('Valid amount and registration required')
      return
    }

    const payload: any = {
      registration_id: result.id,
      amount: Number(amount),
      method,
      transaction_id: method === 'UPI' ? transactionId || null : null,
    }

    const paymentsTable = resolvedCategory ? `${resolvedCategory}_payments` : 'payments'
    const { data: inserted, error } = await supabase
      .from(paymentsTable)
      .insert(payload)
      .select('*')
      .maybeSingle()

    if (error) {
      setError(error.message)
    } else {
      setMessage('Payment recorded successfully.')
      setAmount('')
      setTransactionId('')
      // refresh list
      const { data } = await supabase
        .from(paymentsTable)
        .select('*')
        .eq('registration_id', result.id)
        .order('created_at', { ascending: true })
      if (data) setPayments(data as PaymentRow[])
      
      // Send WhatsApp message after successful payment
      if (inserted) {
        try {
          // Send WhatsApp message
          await handleWhatsAppMessage(result, inserted as PaymentRow, resolvedCategory ? resolvedCategory : 'General')
          
          // Print receipt
          generateHtmlSlip(result, inserted as PaymentRow, resolvedCategory ? resolvedCategory : 'General')
        } catch (e) {
          console.error('Post-payment processing failed', e)
        }
      }
    }
  }

  // --- Dual Receipt Print Function ---
  function generateHtmlSlip(reg: Registration, pay: PaymentRow, category?: string) {
    const now = new Date(pay.created_at || Date.now());
    const dateStr = now.toLocaleDateString('en-IN');
    const amount = Number(pay.amount).toFixed(2);
    const method = pay.method || 'Cash';
    const txnId = pay.transaction_id || '—';
  
    const slipContent = `
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      .container { display: flex; gap: 10px; }
      .receipt { flex: 1; border: 1px solid #000; padding: 15px; box-sizing: border-box; }
      .header { text-align: center; font-weight: bold; font-size: 1.2em; margin-bottom: 5px; }
      .sub-header { text-align: center; font-size: 0.9em; margin-bottom: 15px; }
      .details { margin: 10px 0; }
      .line { display: flex; justify-content: space-between; margin: 5px 0; }
      .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .table td { padding: 5px; }
      .table .right { text-align: right; font-weight: bold; }
      .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 5px; font-weight: bold; }
      .footer { text-align: center; margin-top: 15px; font-size: 0.9em; }
    </style>
  
    <div class="container">
      ${[1, 2]
        .map(
          () => `
        <div class="receipt">
          <div class="header">S K Enterprises</div>
          <div class="sub-header">Aland chakrikata, Near Devi Temple, Syndicate Bank opposite main road, Road Aland - 585302, Dist. Kalburagi</div>
          ${category ? `<div class="category-header" style="text-align: center; font-weight: bold; font-size: 1.1em; margin: 10px 0; color: #1976d2;">${category.toUpperCase()} SERVICES</div>` : ''}
          <div class="details">
            <div class="line"><strong>Date:</strong> ${dateStr}</div>
            <div class="line"><strong>Card No:</strong> ${reg.card_no || '—'}</div>
          </div>
          <div class="details">
            <div class="line"><strong>Amount Paid (₹):</strong> ₹${amount}</div>
            <div class="line"><strong>Method:</strong> ${method}</div>
            <div class="line"><strong>Txn ID:</strong> ${txnId}</div>
          </div>
          <table class="table">
            <tr><td>PAYMENT RECEIVED</td><td class="right">₹${amount}</td></tr>
          </table>
          <div class="total">TOTAL: ₹${amount}</div>
          <div class="footer">Cashier / Manager Partner</div>
        </div>`
        )
        .join('')}
    </div>`;
  
    const printWindow = window.open('', '', 'height=800,width=1200');
    if (!printWindow) {
      alert('Unable to open print window. Please allow pop-ups and try again.');
      return;
    }
  
    printWindow.document.write('<html><head><title>Payment Slip</title></head><body>');
    printWindow.document.write(slipContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
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
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            variant="outlined"
            size="small"
          >
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Payment
          </Typography>
        </Stack>

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Autocomplete
                  options={nameSuggestions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                  value={nameSuggestions.find(s => s.name === queryName) || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setQueryName(newValue.name)
                      setResult(newValue)
                      setNameResults([])
                      setNameSuggestions([])
                    } else {
                      setQueryName('')
                      setResult(null)
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setQueryName(newInputValue)
                    debouncedNameSearch(newInputValue)
                  }}
                  loading={loadingSuggestions.name}
                  loadingText="Searching..."
                  noOptionsText="No customers found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Name"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSuggestions.name ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.phone} • {option.card_no || 'No card'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Box>
              <Button variant="contained" onClick={() => searchBy('name')} sx={{ minWidth: 120 }}>
                Search
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Autocomplete
                  options={cardSuggestions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.card_no || ''}
                  value={cardSuggestions.find(s => s.card_no === queryCard) || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setQueryCard(newValue.card_no || '')
                      setResult(newValue)
                      setCardSuggestions([])
                    } else {
                      setQueryCard('')
                      setResult(null)
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setQueryCard(newInputValue)
                    debouncedCardSearch(newInputValue)
                  }}
                  loading={loadingSuggestions.card}
                  loadingText="Searching..."
                  noOptionsText="No customers found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Card no"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSuggestions.card ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.card_no || 'No card'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.name} • {option.phone}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Box>
              <Button variant="contained" onClick={() => searchBy('card_no')} sx={{ minWidth: 120 }}>
                Search
              </Button>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Autocomplete
                  options={phoneSuggestions}
                  getOptionLabel={(option) => typeof option === 'string' ? option : option.phone}
                  value={phoneSuggestions.find(s => s.phone === queryPhone) || null}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setQueryPhone(newValue.phone)
                      setResult(newValue)
                      setPhoneSuggestions([])
                    } else {
                      setQueryPhone('')
                      setResult(null)
                    }
                  }}
                  onInputChange={(_, newInputValue) => {
                    setQueryPhone(newInputValue)
                    debouncedPhoneSearch(newInputValue)
                  }}
                  loading={loadingSuggestions.phone}
                  loadingText="Searching..."
                  noOptionsText="No customers found"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search by Phone no"
                      inputProps={{ ...params.inputProps, inputMode: 'numeric' }}
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSuggestions.phone ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.phone}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.name} • {option.card_no || 'No card'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                />
              </Box>
              <Button variant="contained" onClick={() => searchBy('phone')} sx={{ minWidth: 120 }}>
                Search
              </Button>
            </Stack>
          </Stack>

          {error && (
            <Alert sx={{ mt: 2 }} severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {nameResults.length > 0 && (
            <Paper elevation={0} sx={{ p: 0, mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Card no</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Address</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nameResults.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.phone}</TableCell>
                      <TableCell>{r.card_no || '—'}</TableCell>
                      <TableCell>{r.address}</TableCell>
                      <TableCell align="right">
                        <Button size="small" onClick={() => { setResult(r); setNameResults([]) }}>
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Paper>

        {result && (
          <Stack spacing={2}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">{result.name}</Typography>
              <Typography color="text.secondary">
                {result.phone} • {result.address}
              </Typography>
              {result.card_no && (
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Card no: {result.card_no}
                </Typography>
              )}

              <Stack sx={{ mt: 2 }} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  type="number"
                  inputProps={{ min: 0 }}
                />
                <FormControl sx={{ minWidth: 140 }}>
                  <InputLabel id="method-label">Method</InputLabel>
                  <Select
                    labelId="method-label"
                    label="Method"
                    value={method}
                    onChange={(e) =>
                      setMethod(e.target.value as 'Cash' | 'UPI')
                    }
                  >
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="UPI">UPI</MenuItem>
                  </Select>
                </FormControl>
                {method === 'UPI' && (
                  <TextField
                    label="Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                )}
                <Button variant="contained" onClick={recordPayment}>
                  Record Payment
                </Button>
              </Stack>
              {warning && (
                <Alert sx={{ mt: 2 }} severity="warning" onClose={() => setWarning(null)}>
                  {warning}
                </Alert>
              )}
              {message && (
                <Alert sx={{ mt: 2 }} severity="success" onClose={() => setMessage(null)}>
                  {message}
                </Alert>
              )}
            </Paper>

            <Paper elevation={2} sx={{ p: 0, overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Sl. No.</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Transaction ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formattedPayments.map((p, idx) => (
                    <TableRow key={p.id || idx}>
                      <TableCell>{String(idx + 1).padStart(2, '0')}</TableCell>
                      <TableCell>{p.displayDate}</TableCell>
                      <TableCell>
                        {p.amount?.toFixed ? p.amount.toFixed(2) : p.amount}
                      </TableCell>
                      <TableCell>{p.displayMode}</TableCell>
                      <TableCell>{p.displayTxn}</TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined" onClick={() => generateHtmlSlip(result!, p, resolvedCategory ? resolvedCategory : 'General')}>
                          Reprint
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {formattedPayments.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Typography
                          align="center"
                          color="text.secondary"
                          sx={{ py: 3 }}
                        >
                          No payments yet.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </Stack>
        )}
      </Container>
    </Box>
  )
}
