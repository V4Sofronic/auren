import { useState } from 'react'
import { Link, go } from '../router.jsx'
import { SHIPPING, fmt, priceBag, setStore, useAccount, useStore } from '../store.js'
import Field, { emailOk } from '../components/Field.jsx'
import Summary from '../components/Summary.jsx'

export default function CheckoutPage() {
  const bag = useStore('bag', [])
  const promo = useStore('promo', '')
  const saved = useStore('checkout', null)
  const acct = useAccount()
  const [f, setF] = useState(() => ({
    email: acct?.email || '', first: acct?.name?.split(' ')[0] || '', last: acct?.name?.split(' ').slice(1).join(' ') || '',
    phone: acct?.phone || '', address: acct?.address || '', city: '', zip: '', country: 'Türkiye', method: 'standard', ...(saved || {}),
  }))
  const [err, setErr] = useState({})
  const t = priceBag(bag, f.method, promo)
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })

  if (!t.items.length) return <div className="page narrow center"><h1 className="display">Nothing to check out</h1><p><Link to="/" className="btn gold">Back to the collection</Link></p></div>

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (!emailOk(f.email)) x.email = 'Enter a valid email.'
    if (f.first.trim().length < 1) x.first = 'Required.'
    if (f.last.trim().length < 1) x.last = 'Required.'
    if (f.address.trim().length < 4) x.address = 'Enter your street address.'
    if (f.city.trim().length < 2) x.city = 'Required.'
    if (f.zip.trim().length < 3) x.zip = 'Enter a postal code.'
    if (f.phone.replace(/\D/g, '').length < 7) x.phone = 'Enter a phone number.'
    setErr(x)
    if (Object.keys(x).length) return
    setStore('checkout', f)
    go('payment')
  }

  return (
    <div className="page">
      <ol className="steps"><li className="on">Shipping</li><li>Payment</li><li>Confirmation</li></ol>
      <div className="two">
        <form className="cform" onSubmit={submit} noValidate>
          <h2 className="mini">Contact</h2>
          <Field label="Email" error={err.email}><input type="email" value={f.email} onChange={on('email')} autoComplete="email" /></Field>
          <h2 className="mini">Delivery address</h2>
          <div className="grid2">
            <Field label="First name" error={err.first}><input value={f.first} onChange={on('first')} autoComplete="given-name" /></Field>
            <Field label="Last name" error={err.last}><input value={f.last} onChange={on('last')} autoComplete="family-name" /></Field>
          </div>
          <Field label="Street address" error={err.address}><input value={f.address} onChange={on('address')} autoComplete="street-address" /></Field>
          <div className="grid2">
            <Field label="City" error={err.city}><input value={f.city} onChange={on('city')} autoComplete="address-level2" /></Field>
            <Field label="Postal code" error={err.zip}><input value={f.zip} onChange={on('zip')} autoComplete="postal-code" /></Field>
          </div>
          <div className="grid2">
            <Field label="Country"><input value={f.country} onChange={on('country')} autoComplete="country-name" /></Field>
            <Field label="Phone" error={err.phone}><input type="tel" value={f.phone} onChange={on('phone')} autoComplete="tel" /></Field>
          </div>
          <h2 className="mini">Delivery method</h2>
          <div className="methods">
            {Object.entries(SHIPPING).map(([k, m]) => (
              <label key={k} className={`method ${f.method === k ? 'on' : ''}`}>
                <input type="radio" name="method" checked={f.method === k} onChange={() => setF({ ...f, method: k })} />
                <span><strong>{m.label}</strong><small>{m.eta}</small></span><em>{m.price ? fmt(m.price) : 'Complimentary'}</em>
              </label>
            ))}
          </div>
          <div className="btnrow"><Link to="/bag" className="btn">← Back to bag</Link><button className="btn gold" type="submit">Continue to payment</button></div>
        </form>
        <Summary t={t} compact method={SHIPPING[f.method].label} />
      </div>
    </div>
  )
}
