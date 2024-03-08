import * as PIXI from 'pixi.js'
import { BlockOptions } from './types'
class Block extends PIXI.Container {
  private readonly _options: BlockOptions
  constructor(options: BlockOptions) {
    super()
    this._options = options
  }

  get options() {
    return this._options
  }
}

export default Block
