import { Link } from '../router.jsx'
import { bagActions, product, toast, toggleWish, useStore } from '../store.js'
import ProductCard from '../components/ProductCard.jsx'

export default function WishlistPage() {
  const ids = useStore('wishlist', [])
  const items = ids.map(product).filter(Boolean)
  return (
    <div className="page">
      <h1 className="display left sm">Wishlist</h1>
      {!items.length ? (
        <div className="center"><p className="lead">Nothing saved yet. Tap the heart on any watch to keep it here.</p><p><Link to="/" className="btn gold">Explore the collection</Link></p></div>
      ) : (
        <div className="pgrid">
          {items.map((p) => (
            <ProductCard key={p.id} p={p}>
              <div className="actions c">
                <button className="btn gold" onClick={() => { bagActions.add(p.id, 'M', 1); toggleWish(p.id); toast('Moved to your bag') }}>Move to bag</button>
              </div>
            </ProductCard>
          ))}
        </div>
      )}
    </div>
  )
}
