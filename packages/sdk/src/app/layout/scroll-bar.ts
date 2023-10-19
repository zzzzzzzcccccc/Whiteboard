import * as PIXI from 'pixi.js'
import options from '../../options'
import { MOVE, NUMBER_ZERO, POINTER, STATIC, WHEEL, POSITION_X, POSITION_Y, FPS_60 } from '../../constant'
import { EmitterEventName, EventNameSpace } from '../../enums'
import { PixiWithExtra } from '../../types'
import { events, pixiEvents } from '../../events'
import { debounce } from '../../utils'

class ScrollBar {
  private readonly _bottom: PIXI.Graphics
  private readonly _right: PIXI.Graphics
  private _currentMove: { position: EventNameSpace; XY: [number, number] } | null = null
  private _timer: [NodeJS.Timeout | null, NodeJS.Timeout | null] = [null, null]

  private static drawBar(target: PIXI.Graphics, x: number, y: number, width: number, height: number) {
    const { color, zIndex, radius } = options.scrollBar
    target.clear()
    target.beginFill(color)
    target.drawRoundedRect(x, y, width, height, radius)
    target.endFill()
    target.zIndex = zIndex
    target.cursor = POINTER
  }

  private static barDefaultEventsSetting(target: PixiWithExtra<PIXI.Graphics>) {
    target.eventMode = STATIC
  }

  constructor(private readonly app: PIXI.Application) {
    this._bottom = new PIXI.Graphics()
    this._right = new PIXI.Graphics()
    this._bottom.visible = false
    this._right.visible = false
    this.render()
    this.registerEvents()
  }

  private render() {
    const { size } = options.scrollBar
    ScrollBar.drawBar(this._bottom, 0, this.barOffsetXY.y, this.barWidthHeight[0], size)
    ScrollBar.drawBar(this._right, this.barOffsetXY.x, 0, size, this.barWidthHeight[1])
  }

  private registerEvents() {
    ScrollBar.barDefaultEventsSetting(this._bottom)
    ScrollBar.barDefaultEventsSetting(this._right)
    pixiEvents.register(EventNameSpace.SCROLL_BAR_BOTTOM, this._bottom, ['pointerdown'])
    pixiEvents.register(EventNameSpace.SCROLL_BAR_RIGHT, this._right, ['pointerdown'])
    pixiEvents.on(
      EventNameSpace.SCROLL_BAR_BOTTOM,
      'pointerdown',
      this.moveStart.bind(this, EventNameSpace.SCROLL_BAR_BOTTOM),
    )
    pixiEvents.on(
      EventNameSpace.SCROLL_BAR_RIGHT,
      'pointerdown',
      this.moveStart.bind(this, EventNameSpace.SCROLL_BAR_RIGHT),
    )
    pixiEvents.on(EventNameSpace.STAGE, 'pointermove', this.move.bind(this))
    pixiEvents.on(EventNameSpace.STAGE, 'pointerup', this.moveEnd.bind(this))
    pixiEvents.on(EventNameSpace.STAGE, 'pointerupoutside', this.moveEnd.bind(this))
    events.on(EmitterEventName.WHITE_BOARD_CHANGE, this.handleOnWhiteBoardChange.bind(this))
    events.on(EmitterEventName.RESIZE_CHANGE, debounce(this.render.bind(this), FPS_60))
  }

  private handleOnWhiteBoardChange({ type, ...payload }: Record<string, any>) {
    const onWheel = () => {
      const { instance, maxXY, position } = payload
      const { x, y } = instance
      const [PX, PY] = [-x / maxXY[0], -y / maxXY[1]]
      const [X, Y] = [this.maxXY[0] * PX, this.maxXY[1] * PY]
      this._bottom.x = X
      this._right.y = Y
      this.showBar(position)
    }
    if (type === WHEEL) {
      onWheel()
    }
  }

  private moveStart(position: EventNameSpace, event: PIXI.FederatedPointerEvent) {
    if (event.button !== NUMBER_ZERO || this._currentMove) return
    event.preventDefault()
    event.stopImmediatePropagation()
    this._currentMove = { position, XY: [event.globalX, event.globalY] }
  }

  private move(event: PIXI.FederatedPointerEvent) {
    if (!this._currentMove) return
    const { XY, position } = this._currentMove
    const [startX, startY] = XY
    const [moveX, moveY] = [event.globalX, event.globalY]
    const handler = {
      [EventNameSpace.SCROLL_BAR_BOTTOM]: () => {
        const diffX = this._bottom.x + (moveX - startX)
        if (diffX < 0 || diffX > this.maxXY[0]) return
        this._bottom.x = diffX
        this.showBar(POSITION_X)
        events.emitScrollBarEvent(MOVE, { position: POSITION_X, instance: this.instance })
      },
      [EventNameSpace.SCROLL_BAR_RIGHT]: () => {
        const diffY = this._right.y + (moveY - startY)
        if (diffY < 0 || diffY > this.maxXY[1]) return
        this._right.y = diffY
        this.showBar(POSITION_Y)
        events.emitScrollBarEvent(MOVE, { position: POSITION_Y, instance: this.instance })
      },
    } as Record<EventNameSpace, () => void>
    handler[position]?.()
    this._currentMove.XY = [moveX, moveY]
  }

  private moveEnd() {
    if (!this._currentMove) return
    this._currentMove = null
  }

  private showBar(position: string) {
    const { hiddenDelay } = options.scrollBar
    const isX = position === POSITION_X
    const target = isX ? this._bottom : this._right
    const index = isX ? 0 : 1
    if (this._timer[index]) {
      // @ts-ignore
      clearTimeout(this._timer[index])
      this._timer[index] = null
    }
    target.visible = true
    this._timer[index] = setTimeout(() => (target.visible = false), hiddenDelay)
  }

  get barOffsetXY() {
    const { width, height } = this.app.screen
    const { size } = options.scrollBar
    const { resolution } = options.screen
    return {
      x: width / resolution - size,
      y: height / resolution - size,
    }
  }

  get maxXY() {
    const { width, height } = this.app.screen
    const { resolution } = options.screen
    return [width / resolution - this._bottom.width, height / resolution - this._right.height]
  }

  get barWidthHeight() {
    const { width, height } = this.app.screen
    const { resolution } = options.screen
    const { width: whiteboardWidth, height: whiteboardHeight } = options.whiteboard
    const [widthRatio, heightRatio] = [width / whiteboardWidth, height / whiteboardHeight]
    const [bottomWidth, rightHeight] = [widthRatio * width, heightRatio * height]
    return [Math.floor(bottomWidth / resolution), Math.floor(rightHeight / resolution)]
  }

  get instance() {
    return {
      bottom: this._bottom,
      right: this._right,
    }
  }
}

export default ScrollBar
