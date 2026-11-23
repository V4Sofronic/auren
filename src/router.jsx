import { useEffect, useState } from 'react'
const parse = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent)
export function useRoute() {
  const [parts, setParts] = useState(parse)
  useEffect(() => {
    const f = () => setParts(parse())
    window.addEventListener('hashchange', f)
    return () => window.removeEventListener('hashchange', f)
  }, [])
  return parts
}
export const go = (to) => { window.location.hash = '#/' + String(to).replace(/^\//, '') }
export function Link({ to, children, ...rest }) {
  return <a href={'#/' + String(to).replace(/^\//, '')} {...rest}>{children}</a>
}
