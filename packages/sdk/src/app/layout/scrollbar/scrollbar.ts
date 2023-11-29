import * as PIXI from 'pixi.js'
import App from '../../app'
import { EmitterEventName, EventNameSpace } from '../../../enums'
import Viewport from '../viewport'
import options from '../../../options'
import { PixiWithExtra } from '../../../types'
import { POINTER, STATIC } from '../../../constant'

class Scrollbar {
  private readonly _app: App
  private readonly _vertical: PIXI.Graphics
  private readonly _horizontal: PIXI.Graphics

  private _activeTimer: NodeJS.Timeout | null = null

  private static setupDefaultConfiguration<Target = PIXI.Graphics>(target: PixiWithExtra<Target>) {
    const { zIndex } = options.scrollbar
    target.sortableChildren = true
    target.eventMode = STATIC
    target.cursor = POINTER
    target.zIndex = zIndex
  }

  constructor(app: App) {
    this._app = app
    this._vertical = new PIXI.Graphics()
    this._horizontal = new PIXI.Graphics()
    Scrollbar.setupDefaultConfiguration(this._vertical)
    Scrollbar.setupDefaultConfiguration(this._horizontal)
    this.registerEvents()
  }

  private drawVertical(y = 0) {
    const { backgroundColor, radius } = options.scrollbar
    const {
      float,
      vertical: { width, height },
    } = this.configuration
    this._vertical.clear().beginFill(backgroundColor).drawRoundedRect(float[0], y, width, height, radius).endFill()
    this._vertical.visible = true
  }

  private drawHorizontal(x = 0) {
    const { backgroundColor, radius } = options.scrollbar
    const {
      float,
      horizontal: { width, height },
    } = this.configuration
    this._horizontal.clear().beginFill(backgroundColor).drawRoundedRect(x, float[1], width, height, radius).endFill()
    this._horizontal.visible = true
  }

  private registerEvents() {
    this._app.pixiEvents.on(EventNameSpace.WHITEBOARD, 'moved', this.handleOnWhiteboardMoved.bind(this))
    this._app.events.on(EmitterEventName.RESIZE_CHANGE, this.handleOnResizeChange.bind(this))
  }

  private handleOnWhiteboardMoved(payload?: { viewport?: Viewport }) {
    const { left = 0, top = 0 } = payload?.viewport || {}
    const { whiteboardScroll } = this.configuration
    const [pt, pl] = [top / whiteboardScroll[1], left / whiteboardScroll[0]]
    const [scrollX, scrollY] = this.configuration.scroll
    this.drawHorizontal(pl * scrollX)
    this.drawVertical(pt * scrollY)
    if (this._activeTimer) {
      clearTimeout(this._activeTimer)
    }
    this._activeTimer = setTimeout(() => this.hiddenBar(), options.scrollbar.hiddenDelay)
  }

  private handleOnResizeChange() {
    this.hiddenBar()
  }

  private hiddenBar() {
    this._vertical.visible = false
    this._horizontal.visible = false
  }

  get instance() {
    return {
      vertical: this._vertical,
      horizontal: this._horizontal,
    }
  }

  get configuration() {
    const { width, height } = options.whiteboard
    const { width: screenWidth, height: screenHeight, widthByResolution, heightByResolution } = options.screen
    const { size } = options.scrollbar
    const { screenWidthScale = widthByResolution, screenHeightScale = heightByResolution } =
      this._app.whiteboard.viewport
    const [verticalWidth, verticalHeight] = [size, heightByResolution * (screenHeight / height)]
    const [horizontalWidth, horizontalHeight] = [widthByResolution * (screenWidth / width), size]
    const floatX = widthByResolution - verticalWidth
    const floatY = heightByResolution - horizontalHeight
    const [scrollX, scrollY] = [widthByResolution - horizontalWidth, heightByResolution - verticalHeight]

    return {
      float: [floatX, floatY],
      scroll: [scrollX, scrollY],
      whiteboardScroll: [width - screenWidthScale, height - screenHeightScale],
      vertical: { width: verticalWidth, height: verticalHeight },
      horizontal: { width: horizontalWidth, height: horizontalHeight },
    }
  }
}

export default Scrollbar
