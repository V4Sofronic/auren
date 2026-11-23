import Icon from './Icons.jsx'
import { Link } from '../router.jsx'

const ITEMS = [
  ['box', 'Premium Packaging', 'Your watch arrives in an obsidian presentation case with a magnetic closure, a travel pouch and a hand-signed certificate of authenticity.'],
  ['shield', 'Five-Year Warranty', 'An international warranty covers the movement and every manufacturing detail. Service is performed by our own watchmakers.'],
  ['truck', 'Insured Delivery', 'Complimentary insured express delivery worldwide, discreetly packaged and signed for. White-glove hand delivery is available in select cities.'],
  ['key', 'Lifetime Ownership', 'Private concierge, bracelet adjustment, engraving and scheduled servicing reminders — for as long as you wear it.'],
]

export default function Experience() {
  return (
    <section id="experience" className="experience">
      <header className="sec-head">
        <p className="eyebrow">The AUREN Experience</p>
        <h2 className="display">Ownership, considered</h2>
      </header>
      <div className="exp-grid">
        {ITEMS.map(([ic, t, d], i) => (
          <article key={t} className="exp-card">
            <span className="exp-n">0{i + 1}</span>
            <Icon n={ic} size={30} />
            <h3>{t}</h3>
            <p>{d}</p>
          </article>
        ))}
      </div>
      <p className="center cta-row"><Link to="/track" className="btn">Track an order</Link> <Link to="/account" className="btn">Your account</Link></p>
    </section>
  )
}
