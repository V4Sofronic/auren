import { useState } from 'react'
import { getStore, setStore, toast } from '../store.js'
import { FAQS } from '../data.js'
import { Link } from '../router.jsx'

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export default function Contact() {
  const [f, setF] = useState({ name: '', email: '', topic: 'Product enquiry', message: '' })
  const [err, setErr] = useState({})
  const [sent, setSent] = useState(false)
  const [open, setOpen] = useState(0)
  const on = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const x = {}
    if (f.name.trim().length < 2) x.name = 'Please enter your name.'
    if (!emailOk(f.email)) x.email = 'Please enter a valid email.'
    if (f.message.trim().length < 10) x.message = 'Please write at least a short message.'
    setErr(x)
    if (Object.keys(x).length) return
    setStore('messages', [{ ...f, at: Date.now() }, ...getStore('messages', [])])
    setSent(true); toast('Message sent to our concierge (demo)')
  }

  return (
    <section id="contact" className="contact">
      <header className="sec-head">
        <p className="eyebrow">Contact &amp; Client Services</p>
        <h2 className="display">At your service</h2>
      </header>
      <div className="contact-grid">
        <form className="cform" onSubmit={submit} noValidate>
          {sent ? (
            <div className="sent"><h3>Thank you, {f.name.split(' ')[0]}.</h3><p>Your message has been received. A concierge will reply to {f.email} within one business day.</p>
              <button type="button" className="btn" onClick={() => { setSent(false); setF({ name: '', email: '', topic: 'Product enquiry', message: '' }) }}>Send another</button></div>
          ) : (
            <>
              <label className="field"><span>Name</span><input value={f.name} onChange={on('name')} autoComplete="name" />{err.name && <b>{err.name}</b>}</label>
              <label className="field"><span>Email</span><input type="email" value={f.email} onChange={on('email')} autoComplete="email" />{err.email && <b>{err.email}</b>}</label>
              <label className="field"><span>Topic</span>
                <select value={f.topic} onChange={on('topic')}>{['Product enquiry', 'Order support', 'Warranty & service', 'Private viewing', 'Press'].map((t) => <option key={t}>{t}</option>)}</select></label>
              <label className="field"><span>Message</span><textarea rows="5" value={f.message} onChange={on('message')} />{err.message && <b>{err.message}</b>}</label>
              <button className="btn gold" type="submit">Send message</button>
            </>
          )}
        </form>

        <div className="faqs">
          <h3 className="mini">Frequently asked</h3>
          {FAQS.map(([q, a], i) => (
            <div key={q} className={`faq ${open === i ? 'open' : ''}`}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<span>{open === i ? '−' : '+'}</span></button>
              <div className="faq-a"><p>{a}</p></div>
            </div>
          ))}
        </div>

        <div className="assist">
          <h3 className="mini">Client assistance</h3>
          <p><strong>Concierge</strong><br />+90 212 000 00 00</p>
          <p><strong>Email</strong><br />concierge@auren.example</p>
          <p><strong>Hours</strong><br />Mon–Sat, 09:00–19:00 (GMT+3)</p>
          <p><Link to="/track" className="link-g">Track an order →</Link><br /><Link to="/account" className="link-g">My account →</Link></p>
          <small className="fine">Demo details — no real contact channels.</small>
        </div>
      </div>
    </section>
  )
}
