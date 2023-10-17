import * as PIXI from 'pixi.js'
import options from '../../options'

class Background {
  private readonly _grid: PIXI.Graphics

  constructor() {
    this._grid = new PIXI.Graphics()
    this.render()
  }

  private render() {
    this.drawGrid()
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
      grid: this._grid,
    }
  }
}

export default Background
