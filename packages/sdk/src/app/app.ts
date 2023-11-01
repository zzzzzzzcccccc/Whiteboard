import * as PIXI from 'pixi.js'
import options from '../options'
import { events, pixiEvents } from '../events'
import { Whiteboard, Scrollbar } from './layout'

class App {
  private readonly _instance: PIXI.Application
  private readonly _whiteboard: Whiteboard
  private readonly _scrollbar: Scrollbar

  constructor() {
    this._instance = new PIXI.Application({ ...options.screen })
    this.registerEvents()
    this._whiteboard = new Whiteboard(this._instance)
    this._scrollbar = new Scrollbar()
  }

  public updateWhiteboardZoom(payload: number) {
  }

  public render() {
    const children = [
      this._whiteboard.instance,
      ...Object.values(this._scrollbar.instance)
    ]
    this._instance.stage.addChild(...children)
  }

  public destroy() {
    window.removeEventListener('resize', (e) => events.emitResizeChange(e))
    events.removeAllListeners()
    pixiEvents.removeAllListeners()
    this._instance.destroy(true)
  }

  private registerEvents() {
    window.addEventListener('resize', (e) => events.emitResizeChange(e))
  }

  get instance() {
    return this._instance
  }
}

export default App
