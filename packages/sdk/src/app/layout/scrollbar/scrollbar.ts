import * as PIXI from 'pixi.js'

class Scrollbar {
  private readonly _vertical: PIXI.Graphics
  private readonly _horizontal: PIXI.Graphics

  constructor() {
    this._vertical = new PIXI.Graphics()
    this._horizontal = new PIXI.Graphics()
  }

  get instance() {
    return {
      vertical: this._vertical,
      horizontal: this._horizontal,
    }
  }
}

export default Scrollbar
