import * as PIXI from 'pixi.js'
import options from '../options'
import { events, pixiEvents } from '../events'
import { ScrollBar, Whiteboard } from './layout'
import { STATIC } from '../constant'
import { PixiWithExtra } from '../types'
import { EventNameSpace } from '../enums'

class App {
  private readonly _instance: PIXI.Application
  private readonly _scrollBar: ScrollBar
  private readonly _whiteboard: Whiteboard

  constructor() {
    this._instance = new PIXI.Application({ ...options.screen })
    this.registerEvents()
    this._whiteboard = new Whiteboard(this._instance)
    this._scrollBar = new ScrollBar(this._instance)
  }

  public render() {
    const children = [...Object.values(this._scrollBar.instance), this._whiteboard.instance]
    this._instance.stage.addChild(...children)
  }

  public destroy() {
    window.removeEventListener('resize', events.emitResizeChange)
    events.removeAllListeners()
    pixiEvents.removeAllListeners()
    this._instance.destroy(true)
  }

  private registerEvents() {
    const target = this._instance.stage as PixiWithExtra<PIXI.Container>
    target.sortableChildren = true
    target.eventMode = STATIC
    target.hitArea = this._instance.screen
    pixiEvents.register(EventNameSpace.STAGE, this._instance.stage, [
      'pointermove',
      'pointerup',
      'pointerupoutside',
      'wheel',
    ])
    window.addEventListener('resize', events.emitResizeChange)
  }

  get instance() {
    return this._instance
  }
}

export default App
