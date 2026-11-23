import { useEffect, useRef, useState } from 'react'
import { Link, go } from '../router.jsx'
import { SHIPPING, placeOrder, priceBag, useStore } from '../store.js'
import Field from '../components/Field.jsx'
import Summary from '../components/Summary.jsx'

const group = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
const expiry = (v) => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d }

export default function PaymentPage() {
  const bag = useStore('bag', [])
  const promo = useStore('promo', '')
  const info = useStore('checkout', null)
  const [f, setF] = useState({ name: '', number: '', exp: '', cvc: '' })
  const [err, setErr] = useState({})
  const [busy, setBusy] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const method = info?.method || 'standard'
  const t = priceBag(bag, method, promo)
  if ((!t.items.length || !info) && !busy) return <div className="page narrow center"><h1 className="display">Nothing to pay for</h1><p><Link to="/bag" className="btn gold">Go to bag</Link></p></div>

  const pay = (e) => {
    e.preventDefault()
    const x = {}
    const digits = f.number.replace(/\D/g, '')
    if (f.name.trim().length < 2) x.name = 'Name on card is required.'
    if (digits.length !== 16) x.number = 'Enter a 16-digit card number (demo: 4242 4242 4242 4242).'
    const m = /^(\d{2})\/(\d{2})$/.exec(f.exp)
    const now = new Date()
    if (!m || +m[1] < 1 || +m[1] > 12 || +m[2] + 2000 < now.getFullYear() || (+m[2] + 2000 === now.getFullYear() && +m[1] < now.getMonth() + 1)) x.exp = 'Enter a valid future date (MM/YY).'
    if (!/^\d{3,4}$/.test(f.cvc)) x.cvc = '3–4 digits.'
    setErr(x)
    if (Object.keys(x).length) return
    setBusy(true)
    timer.current = setTimeout(() => {
      const id = placeOrder({ info, method, promo, card: '•••• ' + digits.slice(-4) })
      go(`confirmation/${id}`)
    }, 1800)
  }

  return (
    <div className="page">
      <ol className="steps"><li className="done">Shipping</li><li className="on">Payment</li><li>Confirmation</li></ol>
      <div className="two">
        <form className="cform" onSubmit={pay} noValidate>
          <div className="demo-banner"><strong>Demo payment.</strong> No card is charged and nothing leaves your browser. Never enter real card details.</div>
          <h2 className="mini">Card details</h2>
          <Field label="Name on card" error={err.name}><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="cc-name" /></Field>
          <Field label="Card number" error={err.number}><input inputMode="numeric" placeholder="4242 4242 4242 4242" value={f.number} onChange={(e) => setF({ ...f, number: group(e.target.value) })} autoComplete="cc-number" /></Field>
          <div className="grid2">
            <Field label="Expiry (MM/YY)" error={err.exp}><input inputMode="numeric" placeholder="08/29" value={f.exp} onChange={(e) => setF({ ...f, exp: expiry(e.target.value) })} autoComplete="cc-exp" /></Field>
            <Field label="CVC" error={err.cvc}><input inputMode="numeric" placeholder="123" value={f.cvc} onChange={(e) => setF({ ...f, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} autoComplete="cc-csc" /></Field>
          </div>
          <p className="fine">Shipping to {info.first} {info.last}, {info.address}, {info.city} · {SHIPPING[method].label}</p>
          <div className="btnrow"><Link to="/checkout" className="btn">← Back</Link><button className="btn gold" type="submit" disabled={busy}>{busy ? 'Authorising…' : `Pay $${t.total.toLocaleString('en-US')}`}</button></div>
        </form>
        <Summary t={t} compact method={SHIPPING[method].label} />
      </div>
      {busy && <div className="overlay"><div className="spinner" /><p>Authorising your demo payment…</p></div>}
    </div>
  )
}
