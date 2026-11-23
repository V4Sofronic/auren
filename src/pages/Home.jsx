import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { consumePending } from '../scroll.js'
import Journey from '../components/Journey.jsx'
import Signature from '../components/Signature.jsx'
import Collection from '../components/Collection.jsx'
import Details from '../components/Details.jsx'
import Experience from '../components/Experience.jsx'
import Philosophy from '../components/Philosophy.jsx'
import Contact from '../components/Contact.jsx'
import FinalWord from '../components/FinalWord.jsx'

export default function Home() {
  useEffect(() => {
    const t = setTimeout(() => { ScrollTrigger.refresh(); consumePending() }, 300)
    return () => clearTimeout(t)
  }, [])
  return <><Journey /><Signature /><Collection /><Details /><Experience /><Philosophy /><Contact /><FinalWord /></>
}
