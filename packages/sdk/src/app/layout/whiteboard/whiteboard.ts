import * as PIXI from 'pixi.js'
import {Viewport} from 'pixi-viewport'
import options from '../../../options'
import Background from './background'
import {pixiEvents} from "../../../events"
import {EventNameSpace} from "../../../enums"

class Whiteboard {
  private readonly _instance: Viewport
  private readonly _background: Background

  constructor(private readonly app: PIXI.Application) {
    const { width, height } = options.whiteboard
    this._instance = new Viewport({
      passiveWheel: false,
      stopPropagation: true,
      screenWidth: options.screen.width,
      screenHeight: options.screen.height,
      worldWidth: width,
      worldHeight: height,
      events: this.app.renderer.events,
    })
    this.registerEvents()
    this._background = new Background()
    this.render()
  }

  private render() {
    this._instance.addChild(...Object.values(this._background.instance))
  }

  private registerEvents() {
    this._instance
      .drag({ clampWheel: true, direction: 'all' })
      .clamp({ underflow: 'top-left', direction: 'all' })
      .decelerate()
    pixiEvents.register(EventNameSpace.WHITEBOARD, this._instance, ['pointermove', 'pointerup', 'pointercancel', 'pointerupoutside', 'moved'])
  }

  get instance() {
    return this._instance
  }
}

export default Whiteboard;
