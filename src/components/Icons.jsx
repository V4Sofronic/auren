const P = {
  heart: 'M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 5 6.4 5c2 0 3.6 1 4.6 2.6h2C14 6 15.600 5 17.600 5 21 5 23.100 8.400 21.600 11.800 19.500 16.400 12 21 12 21z',
  user: 'M12 12a4.500 4.500 0 1 0 0-9 4.500 4.500 0 0 0 0 9zM3.500 21c.6-4 4-6.500 8.500-6.500s7.900 2.500 8.500 6.500',
  bag: 'M5 8h14l-1 12.500H6L5 8zM9 8V6.500a3 3 0 0 1 6 0V8',
  up: 'M6 15l6-6 6 6', down: 'M6 9l6 6 6-6', left: 'M15 6l-6 6 6 6', right: 'M9 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14', minus: 'M5 12h14', close: 'M6 6l12 12M18 6L6 18', menu: 'M4 8h16M4 16h16',
  box: 'M3 7.500L12 3l9 4.500v9L12 21l-9-4.500v-9zM3 7.500L12 12l9-4.500M12 12v9',
  shield: 'M12 3l8 3v6c0 4.500-3.400 8-8 9-4.600-1-8-4.500-8-9V6l8-3zM8.500 12l2.500 2.500 4.500-5',
  truck: 'M2 6h11v9H2zM13 9h4l3 3v3h-7zM6 18.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3zM17 18.500a1.500 1.500 0 1 0 0-3 1.500 1.500 0 0 0 0 3z',
  key: 'M14 10a4 4 0 1 1-1.200-2.800L21 15v3h-3v-2h-2v-2h-2l-1.800-1.800',
  check: 'M5 12.500l4.500 4.500L19 7.500',
}
export default function Icon({ n, size = 20, fill = false, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={P[n]} />
    </svg>
  )
}
