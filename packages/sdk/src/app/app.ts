import * as PIXI from 'pixi.js'
import options from '../options'
import { Events, PixiEvents } from '../events'
import { Whiteboard, Scrollbar } from './layout'
import { debounce } from '../utils'
import { Block } from '@yyz/blocks'

class App {
  private readonly _instance: PIXI.Application
  private readonly _events: Events
  private readonly _pixiEvents: PixiEvents
  private readonly _handleOnResizeChangeByDebounce: (e: UIEvent) => void
  private readonly _whiteboard: Whiteboard
  private readonly _scrollbar: Scrollbar

  constructor() {
    this._instance = new PIXI.Application({ ...options.screen })
    this._events = new Events()
    this._pixiEvents = new PixiEvents()

    this._handleOnResizeChangeByDebounce = debounce((e) => this._events.emitResizeChange(e), 1000)
    this.registerEvents()

    this._whiteboard = new Whiteboard(this)
    this._scrollbar = new Scrollbar(this)
  }

  public setZoom(payload: number) {
    const [min, max] = options.whiteboard.zoomLimit
    if (payload < min || payload > max) return
    this._whiteboard.viewport.setZoom(payload)
  }

  public render() {
    const children = [this._whiteboard.instance, ...Object.values(this._scrollbar.instance)]
    this._instance.stage.addChild(...children)
  }

  public destroy() {
    window.removeEventListener('resize', this._handleOnResizeChangeByDebounce)
    this._events.removeAllListeners()
    this._pixiEvents.removeAllListeners()
    this._whiteboard.destroy()
    this._instance.destroy(true)
  }

  public addBlocks<T extends Block>(blocks: T[]) {
    this._whiteboard.instance.addChild(...blocks)
  }

  public removeBlocks<T extends Block>(blocks: T[]) {
    this._whiteboard.instance.removeChild(...blocks)
  }

  private registerEvents() {
    window.addEventListener('resize', this._handleOnResizeChangeByDebounce)
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

  get whiteboard() {
    return this._whiteboard
  }
}

export default App
