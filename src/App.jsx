import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useRoute } from './router.jsx'
import { scrollToTop, setLenis } from './scroll.js'
import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import Home from './pages/Home.jsx'
import ProductPage from './pages/ProductPage.jsx'
import BagPage from './pages/BagPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import PaymentPage from './pages/PaymentPage.jsx'
import ConfirmationPage from './pages/ConfirmationPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import WishlistPage from './pages/WishlistPage.jsx'
import TrackPage from './pages/TrackPage.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const parts = useRoute()
  const [r0, r1] = parts
  const key = parts.join('/')

  // Smooth scrolling wired into GSAP's ticker
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    setLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(raf); lenis.destroy(); setLenis(null) }
  }, [])

  // every route change starts at the top
  useEffect(() => { scrollToTop() }, [key])

  let page
  switch (r0) {
    case undefined: page = <Home />; break
    case 'product': page = <ProductPage id={r1} />; break
    case 'bag': page = <BagPage />; break
    case 'checkout': page = <CheckoutPage />; break
    case 'payment': page = <PaymentPage />; break
    case 'confirmation': page = <ConfirmationPage id={r1} />; break
    case 'account': page = <AccountPage />; break
    case 'wishlist': page = <WishlistPage />; break
    case 'track': page = <TrackPage id={r1} />; break
    default: page = <div className="page narrow center"><h1 className="display">Page not found</h1><p><a className="btn gold" href="#/">Back to home</a></p></div>
  }

  return (
    <>
      <Nav solid={!!r0} />
      <main id="top" key={key} className="route">{page}</main>
      <Footer />
      <Toast />
    </>
  )
}
