import { type FormEvent, useState } from 'react'
import { supabase } from '../utils/supabase'

export default function Register() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [cardNo, setCardNo] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    setLoading(true)
    if (!supabase) { setError('Missing Supabase configuration'); return }
    
    // Add SKPC prefix to card number if not already present
    const cardNumberWithPrefix = cardNo.toUpperCase().startsWith('SKPC') 
      ? cardNo.toUpperCase() 
      : `SKPC${cardNo.toUpperCase()}`
    
    const { error } = await supabase.from('registrations').insert({ name, phone, address, card_no: cardNumberWithPrefix })
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Registration saved')
      setName('')
      setPhone('')
      setAddress('')
      setCardNo('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/logo.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.16, filter: 'saturate(0.9) contrast(1.05)' }} />
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.55))' }} />

      <div style={{ position: 'relative', minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
        <div style={{ width: '100%', maxWidth: 560, padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)' }}>
          <h2 style={{ margin: 0, marginBottom: 16, color: '#ffffff', fontWeight: 600 }}>Registration</h2>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <label htmlFor="name" style={{ color: '#f1f5f9', fontSize: 14 }}>Name</label>
              <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label htmlFor="phone" style={{ color: '#f1f5f9', fontSize: 14 }}>Phone number</label>
              <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label htmlFor="cardno" style={{ color: '#f1f5f9', fontSize: 14 }}>Card no (SKPC prefix will be added automatically)</label>
              <input id="cardno" value={cardNo} onChange={(e) => setCardNo(e.target.value)} placeholder="Enter card number (SKPC will be added)" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              <label htmlFor="address" style={{ color: '#f1f5f9', fontSize: 14 }}>Address</label>
              <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" rows={3} required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.9)', outline: 'none', resize: 'vertical' }} />
            </div>
            <button disabled={loading} type="submit" style={{ marginTop: 8, padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.35)', background: loading ? 'rgba(2,132,199,0.7)' : 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#ffffff', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer' }}>{loading ? 'Saving...' : 'Submit'}</button>
          </form>
          {message && <p style={{ color: '#22c55e', marginTop: 12 }}>{message}</p>}
          {error && <p style={{ color: '#ef4444', marginTop: 12 }}>{error}</p>}
        </div>
      </div>
    </div>
  )
}


