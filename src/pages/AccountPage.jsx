import { useEffect, useState } from 'react'
import { Link } from '../router.jsx'
import { TRACK_STEPS, auth, fmt, orderStage, toast, useAccount, useStore } from '../store.js'
import Field, { emailOk } from '../components/Field.jsx'

const day = (t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

function Auth() {
  const [mode, setMode] = useState('in')
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState({})
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (mode === 'up' && f.name.trim().length < 2) x.name = 'Enter your name.'
    if (!emailOk(f.email)) x.email = 'Enter a valid email.'
    if (f.password.length < 6) x.password = 'At least 6 characters.'
    if (!Object.keys(x).length) { const m = mode === 'up' ? auth.register(f) : auth.login(f.email, f.password); if (m) x.form = m; else toast(mode === 'up' ? 'Account created' : 'Welcome back') }
    setErr(x)
  }
  return (
    <div className="page narrow">
      <h1 className="display sm center">{mode === 'in' ? 'Sign in' : 'Create your account'}</h1>
      <form className="cform authform" onSubmit={submit} noValidate>
        {mode === 'up' && <Field label="Full name" error={err.name}><input value={f.name} onChange={on('name')} autoComplete="name" /></Field>}
        <Field label="Email" error={err.email}><input type="email" value={f.email} onChange={on('email')} autoComplete="email" /></Field>
        <Field label="Password" error={err.password}><input type="password" value={f.password} onChange={on('password')} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} /></Field>
        {err.form && <p className="err-box">{err.form}</p>}
        <button className="btn gold full" type="submit">{mode === 'in' ? 'Sign in' : 'Create account'}</button>
        <p className="center muted">{mode === 'in' ? 'New to AUREN?' : 'Already a member?'} <button type="button" className="link-g" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr({}) }}>{mode === 'in' ? 'Create an account' : 'Sign in'}</button></p>
        <p className="fine center">Demo only: accounts live in this browser and passwords are not securely stored. Don’t reuse a real password.</p>
      </form>
    </div>
  )
}

export default function AccountPage() {
  const a = useAccount()
  const orders = useStore('orders', [])
  const wish = useStore('wishlist', [])
  const [f, setF] = useState({ name: '', phone: '', address: '' })
  useEffect(() => { if (a) setF({ name: a.name, phone: a.phone || '', address: a.address || '' }) }, [a?.email]) // eslint-disable-line
  if (!a) return <Auth />
  const mine = orders.filter((o) => o.email === a.email)
  const save = (e) => { e.preventDefault(); auth.update(a.email, f); toast('Profile saved') }

  return (
    <div className="page">
      <div className="acct-head">
        <div><p className="eyebrow">My account</p><h1 className="display left sm">Welcome, {a.name.split(' ')[0]}</h1><small className="muted">{a.email}</small></div>
        <button className="btn" onClick={() => { auth.logout(); toast('Signed out') }}>Sign out</button>
      </div>
      <div className="acct-grid">
        <section className="card-box">
          <h2 className="mini">Profile</h2>
          <form className="cform" onSubmit={save}>
            <Field label="Full name"><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
            <Field label="Phone"><input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
            <Field label="Default address"><input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></Field>
            <button className="btn gold" type="submit">Save changes</button>
          </form>
        </section>
        <section className="card-box">
          <h2 className="mini">Order history</h2>
          {mine.length === 0 && <p className="muted">No orders yet.</p>}
          {mine.map((o) => <Link className="orow" key={o.id} to={`/track/${o.id}`}><span>{o.id}</span><span>{day(o.createdAt)}</span><span>{fmt(o.totals.total)}</span><span>{TRACK_STEPS[orderStage(o)]}</span></Link>)}
          <p className="cta-row"><Link to="/track" className="btn">Order tracking</Link> <Link to="/wishlist" className="btn">Wishlist ({wish.length})</Link></p>
        </section>
      </div>
    </div>
  )
}
