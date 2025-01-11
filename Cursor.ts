export class Cursor {
  x: number
  y: number
  radius: number

  constructor(x: number, y: number, radius: number) {
    this.x = x
    this.y = y
    this.radius = radius
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    // Rotate 60 degrees counterclockwise (-Math.PI / 3 radians)
    ctx.rotate(-Math.PI / 3)
    ctx.font = `${this.radius * 2}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('👟', 0, 0)
    ctx.restore()
  }
}

