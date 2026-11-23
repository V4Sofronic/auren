import { useState } from 'react'
import { PRODUCTS, SIZES } from '../data.js'
import { Link, go } from '../router.jsx'
import { bagActions, fmt, product, toast, toggleWish, useStore } from '../store.js'
import ProductCard from '../components/ProductCard.jsx'
import Icon from '../components/Icons.jsx'

const VIEWS = {
  front: { label: 'Front', size: 'contain', pos: 'center' },
  dial: { label: 'Dial', size: '300%', pos: '50% 46%' },
  crown: { label: 'Crown', size: '470%', pos: '97% 40%' },
  bracelet: { label: 'Bracelet', size: '340%', pos: '50% 93%' },
}

export default function ProductPage({ id }) {
  const p = product(id)
  const [view, setView] = useState('front')
  const [size, setSize] = useState('M')
  const [qty, setQty] = useState(1)
  const [acc, setAcc] = useState('specs')
  const wish = useStore('wishlist', [])
  if (!p) return <div className="page narrow"><h1 className="display">Watch not found</h1><Link to="/" className="btn">Back to home</Link></div>

  const v = VIEWS[view]
  const img = p.img || '/watch.png'
  const add = () => { bagActions.add(p.id, size, qty); toast(`${p.name} ${p.variant} added to your bag`) }
  const ACC = {
    specs: ['Specifications', 'Case 42 mm · Grade 5 titanium · Sapphire crystal · Calibre AU-01 automatic skeleton · 72 h power reserve · 50 m water resistance.'],
    ship: ['Shipping & returns', 'Complimentary insured express delivery in 3–5 business days. 30-day returns on unworn watches in original packaging.'],
    warranty: ['Warranty & care', 'Five-year international warranty. Complimentary first service and bracelet adjustment through our concierge.'],
  }
  return (
    <div className="page">
      <nav className="crumbs"><Link to="/">Home</Link> / <span>{p.name} {p.variant}</span></nav>
      <div className="pdp">
        <div className="gallery">
          <div className="gmain">
            <div className="gimg" style={{ backgroundImage: `url(${img})`, backgroundSize: v.size, backgroundPosition: v.pos, filter: p.filter || undefined }} role="img" aria-label={`${p.variant} – ${v.label}`} />
          </div>
          <div className="thumbs">
            {Object.entries(VIEWS).map(([k, t]) => (
              <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)} aria-label={t.label}>
                <i style={{ backgroundImage: `url(${img})`, backgroundSize: t.size === 'contain' ? 'contain' : `${parseInt(t.size) * 0.7}%`, backgroundPosition: t.pos, filter: p.filter || undefined }} />
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pinfo">
          <span className="tag">{p.tag}</span>
          <h1>{p.name} <em>{p.variant}</em></h1>
          <p className="price big">{fmt(p.price)}</p>
          <p className="lead">{p.blurb}</p>

          <div className="opt"><h4>Finish</h4>
            <div className="swatches">{PRODUCTS.map((q) => <Link key={q.id} to={`/product/${q.id}`} className={q.id === p.id ? 'on' : ''} style={{ background: q.swatch }} aria-label={q.variant} title={q.variant} />)}</div>
          </div>
          <div className="opt"><h4>Bracelet size</h4>
            <div className="sizes">{SIZES.map((s) => <button key={s} className={size === s ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}</div>
          </div>
          <div className="opt"><h4>Quantity</h4>
            <div className="qty"><button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Less"><Icon n="minus" size={16} /></button><span>{qty}</span><button onClick={() => setQty(Math.min(5, qty + 1))} aria-label="More"><Icon n="plus" size={16} /></button></div>
          </div>

          <div className="actions">
            <button className="btn gold wide" onClick={add}>Add to bag</button>
            <button className="btn wide" onClick={() => { bagActions.add(p.id, size, qty); go('checkout') }}>Buy now</button>
            <button className={`heart ${wish.includes(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist"><Icon n="heart" fill={wish.includes(p.id)} /></button>
          </div>

          <div className="accs">
            {Object.entries(ACC).map(([k, [t, body]]) => (
              <div key={k} className={`faq ${acc === k ? 'open' : ''}`}>
                <button onClick={() => setAcc(acc === k ? '' : k)} aria-expanded={acc === k}>{t}<span>{acc === k ? '−' : '+'}</span></button>
                <div className="faq-a"><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="display sm">You may also like</h2>
      <div className="pgrid">{PRODUCTS.filter((q) => q.id !== p.id).slice(0, 3).map((q) => <ProductCard key={q.id} p={q} />)}</div>
    </div>
  )
}
