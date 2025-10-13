import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../utils/supabase'
import { useParams } from 'react-router-dom'

type LuckyRow = {
  id: string
  registration_id: string
  prize: string | null
  created_at: string
  winner_month?: string | null
  registrations?: { name: string; phone: string }
}

export default function LuckyDraw() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const { category } = useParams()
  const resolvedCategory = useMemo(() => {
    const c = (category || '').toLowerCase()
    return c === 'laptop' || c === 'camera' || c === 'inverter' ? c : null
  }, [category])
  const [rows, setRows] = useState<LuckyRow[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Entry UI state
  const months = useMemo(() => (
    ['January','February','March','April','May','June','July','August','September','October','November','December']
  ), [])
  const defaultMonth = useMemo(() => months[new Date().getMonth()], [months])
  const [winnerMonth, setWinnerMonth] = useState<string>(defaultMonth)
  const [queryName, setQueryName] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string; phone: string }>>([])
  const [selectedReg, setSelectedReg] = useState<{ id: string; name: string; phone: string } | null>(null)
  const [prize, setPrize] = useState('')

  useEffect(() => {
    async function load() {
      const table = resolvedCategory ? `${resolvedCategory}_lucky_draws` : 'lucky_draws'
      const regTable = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
      const { data, error } = await supabase
        .from(table)
        .select(`id, registration_id, prize, created_at, winner_month, ${regTable}!inner(name, phone)`) // join alias
        .order('created_at', { ascending: false })
      if (error) setError(error.message)
      else setRows((data as unknown as LuckyRow[]) || [])
    }
    load()
  }, [resolvedCategory])

  async function searchByName() {
    setError(null)
    setSelectedReg(null)
    setSearchResults([])
    if (!supabase) { setError('Missing Supabase configuration'); return }
    const table = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
    const { data, error } = await supabase
      .from(table)
      .select('id, name, phone')
      .ilike('name', `%${queryName}%`)
      .limit(50)
    if (error) setError(error.message)
    else setSearchResults((data as any[]) || [])
  }

  async function saveWinner() {
    setError(null)
    if (!selectedReg) { setError('Please select a registration'); return }
    setLoading(true)
    const payload: any = { registration_id: selectedReg.id, prize: prize || null, winner_month: winnerMonth }
    const table = resolvedCategory ? `${resolvedCategory}_lucky_draws` : 'lucky_draws'
    const { error } = await supabase.from(table).insert(payload)
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // Reset entry state and refresh list
    setQueryName('')
    setSearchResults([])
    setSelectedReg(null)
    setPrize('')
    const regTable = resolvedCategory ? `${resolvedCategory}_registrations` : 'registrations'
    const { data } = await supabase
      .from(table)
      .select(`id, registration_id, prize, created_at, winner_month, ${regTable}!inner(name, phone)`) 
      .order('created_at', { ascending: false })
    if (data) setRows((data as unknown as LuckyRow[]) || [])
  }

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: 16 }}>
      <h2>{resolvedCategory ? `${resolvedCategory.charAt(0).toUpperCase()}${resolvedCategory.slice(1)} ` : ''}Lucky Winners</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Entry section */}
      <div style={{ marginTop: 16, padding: 20, border: '2px solid #3b82f6', borderRadius: 12, background: '#eff6ff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginTop: 0, color: '#1e40af', fontSize: '1.25rem', fontWeight: 'bold' }}>🎉 Enter Monthly Winner</h3>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: '1fr', alignItems: 'center' }}>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <select value={winnerMonth} onChange={(e) => setWinnerMonth(e.target.value)} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }}>
              {months.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input value={queryName} onChange={(e) => setQueryName(e.target.value)} placeholder="Search by name" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <button onClick={searchByName} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #0ea5e9', background: '#0ea5e9', color: 'white', fontWeight: 600, width: '100%' }}>Search</button>
          </div>
          {searchResults.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Name</th>
                    <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Phone</th>
                    <th style={{ textAlign: 'right', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((r) => (
                    <tr key={r.id}>
                      <td style={{ padding: 8 }}>{r.name}</td>
                      <td style={{ padding: 8 }}>{r.phone}</td>
                      <td style={{ padding: 8, textAlign: 'right' }}>
                        <button onClick={() => setSelectedReg(r)} style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #64748b', background: selectedReg?.id === r.id ? '#64748b' : 'white', color: selectedReg?.id === r.id ? 'white' : '#0f172a' }}>
                          {selectedReg?.id === r.id ? 'Selected' : 'Select'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 160px' }}>
            <input value={prize} onChange={(e) => setPrize(e.target.value)} placeholder="Prize (optional)" style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1' }} />
            <button onClick={saveWinner} disabled={!selectedReg || loading} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #16a34a', background: !selectedReg || loading ? '#86efac' : '#16a34a', color: 'white', fontWeight: 700 }}>
              {loading ? 'Saving...' : 'Save winner'}
            </button>
          </div>
          {selectedReg && (
            <p style={{ margin: 0, color: '#334155' }}>Selected: <strong>{selectedReg.name}</strong> ({selectedReg.phone}) for <strong>{winnerMonth}</strong></p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24, overflowX: 'auto' }}>
        <h3 style={{ marginTop: 0 }}>Lucky Draw History</h3>
        {rows.length === 0 ? (
          <p>No entries yet</p>
        ) : (
          <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Date</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Month</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Name</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Phone</th>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb', padding: 8 }}>Prize</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={{ padding: 8 }}>{new Date(r.created_at).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{r.winner_month || '-'}</td>
                  <td style={{ padding: 8 }}>{r.registrations?.name}</td>
                  <td style={{ padding: 8 }}>{r.registrations?.phone}</td>
                  <td style={{ padding: 8 }}>{r.prize ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}


