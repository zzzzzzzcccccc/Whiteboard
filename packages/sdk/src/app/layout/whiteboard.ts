import * as PIXI from 'pixi.js'
import Background from './background'
import options from '../../options'
import emitter from '../../emitter'
import { EmitterEventName, EventNameSpace } from '../../enums'
import events from '../../events'
import { MOVE, WHEEL, POSITION_X, POSITION_Y } from '../../constant'

class Whiteboard {
  private readonly _instance: PIXI.Container
  private readonly _background: Background

  constructor(private readonly app: PIXI.Application) {
    this._instance = new PIXI.Container()
    this._background = new Background()

    this.render()
    this.registerEvents()
  }

  private render() {
    const { width, height } = options.whiteboard
    const children = [...Object.values(this._background.instance)]

    this._instance.sortableChildren = true
    this._instance.width = width
    this._instance.height = height
    this._instance.addChild(...children)
  }

  private registerEvents() {
    emitter.on(EmitterEventName.SCROLL_BAR_CHANGE, this.handleOnScrollBarChange.bind(this))
    events.on(EventNameSpace.STAGE, 'wheel', this.handleOnWheel.bind(this))
  }

  private handleOnScrollBarChange({
    instance: { bottom, right },
    type,
  }: {
    instance: { bottom: PIXI.Graphics; right: PIXI.Graphics }
    type: string
  }) {
    const { resolution } = options.screen
    const { width, height } = this.app.screen
    const [scrollX, scrollY] = [bottom.x, right.y]
    const [scrollWidth, scrollHeight] = [bottom.width, right.height]
    const [PX, PY] = [scrollX / (width / resolution - scrollWidth), scrollY / (height / resolution - scrollHeight)]
    if (type === MOVE) {
      this._instance.position.set(-PX * this.maxXY[0], -PY * this.maxXY[1])
      this.emitOnChange(MOVE)
    }
  }

  private handleOnWheel(event: PIXI.FederatedWheelEvent) {
    const [X, Y] = [event.deltaX, event.deltaY]
    const [maxX, maxY] = this.maxXY
    const { wheelSpeed } = options.whiteboard
    if (Math.abs(X) > Math.abs(Y)) {
      const x = this._instance.x - X * wheelSpeed
      if (x > 0 || x < -maxX) return
      this._instance.position.set(x, this._instance.y)
      this.emitOnChange(WHEEL, { position: POSITION_X })
    } else {
      const y = this._instance.y - Y * wheelSpeed
      if (y > 0 || y < -maxY) return
      this._instance.position.set(this._instance.x, y)
      this.emitOnChange(WHEEL, { position: POSITION_Y })
    }
  }

  private emitOnChange<P>(type: string, payload?: P) {
    emitter.emit(EmitterEventName.WHITE_BOARD_CHANGE, {
      ...payload,
      type,
      instance: this._instance,
      maxXY: this.maxXY,
    })
  }

  get maxXY() {
    const { width, height } = this.app.screen
    return [this._instance.width - width, this._instance.height - height]
  }

  get instance() {
    return this._instance
  }
}

export default Whiteboard
