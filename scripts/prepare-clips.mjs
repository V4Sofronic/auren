// Converts raw clips so they scrub smoothly with scroll (keyframe-dense H.264, no audio).
// Put your downloads in /raw-clips and start each file name with its number:
//   01_entrance.mp4, 02_watch_reveal.mp4 ... 08_engineering.mp4   ("Clip 03 - ..." also works)
import { readdirSync, mkdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const IN = 'raw-clips', OUT = 'public/clips'
mkdirSync(OUT, { recursive: true })
if (spawnSync('ffmpeg', ['-version']).error) {
  console.error('ffmpeg not found. Install it first: https://ffmpeg.org/download.html'); process.exit(1)
}
const files = readdirSync(IN).filter(f => /\.(mp4|mov|webm|mkv)$/i.test(f))
if (!files.length) { console.error('No videos found in /raw-clips'); process.exit(1) }

for (const f of files) {
  const m = f.match(/^\D*(\d{1,2})/)
  const n = m ? parseInt(m[1], 10) : 0
  if (n === 4) { console.log(`skip "${f}" (clip 04 is not used)`); continue }
  if (n < 1 || n > 8) { console.warn(`SKIP "${f}" -> name must start with a number 01-08`); continue }
  const out = path.join(OUT, `clip-${String(n).padStart(2, '0')}.mp4`)
  console.log(`> ${f} -> ${out}`)
  const r = spawnSync('ffmpeg', [
    '-y', '-i', path.join(IN, f), '-an',
    '-vf', "scale='min(1920,iw)':-2",
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '23',
    '-g', '2', '-keyint_min', '2', '-sc_threshold', '0',
    '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out
  ], { stdio: 'inherit' })
  if (r.status !== 0) console.error(`FAILED: ${f}`)
}
console.log('Done. Run: npm run dev')
