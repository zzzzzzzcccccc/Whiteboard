import * as PIXI from 'pixi.js'
import Background from './background'
import options from '../../options'
import { EmitterEventName, EventNameSpace } from '../../enums'
import { MOVE, WHEEL, POSITION_X, POSITION_Y } from '../../constant'
import { events, pixiEvents } from '../../events'

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
    events.on(EmitterEventName.SCROLL_BAR_CHANGE, this.handleOnScrollBarChange.bind(this))
    pixiEvents.on(EventNameSpace.STAGE, 'wheel', this.handleOnWheel.bind(this))
  }

  private handleOnScrollBarChange({ type, ...payload }: Record<string, any>) {
    const onMove = () => {
      const {
        instance: { bottom, right },
      } = payload
      const { resolution } = options.screen
      const { width, height } = this.app.screen
      const [scrollX, scrollY] = [bottom.x, right.y]
      const [scrollWidth, scrollHeight] = [bottom.width, right.height]
      const [PX, PY] = [scrollX / (width / resolution - scrollWidth), scrollY / (height / resolution - scrollHeight)]
      this._instance.position.set(-PX * this.maxXY[0], -PY * this.maxXY[1])
    }
    if (type === MOVE) {
      onMove()
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
      events.emitWhiteBoardEvent(WHEEL, { instance: this._instance, maxXY: this.maxXY, position: POSITION_X })
    } else {
      const y = this._instance.y - Y * wheelSpeed
      if (y > 0 || y < -maxY) return
      this._instance.position.set(this._instance.x, y)
      events.emitWhiteBoardEvent(WHEEL, { instance: this._instance, maxXY: this.maxXY, position: POSITION_Y })
    }
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
