export class Ball {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  private lastWallHit: number = 0
  private justHitWall: boolean = false
  private lastCeilingHit: number = 0
  private comboCount: number = 0
  private lastHitTime: number = 0
  private readonly COMBO_TIMEOUT = 2000 // 2 seconds to maintain combo
  private lastHitType: 'none' | 'wall' | 'shoe' = 'none'
  private boundaryWidth: number = 800
  private boundaryHeight: number = 600

  constructor(x: number, y: number, radius: number) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vx = Math.random() * 4 - 2
    this.vy = -5
  }

  resetCombo() {
    this.comboCount = 0
    this.lastHitTime = 0
    this.lastHitType = 'none'
  }

  hitWithShoe() {
    const now = Date.now()
    if (now - this.lastHitTime > this.COMBO_TIMEOUT) {
      this.resetCombo()
    } else if (this.lastHitType === 'wall') {
      // Valid sequence: continuing the shoe-wall pattern
      this.lastHitType = 'shoe'
    } else {
      // Invalid sequence: shoe hit after shoe or first hit
      this.resetCombo()
      this.lastHitType = 'shoe'
    }
    this.lastHitTime = now
  }

  updateBounds(width: number, height: number) {
    this.boundaryWidth = width
    this.boundaryHeight = height
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.17 // Reduced from 0.2 for slightly lighter feel

    // Keep moderate air resistance
    this.vx *= 0.99
    this.vy *= 0.99

    const now = Date.now()
    let collisionPoint = null

    // Reset combo if too much time has passed
    if (now - this.lastHitTime > this.COMBO_TIMEOUT) {
      this.resetCombo()
    }

    // Wall collisions with dynamic boundaries
    if (this.x - this.radius < 0 || this.x + this.radius > this.boundaryWidth || this.y - this.radius < 0) {
      // Handle wall collision
      if (this.x - this.radius < 0) {
        this.x = this.radius
        this.vx = -this.vx * 0.7 // Increased from 0.65 for more bounce
      } else if (this.x + this.radius > this.boundaryWidth) {
        this.x = this.boundaryWidth - this.radius
        this.vx = -this.vx * 0.7 // Increased from 0.65 for more bounce
      }
      
      if (this.y - this.radius < 0) {
        this.y = this.radius
        this.vy = -this.vy * 0.8 // Increased from 0.75 for more bounce
      }

      // Check if this wall hit is part of the valid sequence
      if (this.lastHitType === 'shoe') {
        this.comboCount = Math.min(this.comboCount + 1, 10)
        this.lastHitType = 'wall'
        this.lastHitTime = now

        // Return collision point with current combo points
        collisionPoint = {
          x: this.x,
          y: this.y,
          points: this.comboCount
        }
      } else {
        // Invalid sequence: wall hit after wall or first hit
        this.resetCombo()
        this.lastHitType = 'wall'
        this.lastHitTime = now
      }
    }

    return collisionPoint
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.radius * 2}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('⚽️', this.x, this.y)
    ctx.restore()
  }

  reset(x: number, y: number) {
    this.x = x
    this.y = y
    this.vx = Math.random() * 1.5 - 0.75
    this.vy = -3.5 // Keep the same initial height
    this.comboCount = 0
    this.lastHitTime = 0
    this.lastHitType = 'none'
  }
}

