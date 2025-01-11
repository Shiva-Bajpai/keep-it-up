"use client"

import React, { useRef, useEffect, useState } from 'react'
import { Ball } from '../Ball'
import { Cursor } from '../Cursor'
import { ScoreEffect } from '../ScoreEffect'

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ballRef = useRef<Ball>()
  const cursorRef = useRef<Cursor>()
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })
  const lastCursorPosRef = useRef({ x: 0, y: 0 })
  const scoreEffectsRef = useRef<ScoreEffect[]>([])

  // Update dimensions function to handle portrait mode for mobile
  const updateDimensions = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const height = window.innerHeight
      const isMobile = width <= 768 // Standard mobile breakpoint

      if (isMobile) {
        // For mobile, use full width and leave more space for UI
        setDimensions({
          width: width,
          height: height - 120 // Increased space for header and score
        })
      } else {
        // For desktop, keep original dimensions
        setDimensions({
          width: Math.min(width, 800),
          height: Math.min(height - 100, 600)
        })
      }
    }
  }

  // Add effect to handle window resize
  useEffect(() => {
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize game objects
    if (!ballRef.current) {
      ballRef.current = new Ball(dimensions.width / 2, dimensions.height / 2, 
        Math.min(dimensions.width, dimensions.height) * 0.033)
    }
    if (!cursorRef.current) {
      cursorRef.current = new Cursor(dimensions.width / 2, dimensions.height / 2, 
        Math.min(dimensions.width, dimensions.height) * 0.067)
    }

    const ball = ballRef.current
    const cursor = cursorRef.current

    // Handle mouse and touch events
    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect()
      cursor.x = clientX - rect.left
      cursor.y = clientY - rect.top
    }

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      handlePointerMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handlePointerMove(touch.clientX, touch.clientY)
    }

    // Add event listeners
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchstart', handleTouchMove, { passive: false })

    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      ball.updateBounds(dimensions.width, dimensions.height)
      const collisionPoint = ball.update()
      
      // Handle score effects
      if (collisionPoint) {
        const margin = 30
        const x = collisionPoint.x === 0 ? margin : 
                 collisionPoint.x === dimensions.width ? dimensions.width - margin : 
                 collisionPoint.x
        const y = collisionPoint.y === 0 ? margin : collisionPoint.y

        scoreEffectsRef.current.push(
          new ScoreEffect(
            x, y,
            `+${collisionPoint.points}`,
            collisionPoint.points > 5 ? "#ff4d4d" : "#22c55e"
          )
        )
        setScore(prevScore => prevScore + collisionPoint.points)
      }

      // Update and draw score effects
      scoreEffectsRef.current = scoreEffectsRef.current.filter(effect => {
        const isAlive = effect.update()
        if (isAlive) {
          effect.draw(ctx)
        }
        return isAlive
      })

      // Collision detection
      const dx = cursor.x - ball.x
      const dy = cursor.y - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < cursor.radius + ball.radius) {
        // Calculate cursor velocity
        const cursorVx = cursor.x - lastCursorPosRef.current.x
        const cursorVy = cursor.y - lastCursorPosRef.current.y
        
        // Calculate base velocity from hit angle
        const angle = Math.atan2(dy, dx)
        
        // Base bounce speed plus cursor speed influence
        const cursorSpeed = Math.sqrt(cursorVx * cursorVx + cursorVy * cursorVy)
        const bounceSpeed = 8 + Math.min(cursorSpeed * 0.3, 4)

        // Add a slight upward bias to the bounce, influenced by cursor direction
        const upwardBias = cursorVy < 0 ? 0.3 : 0.1
        const bounceAngle = angle + Math.PI + upwardBias

        // Set velocities with consistent base + cursor influence
        ball.vx = Math.cos(bounceAngle) * bounceSpeed + cursorVx * 0.3
        ball.vy = Math.sin(bounceAngle) * bounceSpeed + cursorVy * 0.3

        // Handle shoe hit sequence
        ball.hitWithShoe()
        setScore(prevScore => prevScore + 1)

        // Prevent multiple collisions
        ball.y = cursor.y - cursor.radius - ball.radius
      }

      // Update last cursor position
      lastCursorPosRef.current = { x: cursor.x, y: cursor.y }

      // Game over check
      if (ball.y - ball.radius > dimensions.height) {
        setGameOver(true)
        ball.reset(dimensions.width / 2, dimensions.height / 2)
        setScore(0)
      }

      ball.draw(ctx)
      cursor.draw(ctx)

      animationFrameId = requestAnimationFrame(render)
    }

    // Start the animation
    render()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchstart', handleTouchMove)
    }
  }, [dimensions])

  // Handle high score updates separately
  useEffect(() => {
    if (gameOver) {
      setHighScore(prevHighScore => Math.max(prevHighScore, score))
    }
  }, [gameOver, score])

  return (
    <div className={`${
      dimensions.width <= 768 
        ? "fixed inset-0 flex flex-col items-center bg-transparent overflow-hidden" 
        : "flex flex-col items-center justify-center min-h-screen bg-transparent"
    }`}>
      <h1 className={`font-bold font-serif ${
        dimensions.width <= 768 
          ? "text-2xl my-2"
          : "text-3xl mb-4"
      }`}>~ Keep It Up ~</h1>
      <div className={
        dimensions.width <= 768
          ? "flex-1 w-full flex flex-col items-center"
          : " p-4 rounded-lg shadow-md"
      }>
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          className={`cursor-none touch-none ${
            dimensions.width <= 768
              ? "border-0"
              : "border border-gray-300"
          }`}
        />
        <div className={
          dimensions.width <= 768
            ? "w-full bg-transparent px-4 py-2"
            : "mt-4 text-center"
        }>
          {gameOver && (
            <p className={`text-red-500 ${
              dimensions.width <= 768
                ? "text-lg font-serif font-semibold md:text-xl"
                : "text-lg font-serif font-semibold md:text-xl"
            }`}>Game Over!</p>
          )}
          <div className={
            dimensions.width <= 768
              ? "flex justify-between max-w-md mx-auto"
              : "space-y-1"
          }>
            <p className="text-lg font-serif font-semibold md:text-xl">Score: {score}</p>
            <p className="text-lg font-serif font-semibold md:text-xl">High Score: {highScore}</p>
          </div>
        </div>
      </div>
     <br />
     <br />
     <footer className="w-full">
  <p className="text-sm mt-4 pl-14 font-serif text-3xl text-left">
    Made with ❤️ <a href="https://shivacodes.vercel.app"><strong>@Shiva Bajpai</strong></a>
  </p>
</footer>



    </div>
  )
}

