import * as PIXI from 'pixi.js'
import {Viewport} from 'pixi-viewport'
import options from '../../../options'
import {pixiEvents} from "../../../events";
import {EventNameSpace} from "../../../enums";

class Scrollbar {
  private readonly _vertical: PIXI.Graphics
  private readonly _horizontal: PIXI.Graphics

  constructor() {
    this._vertical = new PIXI.Graphics()
    this._horizontal = new PIXI.Graphics()
    this.registerEvents()
  }

  private drawHorizontal(viewport: Viewport) {
    const { backgroundColor, size, radius } = options.scrollbar
    const { width, resolution } = options.screen
    const PX = (viewport.left / (viewport.width - width)) * (width - this.scrollbarLayout[0] * resolution)
    const scrollLeft = PX <= 0 ? 0 : PX / resolution
    this._horizontal.clear()
    this._horizontal.beginFill(backgroundColor)
    this._horizontal.drawRoundedRect(scrollLeft, this.defaultOffsetXY[1], this.scrollbarLayout[0], size, radius)
    this._horizontal.endFill()
  }

  private drawVertical(viewport: Viewport) {
    const { backgroundColor, size, radius } = options.scrollbar
    const { height, resolution } = options.screen
    const PH = (viewport.top / (viewport.height - height)) * (height - this.scrollbarLayout[1] * resolution)
    const scrollTop = PH <= 0 ? 0 : PH / resolution
    this._vertical.clear()
    this._vertical.beginFill(backgroundColor)
    this._vertical.drawRoundedRect(this.defaultOffsetXY[0], scrollTop, size, this.scrollbarLayout[1], radius)
    this._vertical.endFill()
  }

  private registerEvents() {
    pixiEvents.on(EventNameSpace.WHITEBOARD, 'moved', this.handlerOnWhiteboardMoved.bind(this))
  }

  private handlerOnWhiteboardMoved(event: { viewport: Viewport }) {
    const instance = event.viewport
    this.drawVertical(instance)
    this.drawHorizontal(instance)
  }

  get scrollbarLayout() {
    const { width, height } = options.whiteboard
    const { width: screenWidth, height: screenHeight } = options.screen
    const [PW, PH] = [screenWidth / width, screenHeight / height]
    const [SW, SH] = [screenWidth * PW, screenHeight * PH]
    return [SW >= screenWidth ? 0 : Math.floor(SW), SH >= screenHeight ? 0 : Math.floor(SH)]
  }

  get defaultOffsetXY() {
    const { width, height, resolution } = options.screen
    const { size } = options.scrollbar
    return [(width / resolution) - size, (height / resolution) - size]
  }

  get maxOffsetXY() {
    const { width: screenWidth, height: screenHeight } = options.screen
    const { width, height } = options.whiteboard
    return [width - screenWidth, height - screenHeight]
  }

  get instance() {
    return {
      vertical: this._vertical,
      horizontal: this._horizontal
    }
  }
}

export default Scrollbar
