# AUREN — Engineered Beyond Time

A cinematic luxury watch website featuring scroll-driven storytelling, interactive animations, and a complete frontend-only demo shopping experience.

## Live Link 
https://auren-liart-nine.vercel.app/

## Features

- Cinematic scroll-driven watch animations
- GSAP animations with Lenis smooth scrolling
- Luxury watch product collections
- Interactive product detail pages
- Shopping bag and checkout experience
- Demo payment flow
- Wishlist and customer account pages
- Order confirmation and tracking
- Browser-based data persistence using localStorage
- Responsive frontend experience

## Tech Stack

- React
- Vite
- JavaScript
- GSAP
- Lenis
- CSS
- localStorage

## Getting Started

Install dependencies:

```bash
npm install
```

Convert video clips:

```bash
npm run clips
```

Start the development server:

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

The production-ready website is generated in the `dist/` directory.

## Demo Information

- Promo code: `AUREN10`
- Demo card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any value

**Important:** This is a frontend-only demonstration. It does not process real payments or connect to a backend. Shopping data and demo orders are stored in browser localStorage.

## Customization

- Products, prices, and FAQs: `src/data.js`
- Clip order and captions: `src/clips.js`
- Website styling: `src/styles.css` and `src/pages.css`
- Product images: `public/products/`

## Deployment

Hosted using Vercel. The production deployment is generated from the Vite build output in `dist/`.

---

© V4Softronic. All rights reserved.
