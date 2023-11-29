import * as PIXI from 'pixi.js'
import { ViewportWheelOptions } from '../types'
import Viewport from '../viewport'
import Plugin from './plugin'
import { WHEEL } from '../../../../constant'

class Wheel extends Plugin<ViewportWheelOptions> {
  constructor(viewport: Viewport, options?: ViewportWheelOptions) {
    super(viewport, options)
    this.run()
  }

  public override run() {
    this._viewport.eventManager.on('wheel', this.handleOnWheel.bind(this))
  }

  public override resize() {
    this.update()
  }

  public override update() {
    if (this.action === 'scroll' && this.scrollInWorld) {
      this.handleOnScrollInWorld(['top', 'left'])
    }
  }

  private emit(name: string, type: string) {
    this._viewport.instance.emit(name, { type, viewport: this._viewport })
  }

  private handleOnWheel(event: PIXI.FederatedWheelEvent) {
    if (this._viewport.disabled) {
      return
    }
    switch (this.action) {
      case 'scroll':
        this.handleOnScroll(event)
        break
      case 'zoom':
        this.handleOnZoom(event)
        break
      default:
        throw new Error('Invalid action for wheel plugin')
    }
  }

  private handleOnScroll(event: PIXI.FederatedWheelEvent) {
    const { deltaX, deltaY } = event
    const reverse = this.reverse ? 1 : -1
    this._viewport.instance.x += deltaX * this.speed * reverse
    this._viewport.instance.y += deltaY * this.speed * reverse
    if (this.scrollInWorld) {
      this.handleOnScrollInWorld()
    }
    this.emit('moved', WHEEL)
  }

  private handleOnZoom(event: PIXI.FederatedWheelEvent) {
    // TODO implement zoom
    console.log(event)
  }

  private handleOnScrollInWorld(ignorePositions: ('top' | 'left' | 'right' | 'bottom')[] = []) {
    if (ignorePositions.indexOf('top') === -1 && this._viewport.top < 0) {
      this._viewport.top = 0
    }
    if (ignorePositions.indexOf('left') === -1 && this._viewport.left < 0) {
      this._viewport.left = 0
    }
    if (ignorePositions.indexOf('right') === -1 && this._viewport.right > this._viewport.options.worldWidth) {
      this._viewport.right = this._viewport.options.worldWidth
    }
    if (ignorePositions.indexOf('bottom') === -1 && this._viewport.bottom > this._viewport.options.worldHeight) {
      this._viewport.bottom = this._viewport.options.worldHeight
    }
  }

  get action() {
    return this._options?.action || 'scroll'
  }

  get speed() {
    return this._options?.speed || 1
  }

  get reverse() {
    return this._options?.reverse || false
  }

  get scrollInWorld() {
    return this._options?.scrollInWorld || true
  }
}

export default Wheel
