import { Link } from '../router.jsx'
import { goSection } from '../scroll.js'
import { PRODUCTS } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="foot-grid">
        <div>
          <div className="logo big">AUREN</div>
          <p className="muted">Engineered beyond time.<br />Istanbul · Geneva · Dubai</p>
        </div>
        <div><h4>The Collection</h4>{PRODUCTS.map((p) => <Link key={p.id} to={`/product/${p.id}`}>{p.name} {p.variant}</Link>)}</div>
        <div><h4>Client Services</h4>
          <Link to="/track">Order Tracking</Link><Link to="/account">My Account</Link><Link to="/wishlist">Wishlist</Link><Link to="/bag">Shopping Bag</Link>
          <button onClick={() => goSection('contact')}>Contact &amp; FAQs</button></div>
        <div><h4>The House</h4>
          <button onClick={() => goSection('philosophy')}>Our Philosophy</button><button onClick={() => goSection('experience')}>The Experience</button><button onClick={() => goSection('details')}>Craftsmanship</button></div>
      </div>
      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} AUREN — a fictional brand. Demo store: no real payments, no real shipping.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  )
}
