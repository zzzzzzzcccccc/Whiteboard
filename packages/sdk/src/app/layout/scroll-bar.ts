import * as PIXI from 'pixi.js'
import options from '../../options'
import { MOVE, NUMBER_ZERO, POINTER, STATIC, WHEEL } from '../../constant'
import { EmitterEventName, EventNameSpace } from '../../enums'
import { PixiWithExtra } from '../../types'
import events from '../../events'
import emitter from '../../emitter'

class ScrollBar {
  private readonly _bottom: PIXI.Graphics
  private readonly _right: PIXI.Graphics
  private _currentMove: { position: EventNameSpace; XY: [number, number] } | null = null

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
    this.render()
    this.registerEvents()
  }

  private render() {
    const { size, bottomWidth, rightHeight } = options.scrollBar
    ScrollBar.drawBar(this._bottom, 0, this.barOffsetXY.y, bottomWidth, size)
    ScrollBar.drawBar(this._right, this.barOffsetXY.x, 0, size, rightHeight)
  }

  private registerEvents() {
    ScrollBar.barDefaultEventsSetting(this._bottom)
    ScrollBar.barDefaultEventsSetting(this._right)
    events.register(EventNameSpace.SCROLL_BAR_BOTTOM, this._bottom, ['pointerdown'])
    events.register(EventNameSpace.SCROLL_BAR_RIGHT, this._right, ['pointerdown'])
    events.on(
      EventNameSpace.SCROLL_BAR_BOTTOM,
      'pointerdown',
      this.moveStart.bind(this, EventNameSpace.SCROLL_BAR_BOTTOM),
    )
    events.on(
      EventNameSpace.SCROLL_BAR_RIGHT,
      'pointerdown',
      this.moveStart.bind(this, EventNameSpace.SCROLL_BAR_RIGHT),
    )
    events.on(EventNameSpace.STAGE, 'pointermove', this.move.bind(this))
    events.on(EventNameSpace.STAGE, 'pointerup', this.moveEnd.bind(this))
    events.on(EventNameSpace.STAGE, 'pointerupoutside', this.moveEnd.bind(this))
    emitter.on(EmitterEventName.WHITE_BOARD_CHANGE, this.handleOnWhiteBoardChange.bind(this))
  }

  private handleOnWhiteBoardChange({
    type,
    instance,
    maxXY,
  }: {
    type: string
    instance: PIXI.Container
    maxXY: [number, number]
  }) {
    const { x, y } = instance
    if (type === WHEEL) {
      const [PX, PY] = [-x / maxXY[0], -y / maxXY[1]]
      const [X, Y] = [this.maxXY[0] * PX, this.maxXY[1] * PY]
      this._bottom.x = X
      this._right.y = Y
      this.emitOnChange(WHEEL)
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
        this.emitOnChange(MOVE)
      },
      [EventNameSpace.SCROLL_BAR_RIGHT]: () => {
        const diffY = this._right.y + (moveY - startY)
        if (diffY < 0 || diffY > this.maxXY[1]) return
        this._right.y = diffY
        this.emitOnChange(MOVE)
      },
    } as Record<EventNameSpace, () => void>
    handler[position]?.()
    this._currentMove.XY = [moveX, moveY]
  }

  private moveEnd() {
    if (!this._currentMove) return
    this._currentMove = null
  }

  private emitOnChange(type: string) {
    emitter.emit(EmitterEventName.SCROLL_BAR_CHANGE, {
      type,
      instance: this.instance,
    })
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

  get instance() {
    return {
      bottom: this._bottom,
      right: this._right,
    }
  }
}

export default ScrollBar
