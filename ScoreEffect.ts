export class ScoreEffect {
  x: number
  y: number
  opacity: number
  value: string
  color: string

  constructor(x: number, y: number, value: string = "+1", color: string = "#22c55e") {
    this.x = x
    this.y = y
    this.opacity = 1
    this.value = value
    this.color = color
  }

  update() {
    this.y -= 2 // Float upward
    this.opacity -= 0.02 // Fade out
    return this.opacity > 0 // Return false when fully faded
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(this.value, this.x, this.y)
    ctx.restore()
  }
} 