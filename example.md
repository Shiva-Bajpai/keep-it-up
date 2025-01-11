'use client'

import { useRef, useEffect, useState } from 'react'

interface Paper {
  x: number
  y: number
  vx: number
  vy: number
  rotation: number
  vRotation: number
  width: number
  height: number
  opacity: number
  text: string
  zIndex: number
}

export default function VSaaSBibleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof window === 'undefined') return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Physics constants
    const GRAVITY = 0.3
    const DRAG = 0.98
    const THROW_FORCE = 15
    const GROUND_Y = canvas.height * 0.8

    // Create papers
    const papers: Paper[] = []
    const paperCount = 30
    const texts = ['SaaS', 'API', 'Cloud', 'Data', 'Code', '{ }', '[ ]', '// TODO']

    for (let i = 0; i < paperCount; i++) {
      papers.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: GROUND_Y - Math.random() * 50,
        vx: 0,
        vy: 0,
        rotation: Math.random() * Math.PI * 0.2 - Math.PI * 0.1,
        vRotation: 0,
        width: 40 + Math.random() * 20,
        height: 60 + Math.random() * 20,
        opacity: 0.6 + Math.random() * 0.4,
        text: texts[Math.floor(Math.random() * texts.length)],
        zIndex: i
      })
    }

    let mouseX = 0
    let mouseY = 0
    let lastMouseX = 0
    let lastMouseY = 0
    let mouseVX = 0
    let mouseVY = 0

    const animate = () => {
      // Update mouse velocity
      mouseVX = mouseX - lastMouseX
      mouseVY = mouseY - lastMouseY
      lastMouseX = mouseX
      lastMouseY = mouseY

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Sort papers by y position for better layering
      papers.sort((a, b) => a.y - b.y)

      papers.forEach(paper => {
        // Apply physics
        paper.vy += GRAVITY
        paper.vx *= DRAG
        paper.vy *= DRAG
        paper.vRotation *= DRAG

        // Mouse interaction
        const dx = mouseX - paper.x
        const dy = mouseY - paper.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 100 && isHovering) {
          const force = (100 - dist) / 100
          const angle = Math.atan2(dy, dx)
          paper.vx -= (mouseVX * force + Math.cos(angle) * THROW_FORCE)
          paper.vy -= (mouseVY * force + Math.sin(angle) * THROW_FORCE)
          paper.vRotation += (Math.random() - 0.5) * 0.2
        }

        // Update position
        paper.x += paper.vx
        paper.y += paper.vy
        paper.rotation += paper.vRotation

        // Bounce off walls
        if (paper.x < 0) { paper.x = 0; paper.vx *= -0.5 }
        if (paper.x > canvas.width) { paper.x = canvas.width; paper.vx *= -0.5 }
        
        // Ground collision
        if (paper.y > GROUND_Y) {
          paper.y = GROUND_Y
          paper.vy *= -0.3
          paper.vx *= 0.8
          paper.vRotation *= 0.8
        }

        // Draw paper
        ctx.save()
        ctx.translate(paper.x, paper.y)
        ctx.rotate(paper.rotation)

        // Shadow
        ctx.fillStyle = `rgba(0, 0, 0, ${paper.opacity * 0.3})`
        ctx.fillRect(2, 2, paper.width, paper.height)

        // Paper
        ctx.fillStyle = `rgba(255, 255, 255, ${paper.opacity})`
        ctx.fillRect(-paper.width/2, -paper.height/2, paper.width, paper.height)

        // Text
        ctx.fillStyle = `rgba(140, 60, 252, ${paper.opacity})`
        ctx.font = `${paper.width/4}px monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(paper.text, 0, 0)

        // Lines
        ctx.strokeStyle = `rgba(140, 60, 252, ${paper.opacity * 0.2})`
        ctx.beginPath()
        for (let y = -paper.height/3; y <= paper.height/3; y += paper.height/6) {
          ctx.moveTo(-paper.width/3, y)
          ctx.lineTo(paper.width/3, y)
        }
        ctx.stroke()

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = (e.clientX - rect.left) * (canvas.width / rect.width)
      mouseY = (e.clientY - rect.top) * (canvas.height / rect.height)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseenter', handleMouseEnter)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseenter', handleMouseEnter)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isHovering])

  return (
    <section className="min-h-screen bg-black pt-32 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="relative z-20">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              The Vertical SaaS Bible
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-12">
              A collection of vertical SaaS case studies, industry breakdowns, scorecards, analysis, and operating learnings. Jam packed with content, it's my hope that it will help one of you build, operate, or invest in the next great vertical SaaS business!
            </p>
            <a
              href="/verticalsaasbible"
              className="inline-flex items-center px-8 py-4 bg-[#8c3cfc] text-white rounded-lg hover:bg-opacity-90 transition-colors text-lg font-medium"
            >
              Purchase Digital Edition for $200
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>

          {/* Right Column - Point Cloud Book */}
          <div className="relative aspect-square">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
} 