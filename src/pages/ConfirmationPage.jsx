import { Link } from '../router.jsx'
import { SHIPPING, fmt, findOrder, useStore } from '../store.js'
import Icon from '../components/Icons.jsx'

export default function ConfirmationPage({ id }) {
  useStore('orders', [])
  const o = findOrder(id)
  if (!o) return <div className="page narrow center"><h1 className="display">Order not found</h1><p><Link to="/track" className="btn">Track an order</Link></p></div>
  return (
    <div className="page narrow">
      <ol className="steps"><li className="done">Shipping</li><li className="done">Payment</li><li className="on">Confirmation</li></ol>
      <div className="confirm">
        <span className="okmark"><Icon n="check" size={34} /></span>
        <p className="eyebrow">Thank you, {o.info.first}</p>
        <h1 className="display sm">Your order is confirmed</h1>
        <p className="lead">Order <strong className="gold-t">{o.id}</strong> — a confirmation has been "sent" to {o.email} (demo).</p>
      </div>
      <div className="card-box">
        {o.lines.map((l, i) => <div className="row2" key={i}><span>{l.name} {l.variant} · Size {l.size} × {l.qty}</span><span>{fmt(l.price * l.qty)}</span></div>)}
        <div className="row2"><span>Shipping · {SHIPPING[o.method].label}</span><span>{o.totals.shipping ? fmt(o.totals.shipping) : 'Complimentary'}</span></div>
        <div className="row2"><span>Tax</span><span>{fmt(o.totals.tax)}</span></div>
        {o.totals.discount > 0 && <div className="row2 disc"><span>Promo</span><span>−{fmt(o.totals.discount)}</span></div>}
        <div className="row2 total"><span>Total paid · {o.card}</span><span>{fmt(o.totals.total)}</span></div>
        <p className="fine">Delivering to {o.info.first} {o.info.last}, {o.info.address}, {o.info.city} {o.info.zip}, {o.info.country}</p>
      </div>
      <p className="center cta-row"><Link to={`/track/${o.id}`} className="btn gold">Track this order</Link> <Link to="/" className="btn">Continue exploring</Link></p>
    </div>
  )
}
