import * as PIXI from 'pixi.js'
import options from '../options'
import { Events, PixiEvents } from '../events'
import { Whiteboard, Scrollbar } from './layout'

class App {
  private readonly _instance: PIXI.Application
  private readonly _events: Events
  private readonly _pixiEvents: PixiEvents
  private readonly _whiteboard: Whiteboard
  private readonly _scrollbar: Scrollbar

  constructor() {
    this._instance = new PIXI.Application({ ...options.screen })
    this._events = new Events()
    this._pixiEvents = new PixiEvents()

    this.registerEvents()

    this._whiteboard = new Whiteboard(this)
    this._scrollbar = new Scrollbar()
  }

  public updateWhiteboardZoom(payload: number) {
    console.log('updateWhiteboardZoom', payload)
  }

  public render() {
    const children = [this._whiteboard.instance, ...Object.values(this._scrollbar.instance)]
    this._instance.stage.addChild(...children)
  }

  public destroy() {
    window.removeEventListener('resize', (e) => this._events.emitResizeChange(e))
    this._events.removeAllListeners()
    this._pixiEvents.removeAllListeners()
    this._whiteboard.destroy()
    this._instance.destroy(true)
  }

  private registerEvents() {
    window.addEventListener('resize', (e) => this._events.emitResizeChange(e))
  }

  get instance() {
    return this._instance
  }

  get events() {
    return this._events
  }

  get pixiEvents() {
    return this._pixiEvents
  }
}

export default App
