import { Link } from '../router.jsx'
import { fmt, toggleWish, useStore } from '../store.js'
import WatchImg from './WatchImg.jsx'
import Icon from './Icons.jsx'

export default function ProductCard({ p, children }) {
  const wish = useStore('wishlist', [])
  return (
    <article className="pcard">
      <button className={`heart abs ${wish.includes(p.id) ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Toggle wishlist"><Icon n="heart" fill={wish.includes(p.id)} /></button>
      <Link to={`/product/${p.id}`} className="pimg"><WatchImg p={p} /></Link>
      <span className="tag">{p.tag}</span>
      <h3><Link to={`/product/${p.id}`}>{p.name} <em>{p.variant}</em></Link></h3>
      <strong>{fmt(p.price)}</strong>
      {children}
    </article>
  )
}
