import * as PIXI from 'pixi.js'
import options from '../../../options'

class Background {
  private readonly _rect: PIXI.Graphics
  private readonly _grid: PIXI.Graphics

  constructor() {
    this._rect = new PIXI.Graphics()
    this._grid = new PIXI.Graphics()
    this.render()
  }

  private render() {
    this.drawRect()
    this.drawGrid()
  }

  private drawRect() {
    const { backgroundColor, width, height } = options.whiteboard
    this._rect.beginFill(backgroundColor)
    this._rect.drawRect(0, 0, width, height)
    this._rect.endFill()
  }

  private drawGrid() {
    const { gap, radius, color, hidden } = options.dot

    if (hidden) return

    const { width, height } = options.whiteboard
    const cols = Math.floor(width / gap)
    const rows = Math.floor(height / gap)
    const halfGap = gap / 2
    const total = cols * rows

    for (let i = 0; i < total; i++) {
      const row = Math.floor(i / cols)
      const col = i % cols
      const x = col * gap + halfGap
      const y = row * gap + halfGap
      this._grid.beginFill(color)
      this._grid.drawCircle(x, y, radius)
    }

    this._grid.endFill()
  }

  get instance() {
    return {
      rect: this._rect,
      grid: this._grid,
    }
  }
}

export default Background
