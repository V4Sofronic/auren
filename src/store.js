import { useSyncExternalStore } from 'react'
import { PRODUCTS, PROMO_CODE } from './data.js'

/* ---------- tiny localStorage store (no backend) ---------- */
const PREFIX = 'auren:'
const cache = {}
const subs = new Set()
const read = (k, d) => { try { const v = localStorage.getItem(PREFIX + k); return v == null ? d : JSON.parse(v) } catch { return d } }
export const getStore = (k, d) => { if (!(k in cache)) cache[k] = read(k, d); return cache[k] }
export function setStore(k, v) {
  cache[k] = v
  try { localStorage.setItem(PREFIX + k, JSON.stringify(v)) } catch { /* storage full / blocked */ }
  subs.forEach((f) => f())
}
window.addEventListener('storage', (e) => {
  if (e.key && e.key.startsWith(PREFIX)) { delete cache[e.key.slice(PREFIX.length)]; subs.forEach((f) => f()) }
})
const subscribe = (f) => { subs.add(f); return () => subs.delete(f) }
export const useStore = (k, d) => useSyncExternalStore(subscribe, () => getStore(k, d))

/* ---------- helpers ---------- */
export const fmt = (n) => '$' + Number(n).toLocaleString('en-US')
export const product = (id) => PRODUCTS.find((p) => p.id === id)
export const toast = (msg) => window.dispatchEvent(new CustomEvent('auren-toast', { detail: msg }))
export const mod = (a, n) => ((a % n) + n) % n

/* ---------- bag ---------- */
export const bagActions = {
  add(id, size = 'M', qty = 1) {
    const bag = getStore('bag', [])
    const key = `${id}|${size}`
    const has = bag.some((l) => l.key === key)
    setStore('bag', has
      ? bag.map((l) => (l.key === key ? { ...l, qty: Math.min(5, l.qty + qty) } : l))
      : [...bag, { key, id, size, qty: Math.min(5, qty) }])
  },
  setQty(key, q) { setStore('bag', getStore('bag', []).map((l) => (l.key === key ? { ...l, qty: Math.max(1, Math.min(5, q)) } : l))) },
  remove(key) { setStore('bag', getStore('bag', []).filter((l) => l.key !== key)) },
  clear() { setStore('bag', []) },
}
export const toggleWish = (id) => {
  const w = getStore('wishlist', [])
  const has = w.includes(id)
  setStore('wishlist', has ? w.filter((x) => x !== id) : [...w, id])
  toast(has ? 'Removed from wishlist' : 'Saved to wishlist')
}

/* ---------- pricing ---------- */
export const SHIPPING = {
  standard: { label: 'Insured Express', eta: '3–5 business days', price: 0 },
  priority: { label: 'Priority Overnight', eta: 'Next business day', price: 90 },
  concierge: { label: 'White-Glove Concierge', eta: 'Hand-delivered, scheduled with you', price: 180 },
}
export function priceBag(lines, method = 'standard', promo = '') {
  const items = lines.map((l) => ({ ...l, p: product(l.id) })).filter((l) => l.p)
  const subtotal = items.reduce((s, l) => s + l.p.price * l.qty, 0)
  const discount = promo.trim().toUpperCase() === PROMO_CODE ? Math.round(subtotal * 0.1) : 0
  const shipping = items.length ? (SHIPPING[method] || SHIPPING.standard).price : 0
  const tax = Math.round((subtotal - discount) * 0.08)
  return { items, subtotal, discount, shipping, tax, total: subtotal - discount + shipping + tax }
}

/* ---------- accounts (demo only: passwords are NOT secure, stored in your browser) ---------- */
export const auth = {
  register({ name, email, password }) {
    const accounts = getStore('accounts', [])
    const e = email.trim().toLowerCase()
    if (accounts.some((a) => a.email === e)) return 'An account with this email already exists.'
    setStore('accounts', [...accounts, { name: name.trim(), email: e, password, phone: '', address: '' }])
    setStore('session', e)
    return null
  },
  login(email, password) {
    const a = getStore('accounts', []).find((x) => x.email === email.trim().toLowerCase())
    if (!a || a.password !== password) return 'Incorrect email or password.'
    setStore('session', a.email)
    return null
  },
  logout() { setStore('session', null) },
  update(email, patch) { setStore('accounts', getStore('accounts', []).map((a) => (a.email === email ? { ...a, ...patch } : a))) },
}
export const useAccount = () => {
  const session = useStore('session', null)
  const accounts = useStore('accounts', [])
  return accounts.find((a) => a.email === session) || null
}

/* ---------- orders & tracking ---------- */
export const TRACK_STEPS = ['Order placed', 'Confirmed & verified', 'Crafted & inspected', 'Dispatched', 'Out for delivery', 'Delivered']
// Demo: status advances by itself every 2 minutes, or press "advance" on the tracking page.
export const orderStage = (o) => Math.min(5, Math.max(o.stage || 0, Math.floor((Date.now() - o.createdAt) / 120000)))
export const advanceOrder = (id) => setStore('orders', getStore('orders', []).map((o) => (o.id === id ? { ...o, stage: Math.min(5, orderStage(o) + 1) } : o)))
export const findOrder = (id) => getStore('orders', []).find((o) => o.id === String(id || '').trim().toUpperCase())

export function placeOrder({ info, method, promo, card }) {
  const t = priceBag(getStore('bag', []), method, promo)
  const id = 'AUR-' + Math.random().toString(36).slice(2, 8).toUpperCase()
  const order = {
    id, createdAt: Date.now(), email: info.email.trim().toLowerCase(), info, method, promo, card, stage: 0,
    lines: t.items.map((l) => ({ id: l.id, name: l.p.name, variant: l.p.variant, size: l.size, qty: l.qty, price: l.p.price })),
    totals: { subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, tax: t.tax, total: t.total },
  }
  setStore('orders', [order, ...getStore('orders', [])])
  bagActions.clear()
  return id
}
