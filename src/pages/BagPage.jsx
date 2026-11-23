import { useState } from 'react'
import { Link, go } from '../router.jsx'
import { bagActions, fmt, priceBag, setStore, toast, useStore } from '../store.js'
import { PROMO_CODE } from '../data.js'
import WatchImg from '../components/WatchImg.jsx'
import Summary from '../components/Summary.jsx'
import Icon from '../components/Icons.jsx'

export default function BagPage() {
  const bag = useStore('bag', [])
  const promo = useStore('promo', '')
  const [code, setCode] = useState(promo)
  const t = priceBag(bag, 'standard', promo)

  const apply = (e) => {
    e.preventDefault()
    if (!code.trim()) { setStore('promo', ''); return }
    if (code.trim().toUpperCase() === PROMO_CODE) { setStore('promo', PROMO_CODE); toast('Promo applied: 10% off') }
    else toast('That code is not valid')
  }

  if (!t.items.length) return (
    <div className="page narrow center">
      <h1 className="display">Your bag is empty</h1>
      <p className="lead">Nothing selected yet — discover the collection.</p>
      <p><Link to="/" className="btn gold">Continue exploring</Link> <Link to="/wishlist" className="btn">View wishlist</Link></p>
    </div>
  )

  return (
    <div className="page">
      <h1 className="display left sm">Shopping bag</h1>
      <div className="two">
        <div className="lines">
          {t.items.map((l) => (
            <article className="bline" key={l.key}>
              <Link to={`/product/${l.p.id}`} className="bthumb"><WatchImg p={l.p} /></Link>
              <div className="binfo">
                <Link to={`/product/${l.p.id}`}><h3>{l.p.name} <em>{l.p.variant}</em></h3></Link>
                <small>Bracelet size {l.size} · {l.p.tag}</small>
                <div className="qty"><button onClick={() => bagActions.setQty(l.key, l.qty - 1)} aria-label="Less"><Icon n="minus" size={16} /></button><span>{l.qty}</span><button onClick={() => bagActions.setQty(l.key, l.qty + 1)} aria-label="More"><Icon n="plus" size={16} /></button></div>
              </div>
              <div className="bprice"><strong>{fmt(l.p.price * l.qty)}</strong><button className="link" onClick={() => bagActions.remove(l.key)}>Remove</button></div>
            </article>
          ))}
        </div>
        <div>
          <Summary t={t} />
          <form className="promo" onSubmit={apply}>
            <input placeholder="Promo code (try AUREN10)" value={code} onChange={(e) => setCode(e.target.value)} aria-label="Promo code" />
            <button className="btn" type="submit">Apply</button>
          </form>
          <button className="btn gold full" onClick={() => go('checkout')}>Proceed to checkout</button>
          <p className="fine center">Demo store — no real payment is taken.</p>
        </div>
      </div>
    </div>
  )
}
