import TiltWatch from './TiltWatch.jsx'
import { PRODUCTS } from '../data.js'

export default function Philosophy() {
  return (
    <section id="philosophy" className="philo">
      <div className="philo-text">
        <p className="eyebrow">Our Philosophy</p>
        <h2 className="display left">More than time</h2>
        <div className="philo-block">
          <h3>The Story</h3>
          <p>AUREN began with a simple conviction: a watch should be a quiet declaration, not a loud one. Born from the glow of Istanbul at night, the house pairs the discipline of Swiss-style watchmaking with a restless, modern eye.</p>
        </div>
        <div className="philo-block">
          <h3>The Vision</h3>
          <p>To build objects that feel inevitable — light, precise and timeless — and to make the mechanism itself the ornament. Nothing hidden, nothing wasted.</p>
        </div>
        <div className="philo-block">
          <h3>The Craft</h3>
          <p>Every AUREN ONE is shaped from grade 5 titanium, opened to reveal its movement, then finished by hand — brushed, polished, inspected twice, and set to run for generations.</p>
        </div>
      </div>
      <TiltWatch p={PRODUCTS[0]} intensity={0.45} spinIn={false} className="philo-watch" />
    </section>
  )
}
