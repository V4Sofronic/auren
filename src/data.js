// ---- Products. To use your own pictures: put files in /public/products/ and set `img` ('/products/xyz.png').
// Without `img`, the shared /watch.png is used, tinted by `filter` (a CSS filter string).
export const PRODUCTS = [
  { id: 'one-titanium', name: 'AUREN ONE', variant: 'Titanium', tag: 'Signature', price: 18500, swatch: '#a7adb4', filter: '',
    blurb: 'Grade 5 titanium skeleton, sapphire crystal and champagne-gold indices. The icon of the house.' },
  { id: 'one-obsidian', name: 'AUREN ONE', variant: 'Obsidian', tag: 'Limited · 250', price: 21900, swatch: '#2a2c31', filter: 'grayscale(.45) brightness(.58) contrast(1.2)',
    blurb: 'Blackened titanium case with a darkened skeleton movement. Quiet, nocturnal, absolute.' },
  { id: 'one-champagne', name: 'AUREN ONE', variant: 'Champagne', tag: 'Atelier', price: 26400, swatch: '#cdaa6a', filter: 'sepia(.85) saturate(1.7) hue-rotate(-10deg) brightness(1.05)',
    blurb: 'Champagne-gold bridges and bezel on a polished titanium bracelet. Warmth, engineered.' },
  { id: 'one-eclipse', name: 'AUREN ONE', variant: 'Eclipse', tag: "Collector's", price: 23800, swatch: '#3d5a80', filter: 'hue-rotate(195deg) saturate(.9) brightness(.9)',
    blurb: 'A midnight-blue skeleton dial, inspired by the Bosphorus after dark.' },
  { id: 'one-meridian', name: 'AUREN ONE', variant: 'Meridian', tag: 'Edition', price: 24900, swatch: '#b9805a', filter: 'sepia(.6) hue-rotate(-35deg) saturate(2) brightness(.95)',
    blurb: 'Rose-toned accents across a titanium case, finished by hand at the bench.' },
]

export const FAQS = [
  ['Is this a real store?', 'No. AUREN is a fictional brand and this is a demo. Nothing is charged, shipped or stored on a server — all data stays in your own browser.'],
  ['How long does delivery take?', 'Insured Express arrives in 3–5 business days, Priority Overnight the next business day, and White-Glove Concierge is scheduled with you.'],
  ['What does the warranty cover?', 'Every AUREN ONE carries a five-year international warranty covering the movement and manufacturing defects.'],
  ['Can I return a watch?', 'Yes. Unworn watches in original packaging can be returned within 30 days for a full refund.'],
  ['How do I find my bracelet size?', 'Measure your wrist at its widest point. S fits up to 16.5 cm, M 16.5–18.5 cm and L 18.5–20.5 cm. Links can be adjusted by our concierge.'],
  ['Can I track my order?', 'Yes. Use Order Tracking with your order number (it starts with AUR-). It is also listed in your account.'],
]

export const SIZES = ['S', 'M', 'L']
export const PROMO_CODE = 'AUREN10'
