'use client'

import { useEffect, useRef } from 'react'

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let animId: number
    let W: number, H: number, dpr: number

    type Star = { x: number; y: number; s: number; phase: number; speed: number; baseA: number; peakA: number; hue: number }
    type Orb = { x: number; y: number; r: number; vx: number; vy: number; phase: number; ps: number; hue: number; br: number }
    let stars: Star[] = []
    let orbs: Orb[] = []

    function resize() {
      const rect = canvas.parentElement!.getBoundingClientRect()
      dpr = devicePixelRatio
      W = rect.width; H = rect.height
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      init()
    }

    function init() {
      stars = []
      for (let i = 0; i < 80; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          s: .4 + Math.random() * 1.2,
          phase: Math.random() * 6.28,
          speed: .002 + Math.random() * .004,
          baseA: .03 + Math.random() * .08,
          peakA: .2 + Math.random() * .3,
          hue: Math.floor(Math.random() * 3)
        })
      }
      orbs = []
      for (let i = 0; i < 8; i++) {
        orbs.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 20 + Math.random() * 40,
          vx: (Math.random() - .5) * .08, vy: (Math.random() - .5) * .06,
          phase: Math.random() * 6.28, ps: .0005 + Math.random() * .0006,
          hue: Math.floor(Math.random() * 3), br: .02 + Math.random() * .025,
        })
      }
    }

    function draw(t: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // Orbs
      for (const o of orbs) {
        o.x += o.vx + Math.sin(t * .0002 + o.phase) * .03
        o.y += o.vy + Math.cos(t * .00018 + o.phase) * .025
        if (o.x < -o.r * 2) o.x = W + o.r; if (o.x > W + o.r * 2) o.x = -o.r
        if (o.y < -o.r * 2) o.y = H + o.r; if (o.y > H + o.r * 2) o.y = -o.r

        const pulse = Math.sin(t * o.ps + o.phase) * .3 + .7
        const br = o.br * pulse, cr = o.r * pulse
        const [rr, gg, bb] = o.hue === 0 ? [109, 90, 205] : o.hue === 1 ? [90, 75, 185] : [75, 65, 165]

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, cr * 2)
        g.addColorStop(0, `rgba(${rr + 20},${gg + 15},${bb + 10},${br * 1.2})`)
        g.addColorStop(.4, `rgba(${rr},${gg},${bb},${br * .4})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, cr * 2, 0, Math.PI * 2); ctx.fill()
      }

      // Stars
      for (const s of stars) {
        const cycle = (Math.sin(t * s.speed + s.phase) + 1) / 2
        const a = s.baseA + Math.pow(cycle, 4) * (s.peakA - s.baseA)
        const [rr, gg, bb] = s.hue === 0 ? [210, 200, 240] : s.hue === 1 ? [185, 170, 230] : [170, 165, 220]
        ctx.beginPath(); ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${rr},${gg},${bb},${a})`; ctx.fill()

        if (a > .2) {
          const spike = s.s * 2.5 * a
          ctx.strokeStyle = `rgba(${rr},${gg},${bb},${a * .15})`; ctx.lineWidth = .4
          ctx.beginPath(); ctx.moveTo(s.x, s.y - spike); ctx.lineTo(s.x, s.y + spike); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(s.x - spike, s.y); ctx.lineTo(s.x + spike, s.y); ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    resize()
    animId = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
