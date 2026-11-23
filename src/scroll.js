// Smooth-scroll helpers shared by the nav, pages and Lenis.
let lenis = null
let pending = null
export const setLenis = (l) => { lenis = l }
export const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0))
const doScroll = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  lenis ? lenis.scrollTo(el, { duration: 1.6 }) : el.scrollIntoView({ behavior: 'smooth' })
}
export const onHome = () => !window.location.hash.replace(/^#\/?/, '')
export function goSection(id) {
  if (onHome()) doScroll(id)
  else { pending = id; window.location.hash = '#/' }
}
export function consumePending() { if (pending) { const id = pending; pending = null; doScroll(id) } }
