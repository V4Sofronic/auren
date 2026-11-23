import { useState } from 'react'
import '@google/model-viewer'

const TABS = {
  Materials: [
    ['Case & bracelet', 'Grade 5 titanium: light on the wrist, strong, cool to the touch.'],
    ['Crystal', 'Domed sapphire with anti-reflective treatment on both faces.'],
    ['Accents', 'Champagne-gold indices, bridges and bezel markers.'],
    ['Finishing', 'Alternating brushed and polished surfaces, finished by hand.'],
  ],
  Movement: [
    ['Calibre', 'AU-01 automatic skeleton, designed and assembled in-house.'],
    ['Frequency', '28,800 vibrations per hour (4 Hz).'],
    ['Power reserve', 'Approximately 72 hours.'],
    ['Jewels', '27 jewels, including ruby-set balance and escapement.'],
  ],
  Dimensions: [
    ['Case diameter', '42 mm'], ['Thickness', '12.1 mm'], ['Lug-to-lug', '49 mm'],
    ['Lug width', '22 mm'], ['Water resistance', '50 m'], ['Weight', '148 g with bracelet'],
  ],
}

export default function Details() {
  const [tab, setTab] = useState('Materials')
  return (
    <section id="details" className="details">
      <header className="sec-head">
        <p className="eyebrow">The Details</p>
        <h2 className="display">Look closer</h2>
      </header>
      <div className="details-grid">
        <div className="watch-viewer">
          <model-viewer
            src="/models/auren-one.glb"
            alt="AUREN ONE luxury watch"
            camera-controls
            auto-rotate
            rotation-per-second="12deg"
            shadow-intensity="1"
            exposure="1"
            camera-orbit="45deg 70deg 2.5m"
          />
          <div className="viewer-hint">
            DRAG TO ROTATE · SCROLL TO EXPLORE
          </div>
        </div>
        <div className="spec-panel">
          <div className="tabs" role="tablist">
            {Object.keys(TABS).map((t) => <button key={t} role="tab" aria-selected={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}
          </div>
          <dl className="specs" key={tab}>
            {TABS[tab].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          {tab === 'Dimensions' && (
            <svg className="dimsvg" viewBox="0 0 320 130" aria-label="Case dimensions">
              <circle cx="75" cy="65" r="46" /><circle cx="75" cy="65" r="36" className="thin" />
              <line x1="29" y1="118" x2="121" y2="118" className="dim" /><text x="75" y="130" textAnchor="middle">42 mm</text>
              <rect x="190" y="49" width="100" height="32" rx="3" /><rect x="205" y="43" width="70" height="6" rx="2" className="thin" />
              <line x1="302" y1="43" x2="302" y2="81" className="dim" /><text x="312" y="66" textAnchor="start" fontSize="9">12.1</text>
            </svg>
          )}
          <p className="fine">Specifications are illustrative — AUREN is a fictional brand.</p>
        </div>
      </div>
    </section>
  )
}
