import { useEffect, useState } from 'react'
import { Link, go } from '../router.jsx'
import { SHIPPING, TRACK_STEPS, advanceOrder, findOrder, orderStage, useAccount, useStore } from '../store.js'
import Field from '../components/Field.jsx'
import Icon from '../components/Icons.jsx'

const day = (t) => new Date(t).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export default function TrackPage({ id }) {
  const orders = useStore('orders', [])
  const acct = useAccount()
  const [q, setQ] = useState(id || '')
  const [, tick] = useState(0)
  useEffect(() => { const i = setInterval(() => tick((x) => x + 1), 10000); return () => clearInterval(i) }, [])
  useEffect(() => { setQ(id || '') }, [id])

  const o = id ? findOrder(id) : null
  const mine = acct ? orders.filter((x) => x.email === acct.email) : []
  const submit = (e) => { e.preventDefault(); if (q.trim()) go(`track/${q.trim().toUpperCase()}`) }

  const stage = o ? orderStage(o) : 0
  return (
    <div className="page narrow">
      <h1 className="display left sm">Order tracking</h1>
      <form className="promo" onSubmit={submit}>
        <input placeholder="Order number, e.g. AUR-7K2X9Q" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Order number" />
        <button className="btn gold" type="submit">Track</button>
      </form>

      {id && !o && <p className="err-box">No order found with number “{id}”. Orders are saved in this browser only.</p>}
      {o && (
        <div className="card-box">
          <div className="trk-head">
            <div><span className="tag">Order</span><h2>{o.id}</h2><small>Placed {day(o.createdAt)} · {o.lines.reduce((s, l) => s + l.qty, 0)} item(s) · {SHIPPING[o.method].label}</small></div>
            <div className="eta"><small>Estimated delivery</small><strong>{day(o.createdAt + 4 * 86400000)}</strong></div>
          </div>
          <ol className="timeline">
            {TRACK_STEPS.map((s, i) => (
              <li key={s} className={i < stage ? 'done' : i === stage ? 'now' : ''}>
                <span className="dot">{i < stage ? <Icon n="check" size={14} /> : i + 1}</span>
                <div><strong>{s}</strong><small>{i <= stage ? (i === 0 ? day(o.createdAt) : 'Completed') : 'Pending'}</small></div>
              </li>
            ))}
          </ol>
          <p className="fine">Tracking no. AU{o.id.replace(/\D/g, '').padEnd(6, '7')}{o.createdAt.toString().slice(-6)} · Demo: status advances by itself every 2 minutes.</p>
          <div className="btnrow">
            <button className="btn" disabled={stage >= 5} onClick={() => advanceOrder(o.id)}>Demo: advance status</button>
            <Link to={`/confirmation/${o.id}`} className="btn">View receipt</Link>
          </div>
        </div>
      )}

      {!id && (
        <div className="recent">
          <h3 className="mini">{acct ? 'Your orders' : 'Orders on this device'}</h3>
          {(acct ? mine : orders).length === 0 && <p className="muted">No orders yet. Orders you place will appear here.</p>}
          {(acct ? mine : orders).map((x) => <Link className="orow" key={x.id} to={`/track/${x.id}`}><span>{x.id}</span><span>{day(x.createdAt)}</span><span>{TRACK_STEPS[orderStage(x)]}</span><span>→</span></Link>)}
        </div>
      )}
    </div>
  )
}
