export default function WatchImg({ p, className = '', style, shadow = true }) {
  const filter = [p.filter, shadow ? 'drop-shadow(0 18px 22px #000b)' : ''].filter(Boolean).join(' ')
  return <img className={className} src={p.img || '/watch.png'} alt={`${p.name} ${p.variant}`} draggable="false" loading="lazy" style={{ filter, ...style }} />
}
