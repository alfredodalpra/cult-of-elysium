'use client'

import { useEffect, useRef } from 'react'

type Orb = {
  x: number; y: number; r: number; vx: number; vy: number
  phase: number; pulseSpeed: number; hue: number; brightness: number
}
type Twinkler = {
  x: number; y: number; s: number; phase: number; speed: number
  baseA: number; peakA: number; hue: number
}

export function HeroCanvas() {
  const bgRef = useRef<HTMLCanvasElement>(null)
  const fgRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, on: false })
  const stateRef = useRef<{ orbs: Orb[]; twinklers: Twinkler[] }>({ orbs: [], twinklers: [] })

  useEffect(() => {
    const bgCanvas = bgRef.current!
    const fgCanvas = fgRef.current!
    const bg = bgCanvas.getContext('2d')!
    const fg = fgCanvas.getContext('2d')!
    let W: number, H: number, dpr: number
    let animId: number

    function resize() {
      const parent = bgCanvas.parentElement!
      const rect = parent.getBoundingClientRect()
      dpr = devicePixelRatio
      W = rect.width; H = rect.height
      for (const c of [bgCanvas, fgCanvas]) {
        c.width = W * dpr; c.height = H * dpr
        c.style.width = W + 'px'; c.style.height = H + 'px'
      }
      paintBackground()
      initForeground()
    }

    function paintBackground() {
      bg.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cx = W / 2, cy = H / 2

      // Base dark gradient
      const base = bg.createRadialGradient(cx, cy * .85, 0, cx, cy * .85, W * .7)
      base.addColorStop(0, '#100e1a'); base.addColorStop(.5, '#0a0912'); base.addColorStop(1, '#06050b')
      bg.fillStyle = base; bg.fillRect(0, 0, W, H)

      // Nebula washes
      const washes = [
        { x: cx * .7, y: cy * .6, r: W * .35, c: [[70,45,140,.12],[50,30,120,.06]] },
        { x: cx * 1.4, y: cy * 1.2, r: W * .3, c: [[90,60,160,.1],[60,40,130,.05]] },
        { x: cx * .4, y: cy * 1.5, r: W * .25, c: [[55,35,130,.08],[40,25,110,.04]] },
        { x: cx * 1.6, y: cy * .4, r: W * .22, c: [[80,55,150,.09],[50,35,120,.04]] },
        { x: cx, y: cy, r: W * .4, c: [[65,50,145,.07],[45,30,115,.03]] },
        { x: cx * .3, y: cy * .3, r: W * .18, c: [[75,50,155,.07],[55,35,125,.03]] },
        { x: cx * 1.7, y: cy * 1.6, r: W * .2, c: [[60,40,140,.06],[40,28,110,.03]] },
      ]
      for (const w of washes) {
        const g = bg.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r)
        g.addColorStop(0, `rgba(${w.c[0].join(',')})`)
        g.addColorStop(.5, `rgba(${w.c[1].join(',')})`)
        g.addColorStop(1, 'transparent')
        bg.fillStyle = g; bg.fillRect(0, 0, W, H)
      }

      // Bright accent patches
      const accents = [
        { x: cx * .55, y: cy * .75, r: 80, a: .06 },
        { x: cx * 1.35, y: cy * 1.1, r: 60, a: .07 },
        { x: cx * 1.1, y: cy * .5, r: 50, a: .05 },
        { x: cx * .8, y: cy * 1.4, r: 70, a: .05 },
        { x: cx, y: cy * .9, r: 100, a: .04 },
      ]
      for (const a of accents) {
        const g = bg.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r)
        g.addColorStop(0, `rgba(120,95,200,${a.a})`)
        g.addColorStop(.5, `rgba(90,70,170,${a.a * .4})`)
        g.addColorStop(1, 'transparent')
        bg.fillStyle = g; bg.fillRect(0, 0, W, H)
      }

      // Film grain
      const imgData = bg.getImageData(0, 0, W * dpr, H * dpr)
      const d = imgData.data
      for (let i = 0; i < d.length; i += 4) {
        const n = (Math.random() - .5) * 6
        d[i] += n; d[i + 1] += n; d[i + 2] += n
      }
      bg.putImageData(imgData, 0, 0)

      // 400 stars at 3 tiers
      for (let i = 0; i < 400; i++) {
        const x = Math.random() * W, y = Math.random() * H
        const tier = Math.random()
        const sz = tier < .7 ? .5 + Math.random() * .5 : tier < .9 ? 1 + Math.random() : 1.5 + Math.random() * 1.5
        const a = tier < .7 ? .15 + Math.random() * .2 : tier < .9 ? .25 + Math.random() * .3 : .4 + Math.random() * .3
        bg.beginPath(); bg.arc(x, y, sz, 0, Math.PI * 2)
        bg.fillStyle = `rgba(210,200,240,${a})`; bg.fill()
        if (sz > 1.2) {
          const h = Math.random()
          const [hr, hg, hb] = h < .4 ? [130,110,220] : h < .7 ? [100,90,200] : [160,140,230]
          const g = bg.createRadialGradient(x, y, sz, x, y, sz * 4)
          g.addColorStop(0, `rgba(${hr},${hg},${hb},${a * .15})`); g.addColorStop(1, 'transparent')
          bg.fillStyle = g; bg.beginPath(); bg.arc(x, y, sz * 4, 0, Math.PI * 2); bg.fill()
        }
      }
    }

    function initForeground() {
      const orbs: Orb[] = []
      for (let i = 0; i < 18; i++) {
        orbs.push({
          x: Math.random() * W, y: Math.random() * H,
          r: 15 + Math.random() * 35,
          vx: (Math.random() - .5) * .12, vy: (Math.random() - .5) * .1,
          phase: Math.random() * 6.28, pulseSpeed: .0006 + Math.random() * .0008,
          hue: Math.floor(Math.random() * 3), brightness: .04 + Math.random() * .04,
        })
      }
      const twinklers: Twinkler[] = []
      for (let i = 0; i < 60; i++) {
        twinklers.push({
          x: Math.random() * W, y: Math.random() * H,
          s: .5 + Math.random() * 1.5, phase: Math.random() * 6.28,
          speed: .003 + Math.random() * .005,
          baseA: .05 + Math.random() * .15, peakA: .4 + Math.random() * .4,
          hue: Math.floor(Math.random() * 3),
        })
      }
      stateRef.current = { orbs, twinklers }
    }

    function drawFg(t: number) {
      fg.setTransform(dpr, 0, 0, dpr, 0, 0)
      fg.clearRect(0, 0, W, H)
      const { orbs, twinklers } = stateRef.current
      const m = mouseRef.current

      // Orbs
      for (const o of orbs) {
        o.x += o.vx + Math.sin(t * .0002 + o.phase) * .05
        o.y += o.vy + Math.cos(t * .00018 + o.phase) * .04
        if (o.x < -o.r * 2) o.x = W + o.r; if (o.x > W + o.r * 2) o.x = -o.r
        if (o.y < -o.r * 2) o.y = H + o.r; if (o.y > H + o.r * 2) o.y = -o.r

        const pulse = Math.sin(t * o.pulseSpeed + o.phase) * .3 + .7
        let br = o.brightness * pulse, cr = o.r * pulse
        if (m.on) {
          const dx = o.x - m.x, dy = o.y - m.y, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 250) {
            const f = 1 - dist / 250
            br += f * .08; cr *= (1 + f * .2)
            o.x += dx / (dist + 1) * f * 1.5; o.y += dy / (dist + 1) * f * 1.5
          }
        }

        const [rr, gg, bb] = o.hue === 0 ? [109,90,205] : o.hue === 1 ? [90,75,185] : [75,65,165]
        // Outer glow
        const g1 = fg.createRadialGradient(o.x, o.y, 0, o.x, o.y, cr * 2)
        g1.addColorStop(0, `rgba(${rr+25},${gg+20},${bb+15},${br*1.2})`)
        g1.addColorStop(.3, `rgba(${rr},${gg},${bb},${br*.5})`)
        g1.addColorStop(.7, `rgba(${rr-15},${gg-10},${bb-5},${br*.1})`)
        g1.addColorStop(1, 'transparent')
        fg.fillStyle = g1; fg.beginPath(); fg.arc(o.x, o.y, cr * 2, 0, Math.PI * 2); fg.fill()
        // Bright core
        const g2 = fg.createRadialGradient(o.x, o.y, 0, o.x, o.y, cr * .4)
        g2.addColorStop(0, `rgba(${rr+50},${gg+45},${bb+25},${br*2})`)
        g2.addColorStop(1, 'transparent')
        fg.fillStyle = g2; fg.beginPath(); fg.arc(o.x, o.y, cr * .4, 0, Math.PI * 2); fg.fill()
      }

      // Twinklers
      for (const s of twinklers) {
        const cycle = (Math.sin(t * s.speed + s.phase) + 1) / 2
        const a = s.baseA + Math.pow(cycle, 4) * (s.peakA - s.baseA)
        const [rr, gg, bb] = s.hue === 0 ? [220,210,245] : s.hue === 1 ? [190,175,235] : [175,170,225]
        let boost = 0
        if (m.on) {
          const md = Math.sqrt((s.x - m.x) ** 2 + (s.y - m.y) ** 2)
          if (md < 180) boost = (1 - md / 180) * .3
        }
        const fa = Math.min(a + boost, .9)
        fg.beginPath(); fg.arc(s.x, s.y, s.s, 0, Math.PI * 2)
        fg.fillStyle = `rgba(${rr},${gg},${bb},${fa})`; fg.fill()
        // Cross spikes on bright moments
        if (a > .3) {
          const spike = s.s * 3 * a
          fg.strokeStyle = `rgba(${rr},${gg},${bb},${a * .2})`; fg.lineWidth = .5
          fg.beginPath(); fg.moveTo(s.x, s.y - spike); fg.lineTo(s.x, s.y + spike); fg.stroke()
          fg.beginPath(); fg.moveTo(s.x - spike, s.y); fg.lineTo(s.x + spike, s.y); fg.stroke()
        }
        // Halo
        if (a > .25) {
          const g = fg.createRadialGradient(s.x, s.y, s.s, s.x, s.y, s.s * 4)
          g.addColorStop(0, `rgba(109,90,205,${a * .1})`); g.addColorStop(1, 'transparent')
          fg.fillStyle = g; fg.beginPath(); fg.arc(s.x, s.y, s.s * 4, 0, Math.PI * 2); fg.fill()
        }
      }

      // Cursor glow
      if (m.on) {
        const g = fg.createRadialGradient(m.x, m.y, 0, m.x, m.y, 120)
        g.addColorStop(0, 'rgba(109,90,205,0.04)')
        g.addColorStop(.3, 'rgba(90,75,180,0.02)')
        g.addColorStop(1, 'transparent')
        fg.fillStyle = g; fg.beginPath(); fg.arc(m.x, m.y, 120, 0, Math.PI * 2); fg.fill()
      }

      animId = requestAnimationFrame(drawFg)
    }

    function handleMove(e: MouseEvent) {
      const rect = bgCanvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, on: true }
    }
    function handleLeave() { mouseRef.current.on = false }

    const parent = bgCanvas.parentElement!
    parent.addEventListener('mousemove', handleMove)
    parent.addEventListener('mouseleave', handleLeave)

    resize()
    animId = requestAnimationFrame(drawFg)

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      parent.removeEventListener('mousemove', handleMove)
      parent.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <>
      <canvas ref={bgRef} className="absolute inset-0 w-full h-full" />
      <canvas ref={fgRef} className="absolute inset-0 w-full h-full z-[3]" />
    </>
  )
}
