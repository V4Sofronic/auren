export default function Field({ label, error, children, className = '' }) {
  return <label className={`field ${className}`}><span>{label}</span>{children}{error && <b>{error}</b>}</label>
}
export const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || '')
