import * as PIXI from 'pixi.js'
import { ViewportOptions, ViewportWheelOptions } from './types'
import { DEFAULT_VIEWPORT_OPTIONS } from '../../../constant'
import EventManager from './event-manager'
import PluginManager from './plugin-manager'
import { Wheel } from './plugins'

class Viewport {
  private readonly _instance: PIXI.Container
  private readonly _eventManager: EventManager
  private readonly _pluginManager: PluginManager

  private _options: ViewportOptions
  private _disabled: boolean = false
  private _lastViewport: { xy: [number, number]; scale: [number, number] } | null = null

  constructor(options: ViewportOptions) {
    this._options = {
      ...DEFAULT_VIEWPORT_OPTIONS,
      ...options,
    }
    this._instance = new PIXI.Container()
    this._pluginManager = new PluginManager()
    this._eventManager = new EventManager(this)
    this.render()

    this.ticker.add(this.update.bind(this))
  }

  public render(
    payload?: Partial<Pick<ViewportOptions, 'worldWidth' | 'worldHeight' | 'screenWidth' | 'screenHeight'>>,
  ) {
    if (payload) {
      this._options = {
        ...this._options,
        ...payload,
      }
      this.instance.width = this.worldWidth
      this.instance.height = this.worldHeight
    } else {
      this._instance.width = this.worldWidth
      this._instance.height = this.worldHeight
    }
    this._options.screenWidth = this._options.screenWidth || DEFAULT_VIEWPORT_OPTIONS.screenWidth
    this._options.screenHeight = this._options.screenHeight || DEFAULT_VIEWPORT_OPTIONS.screenHeight
    this._pluginManager.resize()
  }

  public addChild(...children: PIXI.DisplayObject[]) {
    this._instance.addChild(...children)
  }

  public destroy() {
    this.ticker.remove(this.update.bind(this))
    this._eventManager.destroy()
    this._instance.destroy(true)
  }

  public wheel(options?: ViewportWheelOptions) {
    const cachePlugin = this._pluginManager.get('wheel')
    if (cachePlugin) {
      cachePlugin.options = options
    } else {
      const wheelPlugin = new Wheel(this, options)
      this._pluginManager.add('wheel', wheelPlugin)
    }
    return this
  }

  public update() {
    if (this.disabled) {
      return
    }
    this._pluginManager.update()
    this._lastViewport = {
      xy: [this._instance.x, this._instance.y],
      scale: [this._instance.scale.x, this._instance.scale.y],
    }
  }

  get instance() {
    return this._instance
  }

  get ticker() {
    return this.options.ticker || DEFAULT_VIEWPORT_OPTIONS.ticker
  }

  get lastViewport() {
    return this._lastViewport
  }

  get screenWidth() {
    return (this.options.screenWidth || DEFAULT_VIEWPORT_OPTIONS.screenWidth) / this.resolution
  }

  get screenHeight() {
    return (this.options.screenHeight || DEFAULT_VIEWPORT_OPTIONS.screenHeight) / this.resolution
  }

  get worldWidth() {
    return this.options.worldWidth * this._instance.scale.x
  }

  get worldHeight() {
    return this.options.worldHeight * this._instance.scale.y
  }

  get resolution() {
    return this.options.resolution || DEFAULT_VIEWPORT_OPTIONS.resolution
  }

  get options() {
    return this._options
  }

  get pluginManager() {
    return this._pluginManager
  }

  get eventManager() {
    return this._eventManager
  }

  get disabled() {
    return this._disabled
  }

  set disabled(value: boolean) {
    this._disabled = value
  }

  get top() {
    return (-1 * this._instance.y) / this._instance.scale.y
  }

  set top(value: number) {
    this._instance.y = -1 * value * this._instance.scale.y
  }

  get left() {
    return (-1 * this.instance.x) / this._instance.scale.x
  }

  set left(value: number) {
    this._instance.x = -1 * value * this._instance.scale.x
  }

  get right() {
    return (-1 * this.instance.x) / this._instance.scale.x + this.screenWidth / this._instance.scale.x
  }

  set right(value: number) {
    this._instance.x = -1 * value * this._instance.scale.x + this.screenWidth
  }

  get bottom() {
    return (-1 * this._instance.y) / this._instance.scale.y + this.screenHeight / this._instance.scale.y
  }

  set bottom(value: number) {
    this._instance.y = -1 * value * this._instance.scale.y + this.screenHeight
  }
}

export default Viewport
