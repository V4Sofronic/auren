import { fmt } from '../store.js'
import WatchImg from './WatchImg.jsx'

export default function Summary({ t, compact = false, method }) {
  return (
    <aside className="summary">
      <h3 className="mini">Order summary</h3>
      {compact && t.items.map((l) => (
        <div className="sline" key={l.key}>
          <div className="sthumb"><WatchImg p={l.p} shadow={false} /></div>
          <div><strong>{l.p.name} {l.p.variant}</strong><small>Size {l.size} · Qty {l.qty}</small></div>
          <span>{fmt(l.p.price * l.qty)}</span>
        </div>
      ))}
      <div className="row2"><span>Subtotal</span><span>{fmt(t.subtotal)}</span></div>
      {t.discount > 0 && <div className="row2 disc"><span>Promo AUREN10</span><span>−{fmt(t.discount)}</span></div>}
      <div className="row2"><span>Shipping{method ? ` · ${method}` : ''}</span><span>{t.shipping ? fmt(t.shipping) : 'Complimentary'}</span></div>
      <div className="row2"><span>Estimated tax</span><span>{fmt(t.tax)}</span></div>
      <div className="row2 total"><span>Total</span><span>{fmt(t.total)}</span></div>
    </aside>
  )
}
