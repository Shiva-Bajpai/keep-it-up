export class Player {
  x: number
  y: number
  width: number
  height: number

  constructor(x: number, y: number, width: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = width / 2
  }

  update() {
    // The player's x position is updated in the mousemove event listener
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.font = `${this.width}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('👟', this.x, this.y)
    ctx.restore()
  }
}

